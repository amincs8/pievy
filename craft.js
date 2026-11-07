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
