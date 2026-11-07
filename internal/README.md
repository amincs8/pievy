# Internal modules

These modules implement the `craft` CLI's workspace package listing workflow. They are implementation details, not a separately supported public API.

## Workflow

1. `data.js` stores the repository root, reads root package and pnpm workspace metadata, and makes the parsed data available to other modules.
2. `packages.js` expands the workspace package globs and reads each package manifest.
3. `filter.js` applies filter expressions and selects output fields.
4. `print.js` turns the selected records into a terminal table.

`parse.js` provides the shared synchronous JSON/YAML file reader.

## Modules

- `data.js`: `setRootPath`, `getRootPath`, `loadData`, and `getData` manage the root metadata and its cache.
- `parse.js`: `parseFile(path, { type })` parses JSON by default or YAML when `type` is `"yaml"`.
- `packages.js`: `loadPackages()` discovers package manifests; `packagesCommandActions(options)` handles the `craft packages` command.
- `filter.js`: `filterData(data, filters)` filters records; `filterKeys(data, keys)` projects and optionally renames fields. `getValue`, `pathToArray`, and `isDotPath` support path lookup.
- `print.js`: `toTableData(data)` builds the table matrix; `print(data)` writes it to stdout.

## Filter expressions

A filter contains a property path, one operator, and a comparison value. Supported operators are `=`, `!=`, `~`, `>`, `<`, `>=`, and `<=`.

```text
.name=@pievy/types
.version>=1.0.0
.name~types
```

Pass multiple expressions to require every expression to match. An operator preceded by a backslash is not treated as an operator; for example, `name\!=1` is rejected because it has no unescaped operator.

## Field selection

Field paths use dot/index notation. Prefix named properties with a dot and use brackets for array indexes. Add `->` and an alias to rename an output column:

```text
.name
.dependencies[0]
.name->Package
```

Missing or nullish selected values are printed as `-`. The packages command defaults to `.name`, `.version`, and `.path`; quiet mode selects only `.name`.
