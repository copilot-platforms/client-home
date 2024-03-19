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

  return (
    <NodeViewWrapper data-drag-handle contentEditable={false}>
      {appState?.appState.displayTasks && (
        <div
          draggable='true'
          datatype='draggable-item'
          onMouseOver={() => setHovered(true)}
          onMouseOut={() => setHovered(false)}
          style={{ position: 'relative', cursor: hovered ? 'pointer' : 'none' }}
        >
          <Typography variant='h2' datatype='draggable-item'>
            You have {taskCount} tasks left to complete
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
                        name={`Pay ${invoiceCount} invoices`}
                        route={PortalRoutes.Billing}
                      />
                    )
                  }
                  if (notification.key === PortalRoutes.Forms) {
                    return (
                      <NotificationComponent
                        key={key}
                        name={`Fill out ${formCount} forms`}
                        route={PortalRoutes.Forms}
                      />
                    )
                  }
                  if (notification.key === PortalRoutes.Contracts) {
                    return (
                      <NotificationComponent
                        key={key}
                        name={`Sign ${contractCount} contract`}
                        route={PortalRoutes.Contracts}
                      />
                    )
                  }
                }
              },
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
            <DragIndicatorRounded />
          </Box>
        </div>
      )}
    </NodeViewWrapper>
  )
}

const NotificationComponent = ({
  name,
  route,
}: {
  name: string
  route: PortalRoutes
}) => {
  const appState = useAppState()
  const pathname = usePathname()
  return (
    <Stack direction='row' justifyContent='space-between'>
      <Typography variant='body1'>{name}</Typography>
      <RedirectButton
        route={route}
        execute={
          pathname.includes('client-preview') || !appState?.appState.readOnly
        }
      >
        <Typography variant='body1'>Go to {route}</Typography>
      </RedirectButton>
    </Stack>
  )
}
