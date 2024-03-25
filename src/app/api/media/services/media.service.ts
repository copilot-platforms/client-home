import DBClient from '@/lib/db'
import { MediaRequest, MediaResponse, MediaResponseSchema } from '@/types/media'
import { getCurrentUser } from '@/utils/common'
import { PrismaClient } from '@prisma/client'

export class MediaService {
  private prismaClient: PrismaClient = DBClient.getInstance()

  async save(
    requestData: MediaRequest,
    blobUrl: string
  ): Promise<MediaResponse | null> {
    const currentUser = await getCurrentUser(requestData.token)
    const media = await this.prismaClient.media.create({
      data: {
        url: blobUrl,
        filename: requestData.file.name,
        contentType: requestData.file.type,
        size: requestData.file.size,
        createdById: currentUser.id,
      },
    })
    if (!media) {
      return null
    }

    return MediaResponseSchema.parse(media)
  }

  async findByUrl(url: string): Promise<MediaResponse | null> {
    const media = await this.prismaClient.media.findFirst({
      where: {
        url: url,
      },
    })
    if (!media) {
      return null
    }

    return MediaResponseSchema.parse(media)
  }

  async delete(mediaId: string): Promise<boolean> {
    try {
      await this.prismaClient.media.delete({
        where: {
          id: mediaId,
        },
      })

      return true
    } catch (error) {
      return false
    }
  }
}
