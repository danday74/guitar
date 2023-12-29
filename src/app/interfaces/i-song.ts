import { ILyricsChords } from './i-lyrics-chords'

export interface ISong {
  verses: ILyricsChords
  choruses: ILyricsChords
  bridges: ILyricsChords
}
