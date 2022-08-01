import { initConfig } from '../../src/core/config'
import { BrowserInitOptions } from '../../src/types/browserInitOptions'

describe('initConfig', () => {
  test('初始化所有配置', () => {
    const option: BrowserInitOptions = {
      behavior: true,
      error: true,
      performance: true
    }
    initConfig(option)

    const behaviorPluginNames = [
      'behavior_pv',
      'behavior_http',
      'behavior_route',
      'behavior_click',
      'behavior_stayTime'
    ]
    const errorPluginNames = [
      'error_http',
      'error_js',
      'error_promise',
      'error_resource'
    ]
    const performancePluginNames = [
      'performance_fcp',
      'performance_lcp',
      'performance_fid',
      'performance_cls',
      'performance_httpTimeConsuming',
      'performance_timing',
      'performance_resource'
    ]

    const pluginNames = option.plugins.map(plugin => plugin.name)

    expect([
      'BreadcrumbPlugin',
      ...behaviorPluginNames,
      ...errorPluginNames,
      ...performancePluginNames,
    ]).toEqual(pluginNames)
  })

  test('初始化部分配置', () => {
    const option: BrowserInitOptions = {
      behavior: {
        click: true
      },
      error: {
        js: true,
        promise: true
      },
      performance: false
    }
    initConfig(option)

    const behaviorPluginNames = [
      'behavior_click'
    ]
    const errorPluginNames = [
      'error_js',
      'error_promise'
    ]

    const pluginNames = option.plugins.map(plugin => plugin.name)

    expect([
      'BreadcrumbPlugin',
      ...behaviorPluginNames,
      ...errorPluginNames
    ]).toEqual(pluginNames)
  })
})