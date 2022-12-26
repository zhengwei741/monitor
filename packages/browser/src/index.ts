import { BrowserSDK } from "./core/sdk";
import { BrowserInitOptions } from "./types";
import { getGlobalSingleton } from "@monitor/utils";
import { getBaseInfo } from "./utils";

let SDK: BrowserSDK;

export function init(options: BrowserInitOptions) {
  SDK = getGlobalSingleton("sdk", () => new BrowserSDK(options));
  return SDK;
}

export function capture(meta = {}) {
  if (SDK) {
    SDK.capture({
      type: "custom",
      meta,
      appId: SDK.appId,
      ...getBaseInfo(),
    });
  }
}
