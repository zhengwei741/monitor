import { SDK } from '@monitor/core'
import { Plugin } from '@monitor/types'
import { supportsFetch } from '@monitor/utils'
import { BrowserInitOptions } from '../types/index'
import { stackParser } from './stack-parsers'
import { createFetchSender, createXHRSender } from './sender'
import { logger } from '@monitor/utils'
import Package from '../../package.json'

const defalutPlugins: Plugin[] = []

export class BrowserSDK extends SDK<BrowserInitOptions> {
  constructor(options: BrowserInitOptions) {
    if (options.debug === true) {
      logger.enable()
    }

    options.plugins = options.plugins.concat(defalutPlugins)

    options.stackParser = stackParser

    options.sender = supportsFetch() ? createFetchSender : createXHRSender

    options.sdkInfo = {
      name: Package.name,
      version: Package.version,
      plugins: options.plugins.map(plugin => plugin.name)
    }
    super(options)
  }
}