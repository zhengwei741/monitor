import { SDK } from '@monitor/core'
import { Plugin } from '@monitor/types'
import { supportsFetch } from '@monitor/utils'
import { BrowserInitOptions } from '../types/index'
import { stackParser } from './stack-parsers'
import { createrFetchSender, createrXHRSender } from './transport'

const defalutPlugins: Plugin[] = []

export class BrowserSDK extends SDK {
  constructor(options: BrowserInitOptions) {

    options.plugins = options.plugins.concat(defalutPlugins)

    options.stackParser = stackParser

    options.sender = supportsFetch() ? createrFetchSender() : createrXHRSender()

    super(options)
  }
}