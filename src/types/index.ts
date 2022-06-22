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
  [key: string]: number | string | any;
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

export interface PerformanceKpi {
  [key: string]: number
}
