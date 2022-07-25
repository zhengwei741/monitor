import { Plugin, Breadcrumb } from '@monitor/types'
import { proxyHash, proxyHistory, proxyDomClick, htmlTreeAsString } from '../../utils'
import { BrowserSDK } from '../../core/sdk'

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
  const handler = function(target: HTMLElement) {
    const Breadcrumb: Breadcrumb = {
      category: 'UI.Click',
      message: htmlTreeAsString(target)
    }
    sdk.addBreadcrumb(Breadcrumb)
  }
  proxyDomClick(handler)
}

function initAjax(sdk: BrowserSDK) {

}

export const BreadcrumbPlugin: Plugin = {
  name: 'BreadcrumbPlugin',
  method: init
}
