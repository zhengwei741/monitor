import { fill, getGlobalObject, isFunction } from '@monitor/utils'
import { addInstrumentationHandler, triggerHandlers } from './instrument'

const global = getGlobalObject()

const instrumentType = {
  SH: 'sendHandler',
  LH: 'loadHandler',
  FSH: 'fetch-sendHandler',
  FLH: 'fetch-loadHandler',
}

export function proxyHttpRequest(sendHandler, loadHandler) {
  if (!('XMLHttpRequest' in global)) {
    return
  }
  addInstrumentationHandler(instrumentType.SH, sendHandler)
  addInstrumentationHandler(instrumentType.LH, loadHandler)

  if (!global.oXMLHttpRequest) {
    global.oXMLHttpRequest = global.XMLHttpRequest
  }

  const httpMetrics = {}

  fill(global.XMLHttpRequest, 'open', function(originalOpenMethod) {
    return function(...args) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const xhr = this
      httpMetrics.method = args[0]
      httpMetrics.url = args[1]

      const onreadystatechangeHandler = function () {
        const { status, statusText, response } = xhr
        triggerHandlers(instrumentType.LH, {
          ...httpMetrics,
          status,
          statusText,
          response,
          responseTime: Date.now(),
        })
      }

      if ('onloadend' in xhr && isFunction(xhr.onloadend)) {
        fill(xhr, 'onloadend', function(original) {
          return function(...arsg) {
            onreadystatechangeHandler()
            original.apply(xhr, arsg)
          }
        })
      } else {
        xhr.addEventListener('loadend', onreadystatechangeHandler)
      }

      originalOpenMethod.apply(xhr, args)
    }
  })

  fill(global.XMLHttpRequest, 'send', function(originalSendMethod) {
    return function(...args) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const xhr = this
      httpMetrics.body = args[0]
      httpMetrics.requestTime = Date.now()
      triggerHandlers(instrumentType.SH, httpMetrics)
      originalSendMethod.apply(xhr, args)
    }
  })
}

export function proxyFetch(sendHandler, loadHandler) {
  if (!('fetch' in global)) {
    return
  }

  addInstrumentationHandler(instrumentType.FSH, sendHandler)
  addInstrumentationHandler(instrumentType.FLH, loadHandler)  

  fill(global, 'fetch', function(originaFetch) {
    return function(...args) {
      let metrics = {
        args,
        method: getFetchMethod(args),
        url: getFetchUrl(args),
        requestTime: Date.now(),
      }

      triggerHandlers(instrumentType.FSH, {
        ...metrics
      })
      return originaFetch.apply(global, args).then(
        async (response) => {
          const res = response.clone()
          metrics = {
            ...metrics,
            status: res.status,
            statusText: res.statusText,
            response: await res.text(),
            responseTime: Date.now(),
          }
          triggerHandlers(instrumentType.FLH, { ...metrics })
          return response
        },
        (error) => {
          triggerHandlers(instrumentType.FLH, {
            ...metrics,
            responseTime: Date.now(),
            error,
          })
          return error
        }
      )
    }
  })
}

function getFetchMethod(fetchArgs) {
  if ('Request' in global && isInstanceOf(fetchArgs[0], Request) && fetchArgs[0].method) {
    return String(fetchArgs[0].method).toUpperCase()
  }
  if (fetchArgs[1] && fetchArgs[1].method) {
    return String(fetchArgs[1].method).toUpperCase()
  }
  return 'GET'
}

function getFetchUrl(fetchArgs) {
  if (typeof fetchArgs[0] === 'string') {
    return fetchArgs[0]
  }
  if ('Request' in global && isInstanceOf(fetchArgs[0], Request)) {
    return fetchArgs[0].url
  }
  return String(fetchArgs[0])
}
