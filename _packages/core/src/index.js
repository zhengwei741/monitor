import { isFunction } from '@monitor/utils'
import { initOptions } from './options'
import { createTransport } from './sender'

export class Core {
  constructor(options){
    this._options = options
    this._plugins = {}
    initOptions(options)
  }

  callPlugins() {
    Object.keys(this._plugins).forEach(pluginsName => {
      const plugin = this._plugins[pluginsName]
      plugin.call(this, this)
    })
  }

  static install(name, method) {
    if (name && isFunction(method)) {
      this._plugins[name] = method
    }
  }

  static installAll(list = []) {
    list.forEach(item => {
      Core.install(item.name, item.method)
    })
  }
}
