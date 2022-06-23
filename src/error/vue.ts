import { ViewModel, Vue, ExceptionMetrics } from "../types"
import { reportErrorHandle } from './index'
import { getErrorUid } from '../utils'

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

export const initVueError = function (vue: Vue) {
  vue.config.errorHandler = function (
    error: Error,
    vm: ViewModel,
    lifecycleHook: string
  ) {
    const reportData: ExceptionMetrics = {
      type: 'vueError',
      errorUid: getErrorUid(`vue-${error.message}-${error.stack}`),
      message: error.message,
      stack: error.stack,
      meta: {
        lifecycleHook,
        componentName: formatComponentName(vm),
        trace: vm ? generateComponentTrace(vm) : "",
        vm,
        error
      }
    };
    reportErrorHandle(reportData)
  };
};
