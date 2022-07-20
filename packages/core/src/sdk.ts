import { InitOptions } from '@monitor/types'
import { logger } from '@monitor/utils'

export class SDK {
  constructor(options: InitOptions) {
    if (options.debug === true) {
      logger.enable()
    }
  }

  captureException() {}

  captureMessage() {}

  captureEvent() {}

  getDsn() {}

  addBreadcrumb() {}
}