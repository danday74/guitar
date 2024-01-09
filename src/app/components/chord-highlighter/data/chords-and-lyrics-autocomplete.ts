import { Completion, CompletionContext, CompletionResult } from '@codemirror/autocomplete'
import { Line } from '@codemirror/state'
import { getIsChordLine, toStandard } from '@utils/chord-utils'
import { TChord } from '@components/chord-highlighter/types/t-chord'
import { getChords } from '@components/chord-highlighter/data/chords'
import { CompletionHelper } from '@components/chord-highlighter/data/completion-helper'

// https://codemirror.net/examples/autocompletion/#providing-completions
// https://codemirror.net/docs/ref/#autocomplete.CompletionContext

export const chordsAndLyricsAutocomplete = (context: CompletionContext): CompletionResult => {
  const word = context.matchBefore(/\w*/)
  if (word.from == word.to && !context.explicit) return null

  const line: Line = context.state.doc.lineAt(context.pos)
  const isChordLine: boolean = getIsChordLine(line.text)

  let options: Completion[]

  if (isChordLine) {
    const chordsEasyType: TChord[] = getChords({ case: 'standard', sharps: 'easyType', flats: 'easyType' })

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
