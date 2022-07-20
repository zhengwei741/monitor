import { getGlobalSingleton, getGlobalObject } from './global'

export const CONSOLE_LEVELS = ['info', 'warn', 'error', 'log']

const PREFIX = 'Monitor Logger '

const global = getGlobalObject<Window | any>()

type LoggerMethod = (...args: unknown[]) => void
type LoggerConsoleMethods = Record<typeof CONSOLE_LEVELS[number], LoggerMethod>;
interface Logger extends LoggerConsoleMethods {
  disable(): void;
  enable(): void;
}

function makeLogger (): Logger {
  let enabled = false
  const logger: Partial<Logger> = {
    disable() {
      enabled = true
    },
    enable() {
      enabled = false
    }
  }

  if ('console' in global) {
    CONSOLE_LEVELS.forEach(level => {
      logger[level] = (...args) => {
        if (enabled) {
          global.console[level](`${PREFIX}[${level}]:`, ...args)
        }
      }
    })
  } else {
    CONSOLE_LEVELS.forEach(level => {
      logger[level] = () => undefined
    })
  }

  return logger as Logger
}

const logger = getGlobalSingleton('logger', makeLogger) as Logger

export {
  logger
}
