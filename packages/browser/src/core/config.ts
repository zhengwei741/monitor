import { Plugin } from '@monitor/types'
import { BrowserInitOptions } from '../types/index'
import * as plugins from '../plugins'

function findPlugin (names: string[] = []): Plugin[] {
  const fplugin: Plugin[] = []
  const allPlugins = plugins as {[key:string]: Plugin}
  Object.keys(plugins).forEach(key => {
    const plugin = allPlugins[key] as Plugin
    if (names.includes(plugin.name)) {
      fplugin.push(plugin)
    }
  })
  return fplugin
}

function getPluginName(option: any, defaultNames: string[] = []): string[] {
  const names: string[] = []
  
  if (typeof option === 'undefined') {
    option = {}
  }
  if (typeof option === 'boolean') {
    option = defaultNames.reduce((prve, curren) => {
      return prve[curren] = option
    }, {} as { [key: string] : boolean })
  }
  names.push(
    ...Object.keys(option)
      .filter(key => option[key])
      .map(name => name)
    )
  return names
}

export function initConfig (options: BrowserInitOptions) {
  let { behavior, error, performance } = options
  const defalutPlugins: Plugin[] = [
    plugins.BreadcrumbPlugin
  ]

  const names: string[] = []

  names.push(
    ...getPluginName(
      behavior,
      ['pv', 'http', 'route', 'click', 'stayTime']
    ).map(name => `behavior_${name}`)
  )

  names.push(
    ...getPluginName(
      error,
      ['http', 'js', 'promise', 'resource']
    ).map(name => `error_${name}`)
  )

  names.push(
    ...getPluginName(
      performance,
      ['fcp', 'lcp', 'fid', 'cls', 'http', 'timing', 'resource', 'httpTimeConsuming']
    ).map(name => `performance_${name}`)
  )

  defalutPlugins.push(...findPlugin(names))

  options.plugins = options.plugins.concat(defalutPlugins)
}
