import { NodeViewWrapper } from '@tiptap/react'
import { Stack, Typography } from '@mui/material'
import RedirectButton from '@/components/atoms/RedirectButton'
import { PortalRoutes } from '@/types/copilotPortal'
import React from 'react'
import { useAppData } from '@/hooks/useAppData'
import { useAppState } from '@/hooks/useAppState'

export const NotificationWidget = () => {
  const invoiceCount = useAppData('{{invoice.count}}')
  const taskCount = useAppData('{{task.count}}')
  const formCount = useAppData('{{form.count}}')
  const contractCount = useAppData('{{contract.count}}')
  const appState = useAppState()

  return (
    <NodeViewWrapper className='' data-drag-handle contentEditable={false}>
      {appState?.appState.displayTasks && (
        <div draggable='true' datatype='draggable-item'>
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
                        buttonName={`Go to ${PortalRoutes.Billing}`}
                      />
                    )
                  }
                  if (notification.key === PortalRoutes.Forms) {
                    return (
                      <NotificationComponent
                        key={key}
                        name={`Fill out ${formCount} forms`}
                        buttonName={`Go to ${PortalRoutes.Forms}`}
                      />
                    )
                  }
                  if (notification.key === PortalRoutes.Contracts) {
                    return (
                      <NotificationComponent
                        key={key}
                        name={`Sign ${contractCount} contract`}
                        buttonName={`Go to ${PortalRoutes.Contracts}`}
                      />
                    )
                  }
                }
              },
            )}
          </Stack>
        </div>
      )}
    </NodeViewWrapper>
  )
}

const NotificationComponent = ({
  name,
  buttonName,
}: {
  name: string
  buttonName: string
}) => {
  return (
    <Stack direction='row' justifyContent='space-between'>
      <Typography variant='body1'>{name}</Typography>
      <RedirectButton route='contracts'>
        <Typography variant='body1'>{buttonName}</Typography>
      </RedirectButton>
    </Stack>
  )
}
