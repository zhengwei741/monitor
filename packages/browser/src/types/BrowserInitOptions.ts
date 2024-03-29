import { CoreOptions } from "@monitor/core";

interface BehaviorOptions {
  pv?: boolean;
  http?: boolean;
  route?: boolean;
  click?: boolean;
  stayTime?: boolean;
}

interface ErrorOptions {
  http?: boolean;
  js?: boolean;
  promise?: boolean;
  resource?: boolean;
}

interface PerformanceOptions {
  fcp?: boolean;
  lcp?: boolean;
  fid?: boolean;
  cls?: boolean;
  http?: boolean;
  timing?: boolean;
  resource?: boolean;
  httpTimeConsuming?: boolean;
}

export interface BrowserInitOptions extends CoreOptions {
  behavior?: boolean | BehaviorOptions;
  error?: boolean | ErrorOptions;
  performance?: boolean | PerformanceOptions;
}
