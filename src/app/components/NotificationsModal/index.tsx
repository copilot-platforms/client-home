'use client'

import { useAppState } from '@/hooks/useAppState'
import { Box, Modal, Typography } from '@mui/material'
import ModalCheckbox from './ModalCheckbox'
import { BillingIcon, ContractsIcon, FormsIcon } from '@/icons'

const modalStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80vw',
  maxWidth: '720px',
  bgcolor: 'white',
  borderRadius: '4px',
  boxShadow: 12,
  outline: 'none',
  fontWeight: 500,
}

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
      <Box sx={modalStyles}>
        <Typography variant='h6' className='px-6 pt-6 pb-4 font-medium'>
          Customize notifications widget
        </Typography>
        <hr />
        <Box className='px-8 pb-4 pt-2'>
          <Box
            className='flex justify-between pt-6 pb-3 text-sm'
            sx={{
              color: '#6B6F76',
            }}
          >
            <Typography id='modal-modal-description'>App name</Typography>
            <Typography id='modal-modal-description'>Enable</Typography>
          </Box>
          <ModalCheckbox Icon={BillingIcon} identifier={'billing'} />
          <ModalCheckbox Icon={FormsIcon} identifier={'forms'} />
          <ModalCheckbox Icon={ContractsIcon} identifier={'contracts'} />
        </Box>
        <hr />
        <Box className='flex justify-end gap-4 py-6 px-8'>
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
        </Box>
      </Box>
    </Modal>
  )
}

export default NotificationsModal
