'use client'

import { useAppState } from '@/hooks/useAppState'
import { Alert, Backdrop, Box, Fade, Modal, Typography } from '@mui/material'
import ModalCheckbox from './ModalCheckbox'
import { ISettings } from '@/types/interfaces'
import { useMemo, useState } from 'react'
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
import { fetcher } from '@/utils/fetcher'
import useSWR from 'swr'
import { useTasksAppId } from '@/hooks/useTasksAppId'

interface NotificationsModalProps {
  settings: ISettings | null
}

const NotificationsModal = ({ settings }: NotificationsModalProps) => {
  const appState = useAppState()
  const [showError, setShowError] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formState, setFormState] = useState<NonNullable<Notification>>(
    order(settings?.notifications || defaultNotificationOptions),
  )

  const { appId } = useTasksAppId()

  useMemo(() => {
    if (showError) {
      setTimeout(() => setShowError(false), 2000)
    }
  }, [showError])

  const handleCancel = () => {
    setFormState(
      order(
        appState?.appState?.settings?.notifications ||
          defaultNotificationOptions,
      ),
    )
    appState?.toggleNotificationsModal()
  }

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
      sx={{ zIndex: 999999999 }} //highest in the app
    >
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[720px] bg-white rounded-md shadow-lg outline-none font-medium'>
        <Fade in={showError}>
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              width: '100%',
            }}
          >
            <Alert severity='error'>At least 1 app should be selected.</Alert>
          </Box>
        </Fade>
        <Typography
          variant='h6'
          className='px-6 pt-6 pb-4 font-medium'
          sx={{ fontFamily: appState?.appState.font.replaceAll('+', ' ') }}
        >
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
            <Typography
              variant='body2'
              id='modal-modal-description'
              sx={{
                fontFamily: appState?.appState.font.replaceAll('+', ' '),
              }}
            >
              App name
            </Typography>
            <Typography
              variant='body2'
              id='modal-modal-description'
              sx={{
                fontFamily: appState?.appState.font.replaceAll('+', ' '),
              }}
            >
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
                    setShowError={setShowError}
                    show={key === 'tasks' ? !!appId : true}
                  />
                ))}
            </SortableContext>
          </DndContext>
        </div>
        <hr />
        <div
          className='flex justify-end gap-4 py-6 px-8'
          style={{
            fontFamily: appState?.appState.font.replaceAll('+', ' '),
          }}
        >
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
