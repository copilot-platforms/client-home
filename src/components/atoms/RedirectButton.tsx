'use client'

import { ReactNode } from 'react'
import Button from './Button'
import { AvailablePortalRoutes } from '@/types/copilotPortal'

interface RedirectButtonProps {
  route: AvailablePortalRoutes
  children: string | ReactNode
}

const RedirectButton = ({ route, children }: RedirectButtonProps) => {
  const handleClick = () => {
    window.parent.postMessage({ type: 'history.push', route }, '*')
  }

  return <Button handleClick={handleClick}>{children}</Button>
}

export default RedirectButton
