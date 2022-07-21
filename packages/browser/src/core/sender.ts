import { getGlobalObject } from '@monitor/utils'
import { RequestData, CreaterSenderOptions } from '@monitor/types'
import { createrSender } from '@monitor/core'

const global = getGlobalObject<Window>()

export function createFetchSender(options: CreaterSenderOptions) {

  const makeRequest = function(requestData: RequestData) {
    const requestOptions: RequestInit = {
      body: requestData.body,
      method: 'POST',
      referrerPolicy: 'origin',
      headers: requestData.headers
    }
    return global.fetch(options.url, requestOptions)  
  }

  return createrSender(makeRequest, options)
}

export function createXHRSender(options: CreaterSenderOptions) {

  const makeRequest = function(requestData: RequestData) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.open('POST', options.url)
  
      xhr.addEventListener('error', reject)
  
      xhr.addEventListener('readystatechange', function() {
        if (xhr.readyState === 4) {
          resolve(xhr.response)
        }
      })
      xhr.send(requestData.body)
    })
  }

  return createrSender(makeRequest, options)
}