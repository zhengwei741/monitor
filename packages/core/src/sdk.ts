import { InitOptions, Sender, StackParserFn, Plugin } from '@monitor/types'
import { logger } from '@monitor/utils'

export class SDK<O extends InitOptions> {
  protected readonly _options: O;

  protected _sender?: Sender

  protected _stackParser?: StackParserFn

  protected readonly dsn?: string

  protected readonly appKey?: string

  protected plugins: {[key : string]: any} = {}

  constructor(options: O) {

    this._options = options

    if (options.dsn) {
      // TODO
      this.dsn = options.dsn

      const { sender, stackParser, plugins } = options

      this._sender = sender({
        url: options.dsn,
        buffSize: options.buffSize
      })
  
      this._stackParser = stackParser

      this.install(plugins)
    } else {
      logger.warn('dsn 未配置')
    }
  }

  install(plugins: Plugin[]) {
    for (const plugin of plugins) {
      try {
        if (!this.plugins[plugin.name]) {
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

  captureMessage() {}

  captureEvent() {}

  addBreadcrumb() {}
}