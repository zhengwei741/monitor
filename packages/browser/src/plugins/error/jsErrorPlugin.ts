import { Plugin } from '@monitor/types'
import { _global } from '../../utils'
import { ErrorTypes, JSMetrics } from '../../types'
import { BrowserSDK } from '../../core/sdk'

// 判断是 JS异常、静态资源异常、还是跨域异常
const getErrorKey = (event: ErrorEvent) => {
  const isJsError = event instanceof ErrorEvent
  if (!isJsError) return ErrorTypes.RE
  return event.message === 'Script error.' ? ErrorTypes.CE : ErrorTypes.JE
}

function init(sdk: BrowserSDK) {
  _global.addEventListener('error', (e) => {
    if (e.error) {
      e.preventDefault()
      // 资源错误不在这上报
      if (getErrorKey(e) === ErrorTypes.RE) {
        return
      }
      const { lineno, colno , error } = e
      const metrics: JSMetrics = {
        type: 'js',
        subtype: ErrorTypes.JE,
        message: error.message,
        stack: error.stack,
        meta: {
          filename: error.filename,
          lineno,
          colno
        }
      }
      sdk.capture(metrics)
    }
  }, true)
}

export const jsErrorPlugins: Plugin = {
  name: 'jsErrorPlugins',
  method: init
}
