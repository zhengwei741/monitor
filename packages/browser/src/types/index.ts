import { InitOptions } from '@monitor/types'

export interface BrowserInitOptions extends InitOptions {}

export interface WebSDK {}

export const ErrorTypes = {
  resource: 'resource-error',
  js: 'js-error',
  cs: 'cros-error',
  pe: 'promise-error',
  he: 'http-error',
  ve: 'vue-error'
}
