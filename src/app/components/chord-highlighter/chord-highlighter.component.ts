import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NgIf } from '@angular/common'
import { EditorView } from "codemirror"
import { codemirrorExtensions } from '@components/chord-highlighter/data/codemirror-extensions'
import { chordsAndLyrics } from '@components/chord-highlighter/data/chords-and-lyrics-language'
import { ChangeSpec, Line, Text } from '@codemirror/state'
import { getIsChordLine, toStandard } from '@utils/chord-utils'
import { TChord } from '@components/chord-highlighter/types/t-chord'

@Component({
  selector: 'app-chord-highlighter',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './chord-highlighter.component.html',
  styleUrl: './chord-highlighter.component.scss'
})
export class ChordHighlighterComponent implements AfterViewInit {
  @ViewChild('editor') editor: ElementRef<HTMLDivElement>

  private view: EditorView

  ngAfterViewInit() {
    this.view = new EditorView({
      doc: '',
      extensions: [
        codemirrorExtensions({ theme: 'dracula', placeholder: 'verses' }),
        chordsAndLyrics()
      ],
      parent: this.editor.nativeElement
    })
  }

  // TODO: integrate with https://stackoverflow.com/a/72407564/1205871 possibly
  format() {

    const doc: Text = this.view.state.doc

    let changes: ChangeSpec[] = []
    let pos: number = 0

    while (pos <= doc.length) {

      const line: Line = doc.lineAt(pos)
      const lineText: string = this.fixChordLine(line.text)

      if (lineText != null) {
        const change: ChangeSpec = {
          from: line.from,
          to: line.to,
          insert: lineText
        } as ChangeSpec
        changes = [...changes, change]
      }

      pos = line.to + 1
    }

    // https://codemirror.net/examples/change
    if (changes.length) this.view.dispatch({ changes })
  }

  // returns null if nothing to fix
  private fixChordLine(origLineText: string): string {

    const isChordLine: boolean = getIsChordLine(origLineText)
    if (!isChordLine) return null

    let parts: string[] = origLineText.split(' ')

    parts = parts.map((part: string): string => {
      if (part === '') return part
      // since this is a chord line, if we get here the part must be a chord
      return toStandard(part as TChord)
    })

    const lineText: string = parts.join(' ')
    return lineText === origLineText ? null : lineText
  }
}
