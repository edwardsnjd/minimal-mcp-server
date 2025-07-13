import EventEmitter from 'node:events'

'use strict'

// Line protocol

export const format = (message) => {
  const messageJson = JSON.stringify(message)
  return `${messageJson}\n`
}

/** Parse input chunks and emit messages. */
export const buildParser = () => {
  const events = new EventEmitter()

  const findLine = (buffer) => {
    const lines = buffer.split('\n')
    if (lines.length < 2) return

    const messageJson = lines.shift()
    const remaining = lines.join('\n')

    const message = JSON.parse(messageJson)
    events.emit('message', message)
    return remaining
  }

  let buffer = ''
  let result = null
  const input = (chunk) => {
    buffer += chunk.toString()
    while (result = findLine(buffer)) { buffer = result }
  }

  return { input, events }
}
