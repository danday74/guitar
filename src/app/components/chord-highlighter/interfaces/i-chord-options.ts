import { TChordCase } from '@components/chord-highlighter/types/t-chord-case'
import { TSharpsFlats } from '@components/chord-highlighter/types/t-sharps-flats'

export interface IChordOptions {
  case: TChordCase
  sharps: TSharpsFlats
  flats: TSharpsFlats
}

export const chordOptions: { [key in 'all' | 'standard' | 'lowerAll' | 'standardAll' | 'standardEasyType']: IChordOptions } = {
  all: Object.freeze({ case: 'all', sharps: 'all', flats: 'all' }),
  standard: Object.freeze({ case: 'standard', sharps: 'standard', flats: 'standard' }),
  lowerAll: Object.freeze({ case: 'lower', sharps: 'all', flats: 'all' }),
  standardAll: Object.freeze({ case: 'standard', sharps: 'all', flats: 'all' }),
  standardEasyType: Object.freeze({ case: 'standard', sharps: 'easyType', flats: 'easyType' })
}
