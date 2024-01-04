import { replaceAt } from './string-utils'
import { TChord } from '@components/chord-highlighter/types/t-chord'

export const toStandard = (chord: TChord): TChord => {
  if (chord.length > 1) {
    if (chord[1] === '#') chord = replaceAt(chord, 1, '♯') as TChord
    if (chord[1] === 'b') chord = replaceAt(chord, 1, '♭') as TChord
  }
  return chord
}
