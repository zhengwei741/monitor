import { StackParserLine, StackParserFn, Frame } from '@monitor/types'

const STACKTRACE_LIMIT = 50

export function createStackParser(...parsers: StackParserLine[]) {
  return function stackParser (stack = '', skipFirst = 0): Frame[] {
    const frames: Frame[] = []
    for (const line of stack.split('\n').slice(skipFirst)) {
      for (const parser of parsers) {
        const frame = parser(line)
        if (frame) {
          frames.push(frame)
        }
      }
    }
    return stripSentryFramesAndReverse(frames)
  }
}

export function stackParserFromStackParserOptions(parser: StackParserLine[]) : StackParserFn {
  return createStackParser(...parser)
}

function stripSentryFramesAndReverse(frames: Frame[]): Frame[] {
  if (!frames.length) {
    return []
  }
  const localStack = frames
  return localStack
    .slice(0, STACKTRACE_LIMIT)
    .map(frame => ({
      ...frame,
      filename: frame.filename || localStack[0].filename,
      functionName: frame.functionName || '?',
    }))
    .reverse()
}
