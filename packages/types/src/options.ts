import { Plugin } from "./plugin";

export interface Options extends HooksTypes {
  appId: string;
  /** 上报的url */
  url: string;
  /** 插件 */
  plugins?: Plugin[];
  /** 是否开启debug */
  debug?: boolean;
  /** 上报缓存数量最大值 */
  buffSize?: number;
}

export interface HooksTypes {
  beforeSend?: (event: any) => any;
  // beforeBreadcrumb?: (breadcrumb: Breadcrumb) => any;
}
