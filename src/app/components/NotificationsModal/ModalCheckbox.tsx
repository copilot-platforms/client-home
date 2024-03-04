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
      <div className='flex justify-between py-4 relative left-2'>
        <div className='flex gap-5'>
          <div className='flex items-center'>
            <Icon style={{ scale: 1.4 }} />
          </div>
          <Typography
            variant='body1'
            id='modal-modal-description'
            className='flex items-center font-medium mt-4 '
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
            value={appState?.appState.notifications?.[identifier]}
          />
        </Box>
      </div>
    </>
  )
}

export default ModalCheckbox
