import { Plugin, Metrics, Sender, SdkInfo } from "@monitor/types";
import { validateInitOptions, CoreOptions } from "./options";
import { isFunction, logger } from "@monitor/utils";

export class SDK<O extends CoreOptions> {
  protected options: O;

  protected url: string;

  protected plugins: { [key: string]: Plugin } = {};

  protected sender: Sender;

  public appId: string;

  public sdkInfo: SdkInfo;

  constructor(options: O) {
    validateInitOptions(options);

    this.options = options;

    const { url, plugins, createrSender, appId, sdkInfo } = options;
    this.url = url;
    this.appId = appId;

    this.install(plugins || []);

    this.sender = createrSender({
      url: options.url,
      onBeforSend: options.beforeSend,
      buffSize: options.buffSize,
    });

    this.sdkInfo = sdkInfo;
  }

  install(plugins: Plugin[]) {
    for (const plugin of plugins) {
      try {
        if (!this.plugins[plugin.name] && isFunction(plugin.method)) {
          plugin.method.call(this, this);
          this.plugins[plugin.name] = plugin;
        }
      } catch (e) {
        logger.error(`安装${plugin.name}插件失败`, e);
      }
    }
  }

  capture(metrics: Metrics) {
    metrics.appId = this.appId;
    logger.info("----------capture" + metrics);
    this.sender.send(metrics);
  }
}
