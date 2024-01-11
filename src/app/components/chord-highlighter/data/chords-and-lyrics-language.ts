import { LanguageSupport, StreamLanguage, StringStream } from '@codemirror/language'
import { tags } from '@lezer/highlight'
import { cloneDeep, noop } from 'lodash-es'
import { getChordsRegex } from '@components/chord-highlighter/data/chords'
import { getIsChordLine } from '@utils/chord-utils'
import { chordsAndLyricsAutocomplete } from '@components/chord-highlighter/data/chords-and-lyrics-autocomplete'
import { chordOptions } from '@components/chord-highlighter/interfaces/i-chord-options'

interface IState {}

const initialState: IState = {}

// https://codemirror.net/docs/ref/#language.StreamParser
// https://stackoverflow.com/questions/75191956/how-to-properly-define-a-codemirror-language

const chordsAndLyricsLanguage: StreamLanguage<IState> = StreamLanguage.define({

  // A name for this language
  name: 'chordsAndLyrics',

  // Produce a start state for the parser
  startState: (/* indentUnit: number */): IState => cloneDeep(initialState),

  // Read one token, advancing the stream past it, and returning a string indicating the token's style tag
  // either the name of one of the tags in tags or tokenTable, or such a name suffixed by one or more tag modifier names, separated by periods
  // For example "keyword" or "variableName.constant", or a space-separated set of such token types
  // It is okay to return a zero-length token, but only if that updates the state so that the next call will return a non-empty token again
  token: (stream: StringStream, state: IState = cloneDeep(initialState)): string => {
    noop(state)

    const isChordLine: boolean = getIsChordLine(stream.string)

    if (isChordLine) {
      const regex: RegExp = getChordsRegex(chordOptions.standardAll)
      // https://codemirror.net/docs/ref/#language.StringStream.match
      const match: boolean | RegExpMatchArray = stream.match(regex)
      if (match) return 'chord'
    }

    stream.next()
    return null
  },

  // This notifies the parser of a blank line in the input. It can update its state here if it needs to
  blankLine: (/* state: IState, indentUnit: number */) => {},

  // Copy a given state. By default, a shallow object copy is done which also copies arrays held at the top level of the object
  copyState: (state: IState): IState => cloneDeep(state),

  // Compute automatic indentation for the line that starts with the given state and text
  indent: (/* state: IState, textAfter: string, context: IndentContext */): number => 0,

  // Default language data to attach to this language
  languageData: {
    autocomplete: chordsAndLyricsAutocomplete
  },

  // Extra tokens to use in this parser. When the tokenizer returns a token name that exists as a property in this object,
  // the corresponding tags will be assigned to the token
  tokenTable: {
    chord: tags.keyword
  }
})

export const chordsAndLyrics = (): LanguageSupport => {
  return new LanguageSupport(chordsAndLyricsLanguage)
}
