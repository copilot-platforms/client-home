'use client'

import CalloutExtension from '@/components/tiptap/callout/CalloutExtension'
import LinkpdfExtension from '@/components/tiptap/pdf/PdfExtension'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Heading from '@tiptap/extension-heading'
import Text from '@tiptap/extension-text'
import OrderedList from '@tiptap/extension-ordered-list'
import BulletList from '@tiptap/extension-bullet-list'
import ListItem from '@tiptap/extension-list-item'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Underline from '@tiptap/extension-underline'
import CodeBlock from '@tiptap/extension-code-block'
import Code from '@tiptap/extension-code'
import Link from '@tiptap/extension-link'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Strike from '@tiptap/extension-strike'
import Gapcursor from '@tiptap/extension-gapcursor'
import History from '@tiptap/extension-history'
import Mention from '@tiptap/extension-mention'
import Hardbreak from '@tiptap/extension-hard-break'
import FloatingCommandExtension from '@/components/tiptap/floatingMenu/floatingCommandExtension'
import { floatingMenuSuggestion } from '@/components/tiptap/floatingMenu/floatingMenuSuggestion'
import { autofillMenuSuggestion } from '@/components/tiptap/autofieldSelector/autofillMenuSuggestion'

import { EditorContent, useEditor } from '@tiptap/react'
import { useEffect } from 'react'
import { ImageResize } from '@/components/tiptap/image/image'
import { AutofillExtension } from '@/components/tiptap/autofieldSelector/ext_autofill'
import { NotificationWidgetExtension } from '@/components/tiptap/notificationWidget/ext_notification_widget'
import { useAppState } from '@/hooks/useAppState'
import { ISettings } from '@/types/interfaces'
import { defaultState } from '../../../defaultState'
import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher'
import { IframeExtension } from '@/components/tiptap/iframe/ext_iframe'

const ClientPreview = ({
  content,
  settings,
  token,
  font,
}: {
  content: string
  settings: ISettings
  token: string
  font: string
}) => {
  /**
   * Importing all the editor related imports and settings up this editor
   * in this route again is intentional. This is because client-preview is
   * a separate route which stays independent to the main route. Main route
   * will never load for client preview and thus editor will never load as well.
   */
  const appState = useAppState()

  const editor = useEditor({
    extensions: [
      AutofillExtension,
      NotificationWidgetExtension,
      IframeExtension.configure({
        allowFullscreen: true,
      }),
      Document,
      Paragraph,
      Heading,
      Text,
      Underline,
      Bold,
      Italic,
      Strike,
      CalloutExtension,
      LinkpdfExtension,
      Gapcursor,
      History,
      Hardbreak.configure({
        keepMarks: true,
      }),
      FloatingCommandExtension.configure({
        suggestion: floatingMenuSuggestion,
      }),
      Mention.configure({
        suggestion: autofillMenuSuggestion,
        renderLabel({ node }) {
          return `${node.attrs.label ?? node.attrs.id}`
        },
      }),
      Link.extend({
        exitable: true,
      }),
      OrderedList.configure({
        itemTypeName: 'listItem',
        keepMarks: true,
        keepAttributes: true,
        HTMLAttributes: {
          class: 'list-decimal',
          type: '1',
        },
      }),
      ListItem,
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc',
        },
      }),
      ImageResize.configure({
        readOnly: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      CodeBlock,
      Code,
    ],
    content: content || defaultState,
  })

  const { data } = useSWR(`api/notifications?token=${token}`, fetcher, {
    refreshInterval: 5000,
  })

  useEffect(() => {
    window.scrollBy({ top: 0, left: 0, behavior: 'smooth' })
    if (editor && content) {
      editor?.chain().focus().setTextSelection(0).run()
      appState?.toggleReadOnly(true)
      const _settings = {
        content: defaultState,
        backgroundColor: '#f7f8fa',
        id: '',
        bannerImage: {
          id: '',
          url: '',
          filename: '',
          contentType: '',
          size: 0,
          createdById: '',
        },
        createdById: '',
        displayTasks: false,
      }
      editor.setEditable(false)
      editor.chain().focus().setContent(content).run()
      if (settings?.displayTasks) {
        appState?.toggleDisplayTasks()
      }
      appState?.setSettings(settings || _settings)
      appState?.setFont(font)
    }
  }, [editor, content, settings, font])

  useEffect(() => {
    if (editor) {
      editor.chain().focus('start').run()
    }
  }, [editor])

  useEffect(() => {
    appState?.setNotification(data)
  }, [data])

  useEffect(() => {
    window.scrollBy({ top: 0, left: 0, behavior: 'smooth' })
  }, [])

  if (!editor) {
    return null
  }

  return <EditorContent editor={editor} readOnly={true} content={content} />
}

export default ClientPreview
