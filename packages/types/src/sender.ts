/* eslint-disable @typescript-eslint/no-explicit-any */
import { Event } from './event'
export interface Sender {
  send: SendFn
  flush: () => void
}

export type SendFn = (event: Event) => PromiseLike<any>

export type CreaterSender = (options: CreaterSenderOptions) => Sender

export interface RequestData {
  method?: string
  body: any
  headers?: { [key: string]: string }
}

export interface CreaterSenderOptions {
  buffSize?: number
  url: string
  onBeforSend?: (event: Event) => RequestData
}