import { Plugin } from '@monitor/types'
import { _global } from '../../utils'
import { ErrorTypes, JSMetrics } from '../../types'
import { BrowserSDK } from '../../core/sdk'

const init = function(sdk: BrowserSDK) {
  if (!('document' in _global)) {
    return
  }
  _global.document.addEventListener('error', (e) => {
    e.preventDefault()
    const target = e.target as HTMLElement
    if (target && target.nodeType === 1) {
      let src = ''
      if (target.nodeName.toLowerCase() === 'link') {
        // @ts-ignore
        src = target.href
      } else {
        // @ts-ignore
        src = target.currentSrc || target.src
      }
      const metrics: JSMetrics = {
        type: 'js',
        subtype: ErrorTypes.RE,
        meta: {
          url: src,
          html: target.outerHTML,
          tagName: target.tagName,
        }
      }
      sdk.capture(metrics)
    }
  }, true)
}

export const ResourceErrorPlugin: Plugin = {
  name: 'resourceErrorPlugin',
  method: init
}
