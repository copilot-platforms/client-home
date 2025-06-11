import { IClient } from '@/types/interfaces'

export const clientToSelectorOption = (clients: IClient[]) => {
  return clients.map((client) => ({
    value: client.id,
    label: client.givenName,
    avatarSrc: client.avatarImageUrl,
    avatarFallbackColor: '#60606a',
    companyId: client.companyId,
    type: 'client',
  }))
}
