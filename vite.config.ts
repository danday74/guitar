import { defineConfig } from 'vite'
import path from 'path'

// https://stackoverflow.com/a/73742188/1205871
// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  resolve: {
    alias: [
      { find: '@components', replacement: path.resolve(__dirname, 'src/app/components') }
    ]
  }
})
