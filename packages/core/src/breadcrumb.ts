import { getGlobalSingleton } from '@monitor/utils'
import { Breadcrumb, Breadcrumbs } from '@monitor/types'

const DEFALUT_MAX = 100

function makeBreadcrumbs (maxBreadcrumb: number): Breadcrumbs {
  const stack: Breadcrumb[] = []
  let max: number = maxBreadcrumb || DEFALUT_MAX
  if (max > DEFALUT_MAX) {
    max = DEFALUT_MAX
  }

  function addBreadcrumb(breadcrumb: Breadcrumb): void {
    if (stack.length === max) {
      stack.shift()
    }
    stack.push(breadcrumb)
  }

  function getStack(): Breadcrumb[] {
    return stack
  }

  return {
    addBreadcrumb,
    getStack
  }
}

export function initBreadcrumbs () {
  const breadcrumbs = getGlobalSingleton('breadcrumbs', makeBreadcrumbs)
  return breadcrumbs
}
