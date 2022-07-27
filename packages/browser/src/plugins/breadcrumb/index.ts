import { Plugin, Breadcrumb } from '@monitor/types'
import {
  proxyHash,
  proxyHistory,
  proxyDomClick,
  htmlTreeAsString,
  proxyFetch,
  proxyHttpRequest
} from '../../utils'
import { BrowserSDK } from '../../core/sdk'
import { HTTPMetrics } from '../../types/metrics'

function init(sdk: BrowserSDK) {
  // 路由跳转行为
  initRoute(sdk)
  // 点击行为
  initClick(sdk)
  // ajax 请求行为
  initAjax(sdk)
  // 用户自定义事件
}

function initRoute(sdk: BrowserSDK) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handler = function(args: any) {
    const Breadcrumb: Breadcrumb = {
      category: 'Route',
      data: {
        ...args
      }
    }
    sdk.addBreadcrumb(Breadcrumb)
  }

  proxyHash(handler)
  proxyHistory(handler)
}

function initClick(sdk: BrowserSDK) {
  const handler = function(e: Event) {
    const target = (e.target || e.srcElement) as HTMLElement
    if (!target) {
      return
    }
    const Breadcrumb: Breadcrumb = {
      category: 'UI.Click',
      message: htmlTreeAsString(target)
    }
    sdk.addBreadcrumb(Breadcrumb)
  }
  proxyDomClick(handler)
}

function initAjax(sdk: BrowserSDK) {
  const handler = function(metrics: HTTPMetrics) {
    const Breadcrumb: Breadcrumb = {
      category: metrics.requestType ? metrics.requestType : 'Xhr',
      message: metrics.error ? metrics.error.message : '',
      data: {
        url: metrics.method,
        method: metrics.method,
        statusText: metrics.statusText,
        args: metrics.args,
        response: metrics.response
      }
    }
    sdk.addBreadcrumb(Breadcrumb)
  }
  proxyFetch(handler)
  proxyHttpRequest(handler)
}

export const BreadcrumbPlugin: Plugin = {
  name: 'BreadcrumbPlugin',
  method: init
}
