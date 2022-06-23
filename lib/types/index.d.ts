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
export declare type ViewModel = {
    _isVue?: boolean;
    __isVue?: boolean;
    $root: ViewModel;
    $parent?: ViewModel;
    $props: {
        [key: string]: any;
    };
    $options: {
        name?: string;
        propsData?: {
            [key: string]: any;
        };
        _componentTag?: string;
        __file?: string;
    };
};
export interface PerformanceEntryHandler {
    (entry: PerformanceEntry): void;
}
export declare type Hook = 'activated' | 'beforeCreate' | 'beforeDestroy' | 'beforeMount' | 'beforeUpdate' | 'created' | 'deactivated' | 'destroyed' | 'mounted' | 'updated';
export interface Vue {
    config: {
        errorHandler?: any;
        warnHandler?: any;
        silent?: boolean;
        globalProperties: {
            [key: string]: any;
        };
    };
    mixin: (mixins: Partial<Record<Hook, any>>) => void;
    prototype: any;
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
    name?: string;
    transferSize: number;
    initiatorType: string;
    startTime: number;
    responseEnd: number;
    dnsLookup: number;
    initialConnect: number;
    ssl: number;
    request: number;
    ttfb: number;
    contentDownload: number;
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
    title: string;
    language: string;
    userAgent?: string;
    winScreen: string;
    docScreen: string;
}
export declare const enum mechanismType {
    JS = "js",
    RS = "resource",
    UJ = "unhandledrejection",
    HP = "http",
    CS = "cors",
    CO = "console",
    VUE = "vue"
}
export interface ExceptionMetrics {
    type: string;
    errorUid: string;
    message?: string;
    stack?: string;
    stackTrace?: unknown;
    pageInformation?: PageInformation;
    meta?: unknown;
}
