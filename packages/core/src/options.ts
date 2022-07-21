import { InitOptions } from '@monitor/types'
import { validateOption } from '@monitor/utils'

export function initOptions(options: InitOptions) {
  const {
    dsn,
    appKey,
    beforeSend,
    beforeBreadcrumb
  } = options
  validateOption(dsn, 'dsn', 'string')
  validateOption(appKey, 'appKey', 'string')

  validateOption(beforeSend, 'beforeSend', 'function')
  validateOption(beforeBreadcrumb, 'beforeBreadcrumb', 'function')
}
