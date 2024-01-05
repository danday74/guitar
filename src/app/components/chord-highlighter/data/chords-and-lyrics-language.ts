import { LanguageSupport, StreamLanguage, StringStream } from '@codemirror/language'
import { tags as t } from '@lezer/highlight'
import { Completion, CompletionContext, CompletionResult } from '@codemirror/autocomplete'
import { Line } from '@codemirror/state'
import { cloneDeep, noop } from 'lodash-es'
import { getChords, getChordsRegex } from '@components/chord-highlighter/data/chords'
import { TChord } from '@components/chord-highlighter/types/t-chord'
import { getIsChordLine, toStandard } from '@utils/chord-utils'

interface IState {
  db: boolean
  collection: boolean
  where: boolean
  limit: boolean
  whereValue: boolean
  whereOperator: boolean
}

const initialState: IState = {
  db: false,
  collection: false,
  where: false,
  limit: false,
  whereValue: false,
  whereOperator: false
}

// https://codemirror.net/examples/autocompletion/#providing-completions
// https://codemirror.net/docs/ref/#autocomplete.CompletionContext
const autocomplete = (context: CompletionContext): CompletionResult => {
  const word = context.matchBefore(/\w*/)
  if (word.from == word.to && !context.explicit) return null

  console.log('word.from', word.from)
  console.log('word.to', word.to)
  console.log('word.text', word.text)
  console.log('context', context)

  const line: Line = context.state.doc.lineAt(context.pos)
  const isChordLine: boolean = getIsChordLine(line.text)

  let options: Completion[]

  if (isChordLine) {
    const chordsEasyType: TChord[] = getChords({ caseInsensitive: false, flats: 'easyType', sharps: 'easyType' })

    options = chordsEasyType.map((chord: TChord): Completion => {
      const standardChord: TChord = toStandard(chord)
      return {
        label: chord,
        displayLabel: standardChord,
        apply: standardChord,
        boost: CompletionHelper.getBoost(chord),
        type: CompletionHelper.getType(chord)
      }
    })
  } else {
    options = []
  }

  // https://codemirror.net/docs/ref/#autocomplete.Completion

  // https://codemirror.net/docs/ref/#autocomplete.CompletionResult
  return {
    from: word.from,
    validFor: /[a-gA-G][#b]?[a-zA-Z0-9]*/,
    options
  }
}

// https://codemirror.net/docs/ref/#language.StreamParser
// https://stackoverflow.com/questions/75191956/how-to-properly-define-a-codemirror-language

export const ChordsAndLyricsLanguage: StreamLanguage<IState> = StreamLanguage.define({
  // A name for this language
  name: 'ChordsAndLyrics',

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
      const regex: RegExp = getChordsRegex()
      const match = stream.match(regex)
      console.log('token match', match, !!match)
      if (match) return 'keyword'
    }

    // if (stream.match('db')) {
    //   state.db = true
    //   return 'keyword'
    // }


    // if (stream.match('db')) {
    //   state.db = true
    //   return 'keyword'
    // }
    // if (stream.match('.')) {
    //   if (state.db) {
    //     state.db = false
    //     state.collection = true
    //     return 'keyword'
    //   } else if (state.collection) {
    //     state.collection = false
    //     state.where = true
    //     return 'keyword'
    //   } else if (state.where) {
    //     state.where = false
    //     state.limit = true
    //     return 'keyword'
    //   } else if (state.limit) {
    //     state.limit = false
    //     return 'keyword'
    //   }
    // }
    // if (stream.match('collection')) {
    //   if (state.db) {
    //     state.collection = true
    //     return 'keyword'
    //   }
    // }
    // if (stream.match('where')) {
    //   if (state.collection) {
    //     state.where = true
    //     return 'keyword'
    //   }
    // }
    // if (stream.match('limit')) {
    //   if (state.where) {
    //     state.limit = true
    //     return 'keyword'
    //   }
    // }
    // if (stream.match('get')) {
    //   if (state.limit) {
    //     state.limit = false
    //     return 'keyword'
    //   }
    // }
    // if (stream.match(/"(?:[^\\"]|\\.)*"/)) {
    //   if (state.collection) {
    //     return 'string'
    //   }
    //   if (state.where) {
    //     state.where = false
    //     state.whereValue = true
    //     return 'string'
    //   }
    //   if (state.whereValue) {
    //     state.whereValue = false
    //     return 'string'
    //   }
    //   if (stream.match('==')) {
    //     if (state.whereValue) {
    //       state.whereValue = false
    //       state.whereOperator = true
    //       return 'operator'
    //     }
    //   }
    //   if (stream.match(/[0-9]+/)) {
    //     if (state.limit) {
    //       return 'number'
    //     }
    //   }
    // }
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
    commentTokens: { line: ';' },
    autocomplete
  },

  // Extra tokens to use in this parser. When the tokenizer returns a token name that exists as a property in this object,
  // the corresponding tags will be assigned to the token
  tokenTable: {
    db: t.keyword,
    dot: t.punctuation,
    collection: t.keyword,
    get: t.keyword,
    lParen: t.punctuation,
    rParen: t.punctuation,
    string: t.string
  }
})

class CompletionHelper {
  static getBoost(chord: TChord): number {
    if (chord.length > 1) {
      if (chord[1] === '♯') return 4
      if (chord[1] === '#') return 3
      if (chord[1] === '♭') return 2
      if (chord[1] === 'b') return 1
    }
    return 5
  }

  static getType(chord: TChord): 'chord' | 'chord-sharp' | 'chord-flat' {
    if (chord.length > 1) {
      if (chord[1] === '♯') return 'chord-sharp'
      if (chord[1] === '#') return 'chord-sharp'
      if (chord[1] === '♭') return 'chord-flat'
      if (chord[1] === 'b') return 'chord-flat'
    }
    return 'chord'
  }
}

export const chordsAndLyrics = (): LanguageSupport => {
  return new LanguageSupport(ChordsAndLyricsLanguage)
}
