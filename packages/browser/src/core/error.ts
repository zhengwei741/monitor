import { BaseError } from '@monitor/core'
import { BrowserMetrics,  } from '../types'

export class BrowserError extends BaseError<BrowserMetrics> {
  createErrorid(metrics: BrowserMetrics): string | boolean {

    let id = ''

    switch (metrics.type) {
      case 'js':
        break;
    }

    this.submitErrorids

    return false
  }
}