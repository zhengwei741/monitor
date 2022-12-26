import { _global } from "./global";

export const getPageInfo = function () {
  if (!("location" in _global)) {
    return {};
  }
  const {
    host,
    hostname,
    href,
    protocol,
    origin,
    port,
    pathname,
    search,
    hash,
  } = _global.location;
  const { width, height } = _global.screen;
  const { language, userAgent } = _global.navigator;

  return {
    host,
    hostname,
    href,
    protocol,
    origin,
    port,
    pathname,
    search,
    hash,
    title: _global.document.title,
    language: language.substring(0, 2),
    userAgent,
    winScreen: `${width}x${height}`,
    docScreen: `${
      _global.document.documentElement.clientWidth ||
      _global.document.body.clientWidth
    }x${
      _global.document.documentElement.clientHeight ||
      _global.document.body.clientHeight
    }`,
  };
};

// 返回 OI 用户来路信息
export const getOriginInfo = () => {
  const getEntriesByType = _global?.performance?.getEntriesByType;

  const timing =
    typeof getEntriesByType === "function"
      ? (getEntriesByType("navigation")[0] as PerformanceNavigationTiming)
      : null;

  let type = "";
  if (timing) {
    type = timing.type;
  }
  return {
    referrer: _global.document.referrer,
    type,
  };
};
