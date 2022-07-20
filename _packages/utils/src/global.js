import { isBrowserBundle } from './env'

const fallbackGlobalObject = {}

export function getGlobalObject(){
  return (
    isNodeEnv()
      ? global
      : typeof window !== 'undefined' // eslint-disable-line no-restricted-globals
      ? window // eslint-disable-line no-restricted-globals
      : typeof self !== 'undefined'
      ? self
      : fallbackGlobalObject
  )
}

export function isNodeEnv() {
  return (
    !isBrowserBundle() &&
    Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]'
  );
}

export function getGlobalSingleton(name, creator) {
  const global = getGlobalObject()
  const __MONITOR__ = (global.__MONITOR__ = global.__MONITOR__ || {})
  const singleton = __MONITOR__[name] || (__MONITOR__[name] = creator())
  return singleton
}
