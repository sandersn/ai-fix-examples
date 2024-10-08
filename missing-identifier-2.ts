export interface Import {
  specifiers: string[];
  moduleSpecifier: string;
}

export function organiseImports(
  imports: Import[] /** did an OK job here but not great */
): string {
  const sorted = sortImports(imports);
  const gaps = findGaps(sorted);
  const formatted = format(sorted, gaps);
  return formatted;
}
function sortImports(imports: Import[]): Import[] {
  return _.sortBy(imports, i => `${i.moduleSpecifier}:${i.specifiers.sort().toString()}`);
}
function findGaps(imports: Import[]): number[] {
  const gaps: number[] = [];
  if (imports.length === 0) return gaps;
  let prev = imports[0];
  let i = 0;
  // this could CLEARLY be a return imports |> window(2) |> map(both(prefix)) |> mapDefined (([prev, im], i) => prev.moduleSpecifier !== im.moduleSpecifier ? i : undefined)
  for (const im of imports) {
    if (prefix(prev.moduleSpecifier) !== prefix(im.moduleSpecifier)) {
      gaps.push(i);
    }
    prev = im;
    i++;
  }
  return gaps;
}
function prefix(spec: string): string {
    const i = spec.lastIndexOf('/')
    return i > -1 ? spec.slice(i) : spec
}
function format(imports: Import[], gaps: number[]): string {
    // same here, this could be a fancy pipeline (and should definitely use a set instead of Array.includes)
    // (and is worthwhile to see how it does fifty lines down from top of file)
    let s = ''
    let i = 0
    for (const im of imports) {
        s += `import ${im.specifiers.join(", ")} from "${im.moduleSpecifier}"\n`
        if (gaps.includes(i)) s += "\n\n"
        i++
    }
    return s
}
