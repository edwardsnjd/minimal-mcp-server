# Personal MCP Server

Little MCP server to act as a local base MCP instance for any little tools I'd like to make available to local `ollama` models.

Only supports `stdio`.

Do not use this for anything important.  This is an educational toy.

## Tools

The plan is to keep this server minimal by exposing only a small number of relatively safe tools:
- find_all_files [PATTERN] = expose local file listing ("ls -l" style)
- cat_file REL_PATH = cat the content of the given file
- git_log [REL_PATH] = terse git log
- git_show COMMIT = full git show
- find_text_in_files [PATTERN] = text search

## Testing

For testing there are two MCP server executables, both supporting only `stdio`:
- nick-mcp = the MCP server
- nick-mcp-logging = wrapper that logs stdin, stderr, and stdout for ease of debugging

## Development

`manifest.scm` is a Guile manifest, so `guile shell` will make those dev dependencies available.
