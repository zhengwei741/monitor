import { Frame } from './exception'

export type StackParserLine = (stack: string) => Frame
export type StackParserFn = (stack: string, skipFirst: number) => Frame[]