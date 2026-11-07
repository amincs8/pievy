import { loadPackages } from "./packages.js";

const dependencyGroups = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies",
];

function printEntries(title, value) {
  const entries = Object.entries(value ?? {});

  console.log(`\n${title}:`);
  if (entries.length === 0) {
    console.log("  none");
    return;
  }

  for (const [name, version] of entries) {
    console.log(`  ${name}: ${version}`);
  }
}

/**
 * Prints details about a workspace package.
 *
 * @param {string} packageIdentifier - Exact package name or workspace-relative package path.
 * @param {{ dependencies?: boolean, scripts?: boolean, json?: boolean }} options - Output options.
 * @throws {Error} If no workspace package matches the identifier.
 */
export function inspectPackageCommand(packageIdentifier, options) {
  const packages = loadPackages();
  const pkg = packages.find(
    ({ name, path }) => name === packageIdentifier || path === packageIdentifier,
  );

  if (!pkg) {
    throw new Error(`Package "${packageIdentifier}" was not found in the workspace.`);
  }

  const manifest = { ...pkg };
  delete manifest.rootPath;
  if (options.json) {
    console.log(JSON.stringify(manifest, null, 2));
    return;
  }

  console.log(`${pkg.name ?? packageIdentifier}${pkg.version ? `@${pkg.version}` : ""}`);
  if (pkg.description) console.log(pkg.description);
  if (pkg.path) console.log(`Path: ${pkg.path}`);
  if (pkg.license) console.log(`License: ${pkg.license}`);

  if (options.dependencies) {
    for (const group of dependencyGroups) {
      printEntries(group, pkg[group]);
    }
  }

  if (options.scripts) {
    printEntries("Scripts", pkg.scripts);
  }
}
