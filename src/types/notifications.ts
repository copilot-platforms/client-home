import { z } from 'zod'

export type NotificationOption = 'billing' | 'forms' | 'contracts'

export const NotificationOptionSchema = z.object({
  key: z.string(),
  show: z.boolean(),
  order: z.number(),
})

export const NotificationsSchema = z.array(NotificationOptionSchema).nullish()
// export const NotificationsSchema = z.any()

export type Notification = z.infer<typeof NotificationsSchema>
