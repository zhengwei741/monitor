// import { throttle } from "@monitor/utils";
import { addEventHandler, triggerHandlers } from "@monitor/core";
import { _global } from "./global";

const instrumentType = {
  DC: "_dom_click",
};

type handlerType = (e: Event) => void;

export function proxyDomClick(handler: handlerType) {
  if (!("document" in _global)) {
    return;
  }

  const res = addEventHandler(instrumentType.DC, handler);
  if (!res) {
    return;
  }

  // const globalDOMEventHandler = throttle(function (e: Event) {
  //   triggerHandlers(instrumentType.DC, e);
  // }, 500) as any;

  const globalDOMEventHandler = function (e: Event) {
    triggerHandlers(instrumentType.DC, e);
  };

  _global.addEventListener("click", globalDOMEventHandler);
}
