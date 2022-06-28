import { getPageInfo, report } from '../base'
import { ReportData, mechanismType } from '../types'
import { onAfterLoad } from '../utils'

export const init = function () {
  // 用户基本信息
  initPageInfo()
  // 行为栈记录
  // 路由跳转
  initRouterChange()
  // pv uv
  initPV()
  // 点击事件
  // 自定义埋点
  // 用户停留时间
  // 访客来路
  // 用户来路
  // User Agent 解析
  // ip 采集
}

const userBehaviorSendHandle = function(behaviorReportData = {}) {
  const reportData: ReportData = {
    ...behaviorReportData,
    type: 'behavior'
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
