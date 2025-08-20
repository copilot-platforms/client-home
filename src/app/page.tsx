import EditorInterface from '@/app/components/EditorInterface'
import InvalidToken from '@/app/components/InvalidToken'
import SideBarInterface from '@/app/components/SideBarInterface'
import NotificationsModal from '@/components/NotificationsModal'
import { apiUrl } from '@/config'
import { ClientsResponseSchema, CompanyResponse } from '@/types/common'
import { IClient, ICustomField } from '@/types/interfaces'
import { CopilotAPI } from '@/utils/copilotApiUtils'
import { z } from 'zod'

export const revalidate = 0

async function listClients(token: string) {
  const copilotClient = new CopilotAPI(token)
  const clientList = ClientsResponseSchema.parse(
    await copilotClient.getClients(),
  )
  return (clientList.data
    ?.sort((a, b) => a.givenName.localeCompare(b.givenName))
    ?.map(
      (client) =>
        ({
          ...client,
          companyIds: client.companyIds?.length
            ? client.companyIds
            : [client.companyId], // companyId is soon to be deprecated
        }) as unknown as IClient,
    ) || []) as IClient[]
}

async function listCompanies(token: string): Promise<CompanyResponse[]> {
  const copilot = new CopilotAPI(token)
  return await copilot.getCompanies()
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
  const tokenParsed = z.string().safeParse(searchParams.token)
  if (!tokenParsed.success) {
    return <InvalidToken />
  }

  const token = tokenParsed.data

  const copilotClient = new CopilotAPI(token)

  const [clientList, companies, settings, workspace, customFields] =
    await Promise.all([
      listClients(token),
      listCompanies(token),
      getSettings(token),
      copilotClient.getWorkspaceInfo(),
      getCustomFields(token),
    ])

  return (
    <>
      <head>
        <link
          href={`https://fonts.googleapis.com/css2?family=${workspace.font}&display=swap`}
          rel='stylesheet'
        />
      </head>
      <div style={{ fontFamily: workspace.font.replaceAll('+', ' ') }}>
        <div className='flex flex-row'>
          <div className='relative w-full'>
            <EditorInterface
              settings={settings}
              token={token}
              font={workspace.font}
              customLabels={workspace.labels}
            />
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
              displayTasks={settings?.displayTasks}
              clientList={clientList}
              companies={companies}
              customFields={customFields}
            />
          </div>
          <NotificationsModal settings={settings} />
        </div>
      </div>
    </>
  )
}
