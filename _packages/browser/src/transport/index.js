import { } from '@monitor/core'

export function makeFetchTransport (options) {
  const data = {
    body: options.body,
    method: 'POST',
    referrerPolicy: 'origin',
    headers: options.headers,
    ...options.fetchOptions,
  }

  return window.fetch(options.url, data)
}

export function makeXHRTransport (options) {
  return global.navigator.sendBeacon(options.url, JSON.stringify(options.body))
}
