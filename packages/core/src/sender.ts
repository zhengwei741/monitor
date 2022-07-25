import { Sender, CreaterSenderOptions, RequestData, Event, SendFn } from '@monitor/types'
import { makePromiseBuffer, PromiseBuffer, MonitorError } from '@monitor/utils'

const DEFALUT_BUFFSIZE = 30

export function createrSender(
  makeRequest: (requestData: RequestData) => Promise<any>,
  options?: CreaterSenderOptions
): Sender {
  const buffer: PromiseBuffer<void> = makePromiseBuffer(options?.buffSize || DEFALUT_BUFFSIZE)

  const send: SendFn = function(event: Event): PromiseLike<void> {
    const requestData: RequestData = {
      body: event
    }

    const requestTask = function(): PromiseLike<void> {
      return makeRequest(requestData)
    }
    return buffer
      .add(requestTask)
      .then(
        result => result,
        error => {
          if (error instanceof MonitorError) {
            return Promise.resolve()
          } else {
            throw error
          }
        }
      )
  }

  const flush = (timeout?: number): PromiseLike<boolean> => buffer.drain(timeout)

  return {
    send,
    flush
  }
}
