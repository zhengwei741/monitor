// 包装上报函数
// 将情请求添加进buff区
let DEFAULT_BUFFER_SIZE = 30

export function createTransport(makeRequest, options) {
  const { bufferSize } = options

  if (bufferSize) {
    DEFAULT_BUFFER_SIZE = bufferSize
  }

  const send = function(...args) {
    return makeRequest(...args)
  }

  const flush = function() {
  }

  return {
    send,
    flush
  }
}
