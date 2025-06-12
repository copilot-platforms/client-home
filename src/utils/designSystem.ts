import { CompanyResponse } from '@/types/common'
import { IClient } from '@/types/interfaces'

export const clientToSelectorOption = (
  clients?: IClient[],
  companies?: CompanyResponse[],
) => {
  console.log('companies', companies)
  return (
    clients?.map((client) => ({
      value: client.id,
      label: client.givenName,
      avatarSrc: client.avatarImageUrl,
      avatarFallbackColor:
        companies?.find((company) => company.id === client.companyId)
          ?.fallbackColor || '#C9CBCD',
      companyId: client.companyId,
      type: 'client',
    })) || []
  )
}

export const companyToSelectorOption = (companies?: CompanyResponse[]) => {
  return (
    companies?.map((company) => ({
      value: company.id,
      label: company.name,
      companyId: company.id,
      avatarSrc: company.iconImageUrl,
      avatarFallbackColor: company.fallbackColor || '#C9CBCD',
      type: 'company',
    })) || []
  )
}
