'use client'

import { BillingIcon, ContractsIcon, FormsIcon, SVGIcon } from '@/icons'
import { Notification, NotificationOption } from '@/types/notifications'
import { capitalizeFirstLetter } from '@/utils/string'
import { Box, Checkbox, Typography } from '@mui/material'
import { Dispatch, SetStateAction } from 'react'

const notificationIcons: { [_ in NotificationOption]: SVGIcon } = {
  billing: BillingIcon,
  forms: FormsIcon,
  contracts: ContractsIcon,
}

interface ModalCheckboxProps {
  identifier: NotificationOption
  formState: NonNullable<Notification>
  setFormState: Dispatch<SetStateAction<NonNullable<Notification>>>
}

const ModalCheckbox = ({
  identifier,
  formState,
  setFormState,
}: ModalCheckboxProps) => {
  const Icon: SVGIcon = notificationIcons[identifier]

  const handleChange = () => {
    const i = formState.findIndex((item) => item.key === identifier)
    setFormState((prev) => [
      ...prev.slice(0, i),
      { ...prev[i], show: !prev[i].show },
      ...prev.slice(i + 1),
    ])
  }

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
            checked={formState.find((item) => item.key === identifier)?.show}
            onChange={handleChange}
          />
        </Box>
      </div>
    </>
  )
}

export default ModalCheckbox
