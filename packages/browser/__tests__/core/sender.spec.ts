import { createFetchSender, createXHRSender } from '../../src/core/sender'

describe('sender.ts', () => {
  it('createFetchSender', async () => {
    const options = {
      buffSize: 10,
      url: '127.0.0.1:8080',
      onBeforSend(data) {
        return data || {}
      }
    }

    const sender = createFetchSender(options)

    const res = await sender.send()

    console.log(res)
  })
  it('createXHRSender', () => {

  })
})