import { Component } from '@angular/core'
import { ChordHighlighterComponent } from '@components/chord-highlighter/chord-highlighter.component'

@Component({
  selector: 'app-songs',
  standalone: true,
  imports: [
    ChordHighlighterComponent
  ],
  templateUrl: './songs.component.html',
  styleUrl: './songs.component.scss'
})
export class SongsComponent {}
