import { MonitorError } from "./error";

/** 时间戳 */
export function getTimestamp(): number {
  return Date.now();
}
/** uuid */
export function generateUUID(): string {
  let d = new Date().getTime();
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}
/** 节流 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const throttle = (fn: Function, delay: number): Function => {
  let canRun = true;
  return function (...args: any) {
    if (!canRun) return;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fn.apply(this, args);
    canRun = false;
    setTimeout(() => {
      canRun = true;
    }, delay);
  };
};
/** 获取函数名 */
const defaultFunctionName = "<anonymous>";
export function getFunctionName(fn: unknown) {
  try {
    if (!fn || typeof fn !== "function") {
      return defaultFunctionName;
    }
    return fn.name || defaultFunctionName;
  } catch (e) {
    return defaultFunctionName;
  }
}
/** 校验 */
export function validateOption(
  target: any,
  targetName: string,
  expectType: string
): boolean {
  if (typeofAny(target, expectType)) return true;

  throw new MonitorError(
    `${targetName}期望传入${expectType}类型，目前是${typeof target}类型`
  );
}
function typeofAny(target: any, type: string): boolean {
  return typeof target === type;
}

export function isFunction(func: unknown) {
  return typeof func === "function";
}

export function isThenable(wat: any): wat is PromiseLike<any> {
  return Boolean(wat && wat.then && typeof wat.then === "function");
}

export function isPlainObject(wat: unknown): wat is Record<string, unknown> {
  return isBuiltin(wat, "Object");
}
const objectToString = Object.prototype.toString;
function isBuiltin(wat: unknown, ty: string): boolean {
  return objectToString.call(wat) === `[object ${ty}]`;
}

export function isInstanceOf(wat: any, base: any): boolean {
  try {
    return wat instanceof base;
  } catch (_e) {
    return false;
  }
}
