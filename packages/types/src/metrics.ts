export interface Metrics {
  type: string // 错误类型
  subtype?: string // 子类型
  message?: string // 错误信息
  errorId?: number // 错误id
  stack?: string // 错误栈
  stackTrace?: unknown // 格式化栈信息
  meta?: unknown
  timestamp?: number
  appKey?: string
}
