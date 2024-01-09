import { TSharpsFlats } from '@components/chord-highlighter/types/t-sharps-flats'
import { TChordCase } from '@components/chord-highlighter/types/t-chord-case'

export interface IChordOptions {
  case: TChordCase
  sharps: TSharpsFlats
  flats: TSharpsFlats
}

export const defaultChordOptions: IChordOptions = Object.freeze({ case: 'all', sharps: 'all', flats: 'all' })
