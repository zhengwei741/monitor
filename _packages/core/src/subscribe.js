// 订阅发布
import { getFunctionName } from '@monitor/utils'

const handlers = {}

export function addEventHandler(type, handler) {
  handlers[type] = handlers[type] || []
  if (typeof handler !== 'function') {
    return false
  }
  if (handlers[type].findIndex(handler) !== -1) {
    return false
  }
  handlers[type].push(handler)
  return true
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
