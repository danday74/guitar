import {
  crosshairCursor,
  drawSelection,
  dropCursor,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  placeholder,
  rectangularSelection
} from '@codemirror/view'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { bracketMatching, defaultHighlightStyle, foldGutter, foldKeymap, indentOnInput, syntaxHighlighting } from '@codemirror/language'
import { EditorState, Extension } from '@codemirror/state'
import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete'
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search'
import { lintKeymap } from '@codemirror/lint'
import { ICodemirrorExtensionOptions } from '@components/chord-highlighter/interfaces/i-codemirror-extension-options'
import { birdsOfParadise, dracula } from 'thememirror'

// see basicSetup from node_modules/codemirror/dist/index.js

const codemirrorExtensions = (options: ICodemirrorExtensionOptions): Extension[] => {
  const extensions: Extension[] = [
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightSpecialChars(),
    history(),
    foldGutter(),
    drawSelection(),
    dropCursor(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    rectangularSelection(),
    crosshairCursor(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...searchKeymap,
      ...historyKeymap,
      ...foldKeymap,
      ...completionKeymap,
      ...lintKeymap
    ]),
    // additional extensions
    placeholder(options.placeholder)
  ]

  // https://thememirror.net
  switch (options.theme) {
    case 'birdsOfParadise':
      return [...extensions, birdsOfParadise]
    case 'dracula':
      return [...extensions, dracula]
    default:
      return extensions
  }
}

export { codemirrorExtensions }
