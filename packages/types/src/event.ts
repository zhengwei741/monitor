import { SdkInfo } from './sdkInfo'
import { Breadcrumb } from './breadcrumb'
import { Exception } from './exception'

export interface Event {
  exception?: {
    values: Exception[]
  }
  platform?: string
  sdkInfo?: SdkInfo
  event_id?: string
  timestamp?: number
  breadcrumbs?: Breadcrumb[]
}