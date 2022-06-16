import { MonitorConfigOptions } from "./types/index";

const defaultConfig: MonitorConfigOptions = {
  url: "",
  behavior: false,
  error: false,
  performance: false,
};

const init = function (options: MonitorConfigOptions) {
  normalizeConfig(options);
  console.log("init");
};

const normalizeConfig = function (options: MonitorConfigOptions) {
  if (typeof options.behavior === "boolean") {
  }
};

const install = function (Vue, options: MonitorConfigOptions) {
  init(options);
  if (Vue.prototype) {
    // vue2
    Vue.prototype.$monitor = {};
  } else {
    Vue.config.globalProperties.$monitor = {};
  }
};

export default {
  init,
  install,
};
