import { createrSender } from '@monitor/core'

export function makeFetchSender() {
  return createrSender()
}

export function makeXHRSender() {
  return createrSender()
}