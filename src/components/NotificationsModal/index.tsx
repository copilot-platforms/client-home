'use client'

import { useAppState } from '@/hooks/useAppState'
import { Backdrop, Box, Modal, Typography } from '@mui/material'
import ModalCheckbox from './ModalCheckbox'
import { ISettings } from '@/types/interfaces'
import { useState } from 'react'
import { Notification, NotificationOption } from '@/types/notifications'
import { order } from '@/utils/orderable'
import { defaultNotificationOptions } from '@/utils/notifications'
import {
  DndContext,
  DragEndEvent,
  closestCorners,
  useSensors,
  useSensor,
  MouseSensor,
  TouchSensor,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

interface NotificationsModalProps {
  settings: ISettings | null
}

const NotificationsModal = ({ settings }: NotificationsModalProps) => {
  const appState = useAppState()
  const [saving, setSaving] = useState(false)
  const [formState, setFormState] = useState<NonNullable<Notification>>(
    order(settings?.notifications || defaultNotificationOptions),
  )

  const handleCancel = appState?.toggleNotificationsModal

  const handleSave = async () => {
    try {
      setSaving(true)
      await fetch(`/api/settings?token=${appState?.appState?.token}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...settings,
          displayTasks: appState?.appState.displayTasks,
          token: appState?.appState?.token,
          notifications: formState,
        }),
      })
      appState?.toggleNotificationsModal()
      const newSettings = {
        ...appState?.appState.settings,
        notifications: formState,
      }
      appState?.setSettings(newSettings as ISettings)
    } catch (e) {
      console.error(e)
    }
    setSaving(false)
  }

  const getCheckboxPosition = (id: string) =>
    formState.findIndex((item) => item.key === id)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const originalPosition = getCheckboxPosition(active.id as string)
    const newPosition = getCheckboxPosition(over.id as string)

    const newArr = arrayMove(formState, originalPosition, newPosition)
    // Use this new order to overwrite over existing one!
    setFormState([...newArr.map((item, order) => ({ ...item, order }))])
  }

  // Attach sensors to DnDContext. If we don't then the drag handler will take over and we won't be able to check the checkbox inside
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 6,
      },
    }),
  )

  return (
    <Modal
      open={!!appState?.appState.showNotificationsModal}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 250,
        },
      }}
    >
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[720px] bg-white rounded-md shadow-lg outline-none font-medium'>
        <Typography variant='h6' className='px-6 pt-6 pb-4 font-medium'>
          Customize notifications widget
        </Typography>
        <hr />
        <div className='px-8 py-2'>
          <Box
            className='flex justify-between pt-6 pb-3'
            sx={{
              color: '#6B6F76',
            }}
          >
            <Typography variant='body2' id='modal-modal-description'>
              App name
            </Typography>
            <Typography variant='body2' id='modal-modal-description'>
              Enable
            </Typography>
          </Box>
          <DndContext
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <SortableContext
              items={formState.map((i) => i.key)}
              strategy={verticalListSortingStrategy}
            >
              {formState?.length &&
                formState.map(({ key }) => (
                  <ModalCheckbox
                    key={key}
                    identifier={key as NotificationOption}
                    formState={formState}
                    setFormState={setFormState}
                  />
                ))}
            </SortableContext>
          </DndContext>
        </div>
        <hr />
        <div className='flex justify-end gap-4 py-6 px-8'>
          <button
            className='py-1 px-3 text-new-dark text-[13px] rounded bg-white border border-slate-300'
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className='bg-new-dark py-1 px-3 text-white text-[13px] rounded'
            onClick={handleSave}
          >
            {saving ? 'Saving' : 'Save'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default NotificationsModal
