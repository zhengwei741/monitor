import { getGlobalObject, fill } from "@monitor/utils";

const global = getGlobalObject<Window>();

const dispatchEvent = function (type: string) {
  const e = new Event(type);
  global.dispatchEvent(e);
};

let init = false;
function wrHistory() {
  init = true;
  if ("history" in global) {
    ["pushState", "replaceState"].forEach((type) => {
      fill(global.history, type, function (original) {
        return function (...args: any) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const rv = original.apply(this, args);
          dispatchEvent(type);
          return rv;
        };
      });
    });
  }
}
!init && wrHistory();

export function proxyHistory(handler: (...args: any[]) => void) {
  global.addEventListener("replaceState", (e) => handler(e), true);
  global.addEventListener("pushState", (e) => handler(e), true);
}

export function proxyHash(handler: (...args: any[]) => void) {
  // global.addEventListener('hashchange', (e) => handler(e), true)
  global.addEventListener("popstate", (e) => handler(e), true);
}
