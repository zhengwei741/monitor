import { MonitorConfigOptions } from "./types/index";
import { Vue } from './types'
import { init as performanceInit } from './performance'

// const defaultConfig: MonitorConfigOptions = {
//   url: "",
//   behavior: false,
//   error: false,
//   performance: false,
// };

const init = function (options: MonitorConfigOptions) {
  normalizeConfig(options);
  console.log("init");
  performanceInit({})
};

const normalizeConfig = function (options: MonitorConfigOptions) {
  // if (typeof options.behavior === "boolean") {
  // }
  console.log(options)
};

const install = function (Vue:Vue, options: MonitorConfigOptions) {
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
