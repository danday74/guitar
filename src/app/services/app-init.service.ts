import { Injectable } from '@angular/core'
import { dicts } from '@utils/dicts'
import Typo from 'typo-js'

@Injectable({ providedIn: 'root' })
export class AppInitService {
  async init(): Promise<boolean> {
    return this.initDicts()
  }

  async initDicts(): Promise<boolean> {

    dicts.forEach((dict: Typo) => {
      // @ts-ignore
      if (dict.loaded === false) throw Error(`failure to load dict ${dict.dictionary}`)
    })

    return true
  }
}
