import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class AppInitService {
  async init(): Promise<boolean> {
    return true
  }
}
