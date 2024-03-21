import { NodeViewWrapper } from '@tiptap/react'
import { Box, Stack, Typography } from '@mui/material'
import RedirectButton from '@/components/atoms/RedirectButton'
import { PortalRoutes } from '@/types/copilotPortal'
import React, { useState } from 'react'
import { useAppData } from '@/hooks/useAppData'
import { useAppState } from '@/hooks/useAppState'
import { DragIndicatorRounded } from '@mui/icons-material'
import { usePathname } from 'next/navigation'

export const NotificationWidget = () => {
  const invoiceCount = useAppData('{{invoice.count}}')
  const taskCount = useAppData('{{task.count}}')
  const formCount = useAppData('{{form.count}}')
  const contractCount = useAppData('{{contract.count}}')
  const appState = useAppState()

  const [hovered, setHovered] = useState(false)
  const pathname = usePathname()

  function detectAllFalsy() {
    if (appState?.appState.settings?.notifications) {
      for (let i = 0; i < appState?.appState.settings?.notifications?.length; i++) {
        if (appState?.appState.settings?.notifications[i].show) {
          return false;
        }
      }
      return true;
    }
  }

  const detectDisplay = (value: string) => {
    if (pathname.includes('client-preview')) {
      return Number(value) > 0
    } else {
      if (appState?.appState?.readOnly) {
        return Number(value) > 0
      } else {
        return true
      }
    }
  }

  return (
    <NodeViewWrapper data-drag-handle contentEditable={false}>
      {
        appState?.appState.displayTasks && !detectAllFalsy() &&
        (pathname.includes('client-preview')
          ? Number(taskCount) > 0 && !detectAllFalsy()
          : (appState?.appState.readOnly ? (!detectAllFalsy() && Number(taskCount) > 0) : true)) &&
        <div
          draggable='true'
          datatype='draggable-item'
          onMouseOver={() => setHovered(true)}
          onMouseOut={() => setHovered(false)}
          style={{ position: 'relative', cursor: 'pointer' }}
        >
          <Typography variant='h2' datatype='draggable-item'>
            You have {taskCount} task/s left to complete
          </Typography>

          <Stack
            direction='column'
            rowGap='24px'
            sx={{
              background: '#fff',
              border: '1px solid #DFE1E4',
              borderRadius: '4px',
              padding: '24px',
              margin: '8px 0px 16px 0px',
            }}
          >
            {appState?.appState.settings?.notifications?.map(
              (notification, key) => {
                if (notification.show) {
                  if (notification.key === PortalRoutes.Billing) {
                    return (
                      <NotificationComponent
                        key={key}
                        name={`Pay ${invoiceCount} invoice${!appState?.appState?.readOnly ? '/s' : ''}${Number(invoiceCount) > 1 ? 's' : ''}`}
                        route={PortalRoutes.Billing}
                        display={detectDisplay(invoiceCount)}
                      />
                    )
                  }
                  if (notification.key === PortalRoutes.Forms) {
                    return (
                      <NotificationComponent
                        key={key}
                        name={`Fill out ${formCount} form${!appState?.appState?.readOnly ? '/s' : ''}${Number(formCount) > 1 ? 's' : ''}`}
                        route={PortalRoutes.Forms}
                        display={detectDisplay(formCount)}
                      />
                    )
                  }
                  if (notification.key === PortalRoutes.Contracts) {
                    return (
                      <NotificationComponent
                        key={key}
                        name={`Sign ${contractCount} contract${!appState?.appState?.readOnly ? '/s' : ''}${Number(contractCount) > 1 ? 's' : ''}`}
                        route={PortalRoutes.Contracts}
                        display={detectDisplay(contractCount)}
                      />
                    )
                  }
                }
              }
            )}
          </Stack>
          <Box
            sx={{
              position: 'absolute',
              top: '60%',
              left: 10,
              transform: 'translate(-50%, -50%)',
              display:
                hovered && !appState?.appState.readOnly ? 'block' : 'none',
              opacity: 0.6,
            }}
          >
            <DragIndicatorRounded fontSize='small' />
          </Box>
        </div>
      }
    </NodeViewWrapper>
  )
}

const NotificationComponent = ({
  name,
  route,
  display,
}: {
  name: string
  route: PortalRoutes
  display?: boolean
}) => {
  const pathname = usePathname()

  return (
    <Stack
      direction='row'
      justifyContent='space-between'
      display={display ? 'flex' : 'none'}
      alignItems="center"
    >
      <Typography variant='body1'>{name}</Typography>
      <RedirectButton
        route={route}
        execute={
          pathname.includes('client-preview')
        }
      >
        <Typography variant='body1'>Go to {route}</Typography>
      </RedirectButton>
    </Stack>
  )
}

