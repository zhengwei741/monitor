export function getPageURL() {
  return window.location.href 
}

export function onAfterLoad (callback) {
  if (document.readyState === 'complete') {
    setTimeout(callback)
  } else {
    window.addEventListener('pageshow', callback, { once: true, capture: true });
  }
}

/**
 * 可以理解为异步执行
 * requestIdleCallback 是浏览器空闲时会自动执行内部函数
 * requestAnimationFrame 是浏览器必须执行的
 * 关于 requestIdleCallback 和  requestAnimationFrame 可以参考 https://www.cnblogs.com/cangqinglang/p/13877078.html
 */
export const nextTime =
 window.requestIdleCallback ||
 window.requestAnimationFrame ||
 ((callback) => setTimeout(callback, 17))