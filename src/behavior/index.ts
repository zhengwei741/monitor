import { getPageInfo, report, getBaseInfo } from '../base'
import { ReportData, mechanismType } from '../types'
import { onAfterLoad } from '../utils'
import Bowser from 'bowser'
import uaParserJs from 'ua-parser-js'
import { proxyFetch, proxyHttpRequest } from '../http'

export const init = function () {
  // 用户基本信息
  initPageInfo()
  // 行为栈记录
  initBreadcrumbs()
  // 路由跳转
  initRouterChange()
  // pv uv
  initPV()
  // 点击事件
  initClickHandler()
  // 自定义埋点
  // 用户停留时间
  initStayTime()
  // 访客来路
  // 用户来路
  initOriginInfo()
  // User Agent 解析
  initUserAgent()
  // ip 采集
}

const userBehaviorSendHandle = function(behaviorReportData = {}) {
  const reportData: ReportData = {
    ...behaviorReportData,
    type: 'behavior'
  }
  if (
    reportData.subType === mechanismType.RCR ||
    reportData.subType === mechanismType.CBR ||
    reportData.subType === mechanismType.CDR ||
    reportData.subType === mechanismType.HT
  ) {
    pushBreadcrumb(reportData)
  }
  report(reportData)
}

const initPageInfo = function () {
  userBehaviorSendHandle({
    subType: mechanismType.PI,
    ...getPageInfo()
  })
}

const initRouterChange = function() {
  wrHistory()

  const handler = function(e: Event) {
    const behaviorReportData = {
      page: getPageInfo().pathname,
      // 跳转的方法 eg:replaceState
      jumpType: e.type,
      // 创建时间
      timestamp: new Date().getTime(),
      // 页面信息
      pageInfo: getPageInfo(),
      subType: mechanismType.RCR
    }
    userBehaviorSendHandle(behaviorReportData)
  }

  proxyHistory(handler)
  proxyHash(handler, false)
}

const wr = (type: keyof History) => {
  const orig = history[type];
  return function (this: unknown) {
    // eslint-disable-next-line prefer-rest-params
    const rv = orig.apply(this, arguments);
    const e = new Event(type);
    window.dispatchEvent(e);
    return rv;
  };
};

const wrHistory = function(): void {
  history.pushState = wr('pushState')
  history.replaceState = wr('replaceState')
}

// eslint-disable-next-line @typescript-eslint/ban-types
const proxyHash = function(handler: Function, listenPopstate = true): void {
  window.addEventListener('hashchange', (e) => handler(e), true)
  listenPopstate && window.addEventListener('popstate', (e) => handler(e), true)
}
// eslint-disable-next-line @typescript-eslint/ban-types
const proxyHistory = function(handler: Function, listenPopstate = true): void {
  window.addEventListener('replaceState', (e) => handler(e), true)
  listenPopstate && window.addEventListener('popstate', (e) => handler(e), true)
}

const initPV = function() {
  const handler = function() {
    const behaviorReportData = {
      // 用户来路
      originInformation: getOriginInfo(),
      // 创建时间
      timestamp: new Date().getTime(),
      // 页面信息
      pageInfo: getPageInfo(),
      subType: mechanismType.RCR
    }
    userBehaviorSendHandle(behaviorReportData)
  }
  // 立即上报pv
  onAfterLoad(handler)

  proxyHistory(handler)
  proxyHash(handler, false)
}

// 返回 OI 用户来路信息
export const getOriginInfo = () => {
  return {
    referrer: document.referrer,
    type: window.performance?.navigation.type || '',
  };
};

const routeList: RouterRecord[] = []

interface RouterRecord {
  userId: string
  appId: string
  url: string
  startTime: number
  dulation: number
  endTime: number
}

const initStayTime = function () {
  const handler = function() {
    const { userId, appId } = getBaseInfo()
    const time = Date.now()
    routeList[routeList.length - 1].endTime = time
    routeList[routeList.length - 1].dulation = time - routeList[routeList.length - 1].startTime

    routeList.push(
      {
        userId,
        appId,
        ...{
          url: window.location.pathname,
          startTime: time,
          dulation: 0,
          endTime: 0
        },
      }
    )
  }
  proxyHistory(handler)
  proxyHash(handler, false)

  window.addEventListener('load', () => {
    const { userId, appId } = getBaseInfo()
    routeList.push(
      {
        userId,
        appId,
        ...{
          url: window.location.pathname,
          startTime: Date.now(),
          endTime: 0,
          dulation: 0 
        }
      }
    )
  })

  window.addEventListener('beforeunload', () => {
    const time = new Date().getTime()
    routeList[routeList.length - 1].endTime = time
    routeList[routeList.length - 1].dulation = time - routeList[routeList.length - 1].startTime
    const behaviorReportData = {
      routeList,
      subType: mechanismType.RCR
    }
    userBehaviorSendHandle(behaviorReportData)
  })
}

const mountList = ['div', 'li']
const initClickHandler = function() {
  ['mousedown', 'touchstart'].forEach(eventType => {
    let timer: any = undefined
    window.addEventListener(eventType, (e: Event) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        let target = e.path?.find((x: Element) => mountList.includes(x.tagName?.toLowerCase()));
        // 不支持 path 就再判断 target
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        target = target || (mountList.includes(e.target.tagName?.toLowerCase()) ? e.target : undefined);

        if (!target) return;

        const { top, left } = target.getBoundingClientRect()

        userBehaviorSendHandle({
          top,
          left,
          eventType,
          target: target.tagName,
          outerHTML: target.outerHTML,
          innerHTML: target.innerHTML,
          width: target.offsetWidth,
          height: target.offsetHeight,
          startTime: e.timeStamp,
          subType: mechanismType.CBR,
        })
      }, 500)
    })
  })
}

const initOriginInfo = function() {
  const originInfo = getOriginInfo()
  userBehaviorSendHandle({
    ...originInfo,
    subType: mechanismType.OI
  })
}

const initUserAgent = function () {
  function getFeature(userAgent: string) {
    const browserData = Bowser.parse(userAgent);
    const parserData = uaParserJs(userAgent);
    const browserName = browserData.browser.name || parserData.browser.name; // 浏览器名
    const browserVersion = browserData.browser.version || parserData.browser.version; // 浏览器版本号
    const osName = browserData.os.name || parserData.os.name; // 操作系统名
    const osVersion = parserData.os.version || browserData.os.version; // 操作系统版本号
    const deviceType = browserData.platform.type || parserData.device.type; // 设备类型
    const deviceVendor = browserData.platform.vendor || parserData.device.vendor || ''; // 设备所属公司
    const deviceModel = browserData.platform.model || parserData.device.model || ''; // 设备型号
    const engineName = browserData.engine.name || parserData.engine.name; // engine名
    const engineVersion = browserData.engine.version || parserData.engine.version; // engine版本号
    return {
      browserName,
      browserVersion,
      osName,
      osVersion,
      deviceType,
      deviceVendor,
      deviceModel,
      engineName,
      engineVersion,
    };
  }
  userBehaviorSendHandle({
    subType: 'UserAgent',
    ...getFeature(window.navigator.userAgent)
  })
}


// -----------------------------
// 路由跳转行为
// 点击行为
// ajax 请求行为
// 用户自定义事件
interface Breadcrumbs {
  name?: string
  page: string
  timestamp: number | string
}

const breadcrumbsStack: Breadcrumbs[] = []
const maxbreadcrumbs = 100
const pushBreadcrumb = function(breadcrumb: ReportData) {

  const behavior : Breadcrumbs = {
    page: breadcrumb.page,
    timestamp: breadcrumb.timestamp,
    name: breadcrumb.subType
  }

  if (breadcrumbsStack.length === maxbreadcrumbs) {
    breadcrumbsStack.shift()
  }
  breadcrumbsStack.push(behavior)
}

const initBreadcrumbs = function() {
  const handler = function() {
    userBehaviorSendHandle({
      page: getPageInfo().pathname,
      timestamp: Date.now(),
      subType: mechanismType.HT
    })
  }
  proxyFetch(undefined, handler)
  proxyHttpRequest(undefined, handler)
}
