(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.monitorWeb = factory());
})(this, (function () { 'use strict';

  function markFunctionWrapped(wrapped, original) {
    const proto = original.prototype || {};
    wrapped.prototype = original.prototype = proto;
  }

  function fill(source, name, replacementFactory) {
    if (!source[name]) {
      return
    }
    const original = source[name];

    const wrapped = replacementFactory(original);

    if (isFunction(wrapped)) {
      try {
        markFunctionWrapped(wrapped, original);
      } catch(e) {}
    }
    source[name] = wrapped;
  }

  const defaultFunctionName = '<anonymous>';
  function getFunctionName(fn) {
    try {
      if (!fn || typeof fn !== 'function') {
        return defaultFunctionName
      }
      return fn.name || defaultFunctionName
    } catch (e) {
      return defaultFunctionName
    }
  }

  function isBrowserBundle() {
    return typeof __MONITOR_BROWSER_BUNDLE__ !== 'undefined' && !!__MONITOR_BROWSER_BUNDLE__;
  }

  const fallbackGlobalObject = {};

  function getGlobalObject(){
    return (
      isNodeEnv()
        ? global
        : typeof window !== 'undefined' // eslint-disable-line no-restricted-globals
        ? window // eslint-disable-line no-restricted-globals
        : typeof self !== 'undefined'
        ? self
        : fallbackGlobalObject
    )
  }

  function isNodeEnv() {
    return (
      !isBrowserBundle() &&
      Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]'
    );
  }

  const STACKTRACE_LIMIT = 50;

  function createStackParser(...parsers) {
    return function(stack = '', skipFirst = 0) {
      const frames = [];
      for (const line of stack.split('\n').slice(skipFirst)) {
        for (const parser of parsers) {
          const frame = parser(line);
          if (frame) {
            frames.push(frame);
          }
        }
      }
      return stripSentryFramesAndReverse(frames)
    }
  }

  function stackParserFromStackParserOptions(stackParser) {
    if (Array.isArray(stackParser)) {
      return createStackParser(...stackParser)
    }
    return stackParser
  }

  function stripSentryFramesAndReverse(stack = []) {
    if (!stack.length) {
      return []
    }
    const localStack = stack;
    return localStack
    .slice(0, STACKTRACE_LIMIT)
    .map(frame => ({
      ...frame,
      filename: frame.filename || localStack[0].filename,
      function: frame.function || '?',
    }))
    .reverse()
  }

  function isFunction(func) {
    return typeof func === 'function'
  }

  class Core {
    constructor(options){
      this.options = options;
      this.checkBaseInfo();
    }

    checkBaseInfo() {
      const { url, appId, userId } = this.options;
      if (!url || !appId || !userId) {
        throw new Error('缺少必要参数')
      }
    }

    use(plugin) {
      const installedPlugins = this._installedPlugins || (this._installedPlugins = []);
      if (installedPlugins.indexOf(plugin) > -1) {
        return this
      }
      const args = Array.from(arguments);
      args.unshift(this);
      if (plugin.install && isFunction(plugin.install)) {
        plugin.install.apply(plugin, args);
      } else if (isFunction(plugin)) {
        plugin.apply(null, args);
      }
      installedPlugins.push(plugin);
      return this
    }
  }

  /**
   * 可以理解为异步执行
   * requestIdleCallback 是浏览器空闲时会自动执行内部函数
   * requestAnimationFrame 是浏览器必须执行的
   * 关于 requestIdleCallback 和  requestAnimationFrame 可以参考 https://www.cnblogs.com/cangqinglang/p/13877078.html
   */
  const global$6 = getGlobalObject();

  const nextTime =
   global$6.requestIdleCallback ||
   global$6.requestAnimationFrame ||
   ((callback) => global$6.setTimeout(callback, 17));

  const global$5 = getGlobalObject();
  // 上传缓存
  let caches = [];
  // 上传缓存上限
  const max = 5;
  // 上传定时
  let timer = null;
  // 上报url
  let baseUrl = '';

  // const sendBeacon = global.sendBeacon ? 
  //   (url, data) => {
  //     if (url && data) {
  //       global.navigator.sendBeacon(url, JSON.stringify(data))
  //     }
  //   } : 
  //   (url, data) => {
  //     if ('oXMLHttpRequest' in global && typeof global.oXMLHttpRequest === 'function') {
  //       // 使用原始XMLHttpRequest上传
  //       const XMLHttpRequest = global.oXMLHttpRequest ? global.oXMLHttpRequest : global.XMLHttpRequest
  //       const xhr = new XMLHttpRequest()
  //       xhr.open('POST', url)
  //       xhr.send(JSON.stringify(data))
  //     }
  //   }

  const sendBeacon = (url, data) => {
    console.log(url, 'url');
    console.log(data, 'data');
  }; 

  function send() {
    if (caches.length) {
      const sendEvents = caches.splice(0, max);
      caches = caches.splice(max);
      sendBeacon(baseUrl, { sendTime: Date.now(), ...sendEvents });
      if (caches.length) {
        nextTime(send);
      }
    }
  }

  function report(url, data = {}, immediate = false) {
    baseUrl = url;
    if (immediate) {
      sendBeacon(url, { sendTime: Date.now(), ...data });
      return
    }
    caches.push(data);
    clearTimeout(timer);
    if (caches.length >= max) {
      send();
    } else {
      timer = global$5.setTimeout(send, 5000);
    }
  }

  var e,t,n,i,r=function(e,t){return {name:e,value:void 0===t?-1:t,delta:0,entries:[],id:"v2-".concat(Date.now(),"-").concat(Math.floor(8999999999999*Math.random())+1e12)}},a=function(e,t){try{if(PerformanceObserver.supportedEntryTypes.includes(e)){if("first-input"===e&&!("PerformanceEventTiming"in self))return;var n=new PerformanceObserver((function(e){return e.getEntries().map(t)}));return n.observe({type:e,buffered:!0}),n}}catch(e){}},o=function(e,t){var n=function n(i){"pagehide"!==i.type&&"hidden"!==document.visibilityState||(e(i),t&&(removeEventListener("visibilitychange",n,!0),removeEventListener("pagehide",n,!0)));};addEventListener("visibilitychange",n,!0),addEventListener("pagehide",n,!0);},u=function(e){addEventListener("pageshow",(function(t){t.persisted&&e(t);}),!0);},c=function(e,t,n){var i;return function(r){t.value>=0&&(r||n)&&(t.delta=t.value-(i||0),(t.delta||void 0===i)&&(i=t.value,e(t)));}},f=-1,s=function(){return "hidden"===document.visibilityState?0:1/0},m=function(){o((function(e){var t=e.timeStamp;f=t;}),!0);},v=function(){return f<0&&(f=s(),m(),u((function(){setTimeout((function(){f=s(),m();}),0);}))),{get firstHiddenTime(){return f}}},d=function(e,t){var n,i=v(),o=r("FCP"),f=function(e){"first-contentful-paint"===e.name&&(m&&m.disconnect(),e.startTime<i.firstHiddenTime&&(o.value=e.startTime,o.entries.push(e),n(!0)));},s=window.performance&&performance.getEntriesByName&&performance.getEntriesByName("first-contentful-paint")[0],m=s?null:a("paint",f);(s||m)&&(n=c(e,o,t),s&&f(s),u((function(i){o=r("FCP"),n=c(e,o,t),requestAnimationFrame((function(){requestAnimationFrame((function(){o.value=performance.now()-i.timeStamp,n(!0);}));}));})));},p=!1,l=-1,h=function(e,t){p||(d((function(e){l=e.value;})),p=!0);var n,i=function(t){l>-1&&e(t);},f=r("CLS",0),s=0,m=[],v=function(e){if(!e.hadRecentInput){var t=m[0],i=m[m.length-1];s&&e.startTime-i.startTime<1e3&&e.startTime-t.startTime<5e3?(s+=e.value,m.push(e)):(s=e.value,m=[e]),s>f.value&&(f.value=s,f.entries=m,n());}},h=a("layout-shift",v);h&&(n=c(i,f,t),o((function(){h.takeRecords().map(v),n(!0);})),u((function(){s=0,l=-1,f=r("CLS",0),n=c(i,f,t);})));},T={passive:!0,capture:!0},y=new Date,g=function(i,r){e||(e=r,t=i,n=new Date,w(removeEventListener),E());},E=function(){if(t>=0&&t<n-y){var r={entryType:"first-input",name:e.type,target:e.target,cancelable:e.cancelable,startTime:e.timeStamp,processingStart:e.timeStamp+t};i.forEach((function(e){e(r);})),i=[];}},S=function(e){if(e.cancelable){var t=(e.timeStamp>1e12?new Date:performance.now())-e.timeStamp;"pointerdown"==e.type?function(e,t){var n=function(){g(e,t),r();},i=function(){r();},r=function(){removeEventListener("pointerup",n,T),removeEventListener("pointercancel",i,T);};addEventListener("pointerup",n,T),addEventListener("pointercancel",i,T);}(t,e):g(t,e);}},w=function(e){["mousedown","keydown","touchstart","pointerdown"].forEach((function(t){return e(t,S,T)}));},L=function(n,f){var s,m=v(),d=r("FID"),p=function(e){e.startTime<m.firstHiddenTime&&(d.value=e.processingStart-e.startTime,d.entries.push(e),s(!0));},l=a("first-input",p);s=c(n,d,f),l&&o((function(){l.takeRecords().map(p),l.disconnect();}),!0),l&&u((function(){var a;d=r("FID"),s=c(n,d,f),i=[],t=-1,e=null,w(addEventListener),a=p,i.push(a),E();}));},b={},F=function(e,t){var n,i=v(),f=r("LCP"),s=function(e){var t=e.startTime;t<i.firstHiddenTime&&(f.value=t,f.entries.push(e),n());},m=a("largest-contentful-paint",s);if(m){n=c(e,f,t);var d=function(){b[f.id]||(m.takeRecords().map(s),m.disconnect(),b[f.id]=!0,n(!0));};["keydown","click"].forEach((function(e){addEventListener(e,d,{once:!0,capture:!0});})),o(d,!0),u((function(i){f=r("LCP"),n=c(e,f,t),requestAnimationFrame((function(){requestAnimationFrame((function(){f.value=performance.now()-i.timeStamp,b[f.id]=!0,n(!0);}));}));}));}};

  const handlers = {};

  function addInstrumentationHandler(type, handler) {
    handlers[type] = handlers[type] || [];
    if (typeof handler !== 'function') {
      return
    }
    if (handlers[type].findIndex(handler) !== -1) {
      return
    }
    handlers[type].push(handler);
  }

  function triggerHandlers(type, data) {
    if (!type || !handlers[type]) {
      return
    }
    for (const handler of handlers[type] || []) {
      try {
        handler(data);
      } catch (e) {
        console.log(`Type:${type}\nName:${getFunctionName(handler)}\n错误`);
      }
    }
  }

  const global$4 = getGlobalObject();

  const instrumentType = {
    SH: 'sendHandler',
    LH: 'loadHandler',
    FSH: 'fetch-sendHandler',
    FLH: 'fetch-loadHandler',
  };

  function proxyHttpRequest(sendHandler, loadHandler) {
    if (!('XMLHttpRequest' in global$4)) {
      return
    }
    addInstrumentationHandler(instrumentType.SH, sendHandler);
    addInstrumentationHandler(instrumentType.LH, loadHandler);

    if (!global$4.oXMLHttpRequest) {
      global$4.oXMLHttpRequest = global$4.XMLHttpRequest;
    }

    const httpMetrics = {};

    fill(global$4.XMLHttpRequest, 'open', function(originalOpenMethod) {
      return function(...args) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const xhr = this;
        httpMetrics.method = args[0];
        httpMetrics.url = args[1];

        const onreadystatechangeHandler = function () {
          const { status, statusText, response } = xhr;
          triggerHandlers(instrumentType.LH, {
            ...httpMetrics,
            status,
            statusText,
            response,
            responseTime: Date.now(),
          });
        };

        if ('onloadend' in xhr && isFunction(xhr.onloadend)) {
          fill(xhr, 'onloadend', function(original) {
            return function(...arsg) {
              onreadystatechangeHandler();
              original.apply(xhr, arsg);
            }
          });
        } else {
          xhr.addEventListener('loadend', onreadystatechangeHandler);
        }

        originalOpenMethod.apply(xhr, args);
      }
    });

    fill(global$4.XMLHttpRequest, 'send', function(originalSendMethod) {
      return function(...args) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const xhr = this;
        httpMetrics.body = args[0];
        httpMetrics.requestTime = Date.now();
        triggerHandlers(instrumentType.SH, httpMetrics);
        originalSendMethod.apply(xhr, args);
      }
    });
  }

  function proxyFetch(sendHandler, loadHandler) {
    if (!('fetch' in global$4)) {
      return
    }

    addInstrumentationHandler(instrumentType.FSH, sendHandler);
    addInstrumentationHandler(instrumentType.FLH, loadHandler);  

    fill(global$4, 'fetch', function(originaFetch) {
      return function(...args) {
        let metrics = {
          args,
          fetchData: {
            method: getFetchMethod(args),
            url: getFetchUrl(args),
          },
          requestTime: Date.now(),
        };

        triggerHandlers(instrumentType.FSH, {
          ...metrics
        });
        return originaFetch.apply(global$4, args).then(
          async (response) => {
            const res = response.clone();
            metrics = {
              ...metrics,
              status: res.status,
              statusText: res.statusText,
              response: await res.text(),
              responseTime: Date.now(),
            };
            triggerHandlers(instrumentType.FLH, { ...metrics });
            return response
          },
          (error) => {
            triggerHandlers(instrumentType.FLH, {
              ...metrics,
              responseTime: Date.now(),
              error,
            });
            return error
          }
        )
      }
    });
  }

  function getFetchMethod(fetchArgs) {
    if ('Request' in global$4 && isInstanceOf(fetchArgs[0], Request) && fetchArgs[0].method) {
      return String(fetchArgs[0].method).toUpperCase()
    }
    if (fetchArgs[1] && fetchArgs[1].method) {
      return String(fetchArgs[1].method).toUpperCase()
    }
    return 'GET'
  }

  function getFetchUrl(fetchArgs) {
    if (typeof fetchArgs[0] === 'string') {
      return fetchArgs[0]
    }
    if ('Request' in global$4 && isInstanceOf(fetchArgs[0], Request)) {
      return fetchArgs[0].url
    }
    return String(fetchArgs[0])
  }

  const global$3 = getGlobalObject();

  function onAfterLoad (callback) {
    if (!('document' in global$3)) {
      return
    }
    if (global$3.document.readyState === 'complete') {
      setTimeout(callback);
    } else {
      global$3.addEventListener('pageshow', callback, { once: true, capture: true });
    }
  }

  const global$2 = getGlobalObject();

  function getPageURL() {
    return global$2.location.href 
  }

  const getPageInfo = function() {
    if (!('location' in global$2)) {
      return {}
    }
    const { host, hostname, href, protocol, origin, port, pathname, search, hash } = global$2.location;
    const { width, height } = global$2.screen;
    const { language, userAgent } = global$2.navigator;

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
  };

  // 正则表达式，用以解析堆栈split后得到的字符串
  const CHROME_FULL_MATCH =
    /^\s*at (?:(.*?) ?\()?((?:file|https?|blob|chrome-extension|address|native|eval|webpack|<anonymous>|[-a-z]+:|.*bundle|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;

  function chrome(line) {
    const lineMatch = line.match(CHROME_FULL_MATCH);
    if (!lineMatch) return {}
    const filename = lineMatch[2];
    const functionName = lineMatch[1] || '';
    const lineno = parseInt(lineMatch[3], 10) || undefined;
    const colno = parseInt(lineMatch[4], 10) || undefined;
    return {
      filename,
      functionName,
      lineno,
      colno,
    }
  }

  const defaultParser = [chrome];

  const parseStackFrames = function(stack) {
    const stackParser = stackParserFromStackParserOptions(defaultParser);
    return stackParser(stack)
  };

  // 兼容判断
  const supported = {
    performance: !!window.performance,
    getEntriesByType: !!(window.performance && performance.getEntriesByType),
    PerformanceObserver: 'PerformanceObserver' in window,
    MutationObserver: 'MutationObserver' in window,
    PerformanceNavigationTiming: 'PerformanceNavigationTiming' in window,
  };

  // 白屏（FP）、灰屏（FCP）
  const initFCP = function(webSDK) {
    onAfterLoad(() => {
      d(function(metric) {
        webSDK.report({
          ...metric,
          pageURL: getPageURL(),
          subType: 'fcp',
          type: 'performance'
        });
      });
    });
  };
  // 最大内容绘制（LCP）
  const initLCP = function (webSDK) {
    F((metric) => {
      webSDK.report({
        ...metric,
        pageURL: getPageURL(),
        subType: 'fcp',
        type: 'performance'
      });
    });
  };
  const initFID = function(webSDK) {
    onAfterLoad(() => {
      L(function(metric) {
        webSDK.report({
          ...metric,
          pageURL: getPageURL(),
          subType: 'fid',
          type: 'performance'
        });
      });
    });
  };
  const initCLS = function(webSDK) {
    h(function(metric) {
      webSDK.report({
        ...metric,
        pageURL: getPageURL(),
        subType: 'cls',
        type: 'performance'
      });
    });
  };
  const initHttp = function(webSDK) {
    const onloadHandler = function(metrics) {
      if (metrics.error || metrics.status < 400) {
        delete metrics.response;
        delete metrics.body;
      }
      webSDK.report({
        ...metrics,
        // http时长
        duration: metrics.responseTime - metrics.requestTime,
        pageURL: getPageURL(),
        subType: 'http',
        type: 'performance'
      });
    };
    proxyHttpRequest(undefined, onloadHandler);
    proxyFetch(undefined, onloadHandler);
  };
  const observeTiming = function (webSDK) {
    onAfterLoad(() => {
      let t = performance.timing;
      const times = {};
      if (supported.getEntriesByType) {
        const paintEntries = performance.getEntriesByType('paint');
        if (paintEntries.length) {
          times.FMP = paintEntries[paintEntries.length - 1].startTime;
        }
    
        if (supported.PerformanceNavigationTiming) {
          const nt2Timing = performance.getEntriesByType('navigation')[0];
          if (nt2Timing) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            t = nt2Timing;
          }
        }
      }
    
      const {
        domainLookupStart,
        domainLookupEnd,
        connectStart,
        connectEnd,
        secureConnectionStart,
        requestStart,
        responseStart,
        responseEnd,
        domInteractive,
        domContentLoadedEventEnd,
        loadEventStart,
        fetchStart,
      } = t;
    
      // https://juejin.cn/post/7097157902862909471#heading-19
      // 关键时间点
      times.FP = responseEnd - fetchStart, // 白屏时间
      times.TTI = domInteractive - fetchStart, // 首次可交互时间
      times.DomReady = domContentLoadedEventEnd - fetchStart, // HTML加载完成时间也就是 DOM Ready 时间。
      times.Load = loadEventStart - fetchStart, // 页面完全加载时间
      times.FirseByte = responseStart - domainLookupStart, // 首包时间
      // 关键时间段
      times.DNS = domainLookupEnd - domainLookupStart, // DNS查询耗时
      times.TCP = connectEnd - connectStart, // TCP连接耗时
      times.SSL = secureConnectionStart ? connectEnd - secureConnectionStart : 0, // SSL安全连接耗时
      times.TTFB = responseStart - requestStart, // 请求响应耗时
      times.Trans = responseEnd - responseStart, // 内容传输耗时
      times.DomParse = domInteractive - responseEnd, // DOM解析耗时
      times.Res = loadEventStart - domContentLoadedEventEnd, // 资源加载耗时
      webSDK.report({
        ...times,
        subType: 'timing',
        type: 'performance',
        pageURL: getPageURL()
      });
    });
  };
  const observeResResourceFlow = function(webSDK) {
    const resourceFlow = [];
    const entryHandle = function(list) {
      for (const entry of list.getEntries()) {
        const {
          name,
          transferSize,
          initiatorType,
          startTime,
          responseEnd,
          domainLookupEnd,
          domainLookupStart,
          connectStart,
          connectEnd,
          secureConnectionStart,
          responseStart,
          requestStart,
        } = entry;
        resourceFlow.push({
          // name 资源地址
          name,
          // transferSize 传输大小
          transferSize,
          // initiatorType 资源类型
          initiatorType,
          // startTime 开始时间
          startTime,
          // responseEnd 结束时间
          responseEnd,
          // 贴近 Chrome 的近似分析方案，受到跨域资源影响
          dnsLookup: domainLookupEnd - domainLookupStart,
          initialConnect: connectEnd - connectStart,
          ssl: connectEnd - secureConnectionStart,
          request: responseStart - requestStart,
          ttfb: responseStart - requestStart,
          contentDownload: responseStart - requestStart,
        });
      }
    };
    const observe = new PerformanceObserver(entryHandle);
    observe.observe({ entryTypes: ['resource'] });

    const stopListening = () => {
      if (observe) {
        observe.disconnect();
      }
      webSDK.report({
        resourceList: resourceFlow,
        subType: 'resource',
        type: 'performance',
      });
    };
    // 当页面 pageshow 触发时，中止
    window.addEventListener('pageshow', stopListening, { once: true, capture: true });
  };

  const global$1 = getGlobalObject();

  // 缓存错误id 同一错误不上报
  const submitErrorids = [];
  function reportErrorHandle(errorMechanism = {}) {
    const { errorId, stack } = errorMechanism;
    if (submitErrorids.includes(errorId)) {
      return
    }
    submitErrorids.push(errorId);

    const finallyData = {
      ...errorMechanism,
      ...(stack && { stack: parseStackFrames(stack) }),
      pageInformation: getPageInfo()
    };
    return finallyData
  }

  const errorTypes = {
    resource: 'resource-error',
    js: 'js-error',
    cs: 'cros-error',
    pe: 'promise-error',
    he: 'http-error',
    ve: 'vue-error'
  };

  const initResourceError = function(websdk) {
    if (!('document' in global$1)) {
      return
    }
    global$1.document.addEventListener('error', (e) => {
      e.preventDefault();
      const target = e.target;
      if (target && target.nodeType === 1) {
        let src = '';
        if (target.nodeName.toLowerCase() === 'link') {
          src = target.href;
        } else {
          src = target.currentSrc || target.src;
        }
        const finallyData = reportErrorHandle({
          errorId: `${errorTypes.resource}-${src}-${target.tagName}`,
          meta: {
            url: src,
            html: target.outerHTML,
            type: target.tagName,
          },
          type: errorTypes.resource
        });
        if (finallyData) {
          websdk.report(finallyData);
        }
      }
    }, true);
  };

  // 判断是 JS异常、静态资源异常、还是跨域异常
  const getErrorKey = (event) => {
    const isJsError = event instanceof ErrorEvent;
    if (!isJsError) return errorTypes.resource
    return event.message === 'Script error.' ? errorTypes.cs : errorTypes.js
  };

  const initjsError = function(websdk) {
    if (!('addEventListener' in global$1)) {
      return
    }
    global$1.addEventListener('error', (e) => {
      if (e.error) {
        e.preventDefault();
        // 资源错误不在这上报
        if (getErrorKey(e) === errorTypes.resource) {
          return
        }
        const { lineno, colno , error } = e;
        const finallyData = reportErrorHandle({
          errorId: `${errorTypes.js}-${error.message}-${error.filename}`,
          message: error.message,
          stack: error.stack,
          meta: {
            filename: error.filename,
            lineno,
            colno
          },
          type: errorTypes.js
        });
        if (finallyData) {
          websdk.report(finallyData);
        }
      }
    }, true);
  };

  const initPromiseError = function(websdk) {
    const oldOnunhandledrejection = global$1.onunhandledrejection;

    global$1.onunhandledrejection = function(e) {
      const finallyData = reportErrorHandle({
        stack: e.reason?.stack,
        message: e.reason?.message,
        errorId: `${errorTypes.pe}-${e.reason?.message}`,
        type: errorTypes.pe
      });
      if (finallyData) {
        websdk.report(finallyData);
      }
      if (oldOnunhandledrejection) {
        oldOnunhandledrejection.apply(this, arguments);
      }
    };
  };

  const initHttpError = function(websdk) {

    const onloadHandler = function(metrics) {
      const { status, response, statusText } = metrics;
      if (status < 400) {
        const finallyData = reportErrorHandle({
          ...metrics,
          type: errorTypes.he,
          errorId: `${errorTypes.he}-${response}-${statusText}`
        });
        if (finallyData) {
          websdk.report(finallyData);
        }
      }
    };

    proxyHttpRequest(undefined, onloadHandler);
    proxyFetch(undefined, onloadHandler);
  };


  const classifyRE = /(?:^|[-_])(\w)/g;
  const classify = (str) =>
    str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");

  const formatComponentName = function (vm, includeFile) {
    if (!vm) {
      return "<Anonymous>"
    }
    if (vm.$root === vm) {
      return "<Root>"
    }

    const options = vm.$options;
    let name = options.name || options._componentTag;
    const file = options.__file;
    if (!name && file) {
      const match = file.match(/([^/\\]+)\.vue$/);
      if (match) {
        name = match[1];
      }
    }

    return (
      (name ? `<${classify(name)}>` : "<Anonymous>") +
      (file && includeFile ? `at ${file}` : "")
    )
  };

  const generateComponentTrace = function (vm) {
    if ((vm?.__isVue || vm?._isVue) && vm.$parent) {
      const trace = [];
      while (vm) {
        trace.push(formatComponentName(vm));
        vm = vm.$parent;
      }

      return trace.reverse().join('-->')
    }
    return formatComponentName(vm, true)
  };
  const initVueError = function(websdk) {
    if (websdk.vue) {
      vue.config.errorHandler = function (
        error,
        vm,
        lifecycleHook
      ) {
        const reportData = {
          type: errorTypes.ve,
          errorUid: `${errorTypes.ve}-${error.message}-${error.stack}`,
          message: error.message,
          stack: error.stack,
          meta: {
            lifecycleHook,
            componentName: formatComponentName(vm),
            trace: vm ? generateComponentTrace(vm) : "",
            vm,
            error
          }
        };
        const finallyData = reportErrorHandle(reportData);
        if (finallyData) {
          websdk.report(finallyData);
        }
      };
    }
  };

  const defaultPlugins = [
    initLCP,
    initCLS,
    initHttp,
    observeTiming,
    initFCP,
    initFID,
    observeResResourceFlow,

    initResourceError,
    initjsError,
    initPromiseError,
    initHttpError,
    initVueError
  ];

  class WebSDK extends Core {
    constructor(options = {}) {
      super(options);
      const { url, appId, userId } = options;
      // 基本信息
      this.baseUrl = url;
      this.appId = appId;
      this.userId = userId;

      if (options.defaultPlugins === undefined) {
        options.defaultPlugins = defaultPlugins;
      }
      // 安装插件
      options.defaultPlugins.forEach(plugin => this.use(plugin));
    }

    report(data = {}, immediate = false) {
      report(
        this.baseUrl,
        {
          appId: this.appId,
          userId: this.userId,
          ...data
        },
        immediate
      );
    }
  }

  return WebSDK;

}));
//# sourceMappingURL=monitor-web.umd.js.map
