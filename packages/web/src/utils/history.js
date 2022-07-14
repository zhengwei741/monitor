import { getGlobalObject, fill } from '@monitor/utils'

const global = getGlobalObject()

const dispatchEvent = function(type) {
  const e = new Event(type)
  global.dispatchEvent(e)
}

export function wrHistory() {
  if ('history' in global) {
    ['pushState', 'replaceState'].forEach(type => {
      fill(global.history, type, function(original) {
        return function() {
          const rv = original.apply(this, arguments)
          dispatchEvent(type)
          return rv
        }
      })        
    })
  }
}

wrHistory()

export function proxyHistory(handler) {
  global.addEventListener('replaceState', (e) => handler(e), true)
  global.addEventListener('pushState', (e) => handler(e), true)
}

// hash 变化除了触发 hashchange ,
// 也会触发 popstate 事件,而且会先触发 popstate 事件，我们可以统一监听 popstate
// 这里可以考虑是否需要监听 hashchange,或者只监听 hashchange
export function proxyHash(handler) {
  global.addEventListener('hashchange', (e) => handler(e), true)
  global.addEventListener('popstate', (e) => handler(e), true)
}
