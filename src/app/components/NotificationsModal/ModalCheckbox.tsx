'use client'

import { useAppState } from '@/hooks/useAppState'
import { SVGIcon } from '@/icons'
import { NotificationOption } from '@/types/notifications'
import { capitalizeFirstLetter } from '@/utils/string'
import { Box, Checkbox, Typography } from '@mui/material'

interface ModalCheckboxProps {
  Icon: SVGIcon
  identifier: NotificationOption
}

const ModalCheckbox = ({ Icon, identifier }: ModalCheckboxProps) => {
  const appState = useAppState()

  return (
    <>
      <hr />
      <Box className='flex justify-between py-4 relative left-2'>
        <Box className='flex gap-5'>
          <Box className='flex items-center'>
            <Icon style={{ scale: 1.5 }} />
          </Box>
          <Typography
            id='modal-modal-description'
            className='flex items-center font-medium mt-4 '
          >
            {capitalizeFirstLetter(identifier as string)}
          </Typography>
        </Box>
        <Box className='flex items-center mt-4' sx={{ margin: 0 }}>
          <Checkbox value={appState?.appState.notifications?.[identifier]} />
        </Box>
      </Box>
    </>
  )
}

export default ModalCheckbox
