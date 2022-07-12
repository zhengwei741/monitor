import { getGlobalObject } from '@monitor/utils'
import { getPageInfo, parseStackFrames, proxyHttpRequest, proxyFetch } from '../utils'

const global = getGlobalObject()

// 缓存错误id 同一错误不上报
const submitErrorids = []
function reportErrorHandle(errorMechanism = {}) {
  const { errorId, stack } = errorMechanism
  if (submitErrorids.includes(errorId)) {
    return
  }
  submitErrorids.push(errorId)

  const finallyData = {
    ...errorMechanism,
    ...(stack && { stack: parseStackFrames(stack) }),
    pageInformation: getPageInfo()
  }
  return finallyData
}

const errorTypes = {
  resource: 'resource-error',
  js: 'js-error',
  cs: 'cros-error',
  pe: 'promise-error',
  he: 'http-error'
}

export const initResourceError = function(websdk) {
  if (!('document' in global)) {
    return
  }
  global.document.addEventListener('error', (e) => {
    e.preventDefault()
    const target = e.target
    if (target && target.nodeType === 1) {
      let src = ''
      if (target.nodeName.toLowerCase() === 'link') {
        src = target.href
      } else {
        src = target.currentSrc || target.src
      }
      const finallyData = reportErrorHandle({
        errorId: `${errorTypes.resource}-${e.error.message}-${e.filename}`,
        message: e.error.message,
        stack: e.error.stack,
        meta: {
          src,
          html: target.outerHTML,
          tagName: target.tagName,
        },
        type: errorTypes.resource
      })
      if (finallyData) {
        websdk.report(finallyData)
      }
    }
  }, true)
}

// 判断是 JS异常、静态资源异常、还是跨域异常
const getErrorKey = (event) => {
  const isJsError = event instanceof ErrorEvent
  if (!isJsError) return errorTypes.resource
  return event.message === 'Script error.' ? errorTypes.cs : mechanismType.JS
};

export const initjsError = function(websdk) {
  if (!('document' in global)) {
    return
  }
  global.document.addEventListener('error', (e) => {
    if (e.error) {
      e.preventDefault()
      // 资源错误不在这上报
      if (getErrorKey(e) === errorTypes.resource) {
        return
      }
      const { lineno, colno , error } = e
      const finallyData = reportErrorHandle({
        errorId: `${errorTypes.js}-${error.message}-${error.filename}`,
        message: error.message,
        stack: error.stack,
        meta: {
          filename: error.filename,
          lineno,
          colno
        },
        type: errorTypes.js
      })
      if (finallyData) {
        websdk.report(finallyData)
      }
    }
  }, true)
}

export const initPromiseError = function(websdk) {
  const oldOnunhandledrejection = global.onunhandledrejection

  global.onunhandledrejection = function(e) {
    const finallyData = reportErrorHandle({
      stack: e.reason?.stack,
      message: e.reason?.message,
      errorId: `${errorTypes.pe}-${e.reason?.message}`,
      type: errorTypes.pe
    })
    if (finallyData) {
      websdk.report(finallyData)
    }
    if (oldOnunhandledrejection) {
      oldOnunhandledrejection.apply(this, arguments)
    }
  }
}

export const initHttpError = function(websdk) {

  const onloadHandler = function(metrics) {
    const { status, response, statusText } = metrics
    if (status < 400) {
      const finallyData = reportErrorHandle({
        ...metrics,
        type: errorTypes.he,
        errorId: `${errorTypes.he}-${response}-${statusText}`
      })
      if (finallyData) {
        websdk.report(finallyData)
      }
    }
  }

  proxyHttpRequest(undefined, onloadHandler)
  proxyFetch(undefined, onloadHandler)
}

export {
  initResourceError,
  initjsError,
  initPromiseError
}
