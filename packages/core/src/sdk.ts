import { InitOptions, Sender, StackParserFn, Plugin, Breadcrumb, Breadcrumbs, Metrics, Event } from '@monitor/types'
import { logger, isFunction, MonitorError, getTimestamp, generateUUID } from '@monitor/utils'
import { initBreadcrumbs } from './breadcrumb'

export class SDK<O extends InitOptions> {
  protected _options: O;

  protected dsn: string

  protected appKey: string = ''

  protected plugins: {[key : string]: any} = {}

  protected _sender: Sender

  protected _stackParser: StackParserFn

  protected breadcrumbs: Breadcrumbs;

  constructor(options: O) {

    this._options = options

    if (!options.dsn) {
      throw new MonitorError('dsn 未配置')
    }

    this.dsn = options.dsn

    const { sender, stackParser, plugins } = options

    this._sender = sender({
      url: options.dsn,
      buffSize: options.buffSize
    })

    this._stackParser = stackParser

    this.install(plugins)

    this.breadcrumbs = initBreadcrumbs()
  }

  install(plugins: Plugin[]) {
    for (const plugin of plugins) {
      try {
        if (!this.plugins[plugin.name] && isFunction(plugin.method)) {
          plugin.method.call(this, this)
          this.plugins[plugin.name] = plugin.method
        }
      } catch (e) {
        logger.error(`安装${plugin.name}插件失败`, e)
      }
    }
  }

  captureException() {
    // this.sender.send()
  }

  capture(metrics: Metrics) {
    if (metrics.stack) {
      metrics.stackTrace = this._stackParser(metrics.stack)
    }
    const event: Event = {
      data: metrics,
      sdkInfo: this._options.sdkInfo,
      event_id: generateUUID(),
      timestamp: getTimestamp(),
      breadcrumbs: this.breadcrumbs.getStack()
    }
    this._sender.send(event)
  }

  addBreadcrumb(breadcrumb: Breadcrumb) {
    this.breadcrumbs?.addBreadcrumb(breadcrumb)
  }
}