import { SDK } from '@monitor/core'
import { supportsFetch } from '@monitor/utils'
import { BrowserInitOptions, BrowserMetrics } from '../types/index'
import { stackParser } from './stack-parsers'
import { createFetchSender, createXHRSender } from './sender'
import { logger } from '@monitor/utils'
import { initConfig } from './config'
import Package from '../../package.json'
import { BrowserError } from './error'

export class BrowserSDK extends SDK<BrowserInitOptions> {
  private error: BrowserError = new BrowserError()

  constructor(options: BrowserInitOptions) {
    if (options.debug === true) {
      logger.enable()
    }

    initConfig(options)

    options.stackParser = stackParser

    options.sender = supportsFetch() ? createFetchSender : createXHRSender

    options.sdkInfo = {
      name: Package.name,
      version: Package.version,
      plugins: options.plugins.map(plugin => plugin.name)
    }
    super(options)
  }

  capture(metrics: BrowserMetrics) {
    metrics.appKey = this.appKey
    const errorId = this.error.createErrorid(metrics)
    if (errorId && typeof errorId === 'number') {
      metrics.errorId = errorId
      super.capture(metrics)
    }
  }
}