import { Plugin } from '@monitor/types'
import { _global } from '../../utils'
import { ErrorTypes, JSMetrics } from '../../types'
import { BrowserSDK } from '../../core/sdk'

const init = function(sdk: BrowserSDK) {
  const oldOnunhandledrejection = _global.onunhandledrejection

  _global.onunhandledrejection = function(e) {
    const metrics: JSMetrics = {
      type: 'js',
      subtype: ErrorTypes.PE,
      stack: e.reason?.stack,
      message: e.reason?.message
    }
    sdk.capture(metrics)
    if (oldOnunhandledrejection) {
      oldOnunhandledrejection.apply(this, arguments)
    }
  }
}

export const PromiseErrorPlugin: Plugin = {
  name: 'PromiseErrorPlugin',
  method: init
}
