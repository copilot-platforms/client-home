'use client'

import { useAppState } from '@/hooks/useAppState'
import { Box, Modal, Typography } from '@mui/material'
import ModalCheckbox from './ModalCheckbox'
import { BillingIcon, ContractsIcon, FormsIcon } from '@/icons'

const NotificationsModal = () => {
  const appState = useAppState()

  return (
    <Modal
      open={!!appState?.appState.showNotificationsModal}
      // onClose={() => {
      // }}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
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

          <ModalCheckbox Icon={BillingIcon} identifier={'billing'} />
          <ModalCheckbox Icon={FormsIcon} identifier={'forms'} />
          <ModalCheckbox Icon={ContractsIcon} identifier={'contracts'} />
        </div>
        <hr />
        <div className='flex justify-end gap-4 py-6 px-8'>
          <button
            className='py-1 px-3 text-new-dark text-[13px] rounded bg-white border border-slate-300'
            // onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className='bg-new-dark py-1 px-3 text-white text-[13px] rounded'
            // onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default NotificationsModal
