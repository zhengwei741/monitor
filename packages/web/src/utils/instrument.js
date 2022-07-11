// import { fill, getGlobalObject } from '@monitor/utils'

const handlers = {}
// const global = getGlobalObject()

export function addInstrumentationHandler(type, callback) {
  handlers[type] = handlers[type] || [];
  handlers[type].push(callback)
}

export const triggerHandlers = function(type, data) {
  if (!type || !handlers[type]) {
    return;
  }
  for (const handler of handlers[type] || []) {
    try {
      handler(data);
    } catch (e) {
      console.log(e)
    }
  }
}

// const instrumentConsole = function() {
//   const types = ['error']
//   // debug error info log
//   types.forEach(level => {
//     if (!level in global.console) {
//       return
//     }
//     fill(global.console, level, (originalConsoleMethod) => {
//       return function(...args) {
//         triggerHandlers('console', { args, level })
//         if (originalConsoleMethod) {
//           originalConsoleMethod.apply(global.console, args)
//         }
//       }
//     })
//   })
// }
