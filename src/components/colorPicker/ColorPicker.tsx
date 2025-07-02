import { useEffect, useRef, useState } from 'react'
import { ChromePicker } from 'react-color'
import { When } from '@/components/hoc/When'
import { useAppState } from '@/hooks/useAppState'
import './colorpicker.css'
import { TextField, styled } from '@mui/material'

const ColorPicker = () => {
  const [showPicker, setShowPicker] = useState(false)

  const appState = useAppState()

  const pickerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event: unknown) => {
      //@ts-expect-error unknown typing
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div
      className='py-600 px-500 border-1 border-b relative flex justify-between p-4 gap-3 items-center'
      ref={pickerRef}
      style={{ zIndex: 420 }}
    >
      <p className='font-medium'>Background</p>
      <div className='flex gap-3'>
        <div
          className='border border-slate-200 rounded p-1 flex flex-col justify-center cursor-pointer'
          onClick={() => setShowPicker((prev) => !prev)}
        >
          <div
            style={{
              backgroundColor: `${appState?.appState.editorColor}`,
            }}
            className='w-5 h-5 rounded'
          ></div>
        </div>
        <StyledTextInput
          onClick={() => setShowPicker((prev) => !prev)}
          value={appState?.appState.editorColor}
          onChange={(e) => {
            const hexColor = e.target.value.includes('#')
              ? e.target.value
              : `#${e.target.value}`
            appState?.setEditorColor(hexColor)
          }}
        >
          {appState?.appState.editorColor}
        </StyledTextInput>
      </div>

      <When condition={showPicker}>
        <div className='absolute right-[98px] top-1600'>
          <ChromePicker
            disableAlpha={true}
            color={appState?.appState.editorColor}
            onChange={(color) => {
              appState?.setEditorColor(color.hex)
            }}
          />
        </div>
      </When>
    </div>
  )
}

export const StyledTextInput = styled(TextField, {
  shouldForwardProp: (prop) => prop !== 'padding',
})<{ padding?: string }>(({ padding }) => ({
  width: '80px',
  '& .MuiInputBase-root': {
    paddingLeft: '8px',
  },
  '& .MuiOutlinedInput-input': {
    padding: padding ? padding : '3px 8px 3px 0px',
  },
  '& label.Mui-focused': {
    color: '#000',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#DFE1E4',
    },
    '&:hover fieldset': {
      borderColor: '#DFE1E4',
    },
    '&.Mui-focused fieldset': {
      border: `1px solid #000`,
    },
  },
  input: {
    '&::placeholder': {
      opacity: 1,
      fontSize: '13px',
    },
  },
}))

export default ColorPicker
