import { apiUrl } from '@/config'
import EditorInterface from './components/EditorInterface'
import SideBarInterface from './components/SideBarInterface'
import { CopilotAPI } from '@/utils/copilotApiUtils'
import { ClientsResponseSchema } from '@/types/common'
import { IClient, ICustomField } from '@/types/interfaces'
import { z } from 'zod'
import Head from 'next/head'

export const revalidate = 0

async function listClients(token: string) {
  const copilotClient = new CopilotAPI(token)
  const clientList = ClientsResponseSchema.parse(
    await copilotClient.getClients(),
  )

  return (clientList.data?.sort((a, b) =>
    a.givenName.localeCompare(b.givenName),
  ) || []) as IClient[]
}

async function getCustomFields(token: string) {
  const copilotClient = new CopilotAPI(token)
  const customFieldsList = await copilotClient.getCustomFields()

  return (customFieldsList.data || []) as ICustomField[]
}

async function getSettings(token: string) {
  const res = await fetch(`${apiUrl}/api/settings?token=${token}`)

  if (!res.ok) {
    throw new Error('Something went wrong while fetching settings!')
  }

  const { data } = await res.json()

  return data
}

export default async function Page({
  searchParams,
}: {
  searchParams: { token: string }
}) {
  const token = z.string().parse(searchParams.token)

  const copilotClient = new CopilotAPI(token)

  const [clientList, settings, workspace, customFields] = await Promise.all([
    listClients(token),
    getSettings(token),
    // Promise.resolve(null),
    copilotClient.getWorkspaceInfo(),
    getCustomFields(token),
  ])

  const font = workspace.font?.replaceAll(' ', '+')

  return (
    <>
      <Head>
        <link
          href={`https://fonts.googleapis.com/css2?family=${font}&display=swap`}
          rel='stylesheet'
        />
      </Head>
      <div style={{ fontFamily: workspace.font }}>
        <div className='flex flex-row'>
          <div className='relative w-full'>
            <EditorInterface settings={settings} token={token} />
          </div>
          <div
            className='border-1 border-l border-slate-300 xl:hidden'
            style={{
              minWidth: '350px',
              maxWidth: '350px',
              wordWrap: 'break-word',
              height: '100vh',
            }}
          >
            <SideBarInterface
              clientList={clientList}
              customFields={customFields}
            />
          </div>
        </div>
      </div>
    </>
  )
}
