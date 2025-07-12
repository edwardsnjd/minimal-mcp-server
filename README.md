# Personal MCP Server

Little MCP server to act as a local base MCP instance for any little tools I'd like to make available to local `ollama` models.

Only supports `stdio`.

## Tools

For testing, there are two dummy tools:
- get_pwd = pretend to expose `pwd`
- find_all_files = pretend to expose `find .`

## Testing

For testing there are two MCP server executables, both supporting only `stdio`:
- nick-mcp = the MCP server
- nick-mcp-logging = wrapper that logs stdin, stderr, and stdout for ease of debugging

## Development

`manifest.scm` is a Guile manifest, so `guile shell` will make those dev dependencies available.
