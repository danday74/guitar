import Typo from 'typo-js'

export interface ISpellCheck {
  dict: Typo
  word: string
  correct: boolean
  suggestions: string[]
}

export interface ISpellCheckLine extends ISpellCheck {
  idx: number
}
