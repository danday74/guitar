import { Diagnostic, linter } from '@codemirror/lint'
import { Line, Text } from '@codemirror/state'
import { TLineType } from '@ttypes/t-line-type'
import { getLineType } from '@utils/chord-utils'
import { get } from 'lodash-es'
import { EditorView } from '@codemirror/view'
import { ILineType } from '@components/chord-highlighter/interfaces/i-line-type'

const createDiagnostic = (myLine: ILineType, message: string): Diagnostic => ({
  from: myLine.line.from,
  to: myLine.line.to,
  severity: 'warning',
  message,
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

      if (myLine.lineType === 'chord') {
        if (nextLine == null || nextLine.lineType !== 'lyric') {
          const diagnostic: Diagnostic = createDiagnostic(myLine, 'chords - line after must be lyrics')
          diagnostics.push(diagnostic)
        }
      }

      if (myLine.lineType === 'lyric') {
        if (prevLine == null || prevLine.lineType !== 'chord') {
          const diagnostic: Diagnostic = createDiagnostic(myLine, 'lyrics - line before must be chords')
          diagnostics.push(diagnostic)
        }
      }
    })

    return diagnostics
  })
}
