import { Completion, CompletionContext, CompletionResult } from '@codemirror/autocomplete'
import { Line } from '@codemirror/state'
import { getIsChordLine, toStandard } from '@utils/chord-utils'
import { TChord } from '@components/chord-highlighter/types/t-chord'
import { getChords } from '@components/chord-highlighter/data/chords'
import { CompletionHelper } from '@components/chord-highlighter/data/completion-helper'
import { chordOptions } from '@components/chord-highlighter/interfaces/i-chord-options'

const chordsEasyType: TChord[] = getChords(chordOptions.standardEasyType)

const chordLineOptions: Completion[] = chordsEasyType.map((chord: TChord): Completion => {
  const chordStandard: TChord = toStandard(chord)

  // https://codemirror.net/docs/ref/#autocomplete.Completion
  return {
    label: chord,
    displayLabel: chordStandard,
    apply: chordStandard,
    boost: CompletionHelper.getBoost(chord),
    type: CompletionHelper.getType(chord)
  }
})

// https://codemirror.net/examples/autocompletion/#providing-completions
// https://codemirror.net/docs/ref/#autocomplete.CompletionContext

export const chordsAndLyricsAutocomplete = (context: CompletionContext): CompletionResult => {

  const word: { from: number, to: number, text: string } = context.matchBefore(/\w*/)
  if (word.from === word.to && !context.explicit) return null

  const line: Line = context.state.doc.lineAt(context.pos)
  const isChordLine: boolean = getIsChordLine(line.text)

  const options: Completion[] = isChordLine ? chordLineOptions : []

  // https://codemirror.net/docs/ref/#autocomplete.CompletionResult
  return {
    from: word.from,
    validFor: /[a-gA-G]#?[a-zA-Z0-9]*/,
    options
  }
}
