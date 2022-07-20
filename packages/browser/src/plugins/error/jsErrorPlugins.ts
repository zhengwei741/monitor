import { Plugin } from '@monitor/types'
import { _global } from '../../utils'
import { ErrorTypes } from '../../types'
import { BrowserSDK } from '../../core/sdk'

// 判断是 JS异常、静态资源异常、还是跨域异常
const getErrorKey = (event: ErrorEvent) => {
  const isJsError = event instanceof ErrorEvent
  if (!isJsError) return ErrorTypes.resource
  return event.message === 'Script error.' ? ErrorTypes.cs : ErrorTypes.js
}

function jsError(sdk: BrowserSDK) {
  _global.addEventListener('error', (e) => {
    if (e.error) {
      e.preventDefault()
      // 资源错误不在这上报
      if (getErrorKey(e) === ErrorTypes.resource) {
        return
      }
      // const { lineno, colno , error } = e
      // reportErrorHandle({
      //   errorId: `${ErrorTypes.js}-${error.message}-${error.filename}`,
      //   message: error.message,
      //   stack: error.stack,
      //   meta: {
      //     filename: error.filename,
      //     lineno,
      //     colno
      //   },
      //   type: ErrorTypes.js
      // })
    }
  }, true)
}

export const jsErrorPlugins: Plugin = {
  name: 'jsErrorPlugins',
  method: jsError
}
