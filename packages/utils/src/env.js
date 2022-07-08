export function isBrowserBundle() {
  return typeof __MONITOR_BROWSER_BUNDLE__ !== 'undefined' && !!__MONITOR_BROWSER_BUNDLE__;
}
