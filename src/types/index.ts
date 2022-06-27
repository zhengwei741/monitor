/* eslint-disable @typescript-eslint/no-explicit-any */
export interface MonitorConfigOptions {
  url: string;
  behavior?: boolean | BehaviorConfig;
  error?: boolean | ErrorConfig;
  performance?: boolean | PerformanceConfig;
}

export interface BehaviorConfig {
  ip?: boolean;
  userInfo?: boolean;
  pv?: boolean;
  stayTime?: boolean;
  pageJump?: boolean;
  depth?: boolean;
}

export interface ErrorConfig {
  resource?: boolean;
  promise?: boolean;
  js?: boolean;
  vue?: boolean;
}

export interface PerformanceConfig {
  frame?: boolean;
  fp?: boolean;
  fcp?: boolean;
  lcp?: boolean;
  cls?: boolean;
  resource?: boolean;
  api?: boolean;
}

export interface ReportData {
  [key: string]: any | any[];
}

export type ViewModel = {
  _isVue?: boolean;
  __isVue?: boolean;
  $root: ViewModel;
  $parent?: ViewModel;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $props: { [key: string]: any };
  $options: {
    name?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    propsData?: { [key: string]: any };
    _componentTag?: string;
    __file?: string;
  };
};

export interface PerformanceEntryHandler {
  (entry: PerformanceEntry): void;
}

export type Hook =
  | 'activated'
  | 'beforeCreate'
  | 'beforeDestroy'
  | 'beforeMount'
  | 'beforeUpdate'
  | 'created'
  | 'deactivated'
  | 'destroyed'
  | 'mounted'
  | 'updated';

export interface Vue {
  config: {
    errorHandler?: any;
    warnHandler?: any;
    silent?: boolean;
    globalProperties: { [key: string]: any }
  };
  mixin: (mixins: Partial<Record<Hook, any>>) => void;
  prototype: any
}

export interface PerformanceEntryHandler {
  (entry: PerformanceEntry): void;
}

export interface MPerformanceNavigationTiming {
  FP?: number;
  TTI?: number;
  DomReady?: number;
  Load?: number;
  FirseByte?: number;
  DNS?: number;
  TCP?: number;
  SSL?: number;
  TTFB?: number;
  Trans?: number;
  DomParse?: number;
  Res?: number;
  FMP?: number;
}

export interface resourceFlow {
  // name 资源地址
  name?: string,
  // transferSize 传输大小
  transferSize: number,
  // initiatorType 资源类型
  initiatorType: string,
  // startTime 开始时间
  startTime: number,
  // responseEnd 结束时间
  responseEnd: number,
  // 贴近 Chrome 的近似分析方案，受到跨域资源影响
  dnsLookup: number,
  initialConnect: number,
  ssl: number,
  request: number,
  ttfb: number,
  contentDownload: number,
}

export interface PageInformation {
  host: string;
  hostname: string;
  href: string;
  protocol: string;
  origin: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  // 网页标题
  title: string;
  // 浏览器的语种 (eg:zh) ; 这里截取前两位，有需要也可以不截取
  language: string;
  // 用户 userAgent 信息
  userAgent?: string;
  // 屏幕宽高 (eg:1920x1080)  屏幕宽高意为整个显示屏的宽高
  winScreen: string;
  // 文档宽高 (eg:1388x937)   文档宽高意为当前页面显示的实际宽高（有的同学喜欢半屏显示）
  docScreen: string;
}

export const enum mechanismType {
  JS = 'js',
  RS = 'resource',
  UJ = 'unhandledrejection',
  HP = 'http',
  CS = 'cors',
  CO = 'console',
  VUE = 'vue',
}

// 格式化后的 异常数据结构体
export interface ExceptionMetrics {
  type: string; // 错误类型
  errorUid: string; // 错误id
  message?: string; // 错误信息
  stack?: string;
  stackTrace?: unknown; // 格式化栈信息
  pageInformation?: PageInformation; // 报错页面信息
  meta?: unknown; // 附带信息
}

export interface HttpMetrics {
  method: string;
  url: string | URL;
  body: Document | XMLHttpRequestBodyInit | null | undefined | ReadableStream;
  requestTime: number;
  responseTime: number;
  status: number;
  statusText: string;
  response?: any;
}

