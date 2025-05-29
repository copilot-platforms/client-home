'use client'

import { useAppState } from '@/hooks/useAppState'
import {
  BillingIcon,
  ContractsIcon,
  DragHandleIcon,
  FormsIcon,
  SVGIcon,
  TasksIcon,
} from '@/icons'
import { Notification, NotificationOption } from '@/types/notifications'
import { capitalizeFirstLetter } from '@/utils/string'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Box, Checkbox, Typography } from '@mui/material'
import { Dispatch, SetStateAction, useState } from 'react'

const notificationIcons: { [_key in NotificationOption]: SVGIcon } = {
  billing: BillingIcon,
  forms: FormsIcon,
  contracts: ContractsIcon,
  tasks: TasksIcon,
}

interface ModalCheckboxProps {
  identifier: NotificationOption
  formState: NonNullable<Notification>
  setFormState: Dispatch<SetStateAction<NonNullable<Notification>>>
  setShowError: Dispatch<SetStateAction<NonNullable<boolean>>>
}

const ModalCheckbox = ({
  identifier,
  formState,
  setFormState,
  setShowError,
}: ModalCheckboxProps) => {
  const appState = useAppState()
  const Icon: SVGIcon = notificationIcons[identifier]

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: identifier })
  const style = { transition, transform: CSS.Transform.toString(transform) }
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseOver = () => {
    setIsDragging(true)
  }
  const handleMouseOut = () => {
    setIsDragging(false)
  }

  const handleChange = () => {
    const i = formState.findIndex((item) => item.key === identifier)
    setFormState((prev) => {
      const newState = [
        ...prev.slice(0, i),
        { ...prev[i], show: !prev[i].show },
        ...prev.slice(i + 1),
      ]
      const checkIfAllFalse = newState.every((item) => !item.show)
      if (checkIfAllFalse) {
        setShowError(true)
        return prev
      } else {
        return newState
      }
    })
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <hr />
      <div className='flex justify-between py-4 relative left-2'>
        <div className='flex gap-5'>
          <div className='py-4 absolute left-[-1.5rem] flex items-center'>
            {isDragging ? (
              <DragHandleIcon className='w-[20px] scale-125' />
            ) : (
              <div className='w-[20px]'></div>
            )}
          </div>
          <div className='flex items-center'>
            <Icon style={{ scale: 1.4 }} />
          </div>
          <Typography
            variant='body1'
            id='modal-modal-description'
            className='flex items-center font-medium mt-4 '
            sx={{ fontFamily: appState?.appState.font.replaceAll('+', ' ') }}
          >
            {capitalizeFirstLetter(identifier as string)}
          </Typography>
        </div>
        <Box className='flex items-center mt-4' sx={{ margin: 0 }}>
          <Checkbox
            sx={{
              '&.Mui-checked': {
                color: 'black',
              },
            }}
            checked={formState.find((item) => item.key === identifier)?.show}
            onChange={handleChange}
          />
        </Box>
      </div>
    </div>
  )
}

export default ModalCheckbox
