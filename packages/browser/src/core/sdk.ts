import { SDK } from "@monitor/core";
import { logger } from "@monitor/utils";
import { BrowserInitOptions, BrowserMetrics } from "../types/index";
import { initPlugins } from "./plugins";
import { Metrics } from "./metrics";
import Package from "../../package.json";
import { createrBrowserSender } from "./sender";

export class BrowserSDK extends SDK<BrowserInitOptions> {
  private metrics: Metrics = new Metrics();

  constructor(options: BrowserInitOptions) {
    if (options.debug === true) {
      logger.disable();
    }

    // 安装默认插件
    initPlugins(options);

    // sender
    options.createrSender = createrBrowserSender;

    options.sdkInfo = {
      name: Package.name,
      version: Package.version,
      plugins: options.plugins
        ? options.plugins.map((plugin) => plugin.name)
        : [],
    };

    super(options);
  }

  capture(metrics: BrowserMetrics) {
    if (!this.metrics.includes(metrics)) {
      super.capture(metrics);
    }
  }
}
