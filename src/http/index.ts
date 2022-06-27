/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpMetrics } from '../types'

const sendHandlers: Function[] = []
const loadHandlers: Function[] = []

const runHandler = (handlerList: Function[], metrics: HttpMetrics):void => {
  handlerList.forEach(handler => handler(metrics))
}

const collectHandler = (handlerList: Function[], handler: Function | undefined): void => {
  if (typeof handler === 'function') {
    handlerList.push(handler)
  }
}

export const proxyHttpRequest = (sendHandler?: Function, loadHandler?: Function) => {
  if ('XMLHttpRequest' in window && typeof XMLHttpRequest === 'function') {
    const oXMLHttpRequest = window.XMLHttpRequest
    collectHandler(sendHandlers, sendHandler)
    collectHandler(loadHandlers, loadHandler)

    if (!(window as any).oXMLHttpRequest) {
      (window as any).oXMLHttpRequest = oXMLHttpRequest
    }

    (window as any).XMLHttpRequest = (): XMLHttpRequest => {
      const xhr = new oXMLHttpRequest()
      
      const { open, send } = xhr

      let metrics = {} as HttpMetrics

      xhr.open = (method: string, url: string) => {
        metrics.method = method
        metrics.url = url
        open.call(xhr, method, url, true)
      }

      xhr.send = (body) => {
        metrics.body = body || ''
        metrics.requestTime = Date.now()
        runHandler(sendHandlers, metrics)
        send.call(xhr, body)
      }

      xhr.addEventListener('loadend', () => {
        const { status, statusText, response } = xhr
        metrics = {
          ...metrics,
          status,
          statusText,
          response,
          responseTime: Date.now(),
        }
        runHandler(loadHandlers, metrics)
      })

      return xhr
    }
  }
}

const fetchSndHandlers: Function[] = []
const fetchLoadHandlers: Function[] = []

export const proxyFetch = (sendHandler?: Function, loadHandler?: Function) => {
  if ('fetch' in window && typeof fetch === 'function') {

    collectHandler(fetchSndHandlers, sendHandler)
    collectHandler(fetchLoadHandlers, loadHandler)

    const oFetch = window.fetch
    if (!(window as any).oFetch) {
      (window as any).oFetch = oFetch
    }
    (window as any).fetch = function(input: RequestInfo | URL, init?: RequestInit) {
      let metrics = {} as HttpMetrics
      if (init) {
        const { method, body } = init
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        metrics.url = (input && typeof input !== 'string' ? input?.url : input) || ''
        metrics.method = method || ''
        metrics.body = body || ''
        metrics.requestTime = Date.now()
      }
      runHandler(fetchSndHandlers, metrics)
      return oFetch.call(window, input, init).then(async (response) => {
        const res = response.clone()
        metrics = {
          ...metrics,
          status: res.status,
          statusText: res.statusText,
          response: await res.text(),
          responseTime: new Date().getTime(),
        }
        runHandler(fetchLoadHandlers, metrics)
        return response
      })
    }
  }
}