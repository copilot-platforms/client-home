import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { AutofillComponent } from './AutofillComponent'

export const AutofillExtension = Node.create({
  name: 'autofillComponent',
  group: 'inline',
  content: 'text*',
  inline: true,
  selectable: false,
  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      renderText({ options, node }: any) {
        return `${node.attrs.label ?? node.attrs.id}`
      },
      renderHTML({ options, node }: any) {
        return ['span', this.HTMLAttributes]
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'autofill',
      },
    ]
  },

  whitespace: 'normal',

  addNodeView() {
    return ReactNodeViewRenderer(AutofillComponent)
  },

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-id'),
        renderHTML: (attributes) => {
          if (!attributes.id) {
            return {}
          }

          return {
            'data-id': attributes.id,
          }
        },
      },

      label: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-label'),
        renderHTML: (attributes) => {
          if (!attributes.label) {
            return {}
          }

          return {
            'data-label': attributes.label,
          }
        },
      },
    }
  },

  renderHTML({ node, HTMLAttributes }) {
    if (this.options.renderLabel !== undefined) {
      return [
        'span',
        mergeAttributes(
          { 'data-type': this.name },
          this.options.HTMLAttributes,
          HTMLAttributes,
        ),
        this.options.renderLabel({
          options: this.options,
          node,
        }),
      ]
    }
    const html = this.options.renderHTML({
      options: this.options,
      node,
    })

    if (typeof html === 'string') {
      return [
        'span',
        mergeAttributes(
          { 'data-type': this.name },
          this.options.HTMLAttributes,
          HTMLAttributes,
        ),
        html,
      ]
    }
    return html
  },

  renderText({ node }) {
    if (this.options.renderLabel !== undefined) {
      console.warn(
        'renderLabel is deprecated use renderText and renderHTML instead',
      )
      return this.options.renderLabel({
        options: this.options,
        node,
      })
    }
    return this.options.renderText({
      options: this.options,
      node,
    })
  },
})
