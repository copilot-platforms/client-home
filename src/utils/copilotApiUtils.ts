import { copilotApi } from 'copilot-node-sdk'
import type { CopilotAPI as SDK } from 'copilot-node-sdk'
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
  WorkspaceInfoSchema,
  Token,
  TokenSchema,
  NotificationsSchema,
} from '@/types/common'
import type { Notifications, WorkspaceInfo } from '@/types/common'
import { copilotAPIKey } from '@/config'

export class CopilotAPI {
  copilot: SDK

  constructor(apiToken: string) {
    this.copilot = copilotApi({
      apiKey: copilotAPIKey,
      token: apiToken,
    })
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
}
