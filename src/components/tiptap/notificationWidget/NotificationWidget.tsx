import { NodeViewWrapper } from '@tiptap/react'
import { Box, Stack, Typography } from '@mui/material'
import RedirectButton from '@/components/atoms/RedirectButton'
import { PortalRoutes } from '@/types/copilotPortal'
import React, { useMemo, useState } from 'react'
import { useAppData } from '@/hooks/useAppData'
import { useAppState } from '@/hooks/useAppState'
import { DragIndicatorRounded } from '@mui/icons-material'
import { usePathname } from 'next/navigation'

export const NotificationWidget = () => {
  const invoiceCount = useAppData('{{invoice.count}}')
  const actionCount = useAppData('{{action.count}}')
  const formCount = useAppData('{{form.count}}')
  const contractCount = useAppData('{{contract.count}}')
  const appState = useAppState()

  const [hovered, setHovered] = useState(false)
  const pathname = usePathname()

  function isAllNotificationsTurnedOff() {
    if (appState?.appState.settings?.notifications) {
      return !appState?.appState.settings?.notifications?.some(
        (notification) => notification.show,
      )
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

  const show = useMemo(() => {
    if (!appState?.appState.displayTasks || isAllNotificationsTurnedOff()) {
      return false
    }

    if (!appState?.appState.readOnly) {
      return true
    }

    return Number(actionCount) > 0
  }, [
    appState?.appState.displayTasks,
    appState?.appState.readOnly,
    actionCount,
  ])

  return (
    <NodeViewWrapper data-drag-handle contentEditable={false}>
      {show && (
        <div
          draggable='false'
          datatype='draggable-item'
          onMouseOver={() => setHovered(true)}
          onMouseOut={() => setHovered(false)}
          style={{
            position: 'relative',
          }}
        >
          <Typography
            variant='h2'
            datatype='draggable-item'
            sx={{
              fontFamily: appState?.appState.font.replaceAll('+', ' '),
            }}
          >
            You have {actionCount} action
            {!appState?.appState?.readOnly || Number(actionCount) > 1
              ? 's'
              : ''}{' '}
            left to complete
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
                        name={`Pay ${invoiceCount} invoice${
                          !appState?.appState?.readOnly ||
                          Number(invoiceCount) > 1
                            ? 's'
                            : ''
                        }`}
                        route={PortalRoutes.Billing}
                        display={detectDisplay(invoiceCount)}
                      />
                    )
                  }
                  if (notification.key === PortalRoutes.Forms) {
                    return (
                      <NotificationComponent
                        key={key}
                        name={`Fill out ${formCount} form${
                          !appState?.appState?.readOnly || Number(formCount) > 1
                            ? 's'
                            : ''
                        }`}
                        route={PortalRoutes.Forms}
                        display={detectDisplay(formCount)}
                      />
                    )
                  }
                  if (notification.key === PortalRoutes.Contracts) {
                    return (
                      <NotificationComponent
                        key={key}
                        name={`Sign ${contractCount} contract${
                          !appState?.appState?.readOnly ||
                          Number(contractCount) > 1
                            ? 's'
                            : ''
                        }`}
                        route={PortalRoutes.Contracts}
                        display={detectDisplay(contractCount)}
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
            <DragIndicatorRounded fontSize='small' />
          </Box>
        </div>
      )}
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
  const appState = useAppState()

  return (
    <Stack
      direction='row'
      justifyContent='space-between'
      display={display ? 'flex' : 'none'}
      alignItems='center'
    >
      <Typography
        variant='body1'
        sx={{
          fontFamily: appState?.appState.font.replaceAll('+', ' '),
        }}
      >
        {name}
      </Typography>
      <RedirectButton
        route={route}
        execute={pathname.includes('client-preview')}
      >
        <Typography
          variant='body1'
          sx={{
            fontFamily: appState?.appState.font.replaceAll('+', ' '),
          }}
        >
          Go to {route}
        </Typography>
      </RedirectButton>
    </Stack>
  )
}
