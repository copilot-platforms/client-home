import { NodeViewWrapper } from '@tiptap/react'
import { Stack, Typography } from '@mui/material'
import RedirectButton from '@/components/atoms/RedirectButton'
import { PortalRoutes } from '@/types/copilotPortal'
import React from 'react'
import { useAppData } from '@/hooks/useAppData'

export const NotificationWidget = () => {
  const invoiceCount = useAppData('{{invoice.count}}')
  const taskCount = useAppData('{{task.count}}')

  return (
    <NodeViewWrapper className='' data-drag-handle contentEditable={false}>
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
          <Stack direction='row' justifyContent='space-between'>
            <Typography variant='body1'>Pay {invoiceCount} invoices</Typography>
            <RedirectButton route='billing'>
              <Typography variant='body1'>
                Go to {PortalRoutes.Billing}
              </Typography>
            </RedirectButton>
          </Stack>
          <Stack direction='row' justifyContent='space-between'>
            <Typography variant='body1'>Fill out 1 form</Typography>
            <RedirectButton route='forms'>
              <Typography variant='body1'>
                Go to {PortalRoutes.Forms}
              </Typography>
            </RedirectButton>
          </Stack>
          <Stack direction='row' justifyContent='space-between'>
            <Typography variant='body1'>Sign 1 contract</Typography>
            <RedirectButton route='contracts'>
              <Typography variant='body1'>
                Go to {PortalRoutes.Contracts}
              </Typography>
            </RedirectButton>
          </Stack>
        </Stack>
      </div>
    </NodeViewWrapper>
  )
}
