import { getFunctionName } from '@monitor/utils'

export type HandlerCallback = (data: any) => void

const handlers: { [key: string]: HandlerCallback[] } = {}

export function addEventHandler(type: string, handler: HandlerCallback | undefined): boolean {
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

export function triggerHandlers(type: string, data: any): void {
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
