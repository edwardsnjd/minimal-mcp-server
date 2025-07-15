import child_process from 'node:child_process'

const findAllFiles = ({ filter }) => {
  filter = filter || '.'
  const pathArg = filter.includes('/') ? '--full-path' : ''
  return child_process.execSync(
    `fd --hidden --list-details ${pathArg} "${filter}"`,
    {encoding: 'utf-8'},
  )
}
findAllFiles.info = {
  name: "find_all_files",
  description: "Find all files and directories under the current working directory and list their details (no content).",
  inputSchema: {
    type: "object",
    properties: {
      filter: {
        type: "string",
        description: "Only list paths that match this regex",
      },
    },
    required: []
  }
}

const relativePathRegex = /^(\.\/|[a-zA-Z0-9_\-])/
const ancestorPathStepRegex = /\.\./
const catFile = ({ path }) => {
  if (!relativePathRegex.test(path)) {
    throw `Sorry, path looks like it's not from this project: "${path}"`
  }
  if (ancestorPathStepRegex.test(path)) {
    throw `Sorry, no ancestor steps allowed: "${path}"`
  }
  return child_process.execSync(
    `cat ${path}`,
    {encoding: 'utf-8'},
  )
}
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

const findTextInFiles = ({ pattern }) => child_process.execSync(
  `rg --no-heading --column --line-number --hidden -- "${pattern}" ./ || true`,
  {encoding: 'utf-8'},
)
findTextInFiles.info = {
  name: "find_text_in_files",
  description: "Find all occurrences of the target text in files under the current directory (and return 'path:line:column:match').",
  inputSchema: {
    type: "object",
    properties: {
      pattern: {
        type: "string",
        description: "Look for this text matching this regex.",
      }
    },
    required: ["pattern"],
  }
}

export default [
  findAllFiles,
  catFile,
  gitLog,
  gitShow,
  findTextInFiles,
]
