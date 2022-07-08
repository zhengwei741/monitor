export class Core {
  constructor(options){
    this.options = options
    this.checkBaseInfo()
  }

  checkBaseInfo() {
    const { url, appId, userId } = options
    if (!url || !appId || !userId) {
      throw new Error('缺少必要参数')
    }
  }

  static use(plugin) {
    const installedPlugins = this._installedPlugins || (this._installedPlugins = [])
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }
    const args = Array.from(arguments)
    args.unshift(this)
    if (plugin.install && typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}
