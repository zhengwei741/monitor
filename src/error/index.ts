import { ViewModel } from "../types";
import { report } from "../base";

export const init = function (config) {
  const originalError = window.console.error;
  window.console.error = function (...args) {
    report({
      eventType: "jsError",
    });
    originalError.apply(this, args);
  };

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

const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str: string): string =>
  str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");

const formatComponentName = function (vm?: ViewModel, includeFile?: boolean) {
  if (!vm) {
    return "<Anonymous>";
  }
  if (vm.$root === vm) {
    return "<Root>";
  }

  const options = vm.$options;
  let name = options.name || options._componentTag;
  const file = options.__file;
  if (!name && file) {
    const match = file.match(/([^/\\]+)\.vue$/);
    if (match) {
      name = match[1];
    }
  }

  return (
    (name ? `<${classify(name)}>` : "<Anonymous>") +
    (file && includeFile ? `at ${file}` : "")
  );
};

const generateComponentTrace = function (vm?: ViewModel) {
  if ((vm?.__isVue || vm?._isVue) && vm.$parent) {
    const trace: string[] = [];
    while (vm) {
      trace.push(formatComponentName(vm))
      vm = vm.$parent;
    }

    return trace.reverse().join('-->');
  }
  return formatComponentName(vm, true);
};

const vueError = function (vue) {
  vue.config.errorHandler = function (
    error: Error,
    vm: ViewModel,
    lifecycleHook: string
  ) {
    const reportData = {
      error: error.message,
      componentName: formatComponentName(vm),
      trace: vm ? generateComponentTrace(vm) : "",
      lifecycleHook,
    };
    report({
      ...reportData,
      eventType: "Error",
    });
  };
};
