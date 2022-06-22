import { report } from "../base";
import { vueError } from './vue'

export const init = function (config: any) {

  const { resource, promise, js, vue } = config;
  resource && resourceError();
  js && jsError();
  promise && promiseError();
  vue && vueError(vue);
};

const resourceError = function () {
  window.addEventListener(
    "error",
    (e) => {
      const target = e.target as HTMLElement;
      if (target.nodeType === 1) {
        report({
          eventType: "resourceError",
        });
      }
    },
    true
  );
};

const jsError = function () {
  const originalError = window.console.error;
  window.console.error = function (...args) {
    report({
      eventType: "jsError",
    });
    originalError.apply(this, args);
  };

  window.addEventListener(
    "error",
    (e) => {
      if (e.error) {
        const { lineno } = e;
        report({
          lineno,
          eventType: "jsError",
        });
      }
    },
    true
  );
};

const promiseError = function () {
  window.addEventListener(
    "unhandledrejection",
    function (e: PromiseRejectionEvent) {
      report({
        data: e.reason?.stack,
        eventType: "promiseError",
      });
    }
  );
};
