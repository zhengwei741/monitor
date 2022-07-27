// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export function isThenable(wat: any): wat is PromiseLike<any> {
  return Boolean(wat && wat.then && typeof wat.then === 'function')
}

export function isPlainObject(wat: unknown): wat is Record<string, unknown> {
  return isBuiltin(wat, 'Object')
}

const objectToString = Object.prototype.toString
function isBuiltin(wat: unknown, ty: string): boolean {
  return objectToString.call(wat) === `[object ${ty}]`
}