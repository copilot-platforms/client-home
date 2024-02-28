import Handlebars from 'handlebars'
import { IClient, ISettings } from '@/types/interfaces'
import ClientPreview from '../components/ClientPreview'
import { apiUrl } from '@/config'
import Image from 'next/image'
import { defaultBannerImagePath } from '@/utils/constants'

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

export default async function ClientPreviewPage({
  searchParams,
}: {
  searchParams: { token: string; clientId: string }
}) {
  const { token, clientId } = searchParams

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

  const defaultClient = await getClient(clientId, token)

  const company = await getCompany(defaultClient.companyId, token)

  const template = Handlebars?.compile(settings?.content)

  //add comma separator for custom fields
  const customFields: any = defaultClient?.customFields
  for (const key in customFields) {
    if (Array.isArray(customFields[key])) {
      //element[0].toUpperCase() + element.substring(1) is a hack to capitalize the first string, however changes in SDK response
      //is required.
      customFields[key] = customFields[key].map(
        (element: any) => ' ' + element[0].toUpperCase() + element.substring(1),
      )
    }
  }
  const client = {
    ...defaultClient,
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
