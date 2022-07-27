import { Plugin } from '@monitor/types'
import { getTimestamp } from '@monitor/utils'
import { BrowserSDK } from '../../core/sdk'
import {
  proxyHash,
  proxyHistory,
  proxyFetch,
  proxyHttpRequest,
  proxyDomClick,
  onAfterLoad,
  getPageInfo,
  getOriginInfo,
  _global
} from '../../utils'
import { BehaviorMetrics, HTTPMetrics } from '../../types'

export const pvPlugin: Plugin = {
  name: 'behavior_pv',
  method: function(sdk: BrowserSDK) {
    const handler = function() {
      const BehaviorMetrics: BehaviorMetrics = {
        type: 'behavior',
        subType: 'pv',
        meta: {
          timestamp: getTimestamp(),
          pageInfo: getPageInfo(),
          originInformation: getOriginInfo()
        }
      }
      sdk.capture(BehaviorMetrics)
    }
    onAfterLoad(handler)
    proxyHash(handler)
    proxyHistory(handler)
  }
}

export const HttpRecordPlugin: Plugin = {
  name: 'behavior_http',
  method: function(sdk: BrowserSDK) {
    const handler = function(httpMetrics: HTTPMetrics) {
      const BehaviorMetrics: BehaviorMetrics = {
        type: 'behavior',
        subType: 'http-record',
        meta: {
          ...httpMetrics
        }
      }
      sdk.capture(BehaviorMetrics)
    }
    proxyFetch(handler)
    proxyHttpRequest(handler)
  }
}

export const RouterChangePlugin: Plugin = {
  name: 'behavior_router',
  method: function(sdk: BrowserSDK) {
    const handler = function(e: Event) {
      const BehaviorMetrics: BehaviorMetrics = {
        type: 'behavior',
        subType: 'router-change-record',
        meta: {
          page: getPageInfo().pathname,
          // 跳转的方法 eg:replaceState
          jumpType: e.type,
          // 创建时间
          timestamp: getTimestamp(),
          // 页面信息
          pageInfo: getPageInfo(),
        }
      }
      sdk.capture(BehaviorMetrics)
    }
    proxyHistory(handler)
    proxyHash(handler)
  }
}

export const ClickPlugin: Plugin = {
  name: 'behavior_click',
  method: function(sdk: BrowserSDK) {
    const handler = function(e: Event) {
      const target = (e.target || e.srcElement) as HTMLElement
      if (!target) {
        return
      }
      const { top, left } = target.getBoundingClientRect()
      const BehaviorMetrics: BehaviorMetrics = {
        type: 'behavior',
        subType: 'click-behavior-record',
        meta: {
          top,
          left,
          target: target.tagName,
          outerHTML: target.outerHTML,
          innerHTML: target.innerHTML,
          width: target.offsetWidth,
          height: target.offsetHeight,
          startTime: e.timeStamp,
        }
      }
      sdk.capture(BehaviorMetrics)
    }
    proxyDomClick(handler)
  }
}

interface RouteRecord {
  appKey: string
  url: string
  startTime: number
  dulation: number
  endTime: number
}
const routeList: RouteRecord[] = []
export const StayTimePlugin: Plugin = {
  name: 'behavior_stayTime',
  method: function(sdk: BrowserSDK) {
    const handler = function() {
      const time = Date.now()
      routeList[routeList.length - 1].endTime = time
      routeList[routeList.length - 1].dulation = time - routeList[routeList.length - 1].startTime

      routeList.push(
        {
          appKey: sdk.appKey,
          ...{
            url: _global.location.pathname,
            startTime: time,
            dulation: 0,
            endTime: 0
          },
        }
      )
    }
  
    proxyHash(handler)
    proxyHistory(handler)
  
    _global.addEventListener('load', () => {
      routeList.push(
        {
          // userId: sdk.userId,
          appKey: sdk.appKey,
          ...{
            url: _global.location.pathname,
            startTime: Date.now(),
            endTime: 0,
            dulation: 0 
          }
        }
      )
    })
  
    _global.addEventListener('unload', () => {
      const time = Date.now()
      routeList[routeList.length - 1].endTime = time
      routeList[routeList.length - 1].dulation = time - routeList[routeList.length - 1].startTime
      
      const BehaviorMetrics: BehaviorMetrics = {
        type: 'behavior',
        subType: 'stay-time',
        meta: {
          routeList
        }
      }
      sdk.capture(BehaviorMetrics)
    })
  }
}