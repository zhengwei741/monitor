import { Options, SdkInfo, CreaterSender } from "@monitor/types";
import { validateOption } from "@monitor/utils";

/**
 * 初始化配置 校验配置项等
 * @param options
 */
export function validateInitOptions(options: Options) {
  const { url, appId } = options;

  validateOption(appId, "appId", "string");
  validateOption(url, "url", "string");
}

export interface CoreOptions extends Options {
  /** sdkInfo 版本信息 */
  sdkInfo: SdkInfo;
  // Sender
  createrSender: CreaterSender;
}
