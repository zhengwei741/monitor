import { MonitorConfigOptions } from "./types/index";
import { Vue } from './types'
// import { init as performanceInit } from './performance'
import { init as errorInit } from './error'

// const defaultConfig: MonitorConfigOptions = {
//   url: "",
//   behavior: false,
//   error: false,
//   performance: false,
// };

const init = function (options: MonitorConfigOptions) {
  normalizeConfig(options);
  const { error } = options
  console.log("init--options", error);
  // performanceInit({})
  errorInit(error)
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
