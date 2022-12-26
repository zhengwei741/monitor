import { Plugin } from "@monitor/types";
import { BrowserInitOptions } from "../types/index";
import * as plugins from "../plugins";

function findPlugin(names: string[] = []): Plugin[] {
  const fplugin: Plugin[] = [];
  const allPlugins = plugins as { [key: string]: Plugin };
  Object.keys(plugins).forEach((key) => {
    const plugin = allPlugins[key] as Plugin;
    if (names.includes(plugin.name)) {
      fplugin.push(plugin);
    }
  });
  return fplugin;
}

function getPluginName(option: any, defaultNames: string[] = []): string[] {
  const names: string[] = [];

  if (!option) {
    option = option || {};
  }
  if (typeof option === "boolean") {
    const _option: { [key: string]: boolean } = {};
    defaultNames.reduce((prve, curren) => {
      prve[curren] = option;
      return prve;
    }, _option);
    option = _option;
  }
  names.push(
    ...Object.keys(option)
      .filter((key) => option[key] === true)
      .map((name) => name)
  );
  return names;
}

export function initPlugins(options: BrowserInitOptions) {
  const { behavior, error, performance } = options;
  // const defalutPlugins: Plugin[] = [plugins.BreadcrumbPlugin];
  const defalutPlugins: Plugin[] = [];

  const names: string[] = [];

  names.push(
    ...getPluginName(behavior, [
      "pv",
      "http",
      "route",
      "click",
      "stayTime",
    ]).map((name) => `behavior_${name}`)
  );

  names.push(
    ...getPluginName(error, ["http", "js", "promise", "resource"]).map(
      (name) => `error_${name}`
    )
  );

  names.push(
    ...getPluginName(performance, [
      "fcp",
      "lcp",
      "fid",
      "cls",
      "httpTimeConsuming",
      "timing",
      "resource",
    ]).map((name) => `performance_${name}`)
  );

  defalutPlugins.push(...findPlugin(names));

  if (!options.plugins) {
    options.plugins = [];
  }
  options.plugins = options.plugins.concat(defalutPlugins);
}
