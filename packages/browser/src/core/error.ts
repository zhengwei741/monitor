import { BaseError } from '@monitor/core'
import { BrowserMetrics, ErrorTypes, JSMetrics, HTTPMetrics } from '../types'

export class BrowserError extends BaseError<BrowserMetrics> {
  createErrorid(metrics: BrowserMetrics): number | boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let id: any
    if (metrics.type === 'http') {
      metrics = metrics as HTTPMetrics
      id = metrics.type + metrics.method + metrics.status + metrics.url + metrics.appKey
    } else {
      switch (metrics.subtype) {
        case ErrorTypes.PE:
          id = metrics.type + metrics.stack + metrics.message + metrics.appKey
          break
        case ErrorTypes.RE:
        case ErrorTypes.JE:
        case ErrorTypes.CE:
          metrics = metrics as JSMetrics
          id = metrics.type + metrics.subtype + metrics.message + metrics.appKey + metrics.meta.filename
          break
        default:
          id = metrics.type + metrics.message + metrics.appKey
      }
    }

    id = this.hashErrorId(id)

    if (this.submitErrorids.includes(id)) {
      return false
    }
    this.submitErrorids.push(id)

    return id
  }
}
