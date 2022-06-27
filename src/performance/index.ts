import { getPageURL, onAfterLoad } from '../utils'
import { PerformanceConfig, MPerformanceNavigationTiming, resourceFlow, HttpMetrics } from '../types'
import { report } from "../base"
import { getFCP, getLCP, getFID, getCLS, Metric } from 'web-vitals'
import { proxyHttpRequest, proxyFetch } from '../http'

// 兼容判断
const supported = {
  performance: !!window.performance,
  getEntriesByType: !!(window.performance && performance.getEntriesByType),
  PerformanceObserver: 'PerformanceObserver' in window,
  MutationObserver: 'MutationObserver' in window,
  PerformanceNavigationTiming: 'PerformanceNavigationTiming' in window,
};

const observeTiming = function () {
  let t = performance.timing
  const times: MPerformanceNavigationTiming = {}
  if (supported.getEntriesByType) {
    const paintEntries = performance.getEntriesByType('paint');
    if (paintEntries.length) {
      times.FMP = paintEntries[paintEntries.length - 1].startTime;
    }

    if (supported.PerformanceNavigationTiming) {
      const nt2Timing = performance.getEntriesByType('navigation')[0];
      if (nt2Timing) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        t = nt2Timing;
      }
    }
  }

  const {
    domainLookupStart,
    domainLookupEnd,
    connectStart,
    connectEnd,
    secureConnectionStart,
    requestStart,
    responseStart,
    responseEnd,
    domInteractive,
    domContentLoadedEventEnd,
    loadEventStart,
    fetchStart,
  } = t;

  // https://juejin.cn/post/7097157902862909471#heading-19
  // 关键时间点
  times.FP = responseEnd - fetchStart, // 白屏时间
  times.TTI = domInteractive - fetchStart, // 首次可交互时间
  times.DomReady = domContentLoadedEventEnd - fetchStart, // HTML加载完成时间也就是 DOM Ready 时间。
  times.Load = loadEventStart - fetchStart, // 页面完全加载时间
  times.FirseByte = responseStart - domainLookupStart, // 首包时间
  // 关键时间段
  times.DNS = domainLookupEnd - domainLookupStart, // DNS查询耗时
  times.TCP = connectEnd - connectStart, // TCP连接耗时
  times.SSL = secureConnectionStart ? connectEnd - secureConnectionStart : 0, // SSL安全连接耗时
  times.TTFB = responseStart - requestStart, // 请求响应耗时
  times.Trans = responseEnd - responseStart, // 内容传输耗时
  times.DomParse = domInteractive - responseEnd, // DOM解析耗时
  times.Res = loadEventStart - domContentLoadedEventEnd, // 资源加载耗时
  report({
    ...times,
    type: 'performance',
    pageURL: getPageURL()
  })
}

// 白屏（FP）、灰屏（FCP）
const initFCP = function() {
  getFCP(function(metric: Metric) {
    report({
      ...metric,
      pageURL: getPageURL(),
      subType: 'fcp',
      type: 'performance'
    })
  })
}

// 最大内容绘制（LCP）
const initLCP = function() {
  getLCP(function(metric: Metric) {
    report({
      ...metric,
      pageURL: getPageURL(),
      subType: 'lcp',
      type: 'performance'
    })
  })
}

const initFID = function() {
  getFID(function(metric: Metric) {
    report({
      ...metric,
      pageURL: getPageURL(),
      subType: 'fid',
      type: 'performance'
    })
  })
}

const initCLS = function() {
  getCLS(function(metric: Metric) {
    report({
      ...metric,
      pageURL: getPageURL(),
      subType: 'cls',
      type: 'performance'
    })
  })
}

const observeResResourceFlow = function() {
  const resourceFlow: resourceFlow[] = []
  const entryHandle = function(list: PerformanceObserverEntryList) {
    for (const entry of list.getEntries()) {
      const {
        name,
        transferSize,
        initiatorType,
        startTime,
        responseEnd,
        domainLookupEnd,
        domainLookupStart,
        connectStart,
        connectEnd,
        secureConnectionStart,
        responseStart,
        requestStart,
      } = entry as PerformanceResourceTiming;
      resourceFlow.push({
        // name 资源地址
        name,
        // transferSize 传输大小
        transferSize,
        // initiatorType 资源类型
        initiatorType,
        // startTime 开始时间
        startTime,
        // responseEnd 结束时间
        responseEnd,
        // 贴近 Chrome 的近似分析方案，受到跨域资源影响
        dnsLookup: domainLookupEnd - domainLookupStart,
        initialConnect: connectEnd - connectStart,
        ssl: connectEnd - secureConnectionStart,
        request: responseStart - requestStart,
        ttfb: responseStart - requestStart,
        contentDownload: responseStart - requestStart,
      });
    }
  }
  const observe = new PerformanceObserver(entryHandle)
  observe.observe({ entryTypes: ['resource'] })

  const stopListening = () => {
    if (observe) {
      observe.disconnect();
    }
    report({
      resourceList: resourceFlow,
      subType: 'resource',
      type: 'performance',
    })
  };
  // 当页面 pageshow 触发时，中止
  window.addEventListener('pageshow', stopListening, { once: true, capture: true });
}

const initHttp = function() {
  const loadHandler = (metrics: HttpMetrics) => {
    if (metrics.status < 400) {
      delete metrics.response
      delete metrics.body
    }
    report({
      ...metrics,
      // http时长
      duration: metrics.requestTime - metrics.responseTime,
      pageURL: getPageURL(),
      subType: 'http',
      type: 'performance'
    })
  }
  proxyHttpRequest(undefined, loadHandler)
  proxyFetch(undefined, loadHandler)
}

export const init = function(options: PerformanceConfig) {
  // const { frame, fp, fcp, lcp, cls, resource, api } = options
  initLCP()
  initCLS()
  initHttp()

  onAfterLoad(() => {
    observeTiming()
    initFCP()
    initFID()
  })
  observeResResourceFlow()
}
