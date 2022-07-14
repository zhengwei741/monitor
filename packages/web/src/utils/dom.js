import { getGlobalObject } from '@monitor/utils'
import { addInstrumentationHandler, triggerHandlers, getInstrumented } from './instrument'

const NODE_LIST = ['div', 'li']

const instrumentType = {
  DC: 'dom-click'
}

let timer = null

export function proxyDomClick(handler) { 
  const global = getGlobalObject()

  if (!'document' in global) {
    return
  }

  addInstrumentationHandler(instrumentType.DC, handler)

  if (getInstrumented(instrumentType.DC).length > 1) {
    return
  }

  ['mousedown', 'touchstart'].forEach(eventType => {
    global.document.addEventListener(eventType, function(e) {
      clearTimeout(timer)
      timer = global.setTimeout(() => {
        let target = e.path?.find((x) => NODE_LIST.includes(x.tagName?.toLowerCase()))
        // 不支持 path 就再判断 target
        target = target || (NODE_LIST.includes(e.target.tagName?.toLowerCase()) ? e.target : undefined)
        if (!target) return
        triggerHandlers(instrumentType.DC, { eventType, target, e })
      }, 500)
    })
  })
}
