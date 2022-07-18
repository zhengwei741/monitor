import { getGlobalObject } from '@monitor/utils'

const global = getGlobalObject()

export function onAfterLoad (callback) {
  if (!('document' in global)) {
    return
  }
  if (global.document.readyState === 'complete') {
    setTimeout(callback)
  } else {
    global.addEventListener('pageshow', callback, { once: true, capture: true });
  }
}
