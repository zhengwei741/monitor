import { getPageURL } from '../utils'
import { PerformanceConfig } from '../types'
import { report } from "../base"
import { getFCP, getLCP, getFID, getCLS, Metric } from 'web-vitals'

// 兼容判断
// const supported = {
//   performance: !!window.performance,
//   getEntriesByType: !!(window.performance && performance.getEntriesByType),
//   PerformanceObserver: 'PerformanceObserver' in window,
//   MutationObserver: 'MutationObserver' in window,
//   PerformanceNavigationTiming: 'PerformanceNavigationTiming' in window,
// };

// const observeTiming = function () {
//   let t = performance.timing
//   const times: PerformanceKpi = {}
//   if (supported.getEntriesByType) {
//     const paintEntries = performance.getEntriesByType('paint');
//     if (paintEntries.length) {
//       times.fmp = paintEntries[paintEntries.length - 1].startTime;
//     }

//     if ('PerformanceNavigationTiming' in window) {
//       const nt2Timing = performance.getEntriesByType('navigation')[0];
//       if (nt2Timing) {
//         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//         // @ts-ignore
//         t = nt2Timing;
//       }
//     }
//   }

//   times.tti = t.domInteractive - t.fetchStart; // 首次可交互时间

//   times.ready = t.domContentLoadedEventEnd - t.fetchStart; // HTML加载完成时间

//   times.loadon = t.loadEventStart - t.fetchStart; // 页面完全加载时间

//   times.firstbyte = t.responseStart - t.domainLookupStart; // 首包时间

//   times.dns = t.domainLookupEnd - t.domainLookupStart; // dns查询耗时

//   times.appcache = t.domainLookupStart - t.fetchStart; // dns缓存时间

//   times.tcp = t.connectEnd - t.connectStart; // tcp连接耗时

//   times.ttfb = t.responseStart - t.requestStart; // 请求响应耗时

//   times.trans = t.responseEnd - t.responseStart; // 内容传输耗时

//   times.dom = t.domInteractive - t.responseEnd; // dom解析耗时

//   times.res = t.loadEventStart - t.domContentLoadedEventEnd; // 同步资源加载耗时

//   times.ssllink = t.connectEnd - t.secureConnectionStart; // SSL安全连接耗时

//   times.redirect = t.redirectEnd - t.redirectStart; // 重定向时间

//   times.unloadTime = t.unloadEventEnd - t.unloadEventStart; // 上一个页面的卸载耗时

//   report({
//     ...times,
//     type: 'performance',
//     pageURL: getPageURL()
//   })
// }

// const observeFp = function() {
//   const entryHandler: PerformanceObserverCallback = function(list: PerformanceObserverEntryList) {
//     for (const entry of list.getEntries()) {
//       if (entry.name === 'first-contentful-paint') {
//         observer.disconnect()
//       }
//       const json = entry.toJSON()
//       delete json.duration
//       const data = {
//         ...json,
//         type: 'performance',
//         pageURL: getPageURL()
//       }
//       report(data)
//     }
//   }
//   const observer = new PerformanceObserver(entryHandler)
//   observer.observe({ entryTypes: ['paint'], buffered: true })
// }

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

export const init = function(options: PerformanceConfig) {
  console.log(options)
  // const { frame, fp, fcp, lcp, cls, resource, api } = options
  initFCP()
  initLCP()
  initFID()
  initCLS()
}
