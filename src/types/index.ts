export interface MonitorConfigOptions {
  url: string;
  behavior?: boolean | BehaviorConfig;
  error?: boolean | ErrorConfig;
  performance?: boolean | PerformanceConfig;
}

interface BehaviorConfig {
  ip?: boolean;
  userInfo?: boolean;
  pv?: boolean;
  stayTime?: boolean;
  pageJump?: boolean;
  depth?: boolean;
}

interface ErrorConfig {
  resource?: boolean;
  promise?: boolean;
  js?: boolean;
  vue?: boolean;
}

interface PerformanceConfig {
  frame?: boolean;
  fp?: boolean;
  fcp?: boolean;
  lcp?: boolean;
  cls?: boolean;
  resource?: boolean;
  interface?: boolean;
}

export interface ReportData {
  [key: string]: number | string;
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
