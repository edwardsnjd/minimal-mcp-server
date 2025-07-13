import EventEmitter from 'node:events'
import tools from './tools.js'

"use strict"

// MCP protocol

export class Server {
  constructor() {
    this.events = new EventEmitter()
  }

  handleMessage(message) {
      if ('id' in message) {
        try {
          const response = this.handleRequest(message)
          this.send(response)
        } catch (e) {
          const errorMessage = rpcMessage({
            id: message.id,
            error: internalError(e),
          })
          this.send(errorMessage)
        }
      } else {
        this.handleNotification(message)
      }
  }

  send(message) {
    this.events.emit('message', message)
  }

  handleRequest(message) {
    switch (message.method) {
      case 'initialize': return this.onInitialize(message)
      case 'tools/list': return this.onToolsList(message)
      case 'tools/call': return this.onToolsCall(message)
      case 'prompts/list': return this.onPromptsList(message)
      default: return unknown(message)
    }
  }

  handleNotification(message) {
    // switch (message.method) {
    // }
  }

  // Request handlers

  onInitialize({id}) {
    return initialize(id)
  }

  onToolsList({id}) {
    return toolsList(id)
  }

  onToolsCall({ id, params: { name, arguments: args } }) {
    return toolsCall(id, name, args)
  }

  onPromptsList({id}) {
    return promptsList(id)
  }
}

// MCP message factories

const initialize = (id) => rpcMessage({
  "id": id,
  "result": {
    "protocolVersion": "2025-03-26",
    "capabilities": {
      "prompts": { },
      "logs": { },
      "tools": { },
    },
    "serverInfo": {
      "name": "Nick's rubbish server",
      "version": "0.0.1"
    },
    "instructions": "Optional instructions for the client"
  }
})

const logMessage = (level, data) => rpcMessage({
  method: "notifications/message",
  params: { level, data }
})

const toolsList = (id) => rpcMessage({
  id,
  result: {
    tools: tools.map(t => t.info),
  }
})

const toolsCall = (id, name, args) => {
  const tool = tools.find(t => t.info.name == name)
  if (!tool) {
    return rpcMessage({
      id,
      error: notImplemented(),
    })
  }
  return rpcMessage({
    id,
    result: {
      content: [ { type: "text", text: tool(args) } ],
    },
  })
}

const promptsList = (id) => rpcMessage({
  id,
  result: {
    prompts: [],
  },
})

// Standard JSON-RPC error codes
const PARSE_ERROR = -32700;
const INVALID_REQUEST = -32600;
const METHOD_NOT_FOUND = -32601;
const INVALID_PARAMS = -32602;
const INTERNAL_ERROR = -32603;

const notImplemented = () => ({
  code: INVALID_PARAMS,
  message: "Sorry, not implemented"
})

const internalError = (e) => ({
  code: INTERNAL_ERROR,
  message: `Sorry, error occurred: ${e}`
})

const unknown = (message) => rpcMessage({
  "id": message.id,
  "error": {
    "code": METHOD_NOT_FOUND,
    "message": `Method not found: ${message.method}`
  }
})

const rpcMessage = (body) => ({ jsonrpc: "2.0", ...body })
