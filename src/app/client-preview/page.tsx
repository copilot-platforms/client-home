import Handlebars from 'handlebars'
import { IClient, ICustomField, ISettings } from '@/types/interfaces'
import ClientPreview from '../components/ClientPreview'
import { apiUrl } from '@/config'
import Image from 'next/image'
import { z } from 'zod'
import { CopilotAPI } from '@/utils/copilotApiUtils'
import InvalidToken from '../components/InvalidToken'
import { defaultState } from '../../../defaultState'
import { defaultBannerImagePath, defaultBgColor } from '@/utils/constants'
import { getPreviewMode } from '@/utils/previewMode'
import { NoPreviewSupport } from './NoPreviewSupport'

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
  const copilotClient = new CopilotAPI(token)
  const tokenPayload = await copilotClient.getTokenPayload()
  if (!tokenPayload) {
    throw new Error('Failed to parse token payload')
  }
  if (getPreviewMode(tokenPayload)) {
    return <NoPreviewSupport />
  }

  const clientId = z.string().uuid().parse(searchParams.clientId)

  let settings: ISettings = {
    content: defaultState,
    backgroundColor: defaultBgColor,
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
    displayTasks: false,
  }

  const [defaultSetting, allCustomFields, _client, workspace] =
    await Promise.all([
      getSettings(token),
      getCustomFields(searchParams.token),
      getClient(clientId, token),
      copilotClient.getWorkspaceInfo(),
    ])

  const company = await getCompany(_client.companyId, token)

  if (defaultSetting) {
    settings = {
      ...defaultSetting,
      content: defaultSetting?.content || defaultState,
    }
  }

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

  for (const key of Object.keys(customFields)) {
    if (customFields[key]?.fullAddress) {
      customFields[key] = customFields[key].fullAddress
    }
  }

  const client = {
    ..._client,
    ...customFields,
    company: company.name,
  }

  const htmlContent = template({ client })

  const bannerImgUrl = !defaultSetting
    ? defaultBannerImagePath
    : settings?.bannerImage?.url

  return (
    <>
      <head>
        <link
          href={`https://fonts.googleapis.com/css2?family=${workspace.font}&display=swap`}
          rel='stylesheet'
        />
      </head>
      <div
        className={`overflow-y-auto overflow-x-hidden max-h-screen w-full`}
        style={{
          fontFamily: workspace.font.replaceAll('+', ' '),
          background: `${settings.backgroundColor}`,
        }}
      >
        {bannerImgUrl && (
          <Image
            className='w-full'
            src={bannerImgUrl}
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
          <ClientPreview
            content={htmlContent}
            settings={settings}
            token={searchParams.token}
            font={workspace.font}
          />
        </div>
      </div>
    </>
  )
}
