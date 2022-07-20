import { getGlobalSingleton, getGlobalObject } from './global'

export const CONSOLE_LEVELS = ['info', 'warn', 'error', 'log']

const PREFIX = 'Monitor Logger '

class Logger {
  constructor() {
    const global = getGlobalObject()
    this._console = {}
    this.enabled = true
    if (global.console) {
      CONSOLE_LEVELS.forEach(level => {
        if (level in global.console) {
          this._console[level] = global.console[level]
        }
      })
    }
  }
  bind(debug) {
    this.enabled = debug ? true : false
  }
  disable() {
    this.enabled = false
  }
  enable() {
    this.enabled = true
  }
  info(...args) {
    if (!this.enabled) return
    this._console.info(`${PREFIX}[info]`, ...args)
  }
  warn(...args) {
    if (!this.enabled) return
    this._console.warn(`${PREFIX}[warn]`, ...args)
  }
  error(...args) {
    if (!this.enabled) return
    this._console.error(`${PREFIX}[error]`, ...args)
  }
  log(...args) {
    if (!this.enabled) return
    this._console.log(`${PREFIX}[log]`, ...args)
  }
}

function makeLogger() {
  return new Logger()
}

const logger = getGlobalSingleton('logger', makeLogger)

export {
  logger
} 
