import { Core } from '@monitor/core'
import { supportsFetch } from '@monitor/utils'

import {
  initLCP,
  initCLS,
  initHttp,
  observeTiming,
  initFCP,
  initFID,
  observeResResourceFlow,

  initResourceError,
  initjsError,
  initPromiseError,
  initHttpError,
  initVueError,

  initPageInfo,
  initRouterChange,
  initClickRecord,
  initHttpRecord,
  initPV,
  initStayTime,

  initBreadcrumb
} from '../plugins'

const defaultPlugins = [
  initLCP,
  initCLS,
  initHttp,
  observeTiming,
  initFCP,
  initFID,
  observeResResourceFlow,

  initResourceError,
  initjsError,
  initPromiseError,
  initHttpError,
  initVueError,

  initPageInfo,
  initRouterChange,
  initClickRecord,
  initHttpRecord,
  initPV,
  initStayTime,

  initBreadcrumb
]

export default class WebSDK extends Core {
  constructor(options = {}) {
    options.transport = supportsFetch()

    super(options)

    this.callPlugins()
  }

  // report(data = {}, immediate = false) {
  //   const { baseUrl } = this
  //   report(
  //     baseUrl,
  //     {
  //       appId: this.appId,
  //       userId: this.userId,
  //       ...data
  //     },
  //     immediate
  //   )
  // }
}

WebSDK.installAll(defaultPlugins)
