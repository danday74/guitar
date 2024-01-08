import { TChord } from '@components/chord-highlighter/types/t-chord'
import { TChordType } from '@components/chord-highlighter/types/t-chord-type'

export class CompletionHelper {

  static getBoost(chord: TChord): number {
    if (chord.length > 1) {
      if (chord[1] === '♯') return 4
      if (chord[1] === '#') return 3
      if (chord[1] === '♭') return 2
      if (chord[1].toLowerCase() === 'b') return 1
    }
    return 5
  }

  static getType(chord: TChord): TChordType {
    if (chord.length > 1) {
      if (chord[1] === '♯') return 'chord-sharp'
      if (chord[1] === '#') return 'chord-sharp'
      if (chord[1] === '♭') return 'chord-flat'
      if (chord[1].toLowerCase() === 'b') return 'chord-flat'
    }
    return 'chord'
  }
}
