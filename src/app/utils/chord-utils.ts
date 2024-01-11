import { onlyIncludes, replaceAt } from './string-utils'
import { TChord } from '@components/chord-highlighter/types/t-chord'
import { chords } from '@components/chord-highlighter/data/chords'

export const toStandard = (chord: TChord): TChord => {
  if (chord.length > 1) {
    if (chord[1] === '#') chord = replaceAt(chord, 1, '♯') as TChord
    if (chord[1].toLowerCase() === 'b') chord = replaceAt(chord, 1, '♭') as TChord
  }
  return chords.standard.find((chordStandard: TChord): boolean => chordStandard.toLowerCase() === chord.toLowerCase())
}

export const getIsChordLine = (line: string): boolean => {
  return onlyIncludes(line.toLowerCase(), chords.lowerAll)
}
