import { stackParserFromStackParserOptions } from '@monitor/utils'

// 正则表达式，用以解析堆栈split后得到的字符串
const CHROME_FULL_MATCH =
  /^\s*at (?:(.*?) ?\()?((?:file|https?|blob|chrome-extension|address|native|eval|webpack|<anonymous>|[-a-z]+:|.*bundle|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i

function chrome(line) {
  const lineMatch = line.match(CHROME_FULL_MATCH)
  if (!lineMatch) return {}
  const filename = lineMatch[2]
  const functionName = lineMatch[1] || ''
  const lineno = parseInt(lineMatch[3], 10) || undefined
  const colno = parseInt(lineMatch[4], 10) || undefined
  return {
    filename,
    functionName,
    lineno,
    colno,
  }
}

const defaultParser = [chrome]

export const parseStackFrames = function(stack) {
  const stackParser = stackParserFromStackParserOptions(defaultParser)
  return stackParser(stack)
}
