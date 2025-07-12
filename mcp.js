import EventEmitter from 'node:events'

"use strict"

// MCP protocol

export class Server {
  constructor() {
    this.files = new Map()
    this.events = new EventEmitter()
  }

  handleMessage(message) {
    if ('id' in message) {
      this.handleRequest(message).forEach(m => this.events.emit('message', m))
    } else {
      this.handleNotification(message)
    }
  }

  handleRequest(message) {
    switch (message.method) {
      case 'initialize': return this.onInitialize(message)
      case 'tools/list': return this.onToolsList(message)
      case 'tools/call': return this.onToolsCall(message)
      default: return [unknown(message)]
    }
  }

  handleNotification(message) {
    // switch (message.method) {
    // }
  }

  // Request handlers

  onInitialize({id}) {
    return [initialize(id)]
  }

  onToolsList({id}) {
    return [toolsList(id)]
  }

  onToolsCall({ id, params: { name, arguments: args } }) {
    return [toolsCall(id, name, args)]
  }

  // Notification handlers
}

// MCP responses

const initialize = (id) => lspMessage({
  "id": id,
  "result": {
    "protocolVersion": "2025-03-26",
    "capabilities": {
      "logs": { },
      "tools": { "listChanged": false },
    },
    "serverInfo": {
      "name": "Nick's rubbish server",
      "version": "0.0.1"
    },
    "instructions": "Optional instructions for the client"
  }
})

const logMessage = (level, data) => lspMessage({
  method: "notifications/message",
  params: { level, data }
})

const toolsList = (id) => lspMessage({
  id,
  result: {
    tools: tools
  }
})

const tools = [
  {
    name: "get_pwd",
    description: "Give the current working directory",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "find_all_files",
    description: "Find all files under current working directory",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    }
  }
]

const getPwd = () => "/blah/"

const findAllFiles = () => [
  'foo.md',
  'bar.md',
  'README.md',
]

const toolsCall = (id, name, args) => {
  switch (name) {
    case 'get_pwd':
      return lspMessage({
        id,
        result: {
          content: [ { type: "text", text: getPwd() } ],
        },
      })
    case 'find_all_files':
      return lspMessage({
        id,
        result: {
          content: [ { type: "text", text: findAllFiles().join('\n') } ],
        },
      })
    default:
      return lspMessage({
        id,
        error: notImplemented(),
      })
  }
}

const notFound = () => ({
  code: -32002,
  message: "Sorry, not found"
})

const notImplemented = () => ({
  code: -32603,
  message: "Sorry, not implemented yet"
})

const unknown = (message) => lspMessage({
  "id": message.id,
  "error": {
    "code": -32601,
    "message": `Method not found: ${message.method}`
  }
})

const lspMessage = (body) => ({ jsonrpc: "2.0", ...body })
