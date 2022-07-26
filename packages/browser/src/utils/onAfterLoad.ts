import { getGlobalObject } from '@monitor/utils'

const global = getGlobalObject<Window>()

export function onAfterLoad (callback: () => void) {
  if (!('document' in global)) {
    return
  }
  if (global.document.readyState === 'complete') {
    setTimeout(callback)
  } else {
    global.addEventListener('pageshow', callback, { once: true, capture: true });
  }
}
