export interface Metrics {
  type: string; // 错误类型
  subtype?: string; // 子类型
  timestamp: number; // 时间戳
  appId?: string;
  sessionId: string;
  userId?: string;
  // meta?: unknown; // 根据subtype上报不同
}
