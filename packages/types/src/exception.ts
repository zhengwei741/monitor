export interface Exception {
  type?: string
  value?: string
  stacktrace?: {
    frames: Frame[]
    mechanism: Mechanism
  }
}

export interface Frame {
  colno?: number
  lineno?: number
  filename?: string
  functionName?: string
}

export interface Mechanism {
  type: string
}