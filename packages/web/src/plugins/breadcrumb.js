import { getPageInfo } from '../utils/page'
import { proxyHash, proxyHistory } from '../utils/history'
import { proxyHttpRequest, proxyFetch } from '../utils/http'
import { getGlobalObject, isFunction } from '@monitor/utils'

let breadcrumbsStack = []
const maxbreadcrumbs = 100

export function addBreadcrumb(breadcrumb) {
  const behavior = {
    ...breadcrumb,
    timestamp: Date.now(),
  }

  if (breadcrumbsStack.length === maxbreadcrumbs) {
    breadcrumbsStack.shift()
  }
  breadcrumbsStack.push(behavior)
}

export function getBreadcrumb() {
  return breadcrumbsStack
}

export function initBreadcrumb(websdk) {
  init(() => {
    websdk.report({ stack: breadcrumbsStack })
  })
  // 路由跳转行为
  instrumentRouter()
  // 点击行为
  instrumentClick()
  // ajax 请求行为
  instrumentAjax()
  // 用户自定义事件
  // addBreadcrumb
}

function init(callBlack) {
  const global = getGlobalObject()
  if ('addEventListener' in global && isFunction(callBlack)) {
    global.addEventListener('beforeunload', () => {
      callBlack()
    })
  }
}

function instrumentRouter() {
  const handler = function(e) {
    const breadcrumb = {
      page: getPageInfo().pathname,
      // 跳转的方法 eg:replaceState
      type: 'router-change',
      jumpType: e.type,
      // 创建时间
      timestamp: Date.now(),
      // 页面信息
      pageInfo: getPageInfo()
    }
    addBreadcrumb(breadcrumb)
  }
  proxyHash(handler)
  proxyHistory(handler)
}

const mountList = ['div', 'li']
function instrumentClick() {
  const global = getGlobalObject()

  if (!('document' in global)) {
    return
  }

  ['mousedown', 'touchstart'].forEach(eventType => {
    let time = null
    global.document.addEventListener(eventType, function() {
      clearTimeout(timer)
      time = global.setTimeout(() => {
        let target = e.path?.find((x) => mountList.includes(x.tagName?.toLowerCase()))
        // 不支持 path 就再判断 target
        target = target || (mountList.includes(e.target.tagName?.toLowerCase()) ? e.target : undefined)
        if (!target) return
        const { top, left } = target.getBoundingClientRect()
        addBreadcrumb({
          type: 'user-click',
          top,
          left,
          eventType,
          target: target.tagName,
          outerHTML: target.outerHTML,
          innerHTML: target.innerHTML,
          width: target.offsetWidth,
          height: target.offsetHeight,
          startTime: e.timeStamp,
        })
      }, 500)
    })
  })
}

function instrumentAjax() {
  const handler = function(httpMetrics) {
    const breadcrumb = {
      page: getPageInfo().pathname,
      // 创建时间
      timestamp: Date.now(),
      // 页面信息
      pageInfo: getPageInfo(),
      type: 'http',
      // http url
      url: httpMetrics.url,
      // http 结果
      status: httpMetrics.status,
      // 错误
      error: httpMetrics.error
    }
    addBreadcrumb(breadcrumb)
  }

  proxyHttpRequest(undefined, handler)
  proxyFetch(undefined, handler)
}