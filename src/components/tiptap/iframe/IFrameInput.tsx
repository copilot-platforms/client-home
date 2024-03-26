import { useAppState } from '@/hooks/useAppState'
import { fixUrl } from '@/utils/fixUrl'
import { TiptapEditorUtils } from '@/utils/tiptapEditorUtils'
import { Cancel } from '@mui/icons-material'
import { InputAdornment, TextField } from '@mui/material'
import { Editor } from '@tiptap/react'
import React, { SyntheticEvent, useEffect, useRef, useState } from 'react'

const BubbleEmbedInput = () => {
  const appState = useAppState()

  const [url, setUrl] = useState('')

  const urlInputRef = useRef<HTMLInputElement>(null)

  const tiptapEditorUtils = new TiptapEditorUtils(
    appState?.appState.editor as Editor,
  )

  const handleKeyDown = (event: SyntheticEvent<HTMLDivElement>) => {
    //@ts-expect-error event should contain code
    if (event.code === 'Escape') {
      event.preventDefault()
      appState?.setShowEmbedInput(false)
    }

    //@ts-expect-error event should contain code
    if (event.code === 'Enter') {
      event.preventDefault()
      tiptapEditorUtils.insertEmbed(fixUrl(url))
      appState?.setShowEmbedInput(false)
      setUrl('')
    }
  }

  useEffect(() => {
    if (urlInputRef.current) {
      urlInputRef.current.focus()
    }
  }, [urlInputRef.current])

  return (
    <TextField
      type='text'
      variant='outlined'
      InputProps={{
        endAdornment: (
          <InputAdornment
            position='end'
            sx={{
              cursor: 'pointer',
            }}
          >
            <Cancel
              onClick={() => {
                appState?.setShowEmbedInput(false)
              }}
            />
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiInputBase-input': {
          padding: '8px 12px',
        },
        '& .MuiOutlinedInput-root': {
          '&.Mui-focused fieldset': {
            borderColor: '#DFE1E4',
          },
          '&:hover fieldset': {
            borderColor: '#DFE1E4',
          },
        },
        background: '#fff',
        borderRadius: '8px',
      }}
      onChange={(e) => setUrl(e.target.value)}
      ref={urlInputRef}
      onKeyDown={handleKeyDown}
      value={url}
      autoFocus
    />
  )
}

export default BubbleEmbedInput
