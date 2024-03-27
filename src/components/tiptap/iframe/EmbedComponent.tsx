import React, { useCallback } from 'react'
import { NodeViewWrapper } from '@tiptap/react'
import { Resize } from '../image/resizeIcon'
import { useAppState } from '@/hooks/useAppState'
import { usePathname } from 'next/navigation'

export const EmbedComponent = (props: any) => {
  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const parent = event.currentTarget.closest('.embed')
      const image = parent?.querySelector('div.iframe_container')
      if (!image) return

      const startSize = { x: image.clientWidth, y: image.clientHeight }
      const startPosition = { x: event.pageX, y: event.pageY }

      const onMouseMove = (mouseMoveEvent: MouseEvent) => {
        props.updateAttributes({
          width: startSize.x - startPosition.x + mouseMoveEvent.pageX,
          height: startSize.y - startPosition.y + mouseMoveEvent.pageY,
        })
      }

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    },
    [props],
  )

  function extractIframeSrc(inputString: string) {
    // Regular expression to match the src attribute of an iframe tag
    const iframeSrcRegex = /<iframe.*?src=["']([^"']+)["'][^>]*><\/iframe>/

    const match = inputString.match(iframeSrcRegex)
    if (match) {
      return match[1]
    } else {
      return inputString
    }
  }

  const appState = useAppState()
  const pathname = usePathname()

  return (
    <NodeViewWrapper className='embed'>
      <div
        className='iframe_container'
        style={{
          height: props.node.attrs.height,
          width: props.node.attrs.width,
        }}
      >
        <iframe
          src={extractIframeSrc(props.node.attrs.src)}
          width='100%'
          height='100%'
        />
      </div>
      {!pathname.includes('client-preview') && !appState?.appState.readOnly && (
        <div className='resize-trigger' onMouseDown={handleMouseDown}>
          <Resize />
        </div>
      )}
    </NodeViewWrapper>
  )
}
