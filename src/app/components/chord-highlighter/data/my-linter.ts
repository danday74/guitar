import { Diagnostic, linter } from '@codemirror/lint'
import { Line, Text } from '@codemirror/state'
import { TLineType } from '@ttypes/t-line-type'
import { getLineType } from '@utils/chord-utils'
import { get } from 'lodash-es'
import { EditorView } from '@codemirror/view'
import { ILineType } from '@components/chord-highlighter/interfaces/i-line-type'

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
    const diagnostics: Diagnostic[] = []

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
    })

    return diagnostics
  })
}
