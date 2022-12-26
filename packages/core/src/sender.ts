import {
  Sender,
  CreaterSenderOptions,
  RequestData,
  Metrics,
} from "@monitor/types";
import {
  MonitorError,
  isFunction,
  isThenable,
  getGlobalObject,
  logger,
} from "@monitor/utils";

const DEFALUT_BUFFSIZE = 30;

const global = getGlobalObject<Window>();
const nextTime =
  global.requestIdleCallback ||
  global.requestAnimationFrame ||
  ((callback) => setTimeout(callback, 17));

const MAX_WAITING_TIME = 3000;

export function createrSender(
  makeRequest: (requestData: RequestData) => Promise<unknown>,
  options?: CreaterSenderOptions
): Sender {
  let buffer: Metrics[] = [];

  const maxBuffSize = options?.buffSize || DEFALUT_BUFFSIZE;

  let timer;

  const send = (metrics: Metrics) => {
    buffer = buffer.concat(metrics);

    clearTimeout(timer);

    if (buffer.length >= maxBuffSize) {
      sendRequest();
    } else {
      timer = setTimeout(() => {
        sendRequest();
      }, MAX_WAITING_TIME);
    }
  };

  const sendRequest = async () => {
    const sendBuffer = buffer.splice(0, maxBuffSize);

    buffer = buffer.slice(maxBuffSize);

    const requestData: RequestData = {
      data: sendBuffer,
      headers: options?.headers,
    };

    const onBeforSend = options?.onBeforSend;

    try {
      if (onBeforSend && isFunction(onBeforSend)) {
        const rv = onBeforSend(sendBuffer);
        if (!rv) {
          throw new MonitorError("onBeforSend 返回为空");
        }
        if (isThenable(rv)) {
          await rv.then(
            (res) => {
              requestData.data = res;
              makeRequest(requestData);
              if (buffer.length) {
                nextTime(sendRequest);
              }
            },
            (e) => {
              throw new MonitorError(`onBeforSend reject: ${e}`);
            }
          );
        }
      }
      makeRequest(requestData);
      if (buffer.length) {
        nextTime(sendRequest);
      }
    } catch (e) {
      if (e instanceof MonitorError) {
        logger.warn(e);
        return Promise.resolve();
      } else {
        throw e;
      }
    }
  };

  return {
    send,
  };
}
