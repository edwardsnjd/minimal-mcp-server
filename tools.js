import child_process from 'node:child_process'

const findAllFiles = () => child_process.execSync('fd .', {encoding: 'utf-8'})
findAllFiles.info = {
  name: "find_all_files",
  description: "Find the relative paths of all files and directories under the current working directory.",
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  }
}

const catFile = ({ path }) => child_process.execSync(
  `cat ${path}`,
  {encoding: 'utf-8'},
)
catFile.info = {
  name: "cat_file",
  description: "Output the text of the given file.  This is useful to read the contents.",
  inputSchema: {
    type: "object",
    properties: {
      path: { type: "string" }
    },
    required: ["path"],
  }
}

const gitLog = ({ path = "" }) => child_process.execSync(
  `git log --oneline -- ${path}`,
  {encoding: 'utf-8'},
)
gitLog.info = {
  name: "git_log",
  description: "Show the terse git log, optionally limited by path.",
  inputSchema: {
    type: "object",
    properties: {
      path: { type: "string" }
    },
    required: [],
  }
}

const gitShow = ({ commit }) => child_process.execSync(
  `git show ${commit}`,
  {encoding: 'utf-8'},
)
gitShow.info = {
  name: "git_show",
  description: "Show details of a single git commit.",
  inputSchema: {
    type: "object",
    properties: {
      commit: { type: "string" }
    },
    required: ["commit"],
  }
}

const textSearch = ({ target }) => child_process.execSync(
  `rg --no-heading --column --line-number "${target}" ./ || true`,
  {encoding: 'utf-8'},
)
textSearch.info = {
  name: "text_search",
  description: "Recursively search for the target text in files under the current directory.",
  inputSchema: {
    type: "object",
    properties: {
      target: { type: "string" }
    },
    required: ["target"],
  }
}

export default [
  findAllFiles,
  catFile,
  gitLog,
  gitShow,
  textSearch,
]
