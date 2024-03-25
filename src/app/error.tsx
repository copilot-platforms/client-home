'use client' // Error components must be Client Components

import { Stack, Typography } from '@mui/material'
import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

export default function Error({
  error,
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    const reportId = Sentry.captureException(error)

    console.info('Error reported:', reportId)
    console.error(error)
  }, [error])

  return (
    <Stack
      direction='column'
      justifyContent='center'
      textAlign='center'
      sx={{
        width: { xs: '90%', md: '30%' },
        margin: '0  auto',
        rowGap: '2em',
        mt: '10em',
      }}
    >
      <Typography
        variant='h4'
        sx={{
          fontSize: { xs: '16px', md: '32px' },
        }}
      >
        Error: {error.message}
      </Typography>
    </Stack>
  )
}
