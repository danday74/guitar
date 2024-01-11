import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NgIf } from '@angular/common'
import { EditorView } from "codemirror"
import { codemirrorExtensions } from '@components/chord-highlighter/data/codemirror-extensions'
import { chordsAndLyrics } from '@components/chord-highlighter/data/chords-and-lyrics-language'
import { ChangeSpec, Line } from '@codemirror/state'
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
      extensions: [codemirrorExtensions({ theme: 'dracula', placeholder: 'verses' }), chordsAndLyrics()],
      parent: this.editor.nativeElement
    })
  }

  // TODO: integrate with https://stackoverflow.com/a/72407564/1205871 possibly
  format() {
    let changes: ChangeSpec[] = []
    const doc = this.view.state.doc
    console.log(doc)
    let line: Line
    let pos: number = 0

    while (pos <= doc.length) {
      line = doc.lineAt(pos)
      const isChordLine: boolean = getIsChordLine(line.text)
      if (isChordLine) {
        const change: ChangeSpec = {
          from: line.from,
          to: line.to,
          insert: this.fixChordLine(line.text)
        } as ChangeSpec
        changes = [...changes, change]
      }

      console.log(line)
      pos = line.to + 1
    }

    // TODO: dispatch as little as poss
    // https://codemirror.net/examples/change
    this.view.dispatch({ changes })
  }

  // TODO: Make more efficient?
  private fixChordLine(line: string): string {

    let parts: string[] = line.split(' ')

    parts = parts.map((part: string): string => {
      if (part === '') return part
      // since this is a chord line, if we get here the part must be a chord
      return toStandard(part as TChord)
    })
    return parts.join(' ')
  }
}
