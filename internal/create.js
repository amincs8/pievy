import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { getData, getRootPath } from "./data.js";

const templatesPath = fileURLToPath(new URL("./templates/", import.meta.url));

function runCommand(rootPath, command, args) {
  const result = spawnSync(command, args, { cwd: rootPath, stdio: "inherit" });

  if (result.error) {
    throw new Error(`Failed to run ${command}: ${result.error.message}`, { cause: result.error });
  }

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} exited with status ${result.status}.`);
  }
}

function renderTemplate(sourcePath, targetPath, replacements) {
  mkdirSync(targetPath, { recursive: true });

  for (const entry of readdirSync(sourcePath, { withFileTypes: true })) {
    const sourceFile = join(sourcePath, entry.name);
    const outputName = entry.name.endsWith(".tmp") ? entry.name.slice(0, -4) : entry.name;
    const targetFile = join(targetPath, outputName);

    if (entry.isDirectory()) {
      renderTemplate(sourceFile, targetFile, replacements);
      continue;
    }

    if (!entry.isFile()) continue;

    const content = readFileSync(sourceFile, "utf8").replace(/\$\{(\w+)\}/g, (placeholder, key) => {
      if (!(key in replacements)) {
        throw new Error(`Unknown template placeholder: ${placeholder}`);
      }
      return replacements[key];
    });

    writeFileSync(targetFile, content, { flag: "wx" });
  }
}

/**
 * Creates a workspace package by rendering files from a package template.
 *
 * @param {string} name - Lowercase package name used under the `@pievy` scope.
 * @param {{ description?: string, keywords?: string[], template?: string, authorName?: string, authorEmail?: string }} options - Optional package metadata and template selection.
 * @throws {Error} If the name/template is invalid or the destination already exists.
 */
export function createCommand(name, options = {}) {
  const description = options.description ?? "";
  const templateName = options.template ?? "basic";
  const templatePath = join(templatesPath, templateName);

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
    throw new Error("Package name must use lowercase letters, numbers, and single hyphens.");
  }

  if (typeof description !== "string") {
    throw new Error("Package description must be a string.");
  }

  if (!existsSync(templatePath) || templateName !== "basic") {
    throw new Error(`Unknown package template "${templateName}". Available template: basic.`);
  }

  if (Boolean(options.authorName) !== Boolean(options.authorEmail)) {
    throw new Error("Provide both --author-name and --author-email.");
  }

  const rootPath = getRootPath();
  const targetPath = resolve(rootPath, "packages", name);
  if (existsSync(targetPath)) {
    throw new Error(`Package directory already exists: packages/${name}`);
  }

  const rootPackage = getData("packageJson");
  const authorName = options.authorName ?? rootPackage.author?.name;
  const authorEmail = options.authorEmail ?? rootPackage.author?.email;

  if (typeof authorName !== "string" || !authorName.trim()) {
    throw new Error("An author name is required in the root package or --author-name.");
  }

  if (typeof authorEmail !== "string" || !authorEmail.trim()) {
    throw new Error("An author email is required in the root package or --author-email.");
  }

  const packageName = `@pievy/${name}`;
  const keywords = options.keywords?.length ? options.keywords : ["pievy", name];
  const replacements = {
    authorJson: JSON.stringify({ email: authorEmail, name: authorName }),
    description,
    descriptionJson: JSON.stringify(description),
    keywordsJson: JSON.stringify(keywords),
    packageName,
    packageNameJson: JSON.stringify(packageName),
  };

  try {
    renderTemplate(templatePath, targetPath, replacements);
  } catch (error) {
    rmSync(targetPath, { force: true, recursive: true });
    throw error;
  }

  console.log(`Created @pievy/${name} at packages/${name}`);
  console.log("Installing package dependencies...");
  runCommand(rootPath, "pnpm", ["install", "--filter", packageName]);
  console.log("Running Oxlint...");
  runCommand(rootPath, "pnpm", ["dlx", "oxlint", `packages/${name}`]);
  console.log("Formatting package with Oxfmt...");
  runCommand(rootPath, "pnpm", ["dlx", "oxfmt", `packages/${name}`]);
}
