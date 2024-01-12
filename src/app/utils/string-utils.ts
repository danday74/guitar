// https://stackoverflow.com/a/77744294/1205871
export const onlyIncludes = (str: string, substrings: string[]): boolean => {
  const words: string[] = str.trim().split(/\s+/)
  return words.every((word: string) => substrings.includes(word))
}

export const replaceAt = (str: string, idx: number, replacement: string): string => {
  if (idx > str.length) return str
  return str.substring(0, idx) + replacement + str.substring(idx + replacement.length)
}
