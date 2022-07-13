import { getFCP, getLCP, getFID, getCLS } from 'web-vitals'
import { getPageURL, onAfterLoad, proxyHttpRequest, proxyFetch } from '../utils'

// 兼容判断
const supported = {
  performance: !!window.performance,
  getEntriesByType: !!(window.performance && performance.getEntriesByType),
  PerformanceObserver: 'PerformanceObserver' in window,
  MutationObserver: 'MutationObserver' in window,
  PerformanceNavigationTiming: 'PerformanceNavigationTiming' in window,
}

// 白屏（FP）、灰屏（FCP）
export const initFCP = function(webSDK) {
  onAfterLoad(() => {
    getFCP(function(metric) {
      webSDK.report({
        ...metric,
        pageURL: getPageURL(),
        subType: 'fcp',
        type: 'performance'
      })
    })
  })
}
// 最大内容绘制（LCP）
export const initLCP = function (webSDK) {
  getLCP((metric) => {
    webSDK.report({
      ...metric,
      pageURL: getPageURL(),
      subType: 'fcp',
      type: 'performance'
    })
  })
}
export const initFID = function(webSDK) {
  onAfterLoad(() => {
    getFID(function(metric) {
      webSDK.report({
        ...metric,
        pageURL: getPageURL(),
        subType: 'fid',
        type: 'performance'
      })
    })
  })
}
export const initCLS = function(webSDK) {
  getCLS(function(metric) {
    webSDK.report({
      ...metric,
      pageURL: getPageURL(),
      subType: 'cls',
      type: 'performance'
    })
  })
}
export const initHttp = function(webSDK) {
  const onloadHandler = function(metrics) {
    if (metrics.error || metrics.status < 400) {
      delete metrics.response
      delete metrics.body
    }
    webSDK.report({
      ...metrics,
      // http时长
      duration: metrics.responseTime - metrics.requestTime,
      pageURL: getPageURL(),
      subType: 'http',
      type: 'performance'
    })
  }
  proxyHttpRequest(undefined, onloadHandler)
  proxyFetch(undefined, onloadHandler)
}
export const observeTiming = function (webSDK) {
  onAfterLoad(() => {
    let t = performance.timing
    const times = {}
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
    webSDK.report({
      ...times,
      subType: 'timing',
      type: 'performance',
      pageURL: getPageURL()
    })
  })
}
export const observeResResourceFlow = function(webSDK) {
  const resourceFlow = []
  const entryHandle = function(list) {
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
      } = entry
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
    webSDK.report({
      resourceList: resourceFlow,
      subType: 'resource',
      type: 'performance',
    })
  };
  // 当页面 pageshow 触发时，中止
  window.addEventListener('pageshow', stopListening, { once: true, capture: true });
}