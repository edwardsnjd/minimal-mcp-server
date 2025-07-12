const getPwd = () => "/blah/"
getPwd.info = {
  name: "get_pwd",
  description: "Give the current working directory",
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  }
}

const findAllFiles = () => [
  'foo.md',
  'bar.md',
  'README.md',
]
findAllFiles.info = {
  name: "find_all_files",
  description: "Find all files under current working directory",
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  }
}

export default [
  getPwd,
  findAllFiles,
]

