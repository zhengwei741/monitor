import { Plugin } from "@monitor/types";
import { BrowserSDK } from "../../core/sdk";
import {
  proxyHash,
  proxyHistory,
  proxyDomClick,
  onAfterLoad,
  getPageInfo,
  getOriginInfo,
  parseElementAttribute,
  getBaseInfo,
} from "../../utils";
import { BehaviorMetrics } from "../../types";

export const pvPlugin: Plugin = {
  name: "behavior_pv",
  method: function (sdk: BrowserSDK) {
    const handler = function () {
      const BehaviorMetrics: BehaviorMetrics = {
        type: "behavior",
        subtype: "pv",
        ...getBaseInfo(),
        meta: {
          pageInfo: getPageInfo(),
          originInformation: getOriginInfo(),
        },
      };
      sdk.capture(BehaviorMetrics);
    };
    onAfterLoad(handler);
    proxyHash(handler);
    proxyHistory(handler);
  },
};

export const ClickPlugin: Plugin = {
  name: "behavior_click",
  method: function (sdk: BrowserSDK) {
    const handler = function (e: Event) {
      const target = (e.target || e.srcElement) as HTMLElement;
      if (!target) {
        return;
      }
      const BehaviorMetrics: BehaviorMetrics = {
        type: "behavior",
        subtype: "click-behavior-record",
        ...getBaseInfo(),
        meta: {
          ...parseElementAttribute(target),
          target: target.tagName,
        },
      };
      sdk.capture(BehaviorMetrics);
    };
    proxyDomClick(handler);
  },
};
