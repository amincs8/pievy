#! /usr/bin/env node

import { Command, Option } from "commander";

import { cleanCommand } from "./internal/clean.js";
import { createCommand } from "./internal/create.js";
import { loadData, setRootPath } from "./internal/data.js";
import { inspectPackageCommand } from "./internal/inspect.js";
import { overviewCommand } from "./internal/overview.js";
import { packagesCommandActions } from "./internal/packages.js";

// Load required data
const PACKAGE_ROOT = process.cwd();

setRootPath(PACKAGE_ROOT);
loadData();

// Program configuration
const program = new Command();
program.helpOption(false);

program
  .name("craft")
  .usage("[command] [options]")
  .description("Manage the Pievy ecosystem and development workflows.");

// packages
const keyOp = new Option("-k, --key <key>", "Show keys");
const filterOp = new Option("-f, --filter <filter>", "Filter packages");

keyOp.variadic = true;
filterOp.variadic = true;
program
  .command("packages")
  .description("List all available packages in the Pievy ecosystem")
  .addOption(keyOp)
  .addOption(filterOp)
  .addOption(new Option("-q, --quiet", "Show only package names"))
  .helpOption("-h, --help")
  .helpCommand(true)
  .action(packagesCommandActions);

// inspect
program
  .command("inspect <package>")
  .description("Show details about a workspace package")
  .addOption(new Option("-d, --dependencies", "Show all dependency groups"))
  .addOption(new Option("-s, --scripts", "Show package scripts"))
  .addOption(new Option("-j, --json", "Output the full package manifest as JSON"))
  .helpOption("-h, --help")
  .helpCommand(true)
  .action(inspectPackageCommand);

// overview
program
  .command("overview")
  .description("Summarize the repository and its workspace packages")
  .addOption(new Option("-p, --packages", "Show package descriptions and paths"))
  .addOption(new Option("-s, --scripts", "Show root package scripts"))
  .addOption(new Option("-j, --json", "Output the repository summary as JSON"))
  .helpOption("-h, --help")
  .helpCommand(true)
  .action(overviewCommand);

// create
program
  .command("create <name>")
  .description("Create a workspace package from the basic template")
  .addOption(new Option("-d, --description <description>", "Set the package description"))
  .addOption(new Option("-k, --keywords <keywords...>", "Set package keywords"))
  .addOption(
    new Option("-t, --template <template>", "Select a package template")
      .default("basic")
      .choices(["basic"]),
  )
  .addOption(new Option("--author-name <name>", "Set the package author's name"))
  .addOption(new Option("--author-email <email>", "Set the package author's email"))
  .helpOption("-h, --help")
  .helpCommand(true)
  .action(createCommand);

// clean
program
  .command("clean [package]")
  .description("Remove generated build and test outputs")
  .addOption(new Option("--dry-run", "List generated outputs without removing them"))
  .helpOption("-h, --help")
  .helpCommand(true)
  .action(cleanCommand);

program.parse(process.argv);
