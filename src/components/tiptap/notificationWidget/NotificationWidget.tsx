import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'

export const NotificationWidget = (props: any) => {
  return (
    <NodeViewWrapper className='widget-content' data-drag-handle>
      <NodeViewContent as='div' className='widget' />
    </NodeViewWrapper>
  )
}
