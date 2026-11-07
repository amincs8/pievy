#! /usr/bin/env node

import { Command, Option } from "commander";

import { loadData, setRootPath } from "./internal/data.js";
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
  .addHelpOption()
  .action(packagesCommandActions);

program.parse(process.argv);
