import { Metrics } from '@monitor/types'

export type BrowserMetrics = JSMetrics | HTTPMetrics

export type JSErrorTypes = {
  RE: 'resource-error',
  JE: 'js-error',
  CE: 'cros-error',
  PE: 'promise-error',
  HE: 'http-error'
}
export interface JSMetrics extends Metrics{
  type: 'js'
  subtype: JSErrorTypes[keyof JSErrorTypes]
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
  meta: {
    url?: string
    method?: 'GET' | 'POST'
    request?: ''
    status?: number
  }
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
}