import { report, getPageInfo } from "../base";
import { initVueError } from './vue'
import { getErrorUid } from '../utils'
import { mechanismType, ExceptionMetrics, HttpMetrics } from '../types'
import { proxyFetch, proxyHttpRequest } from '../http'

export const init = function (config: any) {
  const { resource, promise, js, vue, http } = config;
  resource && initResourceError();
  js && initJSError();
  promise && initPromiseError();
  vue && initVueError(vue);
  http && initHttpError()
};

const initResourceError = function () {
  window.addEventListener(
    "error",
    (e) => {
      e.preventDefault()
      const target = e.target as HTMLElement;
      if (target.nodeType === 1) {
        let src = ''
        switch (target.nodeName.toLowerCase()) {
          case 'link':
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            src = target.href
            break;
          default:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            src = target.currentSrc || target.src
        }
        const resourceErrorMechanism: ExceptionMetrics = {
          type: `${mechanismType.RS}Error`,
          errorUid: getErrorUid(`${mechanismType.RS}-${e.error.message}-${e.filename}`),
          message: e.error.message,
          stack: e.error.stack,
          meta: {
            src,
            html: target.outerHTML,
            tagName: target.tagName,
          }
        }
        reportErrorHandle(resourceErrorMechanism)
      }
    },
    true
  );
};

// 判断是 JS异常、静态资源异常、还是跨域异常
export const getErrorKey = (event: ErrorEvent | Event) => {
  const isJsError = event instanceof ErrorEvent;
  if (!isJsError) return mechanismType.RS;
  return event.message === 'Script error.' ? mechanismType.CS : mechanismType.JS;
};

const initJSError = function () {
  const originalError = window.console.error;
  window.console.error = function (...args) {
    const resourceErrorMechanism: ExceptionMetrics = {
      errorUid: getErrorUid(`${mechanismType.CO}-${args}`),
      type: 'consoleError',
      meta: {
        errData: args
      }
    }
    reportErrorHandle(resourceErrorMechanism)
    originalError.apply(this, args);
  };

  window.addEventListener(
    "error",
    (e) => {
      if (e.error) {
        e.preventDefault()
        // 如果不是跨域脚本异常,就结束
        if (getErrorKey(e) !== mechanismType.CS) return
        const { lineno, colno ,error, filename } = e
        const resourceErrorMechanism: ExceptionMetrics = {
          stack: error.stack,
          message: error.message,
          errorUid: getErrorUid(`${mechanismType.JS}-${error.message}-${filename}`),
          type: 'jsError',
          meta: {
            filename,
            lineno,
            colno
          }
        }
        reportErrorHandle(resourceErrorMechanism)
      }
    },
    true
  );
};

const initPromiseError = function () {
  window.addEventListener(
    "unhandledrejection",
    function (e: PromiseRejectionEvent) {
      const resourceErrorMechanism: ExceptionMetrics = {
        stack: e.reason?.stack,
        message: e.reason?.message,
        errorUid: getErrorUid(`${mechanismType.UJ}-${e.reason?.message}`),
        type: 'promiseError'
      }
      reportErrorHandle(resourceErrorMechanism)
    }
  );
};

const initHttpError = function() {
  const loadHandler = function(metrics: HttpMetrics) {
    const { status, response } = metrics
    if (status < 400) {
      return
    }
    const httpErrorMechanism: ExceptionMetrics = {
      errorUid: getErrorUid(`${mechanismType.HP}-${response}-${metrics.statusText}`),
      type: 'httpError',
      meta: {
        metrics
      }
    }
    reportErrorHandle(httpErrorMechanism)
  }

  proxyFetch(undefined, loadHandler)
  proxyHttpRequest(undefined, loadHandler)
}

// 正则表达式，用以解析堆栈split后得到的字符串
const FULL_MATCH =
  /^\s*at (?:(.*?) ?\()?((?:file|https?|blob|chrome-extension|address|native|eval|webpack|<anonymous>|[-a-z]+:|.*bundle|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;

// 限制只追溯10个
const STACKTRACE_LIMIT = 10;

// 解析每一行
export function parseStackLine(line: string) {
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
export function parseStackFrames(stack: string) {
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

const submitErrorids: string[] = []

export const reportErrorHandle = function(errorMechanism: ExceptionMetrics) {
  if (submitErrorids.includes(errorMechanism.errorUid)) {
    return
  }
  submitErrorids.push(errorMechanism.errorUid)

  if (errorMechanism.stack) {
    errorMechanism.stackTrace = parseStackFrames(errorMechanism.stack)
  }
  errorMechanism.pageInformation = getPageInfo()

  report(errorMechanism)
}