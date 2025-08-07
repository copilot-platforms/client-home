import { styled } from '@mui/material'
import { UserCompanySelector } from 'copilot-design-system'

export const CopilotSelector = styled(UserCompanySelector)(() => ({
  width: '240px',
  height: '40px',
  zIndex: 69420,
  boxSizing: 'border-box',
  '[id^="react-select-"][id$="-placeholder"]': {
    fontSize: '14px',
  },
  '[id^="react-select-"][id*="-option-"]': {
    padding: '10px 8px',
  },
}))
