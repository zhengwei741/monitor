import { ReportData } from "../types";
import { nextTime } from "../utils";

let caches: ReportData[] = [];
const max = 5;
let baseUrl = "";
let baseInfo = {};

export const init = function (options: any) {
  const { url, appId, userId } = options;
  baseUrl = url;
  baseInfo = {
    appId,
    userId,
  };
};

let timer: number | undefined = undefined

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
  clearTimeout(timer);
  if (caches.length >= max) {
    send();
  } else {
    timer = window.setTimeout(send, 5000)
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

// const sendBeacon = window.navigator.sendBeacon
//   ? (url: string, data: any) => {
//       if (url && data) {
//         window.navigator.sendBeacon(url, JSON.stringify(data));
//       }
//     }
//   : (url: string, data: any) => {
//       // const img = new Image();
//       // img.src = `${url}?v=${encodeURIComponent(JSON.stringify(data))}`;
//       const xhr = new XMLHttpRequest()
//       xhr.open('POST', url)
//       xhr.send(JSON.stringify(data))
//     };

const sendBeacon = (url: string, data: any) => {
  console.log(url, '--------------url')
  console.log(data, '--------------data')
}

window.addEventListener("beforeunload", () => {
  send();
});
