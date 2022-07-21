import { SDK } from '@monitor/core'
import { Plugin, SdkInfo } from '@monitor/types'
import { supportsFetch } from '@monitor/utils'
import { BrowserInitOptions } from '../types/index'
import { stackParser } from './stack-parsers'
import { createFetchSender, createXHRSender } from './sender'
import { logger } from '@monitor/utils'
import Package from '../../package.json'

const defalutPlugins: Plugin[] = []

export class BrowserSDK extends SDK<BrowserInitOptions> {
  private sdkInfo: SdkInfo = {
    name: Package.name,
    version: Package.version
  }

  constructor(options: BrowserInitOptions) {
    if (options.debug === true) {
      logger.enable()
    }

    options.plugins = options.plugins.concat(defalutPlugins)

    options.stackParser = stackParser

    options.sender = supportsFetch() ? createFetchSender : createXHRSender

    super(options)

    this.sdkInfo.plugins = options.plugins.map(plugin => plugin.name)
  }
}