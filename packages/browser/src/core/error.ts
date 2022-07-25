import { BaseError } from '@monitor/core'
import { BrowserMetrics, ErrorTypes } from '../types'

export class BrowserError extends BaseError<BrowserMetrics> {
  createErrorid(metrics: BrowserMetrics): number | boolean {
    let id: any
    if (metrics.type === 'http') {
      id = metrics.type + metrics.method + metrics.status + metrics.url + metrics.appKey
    } else {
      switch (metrics.subtype) {
        case ErrorTypes.PE:
          // TODO
          id = metrics.type + metrics.stack + metrics.message + metrics.appKey
          break
        case ErrorTypes.RE:
        case ErrorTypes.JE:
        case ErrorTypes.CE:
          id = metrics.type + metrics.subtype + metrics.message + metrics.meta.filename + metrics.appKey
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
