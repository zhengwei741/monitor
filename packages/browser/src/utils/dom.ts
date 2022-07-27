import { getGlobalObject, throttle } from '@monitor/utils'
import { addEventHandler, triggerHandlers } from '@monitor/core'

const instrumentType = {
  DC: '_dom_click'
}

type handlerType = (e: Event) => void

export function proxyDomClick(handler: handlerType) { 
  const _global = getGlobalObject<Window>()

  if (!('document' in _global)) {
    return
  }

  const res = addEventHandler(instrumentType.DC, handler)
  if (!res) {
    return
  }

  const globalDOMEventHandler = throttle(function(e: Event) {
    // let target = e.target || e.srcElement
    // if (!target) return
    triggerHandlers(instrumentType.DC, e)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, 1000) as any

  _global.addEventListener('click', globalDOMEventHandler)
}
