/* eslint-disable @typescript-eslint/no-explicit-any */
import { isInstanceOf, fill, isFunction } from '@monitor/utils'
import { addEventHandler, triggerHandlers, HandlerCallback } from '@monitor/core'
import { HTTPMetrics } from '../types/metrics'

const handlerType = {
  LH: '_loadHandler',
  FLH: '_fetch_loadHandler',
}

export function proxyHttpRequest(loadHandler: HandlerCallback | undefined) {
  if (!('XMLHttpRequest' in window)) {
    return
  }
  const res = addEventHandler(handlerType.LH, loadHandler)

  if (!res) {
    return
  }

  const httpMetrics: HTTPMetrics = {
    type: 'http',
    requestType: 'Xhr'
  }

  fill(window.XMLHttpRequest, 'open', function(originalOpenMethod) {
    return function(...args: any[]) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const xhr = this
      httpMetrics.method = args[0]
      httpMetrics.url = args[1]

      const onreadystatechangeHandler = function () {
        const { status, statusText, response } = xhr
        triggerHandlers(handlerType.LH, {
          ...httpMetrics,
          status,
          statusText,
          response,
          responseTime: Date.now(),
        })
      }

      if ('onloadend' in xhr && isFunction(xhr.onloadend)) {
        fill(xhr, 'onloadend', function(original) {
          return function(...arsg: any) {
            onreadystatechangeHandler()
            original.apply(xhr, arsg)
          }
        })
      } else {
        xhr.addEventListener('loadend', onreadystatechangeHandler)
      }

      originalOpenMethod.apply(xhr, args)
    }
  })

  fill(window.XMLHttpRequest, 'send', function(originalSendMethod) {
    return function(...args: any[]) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const xhr = this
      httpMetrics.body = args[0]
      httpMetrics.requestTime = Date.now()
      originalSendMethod.apply(xhr, args)
    }
  })
}

export function proxyFetch(loadHandler: HandlerCallback | undefined) {
  if (!('fetch' in window)) {
    return
  }
  const res = addEventHandler(handlerType.FLH, loadHandler)

  if (!res) {
    return
  }

  fill(window, 'fetch', function(originaFetch) {
    return function(...args: any[]) {
      let metrics: HTTPMetrics = {
        type: 'http',
        args,
        method: getFetchMethod(args),
        url: getFetchUrl(args),
        requestTime: Date.now(),
        requestType: 'Fetch'
      }
      return originaFetch.apply(window, args).then(
        async (response: any) => {
          const res = response.clone()
          metrics = {
            ...metrics,
            status: res.status,
            statusText: res.statusText,
            response: await res.text(),
            responseTime: Date.now(),
          }
          triggerHandlers(handlerType.FLH, { ...metrics })
          return response
        },
        (error: Error) => {
          metrics.error = error
          triggerHandlers(handlerType.FLH, {
            ...metrics,
            responseTime: Date.now()
          })
          return error
        }
      )
    }
  })
}

export function getFetchMethod(fetchArgs: any[]) {
  if ('Request' in window && isInstanceOf(fetchArgs[0], Request) && fetchArgs[0].method) {
    return String(fetchArgs[0].method).toUpperCase()
  }
  if (fetchArgs[1] && fetchArgs[1].method) {
    return String(fetchArgs[1].method).toUpperCase()
  }
  return 'GET'
}

export function getFetchUrl(fetchArgs: any[]) {
  if (typeof fetchArgs[0] === 'string') {
    return fetchArgs[0]
  }
  if ('Request' in window && isInstanceOf(fetchArgs[0], Request)) {
    return fetchArgs[0].url
  }
  return String(fetchArgs[0])
}
