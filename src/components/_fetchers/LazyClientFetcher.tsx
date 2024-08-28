import { apiUrl } from '@/config'
import { ClientsResponseSchema } from '@/types/common'
import { LazyClientSetter } from './LazyClientSetter'
import { IClient } from '@/types/interfaces'

interface LazyClientFetcherProps {
  token: string
  nextToken?: string
}

export const LazyClientFetcher = async ({
  token,
  nextToken,
}: LazyClientFetcherProps) => {
  const MAX_FETCH_LIMIT = 5_000

  if (!nextToken) {
    return <></>
  }
  const res = await fetch(
    `${apiUrl}/api/clients/?token=${token}&nextToken=${nextToken}&limit=${MAX_FETCH_LIMIT}`,
  )
  const newClients = ClientsResponseSchema.parse(await res.json())
  const newClientsData = (newClients.data?.sort((a, b) =>
    a.givenName.localeCompare(b.givenName),
  ) || []) as IClient[]

  return <LazyClientSetter newClients={newClientsData} />
}
