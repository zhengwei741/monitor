import { getGlobalObject } from '@monitor/utils'
import { getPageInfo } from '../utils'

const global = getGlobalObject()

// 缓存错误id 同一错误不上报
const submitErrorids = []
function reportErrorHandle(errorMechanism = {}) {
  const { errorId, stack } = errorMechanism
  if (submitErrorids.includes(errorId)) {
    return
  }
  submitErrorids.push(errorId)

  const finallyData = {
    ...errorMechanism,
    ...(stack && { stack: parseStackFrames(stack) }),
    pageInformation: getPageInfo()
  }
  return finallyData
}

// 正则表达式，用以解析堆栈split后得到的字符串
const FULL_MATCH =
  /^\s*at (?:(.*?) ?\()?((?:file|https?|blob|chrome-extension|address|native|eval|webpack|<anonymous>|[-a-z]+:|.*bundle|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;

// 限制只追溯10个
const STACKTRACE_LIMIT = 10;

// 解析每一行
function parseStackLine(line) {
  const lineMatch = line.match(FULL_MATCH);
  if (!lineMatch) return {};
  const filename = lineMatch[2];
  const functionName = lineMatch[1] || '';
  const lineno = parseInt(lineMatch[3], 10) || undefined;
  const colno = parseInt(lineMatch[4], 10) || undefined;
  return {
    filename,
    functionName,
    lineno,
    colno,
  };
}
// 解析错误堆栈
function parseStackFrames(stack) {
  // 无 stack 时直接返回
  if (!stack) return [];
  const frames = [];
  for (const line of stack.split('\n').slice(1)) {
    const frame = parseStackLine(line);
    if (frame) {
      frames.push(frame);
    }
  }
  return frames.slice(0, STACKTRACE_LIMIT);
}

const errorTypes = {
  resource: 'resource-error'
}

export const initResourceError = function(websdk) {
  if (!('document' in global)) {
    return
  }
  global.document.addEventListener('error', (e) => {
    e.preventDefault()
    const target = e.target
    if (target && target.nodeType === 1) {
      let src = ''
      if (target.nodeName.toLowerCase() === 'link') {
        src = target.href
      } else {
        src = target.currentSrc || target.src
      }
      reportErrorHandle({
        errorId: `${errorTypes.resource}-${e.error.message}-${e.filename}`,
        message: e.error.message,
        stack: e.error.stack,
        meta: {
          src,
          html: target.outerHTML,
          tagName: target.tagName,
        }
      })
    }
  }, true)
}

export {
  initResourceError
}
