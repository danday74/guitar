import kill from 'tree-kill'
import path from 'path'
import psList from 'ps-list'
import { spawnSync } from 'child_process'
import { fileURLToPath } from 'url'
import { find } from 'lodash-es'

// CLOSE ADOBE READER

let pid

const list = await psList()
const adobes = list.filter(item => {
  return item.name.toLowerCase().includes('adobe') || item.name.toLowerCase().includes('acrobat')
})

if (adobes.length) {
  for (let adobe of adobes) {
    const result = find(adobes, { ppid: adobe.pid })
    if (result) pid = adobe.pid
  }
}

if (pid) {
  kill(pid)
}

// EXECUTE CHORDPRO

const cmd1 = 'chordpro chordpro/test.cho --output=chordpro/test.pdf --strict'
const code = spawnSync(cmd1, { shell: true })

const stderr = code.stderr.toString()
const success = stderr === ''
if (!success) {
  console.log(stderr)
  process.exit(1)
}

// OPEN PDF

if (success) {
  console.log('success')
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename).replaceAll('\\', '/')

  const pdf = `${__dirname}/test.pdf`
  const cmd2 = `start chrome ${pdf}`
  spawnSync(cmd2, { shell: true })
}
