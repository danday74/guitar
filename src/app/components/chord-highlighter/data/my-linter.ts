import { Diagnostic, linter } from '@codemirror/lint'
import { Line, Text } from '@codemirror/state'
import { TLineType } from '@ttypes/t-line-type'
import { getLineType } from '@utils/chord-utils'
import { get } from 'lodash-es'
import { EditorView } from '@codemirror/view'

export const myLinter = () => {
  return linter((view: EditorView) => {
    const diagnostics: Diagnostic[] = []

    const doc: Text = view.state.doc
    const myLines: any[] = []

    let pos: number = 0

    while (pos <= doc.length) {
      const line: Line = doc.lineAt(pos)
      const lineType: TLineType = getLineType(line.text)
      myLines.push({ line, lineType })
      pos = line.to + 1
    }

    myLines.forEach((myLine, i) => {
      const prevLine = get(myLines, i - 1, null)
      const nextLine = get(myLines, i + 1, null)

      if (myLine.lineType === 'chord') {
        if (nextLine == null || nextLine.lineType !== 'lyric') {

          diagnostics.push({
            from: myLine.line.from,
            to: myLine.line.to,
            severity: 'warning',
            message: 'chords - line after must be lyrics',
            actions: [{
              name: 'remove',
              apply(view, from, to) {
                return view.dispatch({ changes: { from, to } })
              }
            }]
          })
        }
      }

      if (myLine.lineType === 'lyric') {
        if (prevLine == null || prevLine.lineType !== 'chord') {

          diagnostics.push({
            from: myLine.line.from,
            to: myLine.line.to,
            severity: 'warning',
            message: 'lyrics - line before must be chords',
            actions: [{
              name: 'remove',
              apply(view, from, to) {
                return view.dispatch({ changes: { from, to } })
              }
            }]
          })
        }
      }
    })

    return diagnostics
  })
}
