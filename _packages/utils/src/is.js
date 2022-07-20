export function isInstanceOf(wat, base) {
  try {
    return wat instanceof base;
  } catch (_e) {
    return false;
  }
}

export function isFunction(func) {
  return typeof func === 'function'
}
