import { AfterViewInit, Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NgIf } from '@angular/common'
import { EditorView } from "codemirror"
import { codemirrorExtensions } from '@components/chord-highlighter/data/codemirror-extensions'
import { chordsAndLyrics } from '@components/chord-highlighter/data/chords-and-lyrics-language'
import { noop } from 'lodash-es'
import { ChangeSpec, Line } from '@codemirror/state'
import { getChords } from '@components/chord-highlighter/data/chords'
import { getIsChordLine, toStandard } from '@utils/chord-utils'
import { TChord } from '@components/chord-highlighter/types/t-chord'
import { chordOptions } from '@components/chord-highlighter/interfaces/i-chord-options'

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
export class ChordHighlighterComponent implements OnInit, AfterViewInit {

  private view: EditorView

  ngOnInit() {
    this.view = new EditorView({
      doc: '',
      extensions: [codemirrorExtensions({ theme: 'dracula', placeholder: 'verses' }), chordsAndLyrics()],
      parent: document.getElementById('editor')
    })
  }

  ngAfterViewInit() {
    noop()
  }

  // TODO: integrate with https://stackoverflow.com/a/72407564/1205871 possibly
  clickMe() {
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


    // const line: Line = this.view.state.doc.lineAt(context.pos)

    // console.log(doc)
    // console.log(doc.toString().split('\n'))
    // // @ts-ignore
    // console.log(doc.text)


    // const text: string = this.view.state.doc.toString()
    // console.log(text)
    // let pos: number = 0
    // const changes: ChangeSpec = []
    // for (let next; (next = text.indexOf('\t', pos)) > -1;) {
    //   changes.push({ from: next, to: next + 1, insert: '  ' })
    //   pos = next + 1
    // }
    // this.view.dispatch({ changes })
  }

  // TODO: Make more efficient?
  private fixChordLine(line: string): string {
    const chordsStandard: TChord[] = getChords(chordOptions.standard)

    let parts: string[] = line.split(' ')

    parts = parts.map((part: string): string => {
      if (part === '') return part
      // since this is a chord line, if we get here the part must be a chord
      const chord: TChord = toStandard(part as TChord)
      return chordsStandard.find((chordStandard: TChord): boolean => chord.toLowerCase() === chordStandard.toLowerCase())
    })
    return parts.join(' ')
  }
}
