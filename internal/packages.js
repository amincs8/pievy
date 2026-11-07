import { globSync } from "glob";

import { getData, getRootPath } from "./data.js";
import { filterData, filterKeys } from "./filter.js";
import { parseFile } from "./parse.js";
import { print } from "./print.js";

/**
 * Discovers package manifests matching the configured pnpm workspace globs.
 *
 * Each result includes manifest properties, a workspace-relative `path`, and
 * an absolute `rootPath`.
 *
 * @returns {object[]} Discovered workspace package records.
 * @throws {Error} If workspace metadata is missing or `workspace.packages` is not an array.
 */
export function loadPackages() {
  const result = [];
  const rootPath = getRootPath();
  const workspace = getData("workspace");

  if (!workspace || !workspace.packages || !Array.isArray(workspace.packages)) {
    throw new Error("workspace.packages must be an array");
  }

  for (const pkgPath of workspace.packages) {
    const packages = globSync(`${pkgPath}/package.json`, {
      cwd: rootPath,
      withFileTypes: true,
    });

    for (const pkg of packages) {
      result.push({
        ...parseFile(pkg.fullpath(), { type: "json" }),
        path: pkg.parentPath.replace(rootPath, ""),
        rootPath: pkg.parentPath,
      });
    }
  }

  return result;
}

const defaultKeys = [".name", ".version", ".path"];

/**
 * Loads workspace packages, applies command options, and prints the result.
 *
 * @param {object} options - Commander options for the `packages` command.
 * @param {boolean} [options.quiet] - Print only package names when true.
 * @param {string|string[]} [options.filter] - Filter expressions.
 * @param {string|string[]} [options.key] - Fields to include in the output.
 */
export function packagesCommandActions(options) {
  const { quiet, filter, key } = options;
  const packages = loadPackages();
  const filtered = filterData(packages, filter ?? "");
  const keys = quiet === true ? ".name" : (key ?? defaultKeys);

  print(filterKeys(filtered, keys));
}
