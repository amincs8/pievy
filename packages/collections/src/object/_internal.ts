const DOT_PATH_REGEX = /^(?:\.[\p{L}\p{N}_$]+|\[\d+\])+$/u;

export function _isDotPath(path: string): boolean {
  return DOT_PATH_REGEX.test(path);
}

export function _pathToArray(path: string): PropertyKey[] {
  const result: PropertyKey[] = [];

  if (_isDotPath(path)) {
    const splited = path.replace(/\[0*(\d+)\]/g, ".$1").split(".");
    for (const value of splited) {
      if (value) {
        result.push(value);
      }
    }
  }

  return result;
}
