#! /usr/bin/env node

import { Command, Option } from "commander";

import { cleanCommand } from "./internal/clean.js";
import { loadData, setRootPath } from "./internal/data.js";
import { inspectPackageCommand } from "./internal/inspect.js";
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
  .helpCommand(true)
  .action(packagesCommandActions);

// inspect
program
  .command("inspect <package>")
  .description("Show details about a workspace package")
  .addOption(new Option("-d, --dependencies", "Show all dependency groups"))
  .addOption(new Option("-s, --scripts", "Show package scripts"))
  .addOption(new Option("-j, --json", "Output the full package manifest as JSON"))
  .helpCommand(true)
  .action(inspectPackageCommand);

// clean
program
  .command("clean [package]")
  .description("Remove generated build and test outputs")
  .addOption(new Option("--dry-run", "List generated outputs without removing them"))
  .helpCommand(true)
  .action(cleanCommand);

program.parse(process.argv);
