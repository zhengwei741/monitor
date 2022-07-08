export function markFunctionWrapped(wrapped, original) {
  const proto = original.prototype || {};
  wrapped.prototype = original.prototype = proto;
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
