export interface Frame {
  colno?: number
  lineno?: number
  filename?: string
  functionName?: string
}

export type StackParserLine = (stack: string) => Frame
export type StackParserFn = (stack: string, skipFirst?: number) => Frame[]