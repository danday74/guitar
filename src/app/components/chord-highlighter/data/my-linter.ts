import { Diagnostic, linter } from '@codemirror/lint'
import { ChangeSpec, Line, Text } from '@codemirror/state'
import { TLineType } from '@ttypes/t-line-type'
import { getChordCount, getIsChordLine, getLineType } from '@utils/chord-utils'
import { get } from 'lodash-es'
import { EditorView } from '@codemirror/view'
import { ILineType } from '@components/chord-highlighter/interfaces/i-line-type'
import { ISpellCheckLine } from '@interfaces/i-spell-check'
import { spellCheckLine } from '@utils/lang-utils'

// https://codemirror.net/examples/lint
// https://codemirror.net/docs/ref/#lint.Diagnostic

const createDiagnostic = (myLine: ILineType, message: string, markClass: string): Diagnostic => ({
  from: myLine.line.from,
  to: myLine.line.to,
  severity: 'warning',
  message,
  markClass,
  actions: [{
    name: 'remove',
    apply(view: EditorView, from: number, to: number) {
      return view.dispatch({ changes: { from, to } })
    }
  }]
})

export const myLinter = () => {
  return linter((view: EditorView) => {
    let diagnostics: Diagnostic[] = []

    const doc: Text = view.state.doc
    const myLines: ILineType[] = []

    let pos: number = 0

    while (pos <= doc.length) {
      const line: Line = doc.lineAt(pos)
      const lineType: TLineType = getLineType(line.text)
      myLines.push({ line, lineType })
      pos = line.to + 1
    }

    myLines.forEach((myLine: ILineType, i: number) => {
      const prevLine: ILineType = get(myLines, i - 1, null)
      const nextLine: ILineType = get(myLines, i + 1, null)

      // TODO: Only show after submit failure (use state?)
      if (myLine.lineType === 'chords') {
        if (nextLine == null || nextLine.lineType !== 'lyrics') {
          const diagnostic: Diagnostic = createDiagnostic(myLine, 'chords - line after must be lyrics', 'chords-line-after')
          diagnostics.push(diagnostic)
        }
      }

      // TODO: Only show after submit failure (use state?)
      if (myLine.lineType === 'lyrics') {
        if (prevLine == null || prevLine.lineType !== 'chords') {
          const diagnostic: Diagnostic = createDiagnostic(myLine, 'lyrics - line before must be chords', 'lyrics-line-before')
          diagnostics.push(diagnostic)
        }
      }

      if (myLine.lineType === 'lyrics') {

        const spellings: ISpellCheckLine[] = spellCheckLine(myLine.line.text)

        const typos: Diagnostic[] = spellings.map((scl: ISpellCheckLine) => {

          return {
            from: myLine.line.from + scl.idx,
            to: myLine.line.from + scl.idx + scl.word.length,
            severity: 'hint',
            message: `suggestions`,
            markClass: 'typo',
            actions: scl.suggestions.map((suggestion: string) => {
              return {
                name: suggestion,

                // TODO: Unit test this
                // e.g.
                //   E Db
                // herro there

                apply(view: EditorView, from: number, to: number) {

                  let changes: ChangeSpec[] = [{ from, to, insert: suggestion }]

                  if (prevLine && prevLine.lineType === 'chords') {
                    const diff: number = suggestion.length - scl.word.length

                    if (diff !== 0) {

                      const start: string = prevLine.line.text.substring(0, scl.idx)
                      let middle: string
                      const end: string = prevLine.line.text.substring(scl.idx + scl.word.length)

                      if (diff > 0) { // add chars
                        middle = prevLine.line.text.substring(scl.idx, scl.idx + scl.word.length) + ' '.repeat(diff)
                      }

                      if (diff < 0) { // remove chars
                        middle = prevLine.line.text.substring(scl.idx, scl.idx + suggestion.length)
                      }

                      const newPrevLineText: string = start + middle + end

                      const isChordLine: boolean = getIsChordLine(newPrevLineText)
                      // TODO: checking chord count is not good enough - need to check actual chords are identical and in correct order
                      const chordCount: number = getChordCount(prevLine.line.text)
                      const newChordCount: number = getChordCount(newPrevLineText)

                      if (isChordLine && chordCount === newChordCount) {
                        const change: ChangeSpec = [{
                          from: prevLine.line.from,
                          to: prevLine.line.to,
                          insert: newPrevLineText
                        }]
                        changes = [...changes, change]
                      } else {
                        // TODO
                        console.warn('Please make manual changes to chords line to allow for typo fix')
                      }
                    }
                  }

                  return view.dispatch({ changes })
                }
              }
            })
          } as Diagnostic
        })

        diagnostics = [...diagnostics, ...typos]
      }
    })

    return diagnostics
  })
}
