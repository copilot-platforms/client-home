import Handlebars from 'handlebars'
import { IClient, ICustomField, ISettings } from '@/types/interfaces'
import ClientPreview from '../components/ClientPreview'
import { apiUrl } from '@/config'
import Image from 'next/image'
import { z } from 'zod'
import { CopilotAPI } from '@/utils/copilotApiUtils'
import InvalidToken from '../components/InvalidToken'

export const revalidate = 0

async function getSettings(token: string) {
  const { data } = await fetch(`${apiUrl}/api/settings?token=${token}`).then(
    (res) => res.json(),
  )
  return data
}

async function getClient(clientId: string, token: string): Promise<IClient> {
  const res = await fetch(
    `${apiUrl}/api/client?clientId=${clientId}&token=${token}`,
  )
  if (!res.ok) {
    throw new Error(`No client found with '${token}' token`)
  }
  const { data } = await res.json()
  return data
}

async function getCompany(companyId: string, token: string) {
  const res = await fetch(
    `${apiUrl}/api/companies?companyId=${companyId}&token=${token}`,
  )

  const { data } = await res.json()
  return data
}

async function getCustomFields(token: string) {
  const copilotClient = new CopilotAPI(token)
  const customFieldsList = await copilotClient.getCustomFields()

  return (customFieldsList.data || []) as ICustomField[]
}

export default async function ClientPreviewPage({
  searchParams,
}: {
  searchParams: { token: string; clientId: string }
}) {
  const tokenParsed = z.string().safeParse(searchParams.token)
  if (!tokenParsed.success) {
    return <InvalidToken />
  }

  const token = tokenParsed.data

  const clientId = z.string().uuid().parse(searchParams.clientId)
  const allCustomFields = await getCustomFields(searchParams.token)

  let settings: ISettings = {
    content: '',
    backgroundColor: '#ffffff',
    id: '',
    bannerImage: {
      id: '',
      url: '',
      filename: '',
      contentType: '',
      size: 0,
      createdById: '',
    },
    createdById: '',
  }

  const defaultSetting = await getSettings(token)

  if (defaultSetting) {
    settings = defaultSetting
  }

  const _client = await getClient(clientId, token)

  const company = await getCompany(_client.companyId, token)

  const template = Handlebars?.compile(settings?.content)

  //add comma separator for custom fields
  const customFields: any = _client?.customFields

  for (const key in customFields) {
    // Check if the value is an array and if the key exists in allCustomFields
    if (
      Array.isArray(customFields[key]) &&
      allCustomFields.some((field) => field.key === key)
    ) {
      // Map the values to their corresponding labels
      customFields[key] = customFields[key].map((value: string[]) => {
        const option: any = (allCustomFields as any)
          .find((field: any) => field.key === key)
          .options.find((opt: any) => opt.key === value)
        return option ? ' ' + option.label : ' ' + value
      })
    }
  }

  const client = {
    ..._client,
    ...customFields,
    company: company.name,
  }

  const htmlContent = template({ client })

  const bannerImgUrl = !defaultSetting
    ? '/images/default_banner.png'
    : settings?.bannerImage?.url

  return (
    <div
      className={`overflow-y-auto overflow-x-hidden max-h-screen w-full`}
      style={{
        background: `${settings.backgroundColor}`,
      }}
    >
      {settings?.bannerImage?.url && (
        <Image
          className='w-full'
          src={bannerImgUrl || '/images/default_banner.png'}
          alt='banner image'
          width={0}
          height={0}
          sizes='100vw'
          style={{
            width: '100%',
            height: '25vh',
            objectFit: 'cover',
          }}
        />
      )}
      <div
        className='px-14 py-350 max-w-xl'
        style={{
          background: `${settings.backgroundColor}`,
          margin: '0 auto',
        }}
      >
        <ClientPreview content={htmlContent} />
      </div>
    </div>
  )
}
