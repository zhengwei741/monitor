import { getGlobalObject } from '@monitor/utils'

const global = getGlobalObject()

export function getPageURL() {
  return global.location.href 
}

export const getPageInfo = function() {
  if (!('location' in global)) {
    return {}
  }
  const { host, hostname, href, protocol, origin, port, pathname, search, hash } = global.location
  const { width, height } = global.screen
  const { language, userAgent } = global.navigator

  return {
    host,
    hostname,
    href,
    protocol,
    origin,
    port,
    pathname,
    search,
    hash,
    title: document.title,
    language: language.substring(0, 2),
    userAgent,
    winScreen: `${width}x${height}`,
    docScreen: `${document.documentElement.clientWidth || document.body.clientWidth}x${
      document.documentElement.clientHeight || document.body.clientHeight
    }`,
  };
}

export function onAfterLoad (callback) {
  if (!('document' in global)) {
    return
  }
  if (global.document.readyState === 'complete') {
    setTimeout(callback)
  } else {
    global.addEventListener('pageshow', callback, { once: true, capture: true });
  }
}

/**
 * 可以理解为异步执行
 * requestIdleCallback 是浏览器空闲时会自动执行内部函数
 * requestAnimationFrame 是浏览器必须执行的
 * 关于 requestIdleCallback 和  requestAnimationFrame 可以参考 https://www.cnblogs.com/cangqinglang/p/13877078.html
 */
export const nextTime =
  global.requestIdleCallback ||
  global.requestAnimationFrame ||
  ((callback) => global.setTimeout(callback, 17))
