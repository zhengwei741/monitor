export interface Breadcrumb {
  type?: string
  event_id?: string
  category?: string
  message?: string
  data?: { [key: string]: any }
  timestamp?: number
}
