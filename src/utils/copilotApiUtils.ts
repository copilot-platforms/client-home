import { copilotAPIKey, tasksAppApiKey } from '@/config'
import type { Notifications, WorkspaceInfo } from '@/types/common'
import {
  ClientResponse,
  ClientResponseSchema,
  ClientsResponseSchema,
  CompanyResponse,
  CompanyResponseSchema,
  CustomFieldResponse,
  CustomFieldResponseSchema,
  MeResponse,
  MeResponseSchema,
  NotificationsSchema,
  Token,
  TokenSchema,
  WorkspaceInfoSchema,
} from '@/types/common'
import { TASKS_APP_URL } from '@/utils/constants'
import { encodePayload } from '@/utils/crypto'
import type { CopilotAPI as SDK } from 'copilot-node-sdk'
import { copilotApi } from 'copilot-node-sdk'

export class CopilotAPI {
  copilot: SDK

  constructor(private readonly token: string) {
    this.copilot = copilotApi({ apiKey: copilotAPIKey, token })
  }

  async me(): Promise<MeResponse | null> {
    const tokenPayload = await this.getTokenPayload()
    const id = tokenPayload?.internalUserId || tokenPayload?.clientId
    if (!tokenPayload || !id) return null

    const retrieveCurrentUserInfo = tokenPayload.internalUserId
      ? this.copilot.retrieveInternalUser
      : this.copilot.retrieveClient
    const currentUserInfo = await retrieveCurrentUserInfo({ id })

    return MeResponseSchema.parse(currentUserInfo)
  }

  // Get parsed payload from token
  async getTokenPayload(): Promise<Token | undefined> {
    return TokenSchema.parse(await this.copilot.getTokenPayload?.())
  }

  async getClient(clientId: string): Promise<ClientResponse> {
    return ClientResponseSchema.parse(
      await this.copilot.retrieveClient({ id: clientId }),
    )
  }

  async getClients() {
    return ClientsResponseSchema.parse(
      await this.copilot.listClients({ limit: 5000 }),
    )
  }

  async getCompany(companyId: string): Promise<CompanyResponse> {
    return CompanyResponseSchema.parse(
      await this.copilot.retrieveCompany({ id: companyId }),
    )
  }

  async getWorkspaceInfo(): Promise<WorkspaceInfo> {
    return WorkspaceInfoSchema.parse(await this.copilot.retrieveWorkspace())
  }

  async getCustomFields(): Promise<CustomFieldResponse> {
    return CustomFieldResponseSchema.parse(
      await this.copilot.listCustomFields(),
    )
  }

  async getNotifications(recipientId: string): Promise<Notifications> {
    const notifications = await this.copilot.listNotifications({
      recipientId,
    })
    return NotificationsSchema.parse(notifications.data)
  }

  async getIncompleteTaskCounts(
    clientId: string,
    companyId: string,
  ): Promise<number> {
    const tokenPayload = await this.getTokenPayload()
    if (!tokenPayload || !tokenPayload.workspaceId) {
      throw new Error('Could not parse token')
    }

    const clientPayload = {
      workspaceId: tokenPayload.workspaceId,
      clientId,
      companyId,
    }

    const baseUrl = new URL('/api/tasks/public', TASKS_APP_URL)
    baseUrl.searchParams.set(
      'token',
      encodePayload(tasksAppApiKey, clientPayload),
    )
    baseUrl.searchParams.set('limit', '1000000')

    const todoUrl = new URL(baseUrl)
    todoUrl.searchParams.set('status', 'todo')

    const inProgressUrl = new URL(baseUrl)
    inProgressUrl.searchParams.set('status', 'inProgress')

    const processTaskResponse = async (
      res: Promise<Response>,
    ): Promise<number> =>
      res.then((res) => res.json()).then(({ data }) => data.length)

    const [todo, inProgress] = await Promise.all([
      processTaskResponse(fetch(todoUrl.toString())),
      processTaskResponse(fetch(inProgressUrl.toString())),
    ])
    return todo + inProgress
  }
}
