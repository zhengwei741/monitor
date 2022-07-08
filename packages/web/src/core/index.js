import { Core } from '@monitor/core'
import { nextTime } from '../utils'
import {
  initLCP,
  initCLS,
  initHttp,
  observeTiming,
  initFCP,
  initFID,
  observeResResourceFlow
} from './plugins'

const defaultPlugins = [
  initLCP,
  initCLS,
  initHttp,
  observeTiming,
  initFCP,
  initFID,
  observeResResourceFlow
]

export class WebSDK extends Core {
  constructor(options) {
    super(options)
    const { url, appId, userId } = options
    // 基本信息
    this.baseUrl = url
    this.appId = appId
    this.userId = userId
    // 上传定时
    this._timer = null
    // 上传缓存
    this._reportCaches = []
    // 上传缓存上限
    this._cachesMax = 5

    if (options.defaultPlugins === undefined) {
      options.defaultPlugins = defaultPlugins
    }
    // 安装插件
    options.defaultPlugins.forEach(plugin => this.use(plugin))
  }

  report(data = {}, immediate = false) {
    if (immediate) {
      this.sendBeacon(this.baseUrl, {
        appId: this.appId,
        userId: this.userId,
        sendTime: Date.now(),
        data: [data]
      })
      return
    }
    this._reportCaches.push(data)
    clearTimeout(this._timer)
    if (this._reportCaches.length >= this._cachesMax) {
      this.send()
    } else {
      this._timer = window.setTimeout(this.send, 5000)
    }
  }

  sendBeacon(url, data) {
    const sendBeacon = window.sendBeacon ? 
      () => {
        if (url && data) {
          window.navigator.sendBeacon(url, JSON.stringify(data))
        }
      } : 
      () => {
        if ('oXMLHttpRequest' in window && typeof window.oXMLHttpRequest === 'function') {
          const xhr = new window.oXMLHttpRequest()
          xhr.open('POST', url)
          xhr.send(JSON.stringify(data))
        }
      }
    sendBeacon(url, data)
  }

  send() {
    if (this._reportCaches.length) {
      const sendEvents = this._reportCaches.splice(0, this._cachesMax)
      this._reportCaches = this._reportCaches.splice(this._cachesMax)

      const sendTime = Date.now()
      this.sendBeacon(this.baseUrl, {
        appId: this.appId,
        userId: this.userId,
        sendTime,
        data: sendEvents
      })
      if (this._reportCaches.length) {
        nextTime(this.send)
      }
    }
  }
}
