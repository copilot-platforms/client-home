import DBClient from '@/lib/db'
import {
  SettingRequest,
  SettingResponse,
  SettingResponseSchema,
} from '@/types/setting'
import { getCurrentUser } from '@/utils/common'
import { PrismaClient } from '@prisma/client'

export class SettingService {
  private prismaClient: PrismaClient = DBClient.getInstance()

  async findByWorkspaceId(
    workspaceId: string,
  ): Promise<SettingResponse | null> {
    const setting = await this.prismaClient.setting.findFirst({
      where: { workspaceId },
      include: {
        bannerImage: true,
      },
    })
    if (!setting) {
      return null
    }

    return SettingResponseSchema.parse(setting)
  }

  async save(
    requestData: SettingRequest & {
      workspaceId: string
    },
  ): Promise<void> {
    const currentUser = await getCurrentUser(requestData.token)

    const settingByWorkspaceId = await this.prismaClient.setting.findFirst({
      where: {
        workspaceId: requestData.workspaceId,
      },
    })

    if (!settingByWorkspaceId) {
      await this.prismaClient.setting.create({
        data: {
          bannerImageId: requestData.bannerImageId,
          backgroundColor: requestData.backgroundColor,
          content: requestData.content,
          createdById: currentUser.id,
          workspaceId: requestData.workspaceId,
          displayTasks: requestData.displayTasks,
          // @ts-expect-error Notifications has already been parsed and error handled
          notifications: requestData.notifications,
        },
      })

      return
    }

    await this.prismaClient.setting.update({
      where: {
        id: settingByWorkspaceId.id,
      },
      data: {
        bannerImageId: requestData.bannerImageId,
        backgroundColor: requestData.backgroundColor,
        content: requestData.content,
        displayTasks: requestData.displayTasks,
        // @ts-expect-error Notifications has already been parsed and error handled
        notifications: requestData.notifications,
      },
    })
  }
}
