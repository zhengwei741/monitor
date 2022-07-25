import { getGlobalObject, throttle } from '@monitor/utils'
import { addEventHandler, triggerHandlers, HandlerCallback } from '@monitor/core'

const instrumentType = {
  DC: 'dom-click'
}

export function proxyDomClick(handler: HandlerCallback) { 
  const _global = getGlobalObject<Window>()

  if (!('document' in _global)) {
    return
  }

  const res = addEventHandler(instrumentType.DC, handler)
  if (!res) {
    return
  }

  const globalDOMEventHandler = throttle(function(e: Event) {
    let target = e.target || e.srcElement
    if (!target) return
    triggerHandlers(instrumentType.DC, target)
  }, 1000) as any

  _global.addEventListener('click', globalDOMEventHandler)
}
