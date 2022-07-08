import { fill, getGlobalObject } from '@monitor/utils'

const handlers = {}
const instrumented = {}
const global = getGlobalObject()

export function addInstrumentationHandler(type, callback) {
  handlers[type] = handlers[type] || [];
  handlers[type].push(callback)
  instrument(type)
}

export function instrument(type) {
  if (instrumented[type]) {
    return
  }
  instrumented[type] = true
  switch (type) {
    case 'console':
      instrumentConsole()
      break;
  }
}

const triggerHandlers = function(type, data) {
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

const instrumentConsole = function() {
  fill(global, )
}
