import { search } from "./search.js";
import { runCommand } from "./run_command.js";
import { listDirectory } from "./list_directory.js";

import { getWorkspaceInfo } from "./get_workspace_info.js";
import { writeFile } from "./write_file.js";
import { readFile } from "./read_file.js";
import { editFile } from "./edit_file.js";
import { createDirectory } from "./create_directory.js";
import { deleteFile } from "./delete_file.js";
import { deleteDirectory } from "./delete_directory.js";

export const tools = {
  run_command: runCommand,
  search: search,
  list_directory: listDirectory,

  get_workspace_info: getWorkspaceInfo,
  get_workspace: getWorkspaceInfo,

  write_file: writeFile,
  read_file: readFile,
  edit_file: editFile,

  create_directory: createDirectory,
  delete_file: deleteFile,
  delete_directory: deleteDirectory
};
