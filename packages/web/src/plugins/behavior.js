import { getPageInfo, getOriginInfo } from '../utils/page'
import { proxyHash, proxyHistory } from '../utils/history'
import { proxyDomClick } from '../utils/dom'
import { proxyFetch, proxyHttpRequest } from '../utils/http'
import { onAfterLoad } from '../utils/onAfterLoad'

const subtype = {
  pi: 'page-info',
  rcr: 'router-change-record',
  cbr: 'click-behavior-record',
  cdr: 'custom-define-record',
  hr: 'http-record',
  pv: 'pv'
}

const reportBehaviorHandle = function(behaviorReportData, callBlack) {
  const reportData = {
    ...behaviorReportData,
    type: 'behavior'
  }
  if (typeof callBlack === 'function') {
    callBlack(reportData)
  }
}

export function initPageInfo (websdk) {
  reportBehaviorHandle(
    { subtype: subtype.pi, ...getPageInfo()},
    websdk.report
  )
}

export function initRouterChange(websdk) {
  const handler = function(e) {
    reportBehaviorHandle(
      {
        page: getPageInfo().pathname,
        // 跳转的方法 eg:replaceState
        jumpType: e.type,
        // 创建时间
        timestamp: Date.now(),
        // 页面信息
        pageInfo: getPageInfo(),
        subType: subtype.rcr
      },
      websdk.report
    )
  }
  proxyHistory(handler)
  proxyHash(handler)
}

export function initClickRecord() {
  const handler = function({ target, e, eventType }) {
    const { top, left } = target.getBoundingClientRect()
    reportBehaviorHandle({
      top,
      left,
      eventType,
      target: target.tagName,
      outerHTML: target.outerHTML,
      innerHTML: target.innerHTML,
      width: target.offsetWidth,
      height: target.offsetHeight,
      startTime: e.timeStamp,
      subType: subtype.cbr,
    })
  }
  proxyDomClick(handler)
}

export function initPV() {
  const handler = function() {
    reportBehaviorHandle({
      originInformation: getOriginInfo(),
      timestamp: Date.now(),
      pageInfo: getPageInfo(),
      subType: subtype.pv
    })
  }
  onAfterLoad(handler)
  proxyHash(handler)
  proxyHistory(handler)
}

export function initHttpRecord() {
  const handler = function(httpMetrics) {
    reportBehaviorHandle({
      ...httpMetrics,
      subtype: subtype.hr
    })
  }
  proxyHttpRequest(undefined, handler)
  proxyFetch(undefined, handler)
}
