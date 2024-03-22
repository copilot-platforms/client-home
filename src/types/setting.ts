import { z } from 'zod'
import { MediaResponseSchema } from '@/types/media'
import { NotificationsSchema } from './notifications'

export const SettingRequestSchema = z.object({
  bannerImageId: z.string().nullable().optional(),
  backgroundColor: z.string().nullable().optional(),
  notifications: NotificationsSchema,
  displayTasks: z.boolean(),
  content: z.string().nullable().optional(),
  token: z.string(),
})
export type SettingRequest = z.infer<typeof SettingRequestSchema>

export const SettingResponseSchema = z.object({
  id: z.string(),
  backgroundColor: z.string().nullable(),
  displayTasks: z.boolean(),
  notifications: NotificationsSchema,
  content: z.string().nullable(),
  createdById: z.string().uuid(),
  bannerImage: MediaResponseSchema.nullable(),
  workspaceId: z.string(),
})
export type SettingResponse = z.infer<typeof SettingResponseSchema>
