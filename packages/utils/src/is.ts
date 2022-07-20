export function isInstanceOf(wat: any, base: any): boolean {
  try {
    return wat instanceof base
  } catch (_e) {
    return false
  }
}

export function isFunction(func: unknown) {
  return typeof func === 'function'
}
