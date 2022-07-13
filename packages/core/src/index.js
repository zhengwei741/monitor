import { isFunction } from '@monitor/utils'

export class Core {
  constructor(options){
    this.options = options
    this.checkBaseInfo()
  }

  checkBaseInfo() {
    const { url, appId, userId } = this.options
    if (!url || !appId || !userId) {
      throw new Error('缺少必要参数')
    }
  }

  use(plugin) {
    const installedPlugins = this._installedPlugins || (this._installedPlugins = [])
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }
    const args = Array.from(arguments)
    args.unshift(this)
    if (plugin.install && isFunction(plugin.install)) {
      plugin.install.apply(plugin, args)
    } else if (isFunction(plugin)) {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}
