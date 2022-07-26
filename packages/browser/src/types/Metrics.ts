import { Metrics } from '@monitor/types'

export type BrowserMetrics = JSMetrics | HTTPMetrics | PerformanceMetrics | BehaviorMetrics

export enum ErrorTypes {
  RE = 'resource-error',
  JE = 'js-error',
  CE = 'cros-error',
  PE = 'promise-error',
  HE = 'http-error'
}

export type ErrorTypesv = 'resource-error' | 'js-error' | 'cros-error' | 'promise-error' | 'http-error'

export interface JSMetrics extends Metrics{
  type: 'js'
  subtype: ErrorTypesv
  meta: {
    url?: string
    html?: string
    tagName?: string
    filename?: string
    lineno?: number
    colno?: number
  }
}

export interface HTTPMetrics extends Metrics{
  type: 'http'
  url?: string
  method?: string
  request?: ''
  status?: number
  body?: any
  requestTime?: number
  statusText?: string
  response?: string
  responseTime?: number
  args?: any
  requestType?: 'Fetch' | 'Xhr'
  error?: Error | any
}

export type BehaviorMetricsType = {
  PI: 'page-info',
  RCR: 'router-change-record',
  CBR: 'click-behavior-record',
  CDR: 'custom-define-record',
  HR: 'http-record',
  PV: 'pv',
  ST: 'stay-time'
}

export interface BehaviorMetrics extends Metrics{
  type: 'behavior'
  subType: BehaviorMetricsType[keyof BehaviorMetricsType]
  pageURL?: string
}

export type PerformanceTypes = {
  FCP: 'fcp',
  LCP: 'lcp',
  FID: 'fid',
  CLS: 'cls',
  HTTP: 'http',
  TIMING: 'timing'
  RESOURCE: 'resource'
}

export interface PerformanceMetrics extends Metrics{
  type: 'performance'
  subType: PerformanceTypes[keyof PerformanceTypes]
  pageURL?: string
}
