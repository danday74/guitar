// https://stackoverflow.com/a/77744294/1205871
export const onlyIncludes = (str: string, substrings: string[]): boolean => {
  // TODO: handle empty string?
  // TODO: Ensure isChordLine is used instead wherever possible
  const words: string[] = str.trim().split(/\s+/)
  return words.every((word: string) => substrings.includes(word))
}

export const replaceAt = (str: string, idx: number, replacement: string): string => {
  // TODO: test this is not buggy
  return str.substring(0, idx) + replacement + str.substring(idx + replacement.length)
}
