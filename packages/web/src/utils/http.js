import { fill, getGlobalObject, getFunctionName } from '@monitor/utils'

const global = getGlobalObject()

const handlers = {}

function addHandlers(type, handler) {
  const handlerList = handlers[type] || []
  if (typeof handler !== 'function') {
    return
  }
  if (handlerList.find(handler) !== -1) {
    return
  }
  handlerList.push(handler)
}

function triggerHandlers(type, data) {
  if (!type || !handlers[type]) {
    return
  }
  for (const handler of handlers[type] || []) {
    try {
      handler(data)
    } catch (e) {
      console.log(`Type:${type}\nName:${getFunctionName(handler)}\n错误`)
    }
  }
}

export function proxyHttpRequest(sendHandler, loadHandler) {
  if (!('XMLHttpRequest' in global)) {
    return
  }
  addHandlers('sendHandler', sendHandler)
  addHandlers('loadHandler', loadHandler)

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
        triggerHandlers('loadHandler', {
          ...httpMetrics,
          status,
          statusText,
          response,
          responseTime: Date.now(),
        })
      }

      if ('onloadend' in xhr && typeof xhr.onloadend === 'function') {
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
      triggerHandlers('sendHandler', httpMetrics)
      originalSendMethod.apply(xhr, args)
    }
  })
}

export function proxyFetch(sendHandler, loadHandler) {
  if (!('fetch' in global)) {
    return
  }

  addHandlers('fetch-sendHandler', sendHandler)
  addHandlers('fetch-loadHandler', loadHandler)  

  fill(global, 'fetch', function(originaFetch) {
    return function(...args) {
      let metrics = {
        args,
        fetchData: {
          method: getFetchMethod(args),
          url: getFetchUrl(args),
        },
        startTimestamp: Date.now(),
      }

      triggerHandlers('fetch-sendHandler', {
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
          triggerHandlers('fetch-loadHandler', { ...metrics })
          return response
        },
        (error) => {
          triggerHandlers('fetch-loadHandler', {
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

function isInstanceOf(wat, base) {
  try {
    return wat instanceof base;
  } catch (_e) {
    return false;
  }
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