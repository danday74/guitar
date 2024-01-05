import { memoize } from 'lodash-es'
import { IChordOptions } from '@components/chord-highlighter/interfaces/i-chord-options'
import { IChordsAndRegex } from '@components/chord-highlighter/interfaces/i-chords-and-regex'
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
  if (options.sharps === true || options.sharps === 'standard') myNotes = [...myNotes, ...notesSharpsStandard]
  if (options.sharps === true || options.sharps === 'easyType') myNotes = [...myNotes, ...notesSharpsEasyType]
  if (options.flats === true || options.flats === 'standard') myNotes = [...myNotes, ...notesFlatsStandard]
  if (options.flats === true || options.flats === 'easyType') myNotes = [...myNotes, ...notesFlatsEasyType]

  // TODO: Does this support a lowercase uppercase mix - dSuS4 - or all uppercase - DSUS4?
  // TODO: Do we need caseInsensitive?
  return myNotes.reduce((acc: TChord[], note: TNote) => {
    const chords: TChord[] = variations.map((vary: TVariation): TChord => `${note}${vary}`)
    acc = [...acc, ...chords]
    if (options.caseInsensitive) {
      const lowerCaseChords: TChord[] = chords.map((chord: TChord) => chord.toLowerCase() as TChord)
      acc = [...acc, ...lowerCaseChords]
    }
    return acc
  }, [])
}

const defaultChordOptions: IChordOptions = { caseInsensitive: true, sharps: true, flats: true }

// TODO: Does memoize work for all functions below?
export const getChords = memoize(
  (options: IChordOptions = defaultChordOptions): TChord[] => {
    return getMyChords(options)
  }, JSON.stringify
)

// TODO: Should regex start with ^
export const getChordsRegex = memoize(
  (options: IChordOptions = defaultChordOptions): RegExp => {
    const chords: TChord[] = getChords(options)
    const strRegex: string = chords.sort((c1: TChord, c2: TChord): number => c2.length - c1.length).join('|')
    return new RegExp('^' + strRegex)
  }, JSON.stringify
)

// TODO: Delete function and interface and use isChordLine instead
export const getChordsAndRegex = memoize(
  (options: IChordOptions = defaultChordOptions): IChordsAndRegex => ({
    chords: getChords(options),
    regex: getChordsRegex(options)
  }), JSON.stringify
)

export const getChordType = memoize(
  (options: IChordOptions = defaultChordOptions): string => {
    const chords: TChord[] = getChords(options)
    const quotedChords: string[] = chords.map((chord: TChord): string => `'${chord}'`)
    return quotedChords.join(' | ')
  }, JSON.stringify
)
