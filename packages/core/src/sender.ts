import {
  Sender,
  CreaterSenderOptions,
  RequestData,
  Event,
  SendFn
} from '@monitor/types'
import {
  makePromiseBuffer,
  PromiseBuffer,
  MonitorError,
  isFunction,
  isThenable,
  isPlainObject
} from '@monitor/utils'

const DEFALUT_BUFFSIZE = 30

export function createrSender(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  makeRequest: (requestData: RequestData) => Promise<any>,
  options?: CreaterSenderOptions
): Sender {
  const buffer: PromiseBuffer<void> = makePromiseBuffer(options?.buffSize || DEFALUT_BUFFSIZE)

  const send: SendFn = function(event: Event): PromiseLike<void> {
    const requestData: RequestData = {
      body: event
    }
    const requestTask = function(): PromiseLike<void> {
      if (options) {
        const { onBeforSend } = options
        if (onBeforSend && isFunction(onBeforSend)) {
          const rv = onBeforSend(event)
          if (isThenable(rv)) {
            return rv.then(res => {
              if (!isPlainObject(rv) || rv === null) {
                throw new MonitorError('onBeforSend 返回为空')
              }
              requestData.body = res
              return makeRequest(requestData)
            }, (e) => {
              throw new MonitorError(`onBeforSend reject: ${e}`)  
            })
          } else if (!isPlainObject(rv) || rv === null) {
            throw new MonitorError('onBeforSend 返回为空')
          }
          requestData.body = rv
        }
      }
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
