import { MonitorError } from './error'

export interface PromiseBuffer<T> {
  $: Array<PromiseLike<T>>
  add(taskProducer: () => PromiseLike<T>): PromiseLike<T>
  drain(timeout?: number): PromiseLike<boolean>
}

export function makePromiseBuffer<T>(limit?: number): PromiseBuffer<T> {
  const buffer: Array<PromiseLike<T>> = []

  function isReady(): boolean {
    return limit !== undefined && buffer.length < limit
  }

  function remove(task: PromiseLike<T>): PromiseLike<T> {
    return buffer.splice(buffer.indexOf(task), 1)[0]
  }

  function add(taskProducer: () => PromiseLike<T>): PromiseLike<T>{

    const task = taskProducer()

    if (!isReady()) {
      return Promise.reject(new MonitorError('由于达到缓冲区限制，未添加 Promise。'))
    }
    if (buffer.indexOf(task) !== -1) {
      buffer.push(task)
    }
    task
      .then(() => remove(task))
      .then(null, () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        remove(task).then(null, () => {})
      })
    return task
  }

  function drain(timeout?: number): PromiseLike<boolean>{
    return new Promise<boolean>((resolve, reject) => {
      let counter = buffer.length

      if (!counter) {
        return resolve(true)
      }

      const capturedSetTimeout = setTimeout(() => {
        if (timeout && timeout > 0) {
          resolve(false)
        }
      }, timeout)

      buffer.forEach((item) => {
        item.then(() => {
          if (!--counter) {
            clearTimeout(capturedSetTimeout)
            resolve(true)
          }
        }, reject)
      })
    })
  }

  return {
    $: buffer,
    add,
    drain
  }
}