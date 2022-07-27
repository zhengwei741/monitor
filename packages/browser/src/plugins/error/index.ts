import { Plugin } from '@monitor/types'
import { _global, proxyFetch, proxyHttpRequest } from '../../utils'
import { HTTPMetrics, JSMetrics, ErrorTypes } from '../../types'
import { BrowserSDK } from '../../core/sdk'

export const HttpErrorPlugin: Plugin = {
  name: 'error_http',
  method: function(sdk: BrowserSDK) {
    const onloadHandler = function(metrics: HTTPMetrics) {
      const { status } = metrics
      if (status && status < 400) {
        sdk.capture(metrics)
      }
    }
    proxyHttpRequest(onloadHandler)
    proxyFetch(onloadHandler)
  }
}

// 判断是 JS异常、静态资源异常、还是跨域异常
const getErrorKey = (event: ErrorEvent) => {
  const isJsError = event instanceof ErrorEvent
  if (!isJsError) return ErrorTypes.RE
  return event.message === 'Script error.' ? ErrorTypes.CE : ErrorTypes.JE
}

export const JSErrorPlugin: Plugin = {
  name: 'error_js',
  method: function (sdk: BrowserSDK) {
    _global.addEventListener('error', (e) => {
      if (e.error) {
        e.preventDefault()
        // 资源错误不在这上报
        if (getErrorKey(e) === ErrorTypes.RE) {
          return
        }
        const { lineno, colno , error } = e
        const metrics: JSMetrics = {
          type: 'js',
          subtype: ErrorTypes.JE,
          message: error.message,
          stack: error.stack,
          meta: {
            filename: error.filename,
            lineno,
            colno
          }
        }
        sdk.capture(metrics)
      }
    }, true)
  }  
}

export const PromiseErrorPlugin: Plugin = {
  name: 'error_promise',
  method: function(sdk: BrowserSDK) {
    const oldOnunhandledrejection = _global.onunhandledrejection
    _global.onunhandledrejection = function(e) {
      const metrics: JSMetrics = {
        type: 'js',
        subtype: ErrorTypes.PE,
        stack: e.reason?.stack,
        message: e.reason?.message,
        meta: {}
      }
      sdk.capture(metrics)
      if (oldOnunhandledrejection) {
        oldOnunhandledrejection.apply(this, arguments)
      }
    }
  }
}

export const ResourceErrorPlugin: Plugin = {
  name: 'error_resource',
  method: function(sdk: BrowserSDK) {
    if (!('document' in _global)) {
      return
    }
    _global.document.addEventListener('error', (e) => {
      e.preventDefault()
      const target = e.target as HTMLElement
      if (target && target.nodeType === 1) {
        let src = ''
        if (target.nodeName.toLowerCase() === 'link') {
          // @ts-ignore
          src = target.href
        } else {
          // @ts-ignore
          src = target.currentSrc || target.src
        }
        const metrics: JSMetrics = {
          type: 'js',
          subtype: ErrorTypes.RE,
          meta: {
            url: src,
            html: target.outerHTML,
            tagName: target.tagName,
          }
        }
        sdk.capture(metrics)
      }
    }, true)
  }
}
