import { getGlobalSingleton } from '@monitor/utils'

const makePlugins = function() {
  
}

const plugins = getGlobalSingleton('plugins', makePlugins)