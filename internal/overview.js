import { getData, getRootPath } from "./data.js";
import { loadPackages } from "./packages.js";

/**
 * Summarizes the repository manifest and workspace packages.
 *
 * @param {{ packages?: boolean, scripts?: boolean, json?: boolean }} options - Output options.
 */
export function overviewCommand(options) {
  const rootPackage = getData("packageJson");
  const workspace = getData("workspace");
  const packages = loadPackages().map(({ name, version, description, path }) => ({
    description,
    name,
    path,
    version,
  }));

  const summary = {
    description: rootPackage.description,
    license: rootPackage.license,
    name: rootPackage.name,
    packageCount: packages.length,
    packageManager: rootPackage.packageManager,
    packages,
    private: rootPackage.private ?? false,
    rootPath: getRootPath(),
    scripts: rootPackage.scripts ?? {},
    workspacePatterns: workspace.packages ?? [],
  };

  if (options.json) {
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  console.log(summary.name ?? "Repository");
  if (summary.description) console.log(summary.description);
  console.log(`Root: ${summary.rootPath}`);
  if (summary.license) console.log(`License: ${summary.license}`);
  if (summary.packageManager) console.log(`Package manager: ${summary.packageManager}`);
  console.log(`Workspace patterns: ${summary.workspacePatterns.join(", ") || "none"}`);
  console.log(`Packages: ${summary.packageCount}`);

  if (packages.length > 0) {
    for (const pkg of packages) {
      const version = pkg.version ? `@${pkg.version}` : "";
      const details = options.packages && pkg.description ? ` - ${pkg.description}` : "";
      const path = options.packages && pkg.path ? ` (${pkg.path})` : "";
      console.log(`  ${pkg.name ?? "(unnamed)"}${version}${path}${details}`);
    }
  }

  if (options.scripts) {
    console.log("\nRoot scripts:");
    const scripts = Object.entries(summary.scripts);
    if (scripts.length === 0) {
      console.log("  none");
    } else {
      for (const [name, command] of scripts) {
        console.log(`  ${name}: ${command}`);
      }
    }
  }
}
