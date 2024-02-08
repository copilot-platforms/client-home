import { apiUrl } from '@/config'
import EditorInterface from './components/EditorInterface'
import SideBarInterface from './components/SideBarInterface'
import { CopilotAPI } from '@/utils/copilotApiUtils'

export const revalidate = 0

async function listClients(token: string) {
  const copilotClient = new CopilotAPI(token)
  const clientList = await copilotClient.getClients()

  return clientList.data
}

async function getCustomFields(token: string) {
  const copilotClient = new CopilotAPI(token)
  const customFieldsList = await copilotClient.getCustomFields()

  return customFieldsList.data
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
  const { token } = searchParams

  const clientList = await listClients(token)
  const customFields = await getCustomFields(token)
  const settings = await getSettings(token)

  return (
    <div>
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
  )
}
