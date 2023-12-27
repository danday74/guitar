import { Component } from '@angular/core'
import { LyricsComponent } from './lyrics/lyrics.component'
import { NgSwitch, NgSwitchCase } from '@angular/common'

@Component({
  selector: 'app-add-song',
  standalone: true,
  imports: [
    LyricsComponent,
    NgSwitchCase,
    NgSwitch
  ],
  templateUrl: './add-song.component.html',
  styleUrl: './add-song.component.scss'
})
export class AddSongComponent {
  stage = 1
}
