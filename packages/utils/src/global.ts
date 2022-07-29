import { Logger } from './logger'
import { Breadcrumbs } from '@monitor/types'

const fallbackGlobalObject = {}

export function getGlobalObject<T>(): T & MonitorGlobal {
  return (
    typeof window !== 'undefined'
    ? window
    : typeof self !== 'undefined'
    ? self
    : fallbackGlobalObject
  ) as T & MonitorGlobal
}

export interface MonitorGlobal {
  __MONITOR__: {
    logger?: Logger
    breadcrumbs?: Breadcrumbs
  }
}

export function getGlobalSingleton(
  name: keyof MonitorGlobal['__MONITOR__'],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  creater: (...args: any[]) => any
) {
  const global = getGlobalObject() as MonitorGlobal
  const __MONITOR__ = global.__MONITOR__ || (global.__MONITOR__ = {})
  const singleton = __MONITOR__[name] || (__MONITOR__[name] = creater())
  return singleton
}
