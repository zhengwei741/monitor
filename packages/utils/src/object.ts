import { isFunction } from '@monitor/utils'

export function markFunctionWrapped(wrapped: any, original: any) {
  const proto = original.prototype || {}
  wrapped.prototype = original.prototype = proto
}

export function fill(
  source: { [key: string]: any },
  name: string,
  replacementFactory: (...args: any[]) => any
): void {
  if (!source[name]) {
    return
  }
  const original = source[name]

  const wrapped = replacementFactory(original)

  if (isFunction(wrapped)) {
    try {
      markFunctionWrapped(wrapped, original)
    } catch(e) {}
  }
  source[name] = wrapped
}

const defaultFunctionName = '<anonymous>'
export function getFunctionName(fn: unknown) {
  try {
    if (!fn || typeof fn !== 'function') {
      return defaultFunctionName
    }
    return fn.name || defaultFunctionName
  } catch (e) {
    return defaultFunctionName
  }
}