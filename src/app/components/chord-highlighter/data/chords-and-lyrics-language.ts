import { LanguageSupport, StreamLanguage, StringStream } from '@codemirror/language'
import { tags as t } from '@lezer/highlight'
import { completeFromList } from '@codemirror/autocomplete'
import { Extension } from '@codemirror/state'

export const ChordsAndLyricsLanguage: StreamLanguage<any> = StreamLanguage.define({
  name: 'ChordsAndLyrics',
  startState: (/* indentUnit: number */) => ({}),
  token: (stream: StringStream, state: any = {}): string => {
    if (stream.match('db')) {
      state.db = true
      return 'keyword'
    }
    if (stream.match('.')) {
      if (state.db) {
        state.db = false
        state.collection = true
        return 'keyword'
      } else if (state.collection) {
        state.collection = false
        state.where = true
        return 'keyword'
      } else if (state.where) {
        state.where = false
        state.limit = true
        return 'keyword'
      } else if (state.limit) {
        state.limit = false
        return 'keyword'
      }
    }
    if (stream.match('collection')) {
      if (state.db) {
        state.collection = true
        return 'keyword'
      }
    }
    if (stream.match('where')) {
      if (state.collection) {
        state.where = true
        return 'keyword'
      }
    }
    if (stream.match('limit')) {
      if (state.where) {
        state.limit = true
        return 'keyword'
      }
    }
    if (stream.match('get')) {
      if (state.limit) {
        state.limit = false
        return 'keyword'
      }
    }
    if (stream.match(/"(?:[^\\"]|\\.)*"/)) {
      if (state.collection) {
        return 'string'
      }
      if (state.where) {
        state.where = false
        state.whereValue = true
        return 'string'
      }
      if (state.whereValue) {
        state.whereValue = false
        return 'string'
      }
      if (stream.match('==')) {
        if (state.whereValue) {
          state.whereValue = false
          state.whereOperator = true
          return 'operator'
        }
      }
      if (stream.match(/[0-9]+/)) {
        if (state.limit) {
          return 'number'
        }
      }
    }
    stream.next()
    return null
  },
  blankLine: (/* state: {}, indentUnit: number */) => {},
  copyState: (/* state: {} */) => {},
  indent: (/* state: {}, textAfter: string, context: IndentContext */): number => 1,
  languageData: {
    commentTokens: { line: ';' }
  },
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

export const ChordsAndLyricsCompletion: Extension = ChordsAndLyricsLanguage.data.of({
  autocomplete: completeFromList([
    { label: 'db', type: 'namespace' },
    { label: 'collection', type: 'function' },
    { label: 'where', type: 'function' },
    { label: 'limit', type: 'function' },
    { label: 'get', type: 'function' }
  ])
})

export const chordsAndLyrics = (): LanguageSupport => {
  return new LanguageSupport(ChordsAndLyricsLanguage, [ChordsAndLyricsCompletion])
}
