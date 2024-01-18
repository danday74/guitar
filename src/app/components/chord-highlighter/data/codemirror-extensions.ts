import { drawSelection, dropCursor, highlightActiveLine, highlightActiveLineGutter, highlightSpecialChars, keymap, placeholder } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { Extension } from '@codemirror/state'
import { autocompletion, completionKeymap } from '@codemirror/autocomplete'
import { searchKeymap } from '@codemirror/search'
import { lintKeymap } from '@codemirror/lint'
import { ICodemirrorExtensionOptions } from '@components/chord-highlighter/interfaces/i-codemirror-extension-options'
import { zebraStripes } from '@components/chord-highlighter/data/zebra-stripes'
import { oneDark } from '@codemirror/theme-one-dark'

// see basicSetup from node_modules/codemirror/dist/index.js

const codemirrorExtensions = (options: ICodemirrorExtensionOptions): Extension[] => {
  // noinspection UnnecessaryLocalVariableJS
  const extensions: Extension[] = [
    // lineNumbers(),
    highlightActiveLineGutter(),
    highlightSpecialChars(),
    history(),
    // foldGutter(),
    drawSelection(),
    dropCursor(),
    // EditorState.allowMultipleSelections.of(true),
    // indentOnInput(),
    // syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    // bracketMatching(),
    // closeBrackets(),
    autocompletion(),
    // rectangularSelection(),
    // crosshairCursor(),
    highlightActiveLine(),
    // highlightSelectionMatches(),
    keymap.of([
      // ...closeBracketsKeymap,
      ...defaultKeymap,
      ...searchKeymap, // search
      ...historyKeymap, // history
      // ...foldKeymap,
      ...completionKeymap, // autocompletion
      ...lintKeymap
    ]),
    // additional extensions
    placeholder(options.placeholder),
    zebraStripes({ step: 2 }),
    oneDark
  ]

  return extensions
}

export { codemirrorExtensions }
