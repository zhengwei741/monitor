import { logger } from './logger'

export function getTimestamp(): number {
  return Date.now()
}

export const objectToString = Object.prototype.toString

export function typeofAny(target: any, type: string): boolean {
  return typeof target === type
}

export function toStringAny(target: any, type: string): boolean {
  return objectToString.call(target) === type
}

export function validateOption(target: any, targetName: string, expectType: string): boolean {
  if (typeofAny(target, expectType)) return true
  typeof target !== 'undefined' && logger.error(`${targetName}期望传入${expectType}类型，目前是${typeof target}类型`)
  return false
}

export function toStringValidateOption(target: any, targetName: string, expectType: string): boolean {
  if (toStringAny(target, expectType)) return true
  typeof target !== 'undefined' && logger.error(`${targetName}期望传入${expectType}类型，目前是${objectToString.call(target)}类型`)
  return false
}
