'use client'

import { Typography, Button as MuiButton } from '@mui/material'
import { TypographyPropsVariantOverrides } from '@mui/material/Typography/Typography'
import { OverridableStringUnion } from '@mui/types'
import { Variant } from '@mui/material/styles/createTypography'
import { ReactNode } from 'react'

interface ButtonProps {
  children: string | ReactNode
  typographyVariant?: OverridableStringUnion<
    Variant | 'inherit',
    TypographyPropsVariantOverrides
  >
  handleClick?: () => void
}

const Button = ({
  children,
  handleClick,
  typographyVariant = 'body1',
}: ButtonProps) => {
  return (
    <MuiButton
      variant='outlined'
      onClick={handleClick}
      sx={{
        padding: '4px 8px',
        borderRadius: '4px',
        border: '1px solid #DFE1E4',
        background: '#ffffff',
        color: '#212B36',
        textTransform: 'none',
        '&:hover': {
          background: '#ffffff',
          border: '1px solid #DFE1E4',
        },
      }}
    >
      <Typography variant={typographyVariant}>{children}</Typography>
    </MuiButton>
  )
}

export default Button
