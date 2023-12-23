import { Routes } from '@angular/router'
import { MainLayoutComponent } from './components/layouts/main-layout/main-layout.component'

export const routes: Routes = [
  {
    path: 'song',
    component: MainLayoutComponent,
    loadChildren: () => import('./routes/song/routes').then(m => m.routes)
  },
  {
    path: 'songs',
    component: MainLayoutComponent,
    loadChildren: () => import('./routes/songs/routes').then(m => m.routes)
  },
  {
    path: '**',
    redirectTo: 'song'
  }
]
