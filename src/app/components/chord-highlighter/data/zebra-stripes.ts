import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate } from '@codemirror/view'
import { Extension, Facet, Line, RangeSet, RangeSetBuilder } from '@codemirror/state'

const baseTheme: Extension = EditorView.baseTheme({
  '&light .cm-zebraStripe': { backgroundColor: '#d4fafa' },
  '&dark .cm-zebraStripe': { backgroundColor: '#1a2727' }
})

const stepSize: Facet<number, number> = Facet.define<number, number>({
  combine: (values): number => values.length ? Math.min(...values) : 2
})

export const zebraStripes = (options: { step?: number } = {}): Extension => {
  return [
    baseTheme,
    options.step == null ? [] : stepSize.of(options.step),
    showStripes
  ]
}

const stripe: Decoration = Decoration.line({
  attributes: { class: 'cm-zebraStripe' }
})

const stripeDeco = (view: EditorView): RangeSet<Decoration> => {
  const step: number = view.state.facet(stepSize)
  const builder: RangeSetBuilder<Decoration> = new RangeSetBuilder<Decoration>()
  for (const { from, to } of view.visibleRanges) {
    for (let pos: number = from; pos <= to;) {
      const line: Line = view.state.doc.lineAt(pos)
      if ((line.number % step) === 0)
        builder.add(line.from, line.from, stripe)
      pos = line.to + 1
    }
  }
  return builder.finish()
}

const showStripes: ViewPlugin<any> = ViewPlugin.fromClass(class {
  decorations: DecorationSet

  constructor(view: EditorView) {
    this.decorations = stripeDeco(view)
  }

  // noinspection JSUnusedGlobalSymbols
  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged)
      this.decorations = stripeDeco(update.view)
  }
}, {
  decorations: v => v.decorations
})
