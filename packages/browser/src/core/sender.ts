import { RequestData, CreaterSenderOptions } from "@monitor/types";
import { createrSender } from "@monitor/core";
import { supportsFetch, _global, encrypt } from "../utils";
import { logger } from "@monitor/utils";

const encryptData = (dataStr: string) => {
  return {
    data: encrypt(dataStr),
  };
};

export const fetch = supportsFetch()
  ? (url, data, headers = {}) => {
      return _global.fetch(url, {
        body: data,
        method: "POST",
        referrerPolicy: "origin",
        headers,
      });
    }
  : (url, data, headers = {}) => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        for (const header in headers) {
          if (Object.prototype.hasOwnProperty.call(headers, header)) {
            xhr.setRequestHeader(header, headers[header]);
          }
        }
        xhr.addEventListener("error", reject);
        xhr.addEventListener("readystatechange", function () {
          if (xhr.readyState === 4) {
            resolve(xhr.response);
          }
        });
        xhr.send(data);
      });
    };

export const send =
  typeof _global.navigator.sendBeacon === "function"
    ? (url, data) => {
        return new Promise((reolve) => {
          let ret;
          if (data) {
            ret = _global.navigator.sendBeacon(url, JSON.stringify(data));
          }
          reolve(ret);
        });
      }
    : fetch;

export function createrBrowserSender(options: CreaterSenderOptions) {
  const makeRequest = (requestData: RequestData) => {
    const data = encryptData(JSON.stringify(requestData.data));
    logger.log(data);
    return send(options.url, data, requestData.headers);
  };

  return createrSender(makeRequest, options);
}
