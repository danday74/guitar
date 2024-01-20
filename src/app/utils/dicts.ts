import Typo from 'typo-js'

const createDict = (name: string): Typo => {
  // https://stackoverflow.com/a/77843143/1205871
  return new Typo(name, null, null, { dictionaryPath: '/assets/dicts' })
}

export const dictEn: Typo = createDict('en')
export const dictEnGb: Typo = createDict('en-gb')

export const dicts: Typo[] = [dictEn, dictEnGb]
