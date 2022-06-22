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