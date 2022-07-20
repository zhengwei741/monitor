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
    logger?: any
    breadcrumb?: any
    plugins?: any
  }
}

export function getGlobalSingleton(
  name: keyof MonitorGlobal['__MONITOR__'],
  creater: () => unknown
) {
  const global = getGlobalObject() as MonitorGlobal
  const __MONITOR__ = global.__MONITOR__ || (global.__MONITOR__ = {})
  const singleton = __MONITOR__[name] || (__MONITOR__[name] = creater())
  return singleton
}
