import { BaseMetrics } from "@monitor/core";
import { BrowserMetrics } from "../types/metrics";

export class Metrics extends BaseMetrics<BrowserMetrics> {
  createMetricsId(metrics: BrowserMetrics): number | null {
    let id: any = "";

    // TODO 错误上报限流
    // if (metrics.type === "js") {
    //   if (metrics.subtype == "js-error") {
    //   }
    // }

    id = this.hashId(id + "");

    // 限制同一错误上报
    if (this.submitids.includes(id)) {
      return null;
    }

    this.submitids.push(id);

    return id;
  }
  //** 是否已经上报相同数据 */
  includes(metrics: BrowserMetrics): boolean {
    // 用户行为暂时不限流
    if (metrics.type === "behavior") {
      return false;
    }
    return this.createMetricsId(metrics) === null;
  }
}
