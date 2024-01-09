import { TSharpsFlats } from '@components/chord-highlighter/types/t-sharps-flats'

export interface IChordOptions {
  caseInsensitive: boolean
  sharps: TSharpsFlats
  flats: TSharpsFlats
}

export const defaultChordOptions: IChordOptions = Object.freeze({ caseInsensitive: true, sharps: 'all', flats: 'all' })
