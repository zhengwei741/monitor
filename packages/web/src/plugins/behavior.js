import { getPageInfo, getOriginInfo } from '../utils'
import { proxyHash, proxyHistory } from '../utils'
import { proxyDomClick } from '../utils/dom'
import { proxyFetch, proxyHttpRequest } from '../utils'
import { onAfterLoad } from '../utils'

const subtype = {
  pi: 'page-info',
  rcr: 'router-change-record',
  cbr: 'click-behavior-record',
  cdr: 'custom-define-record',
  hr: 'http-record',
  pv: 'pv',
  st: 'stay-time'
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
    reportData => websdk.report(reportData)
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
      reportData => websdk.report(reportData)
    )
  }
  proxyHistory(handler)
  proxyHash(handler)
}

export function initClickRecord(websdk) {
  const handler = function({ target, e, eventType }) {
    const { top, left } = target.getBoundingClientRect()
    reportBehaviorHandle(
      {
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
      },
      reportData => websdk.report(reportData)
    )
  }
  proxyDomClick(handler)
}

export function initHttpRecord(websdk) {
  const handler = function(httpMetrics) {
    reportBehaviorHandle(
      {
        ...httpMetrics,
        subtype: subtype.hr
      },
      reportData => websdk.report(reportData)
    )
  }
  proxyHttpRequest(undefined, handler)
  proxyFetch(undefined, handler)
}

export function initPV(websdk) {
  const handler = function() {
    reportBehaviorHandle(
      {
        originInformation: getOriginInfo(),
        timestamp: Date.now(),
        pageInfo: getPageInfo(),
        subType: subtype.pv
      },
      reportData => websdk.report(reportData)
    )
  }
  onAfterLoad(handler)
  proxyHash(handler)
  proxyHistory(handler)
}

const routeList = []
export function initStayTime(websdk) {
  const handler = function() {
    const time = Date.now()
    routeList[routeList.length - 1].endTime = time
    routeList[routeList.length - 1].dulation = time - routeList[routeList.length - 1].startTime

    routeList.push(
      {
        userId: websdk.userId,
        appId: websdk.appId,
        ...{
          url: window.location.pathname,
          startTime: time,
          dulation: 0,
          endTime: 0
        },
      }
    )
  }

  proxyHash(handler)
  proxyHistory(handler)

  window.addEventListener('load', () => {
    routeList.push(
      {
        userId: websdk.userId,
        appId: websdk.appId,
        ...{
          url: window.location.pathname,
          startTime: Date.now(),
          endTime: 0,
          dulation: 0 
        }
      }
    )
  })

  window.addEventListener('unload', () => {
    const time = Date.now()
    routeList[routeList.length - 1].endTime = time
    routeList[routeList.length - 1].dulation = time - routeList[routeList.length - 1].startTime
    reportBehaviorHandle(
      {
        routeList,
        subType: subtype.st
      },
      reportData => websdk.report(reportData)
    )
  })
}
