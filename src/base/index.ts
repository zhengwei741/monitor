import { ReportData } from "../types";
import { nextTime } from "../utils";

let caches: ReportData[] = [];
const max = 5;
let baseUrl = "";
let baseInfo = {};

export const init = function (options) {
  const { url, appId, userId } = options;
  baseUrl = url;
  baseInfo = {
    appId,
    userId,
  };
};

export const report = function (data: ReportData, immediate = false) {
  if (immediate) {
    // 立即上传
    sendBeacon(baseUrl, {
      baseInfo,
      eventInfo: [data],
    });
    return;
  }
  caches.push(data);

  if (caches.length >= max) {
    send();
  } else {
    nextTime(send);
  }
};

export const send = function () {
  if (caches.length) {
    const sendEvents = caches.slice(0, max);
    caches = caches.slice(max);

    const sendTime = Date.now();
    sendBeacon(baseUrl, {
      ...baseInfo,
      sendTime,
      data: sendEvents.map((event) => event),
    });
    if (caches.length) {
      nextTime(send);
    }
  }
};

const sendBeacon = window.navigator.sendBeacon
  ? (url, data) => {
      if (url && data) {
        window.navigator.sendBeacon(url, JSON.stringify(data));
      }
    }
  : (url, data) => {
      const img = new Image();
      img.src = `${url}?v=${encodeURIComponent(JSON.stringify(data))}`;
    };

window.addEventListener("beforeunload", () => {
  send();
});
