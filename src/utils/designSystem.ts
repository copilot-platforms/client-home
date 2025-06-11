import { CompanyResponse } from '@/types/common'
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

export const companyToSelectorOption = (companies: CompanyResponse[]) => {
  return companies.map((company) => ({
    value: company.id,
    label: company.name,
    companyId: company.id,
    type: 'company',
  }))
}
