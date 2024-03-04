import { z } from 'zod'

export type NotificationOption = 'billing' | 'forms' | 'contracts'

export const NotificationOptionSchema = z.object({
  show: z.boolean().optional(),
  order: z.number().optional(),
})

export const NotificationsSchema = z.object({
  billing: NotificationOptionSchema,
  forms: NotificationOptionSchema,
  contracts: NotificationOptionSchema,
})

export type Notification = z.infer<typeof NotificationsSchema>
