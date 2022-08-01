import { BrowserError } from '../../src/core/error'

describe('error.ts', () => {

  const browserError = new BrowserError()

  it('生成错误ID', () => {
    const httpMetrics = {
      type: 'http',
      method: 'post',
      status: 200,
      url: 'http://test.com',
      appKey: 'xxx'
    }

    let errirId = browserError.createErrorid(httpMetrics)

    expect(typeof errirId).toBe('number')

    errirId = browserError.createErrorid(httpMetrics)

    expect(errirId).toBeFalsy()
  })

  it('生成不同错误ID', () => {
    const httpMetrics = {
      type: 'http',
      method: 'post',
      status: 200,
      url: 'http://test.com',
      appKey: 'xxx'
    }
    const httpErrorId = browserError.createErrorid(httpMetrics)

    const promiseErrorMetrics = {
      type: 'js',
      subtype: 'promise-error',
      stack: [],
      message: 'promise-error',
      appKey: 'xxx'
    }
    const promiseErrorId = browserError.createErrorid(promiseErrorMetrics)

    const jsErrorMetrics = {
      type: 'js',
      subtype: 'js-error',
      stack: [],
      message: 'js-error',
      appKey: 'xxx',
      meta: {
        filename: 'xxxx.js'
      }
    }
    const jsErrorId = browserError.createErrorid(jsErrorMetrics)

    expect(promiseErrorId === httpErrorId).toBeFalsy()
    expect(promiseErrorId === jsErrorId).toBeFalsy()
  })
})