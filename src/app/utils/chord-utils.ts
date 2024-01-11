import { onlyIncludes, replaceAt } from './string-utils'
import { TChord } from '@components/chord-highlighter/types/t-chord'
import { getChords } from '@components/chord-highlighter/data/chords'
import { chordOptions } from '@components/chord-highlighter/interfaces/i-chord-options'

export const toStandard = (chord: TChord): TChord => {
  if (chord.length > 1) {
    if (chord[1] === '#') chord = replaceAt(chord, 1, '♯') as TChord
    if (chord[1].toLowerCase() === 'b') chord = replaceAt(chord, 1, '♭') as TChord
  }
  const chordsStandard: TChord[] = getChords(chordOptions.standard)
  return chordsStandard.find((chordStandard: TChord): boolean => chordStandard.toLowerCase() === chord.toLowerCase())
}

export const getIsChordLine = (line: string): boolean => {
  const chords: TChord[] = getChords(chordOptions.lowerAll)
  return onlyIncludes(line.toLowerCase(), chords)
}
