import { Event } from './event'
import { Breadcrumb } from './breadcrumb'
import { Plugin } from './plugin'
import { StackParserFn } from './stacktrace'
import { CreaterSender } from './sender'
import { SdkInfo } from './sdkInfo'

export interface InitOptions extends HooksTypes{
  // 
  appKey: string
  // DSN告诉 SDK 将事件发送到哪里 不存在，SDK 将不会发送任何事件。
  dsn: string
  // 打开或关闭调试模式。
  debug?: boolean
  // 配置错误事件的采样率，范围为0.0至1.0。默认值1.0表示发送 100% 的错误事件。
  sampleRate?: number
  // 此变量控制应捕获的面包屑的总量。这默认为100.
  maxBreadcrumbs?: number
  // 指定此 SDK 是否应向 Sentry 发送事件。
  enabled?: boolean
  //
  sender: CreaterSender
  //
  plugins: Plugin[]

  stackParser: StackParserFn

  buffSize: number

  sdkInfo?: SdkInfo
}

export interface HooksTypes {
  // 此函数使用 SDK 特定的事件对象调用，并且可以返回修改后的事件对象或不返回任何内容以跳过报告事件。
  beforeSend?: (event: Event) => {},
  // 在将面包屑添加到范围之前，使用特定于 SDK 的面包屑对象调用此函数。
  beforeBreadcrumb?: (breadcrumb: Breadcrumb) => {}
}