import { Plugin } from '@monitor/types'
import { _global, proxyFetch, proxyHttpRequest } from '../../utils'
import { HTTPMetrics } from '../../types'
import { BrowserSDK } from '../../core/sdk'
import {} from '../../utils'

const init = function(sdk: BrowserSDK) {
  const onloadHandler = function(metrics: HTTPMetrics) {
    const { status } = metrics
    if (status && status < 400) {
      sdk.capture(metrics)
    }
  }

  proxyHttpRequest(onloadHandler)
  proxyFetch(onloadHandler)
}

export const HttpErrorPlugin: Plugin = {
  name: 'HttpErrorPlugin',
  method: init
}
