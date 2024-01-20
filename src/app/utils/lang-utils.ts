import Typo from 'typo-js'
import { dictEn } from '@utils/dicts'
import { ISpellCheck, ISpellCheckLine } from '@interfaces/i-spell-check'

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument
const segmenter: Intl.Segmenter = new Intl.Segmenter([], { granularity: 'word' })

const getSegments = (str: string): Intl.SegmentData[] => {
  const segments: Intl.Segments = segmenter.segment(str)
  return [...segments]
    .filter((s: Intl.SegmentData) => s.isWordLike)
}

const spellCheck = (word: string): ISpellCheck => {
  const dict: Typo = dictEn // TODO: Support switch dicts
  return {
    dict,
    word,
    correct: dict.check(word),
    suggestions: dict.suggest(word, 5)
  }
}

export const spellCheckLine = (str: string): ISpellCheckLine[] => {

  const segments: Intl.SegmentData[] = getSegments(str)

  return segments
    .map((s: Intl.SegmentData): ISpellCheckLine => {
      const sc: ISpellCheck = spellCheck(s.segment)
      return { ...sc, idx: s.index }
    })
    .filter((sc: ISpellCheckLine) => !sc.correct)
}
