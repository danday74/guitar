import { Component } from '@angular/core'
import { ISong } from '@interfaces/i-song'
import { FormsModule } from '@angular/forms'
import { IRawSong } from '@interfaces/i-raw-song'

@Component({
  selector: 'app-lyrics',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './lyrics.component.html',
  styleUrl: './lyrics.component.scss'
})
export class LyricsComponent {
  raw: IRawSong = { verses: '', choruses: '', bridges: '' }
  song: ISong

  updateSong(type: keyof IRawSong, raw: string) {
    this.raw[type] = raw
    // console.log(type, raw)
  }
}
