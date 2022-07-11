import { getGlobalObject } from '@monitor/utils'
import { nextTime } from './index'

const global = getGlobalObject()
// 上传缓存
let caches = []
// 上传缓存上限
const max = 5
// 上传定时
const timer = null
// 上报url
let baseUrl = ''

const sendBeacon = global.sendBeacon ? 
  (url, data) => {
    if (url && data) {
      global.navigator.sendBeacon(url, JSON.stringify(data))
    }
  } : 
  (url, data) => {
    if ('oXMLHttpRequest' in global && typeof global.oXMLHttpRequest === 'function') {
      // 使用原始XMLHttpRequest上传
      const XMLHttpRequest = global.oXMLHttpRequest ? global.oXMLHttpRequest : global.XMLHttpRequest
      const xhr = new XMLHttpRequest()
      xhr.open('POST', url)
      xhr.send(JSON.stringify(data))
    }
  }

function send() {
  if (caches.length) {
    const sendEvents = caches.splice(0, max)
    caches = caches.splice(max)
    sendBeacon(baseUrl, { sendTime: Date.now(), ...sendEvents })
    if (caches.length) {
      nextTime(send)
    }
  }
}

export function report(url, data = {}, immediate = false) {
  baseUrl = url
  if (immediate) {
    sendBeacon(url, { sendTime: Date.now(), ...data })
    return
  }
  caches.push(data)
  clearTimeout(timer)
  if (caches.length >= max) {
    send()
  } else {
    timer = global.setTimeout(send, 5000)
  }
}
