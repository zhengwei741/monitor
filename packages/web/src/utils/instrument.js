import { getFunctionName } from '@monitor/utils'

const handlers = {}

export function getInstrumented(type) {
  return handlers[type] || []
}

export function addInstrumentationHandler(type, handler) {
  handlers[type] = handlers[type] || []
  if (typeof handler !== 'function') {
    return
  }
  if (handlers[type].findIndex(handler) !== -1) {
    return
  }
  handlers[type].push(handler)
}

export function triggerHandlers(type, data) {
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
