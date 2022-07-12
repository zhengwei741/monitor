export function markFunctionWrapped(wrapped, original) {
  const proto = original.prototype || {}
  wrapped.prototype = original.prototype = proto
}

export function fill(source, name, replacementFactory) {
  if (!source[name]) {
    return
  }
  const original = source[name]

  const wrapped = replacementFactory(original)

  if (typeof wrapped === 'function') {
    try {
      markFunctionWrapped(wrapped, original)
    } catch(e) {}
  }
  source[name] = wrapped
}

const defaultFunctionName = '<anonymous>'
export function getFunctionName(fn) {
  try {
    if (!fn || typeof fn !== 'function') {
      return defaultFunctionName
    }
    return fn.name || defaultFunctionName
  } catch (e) {
    return defaultFunctionName
  }
}