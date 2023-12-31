import { onlyIncludes, replaceAt } from './string-utils'
import { TChord } from '@components/chord-highlighter/types/t-chord'
import { getChords } from '@components/chord-highlighter/data/chords'
import { defaultChordOptions, IChordOptions } from '@components/chord-highlighter/interfaces/i-chord-options'

export const toStandard = (chord: TChord): TChord => {
  if (chord.length > 1) {
    if (chord[1] === '#') chord = replaceAt(chord, 1, '♯') as TChord
    if (chord[1] === 'b') chord = replaceAt(chord, 1, '♭') as TChord
  }
  return chord
}

export const getIsChordLine = (line: string, options: IChordOptions = defaultChordOptions): boolean => {
  const chords: TChord[] = getChords(options)
  return onlyIncludes(line, chords)
}
