import { ReportData, PageInformation, BaseInfo } from "../types";
export declare const init: (options: any) => void;
export declare const report: (data: ReportData, immediate?: boolean) => void;
export declare const send: () => void;
export declare const getPageInfo: () => PageInformation;
export declare const getBaseInfo: () => BaseInfo;
