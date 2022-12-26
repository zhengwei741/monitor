import { isFunction } from "./helper";

export function markFunctionWrapped(wrapped: any, original: any) {
  const proto = original.prototype || {};
  wrapped.prototype = original.prototype = proto;
}

export function fill(
  source: { [key: string]: any },
  name: string,
  replacementFactory: (...args: any[]) => any
): void {
  if (!source[name]) {
    return;
  }
  const original = source[name];

  const wrapped = replacementFactory(original);

  if (isFunction(wrapped)) {
    try {
      markFunctionWrapped(wrapped, original);
    } catch (e) {}
  }
  source[name] = wrapped;
}
