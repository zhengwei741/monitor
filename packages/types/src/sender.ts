import { Event } from './event'
export interface Sender {
  send: (event: Event) => Promise<any>
  flush: () => void
}

export type CreaterSender = (options: CreaterSenderOptions) => Sender

export interface RequestData {
  method?: string
  body: any
  headers?: any
}

export interface CreaterSenderOptions {
  buffSize?: number
  url: string
}