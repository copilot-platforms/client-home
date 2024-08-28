'use client'

import { useAppState } from '@/hooks/useAppState'
import { IClient } from '@/types/interfaces'

interface LazyClientSetterProps {
  newClients: IClient[]
}

export const LazyClientSetter = ({ newClients }: LazyClientSetterProps) => {
  const appState = useAppState()
  console.log('setting new clients list')
  appState?.setClientList([...appState.appState.clientList, ...newClients])

  return <></>
}
