import { Routes } from '@angular/router'
import { SongComponent } from './components/song/song.component'
import { AddSongComponent } from './components/add-song/add-song.component'

export const routes: Routes = [
  {
    path: 'add',
    component: AddSongComponent
  },
  {
    path: ':id',
    component: SongComponent
  }
]
