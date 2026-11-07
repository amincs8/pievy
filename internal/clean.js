import { existsSync, readdirSync, rmSync } from "node:fs";
import { isAbsolute, relative, resolve, sep } from "node:path";

import { getRootPath } from "./data.js";
import { loadPackages } from "./packages.js";

const generatedOutputs = [
  "dist",
  "dist-ssr",
  "build",
  "out",
  "coverage",
  ".turbo",
  ".vitest",
  ".oxlintcache",
];

function isWithinRoot(rootPath, targetPath) {
  const relativePath = relative(rootPath, targetPath);
  return (
    relativePath === "" ||
    (!isAbsolute(relativePath) && relativePath !== ".." && !relativePath.startsWith(`..${sep}`))
  );
}

function findGeneratedOutputs(directory) {
  const targets = generatedOutputs.map((name) => resolve(directory, name));

  if (existsSync(directory)) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith(".tsbuildinfo")) {
        targets.push(resolve(directory, entry.name));
      }
    }
  }

  return targets.filter(existsSync);
}

/**
 * Removes generated build and test artifacts from the workspace or one package.
 * Installed dependencies and source files are never removed.
 *
 * @param {string} [packageIdentifier] - Exact package name or workspace-relative package path.
 * @param {{ dryRun?: boolean }} options - Clean command options.
 * @throws {Error} If the package identifier does not match a workspace package.
 */
export function cleanCommand(packageIdentifier, options) {
  const rootPath = resolve(getRootPath());
  const packages = loadPackages();
  const selectedPackages = packageIdentifier
    ? packages.filter(({ name, path }) => name === packageIdentifier || path === packageIdentifier)
    : packages;

  if (packageIdentifier && selectedPackages.length === 0) {
    throw new Error(`Package "${packageIdentifier}" was not found in the workspace.`);
  }

  const directories = packageIdentifier
    ? selectedPackages.map(({ rootPath: packageRoot }) => packageRoot)
    : [rootPath, ...selectedPackages.map(({ rootPath: packageRoot }) => packageRoot)];
  const targets = [...new Set(directories.flatMap(findGeneratedOutputs))].filter((target) =>
    isWithinRoot(rootPath, target),
  );

  if (targets.length === 0) {
    console.log("No generated outputs found.");
    return;
  }

  for (const target of targets) {
    if (!options.dryRun) {
      rmSync(target, { force: true, recursive: true });
    }
    console.log(`${options.dryRun ? "Would remove" : "Removed"}: ${relative(rootPath, target)}`);
  }
}
