import { getGlobalObject } from '@monitor/utils'

const global = getGlobalObject()

export function getPageURL() {
  return global.location.href 
}

export const getPageInfo = function() {
  if (!('location' in global)) {
    return {}
  }
  const { host, hostname, href, protocol, origin, port, pathname, search, hash } = global.location
  const { width, height } = global.screen
  const { language, userAgent } = global.navigator

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
    title: document.title,
    language: language.substring(0, 2),
    userAgent,
    winScreen: `${width}x${height}`,
    docScreen: `${document.documentElement.clientWidth || document.body.clientWidth}x${
      document.documentElement.clientHeight || document.body.clientHeight
    }`,
  }
}

// 返回 OI 用户来路信息
export const getOriginInfo = () => {
  return {
    referrer: global.document.referrer,
    type: global.performance?.navigation.type || '',
  }
}