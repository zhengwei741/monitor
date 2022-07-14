import { Core } from '@monitor/core'
import { report } from '../utils/report'
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
    super(options)
    const { url, appId, userId } = options
    // 基本信息
    this.baseUrl = url
    this.appId = appId
    this.userId = userId

    if (options.defaultPlugins === undefined) {
      options.defaultPlugins = defaultPlugins
    }
    // 安装插件
    options.defaultPlugins.forEach(plugin => this.use(plugin))
  }

  report(data = {}, immediate = false) {
    const { baseUrl } = this
    report(
      baseUrl,
      {
        appId: this.appId,
        userId: this.userId,
        ...data
      },
      immediate
    )
  }
}
