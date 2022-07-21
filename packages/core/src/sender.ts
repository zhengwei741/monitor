import { Sender, CreaterSenderOptions, RequestData, Event } from '@monitor/types'
import { getGlobalObject } from '@monitor/utils'

const global = getGlobalObject()

export function createrSender(
  makeRequest: (requestData: RequestData) => Promise<any>,
  options?: CreaterSenderOptions
): Sender {
  // TODO
  const send = function(event: Event) {
    const requestData: RequestData = {
      body: event
    }
    return makeRequest(requestData)
  }
  const flush = function() {
  }
  return {
    send,
    flush
  }
}
