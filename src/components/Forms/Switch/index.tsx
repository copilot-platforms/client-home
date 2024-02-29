import { SwitchIconSelected, SwitchIconUnselected } from '@/icons'
import { Box } from '@mui/material'

export const Switch = ({
  value,
  onChange,
}: {
  value: boolean
  onChange?: () => void
}) => {
  const ActiveIcon = value ? SwitchIconSelected : SwitchIconUnselected

  return (
    <Box
      onClick={onChange}
      className='cursor-pointer flex justify-center items-center'
    >
      <ActiveIcon style={{ scale: 1.4 }} />
    </Box>
  )
}
