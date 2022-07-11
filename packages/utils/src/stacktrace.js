const STACKTRACE_LIMIT = 50

export function createStackParser(...parsers) {
  return function(stack = '', skipFirst = 0) {
    const frames = []
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

export function stackParserFromStackParserOptions(stackParser) {
  if (Array.isArray(stackParser)) {
    return createStackParser(...stackParser)
  }
  return stackParser
}

function stripSentryFramesAndReverse(stack = []) {
  if (!stack.length) {
    return []
  }
  const localStack = stack
  return localStack
  .slice(0, STACKTRACE_LIMIT)
  .map(frame => ({
    ...frame,
    filename: frame.filename || localStack[0].filename,
    function: frame.function || '?',
  }))
  .reverse()
}
