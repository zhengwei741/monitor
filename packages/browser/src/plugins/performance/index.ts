import { getFCP, getLCP, getFID, getCLS, Metric } from 'web-vitals'
import { Plugin } from '@monitor/types'
import { BrowserSDK } from '../../core/sdk'
import { onAfterLoad, _global, proxyFetch, proxyHttpRequest } from '../../utils'
import { PerformanceMetrics, HTTPMetrics } from '../../types/metrics'

// 白屏（FP）、灰屏（FCP）
export const fcpPlugin: Plugin = {
  name: '_performance_fcp',
  method: function(sdk: BrowserSDK) {
    onAfterLoad(() => {
      getFCP(function(metric: Metric) {
        const performanceMetrics: PerformanceMetrics = {
          type: 'performance',
          subType: 'fcp',
          pageURL: _global.location.href,
          meta: {
            ...metric,
          }
        }
        sdk.capture(performanceMetrics)
      })
    })
  }
}

// 最大内容绘制（LCP）
export const lcpPlugin: Plugin = {
  name: '_performance_lcp',
  method: function(sdk: BrowserSDK) {
    getLCP(function(metric: Metric) {
      const performanceMetrics: PerformanceMetrics = {
        type: 'performance',
        subType: 'lcp',
        pageURL: _global.location.href,
        meta: {
          ...metric,
        }
      }
      sdk.capture(performanceMetrics)
    })
  }
}

export const fidPlugin: Plugin = {
  name: '_performance_fid',
  method: function(sdk: BrowserSDK) {
    onAfterLoad(() => {
      getFID(function(metric: Metric) {
        const performanceMetrics: PerformanceMetrics = {
          type: 'performance',
          subType: 'fid',
          pageURL: _global.location.href,
          meta: {
            ...metric,
          }
        }
        sdk.capture(performanceMetrics)
      })
    })
  }
}

export const clsPlugin: Plugin = {
  name: '_performance_cls',
  method: function(sdk: BrowserSDK) {
    getCLS(function(metric: Metric) {
      const performanceMetrics: PerformanceMetrics = {
        type: 'performance',
        subType: 'cls',
        pageURL: _global.location.href,
        meta: {
          ...metric,
        }
      }
      sdk.capture(performanceMetrics)
    })
  }
}

export const httpTimeConsumingPlugin: Plugin = {
  name: '_performance_httpTimeConsuming',
  method: function(sdk: BrowserSDK) {
    const handle = function(metrics: HTTPMetrics) {
      if (metrics.error || (metrics.status && metrics.status < 400)) {
        delete metrics.response
        delete metrics.body
      }
      const performanceMetrics: PerformanceMetrics = {
        type: 'performance',
        subType: 'http',
        pageURL: _global.location.href,
        meta: {
          ...metrics,
          // http时长
          ...(
            (metrics.responseTime && metrics.requestTime) && {
              duration: metrics.responseTime - metrics.requestTime
            }
          )
        }
      }
      sdk.capture(performanceMetrics)
    }
    proxyFetch(handle)
    proxyHttpRequest(handle)
  }
}

// 兼容判断
const supported = {
  performance: !!_global.performance,
  getEntriesByType: !!(_global.performance && performance.getEntriesByType),
  PerformanceObserver: 'PerformanceObserver' in _global,
  MutationObserver: 'MutationObserver' in _global,
  PerformanceNavigationTiming: 'PerformanceNavigationTiming' in _global,
}

export const timingPlugin: Plugin = {
  name: '_performance_timing',
  method: function(sdk: BrowserSDK) {
    onAfterLoad(() => {
      let t = performance.timing
      const times: { [key: string]: number } = {}

      if (supported.getEntriesByType) {
        const paintEntries = performance.getEntriesByType('paint')
        if (paintEntries.length) {
          times.FMP = paintEntries[paintEntries.length - 1].startTime
        }
    
        if (supported.PerformanceNavigationTiming) {
          const nt2Timing = performance.getEntriesByType('navigation')[0]
          if (nt2Timing) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            t = nt2Timing
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
      } = t
    
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
      times.Res = loadEventStart - domContentLoadedEventEnd // 资源加载耗时

      const performanceMetrics: PerformanceMetrics = {
        type: 'performance',
        subType: 'timing',
        pageURL: _global.location.href,
        meta: {
          ...times
        }
      }
      sdk.capture(performanceMetrics)
    })
  }
}

// 不统计以下类型的资源
const preventType = ['fetch', 'xmlhttprequest', 'beacon']

const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
if (isSafari) {
  // safari 会把接口请求当成 other
  preventType.push('other')
}

function filter(type: string) {
  return preventType.includes(type)
}

function isCache(entry: PerformanceResourceTiming) {
  // 直接从缓存读取或 304
  return entry.transferSize === 0 || (entry.transferSize !== 0 && entry.encodedBodySize === 0)
}

export const ResourceFlowPlugin: Plugin = {
  name: '_performance_resource',
  method: function(sdk: BrowserSDK) {

    const resourceFlow: { [key: string]: any }[] = []

    let observe: PerformanceObserver

    const entryHandle = function(list: any) {
      const data = list.getEntries ? list.getEntries() : list
      for (const entry of data) {
        // nextHopProtocol 属性为空，说明资源解析错误或者跨域
        // xhr fetch 单独统计
        if (!entry.nextHopProtocol || filter(entry.initiatorType)) {
          return
        }

        resourceFlow.push({
          name: entry.name, // 资源名称
          sourceType: entry.initiatorType, // 资源类型
          duration: entry.duration, // 资源加载耗时
          dns: entry.domainLookupEnd - entry.domainLookupStart, // DNS 耗时
          tcp: entry.connectEnd - entry.connectStart, // 建立 tcp 连接耗时
          redirect: entry.redirectEnd - entry.redirectStart, // 重定向耗时
          ttfb: entry.responseStart, // 首字节时间
          protocol: entry.nextHopProtocol, // 请求协议
          responseBodySize: entry.encodedBodySize, // 响应内容大小
          responseHeaderSize: entry.transferSize - entry.encodedBodySize, // 响应头部大小
          resourceSize: entry.decodedBodySize, // 资源解压后的大小
          isCache: isCache(entry), // 是否命中缓存
          startTime: performance.now(),
        })
      }
    }

    if (supported.PerformanceObserver) {
      observe = new PerformanceObserver(entryHandle)
      observe.observe({ entryTypes: ['resource'] })
    } else {
      const data = _global.performance.getEntriesByType('resource')
      entryHandle(data)
    }

    const stopListening = function() {
      if (observe) {
        observe.disconnect()
      }
      const performanceMetrics: PerformanceMetrics = {
        type: 'performance',
        subType: 'resource',
        pageURL: _global.location.href,
        meta: {
          resources: resourceFlow
        }
      }
      sdk.capture(performanceMetrics)
    }
    // 当页面 pageshow 触发时，中止
    window.addEventListener('pageshow', stopListening, { once: true, capture: true });
  }
}
