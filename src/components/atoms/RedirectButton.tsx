'use client'

import { ReactNode } from 'react'
import Button from './Button'
import { AvailablePortalRoutes } from '@/types/copilotPortal'

interface RedirectButtonProps {
  route?: AvailablePortalRoutes
  children: string | ReactNode
  execute: boolean
  appId?: string
}

const RedirectButton = ({
  route,
  children,
  execute,
  appId,
}: RedirectButtonProps) => {
  const handleClick = () => {
    console.log('postMessage', {
      type: 'history.push',
      id: appId,
      route: 'apps',
    })

    if (execute) {
      if (appId) {
        window.parent.postMessage(
          { type: 'history.push', id: appId, route: 'apps' },
          '*',
        )
      } else {
        window.parent.postMessage({ type: 'history.push', route }, '*')
      }
    }
  }

  return <Button handleClick={handleClick}>{children}</Button>
}

export default RedirectButton
