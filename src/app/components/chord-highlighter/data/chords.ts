import { memoize } from 'lodash-es'
import { IChordOptions } from '@components/chord-highlighter/interfaces/i-chord-options'
import { TChord } from '@components/chord-highlighter/types/t-chord'
import { TNote } from '@components/chord-highlighter/types/t-note'
import { TVariation } from '@components/chord-highlighter/types/t-variation'

const notes: TNote[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

const notesSharpsStandard: TNote[] = ['A♯', 'C♯', 'D♯', 'F♯', 'G♯']
const notesSharpsEasyType: TNote[] = notesSharpsStandard.map((note: string) => note.replace('♯', '#') as TNote)
const notesFlatsStandard: TNote[] = ['A♭', 'B♭', 'D♭', 'E♭', 'G♭']
const notesFlatsEasyType: TNote[] = notesFlatsStandard.map((note: string) => note.replace('♭', 'b') as TNote)

const variations: TVariation[] = ['', 'm', 'm7', 'sus4']

const getMyChords = (options: IChordOptions): TChord[] => {
  let myNotes: TNote[] = [...notes]
  if (options.sharps === 'all' || options.sharps === 'standard') myNotes = [...myNotes, ...notesSharpsStandard]
  if (options.sharps === 'all' || options.sharps === 'easyType') myNotes = [...myNotes, ...notesSharpsEasyType]
  if (options.flats === 'all' || options.flats === 'standard') myNotes = [...myNotes, ...notesFlatsStandard]
  if (options.flats === 'all' || options.flats === 'easyType') myNotes = [...myNotes, ...notesFlatsEasyType]

  // TODO: Does this support a lowercase uppercase mix - dSuS4 - or all uppercase - DSUS4?
  // TODO: Do we need case?
  return myNotes.reduce((acc: TChord[], note: TNote) => {
    const chords: TChord[] = variations.map((vary: TVariation): TChord => `${note}${vary}`)

    if (options.case === 'all' || options.case === 'standard') {
      acc = [...acc, ...chords]
    }

    if (options.case === 'all' || options.case === 'lower') {
      const lowerCaseChords: TChord[] = chords.map((chord: TChord) => chord.toLowerCase() as TChord)
      acc = [...acc, ...lowerCaseChords]
    }
    return acc
  }, [])
}

// TODO: Does memoize work for all functions below?
export const getChords = memoize(
  (options: IChordOptions): TChord[] => {
    return getMyChords(options)
  }, JSON.stringify
)

// TODO: Should regex start with ^
export const getChordsRegex = memoize(
  (options: IChordOptions): RegExp => {
    const chords: TChord[] = getChords(options)
    const strRegex: string = chords.sort((c1: TChord, c2: TChord): number => c2.length - c1.length).join('|')
    return new RegExp('^' + strRegex, 'i')
  }, JSON.stringify
)

export const getChordType = memoize(
  (options: IChordOptions): string => {
    const chords: TChord[] = getChords(options)
    const quotedChords: string[] = chords.map((chord: TChord): string => `'${chord}'`)
    return quotedChords.join(' | ')
  }, JSON.stringify
)
