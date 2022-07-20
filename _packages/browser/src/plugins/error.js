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
  he: 'http-error',
  ve: 'vue-error'
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
        errorId: `${errorTypes.resource}-${src}-${target.tagName}`,
        meta: {
          url: src,
          html: target.outerHTML,
          type: target.tagName,
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
  return event.message === 'Script error.' ? errorTypes.cs : errorTypes.js
}

export const initjsError = function(websdk) {
  if (!('addEventListener' in global)) {
    return
  }
  global.addEventListener('error', (e) => {
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


const classifyRE = /(?:^|[-_])(\w)/g
const classify = (str) =>
  str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "")

const formatComponentName = function (vm, includeFile) {
  if (!vm) {
    return "<Anonymous>"
  }
  if (vm.$root === vm) {
    return "<Root>"
  }

  const options = vm.$options
  let name = options.name || options._componentTag
  const file = options.__file
  if (!name && file) {
    const match = file.match(/([^/\\]+)\.vue$/)
    if (match) {
      name = match[1]
    }
  }

  return (
    (name ? `<${classify(name)}>` : "<Anonymous>") +
    (file && includeFile ? `at ${file}` : "")
  )
}

const generateComponentTrace = function (vm) {
  if ((vm?.__isVue || vm?._isVue) && vm.$parent) {
    const trace = []
    while (vm) {
      trace.push(formatComponentName(vm))
      vm = vm.$parent
    }

    return trace.reverse().join('-->')
  }
  return formatComponentName(vm, true)
}
export const initVueError = function(websdk) {
  if (websdk.vue) {
    vue.config.errorHandler = function (
      error,
      vm,
      lifecycleHook
    ) {
      const reportData = {
        type: errorTypes.ve,
        errorUid: `${errorTypes.ve}-${error.message}-${error.stack}`,
        message: error.message,
        stack: error.stack,
        meta: {
          lifecycleHook,
          componentName: formatComponentName(vm),
          trace: vm ? generateComponentTrace(vm) : "",
          vm,
          error
        }
      }
      const finallyData = reportErrorHandle(reportData)
      if (finallyData) {
        websdk.report(finallyData)
      }
    }
  }
}