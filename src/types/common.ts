import { z } from 'zod'

export const TokenSchema = z.object({
  clientId: z.string().optional(),
  companyId: z.string().optional(),
  internalUserId: z.string().optional(),
  workspaceId: z.string(),
})
export type Token = z.infer<typeof TokenSchema>

export const ClientTokenSchema = z.object({
  clientId: z.string(),
  companyId: z.string().optional(),
  workspaceId: z.string(),
})
export type ClientToken = z.infer<typeof ClientTokenSchema>

export const MeResponseSchema = z.object({
  id: z.string(),
  givenName: z.string(),
  familyName: z.string(),
  email: z.string(),
})
export type MeResponse = z.infer<typeof MeResponseSchema>

export const ClientResponseSchema = z.object({
  id: z.string(),
  givenName: z.string(),
  familyName: z.string(),
  email: z.string(),
  companyId: z.string(),
  customFields: z
    .record(
      z.string(),
      z.union([
        z.string().nullable(),
        z.array(z.string()).nullable(),
        z.record(z.string(), z.any()).nullable(),
      ]),
    )
    .nullable(),
  avatarImageUrl: z.string().nullable(),
})
export type ClientResponse = z.infer<typeof ClientResponseSchema>

export const ClientsResponseSchema = z.object({
  data: z.array(ClientResponseSchema).nullable(),
})
export type ClientsResponse = z.infer<typeof ClientsResponseSchema>

export const CompanyResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  iconImageUrl: z.string(),
  fallbackColor: z.string().optional(),
})
export type CompanyResponse = z.infer<typeof CompanyResponseSchema>

export const CustomFieldResponseSchema = z.object({
  data: z
    .array(
      z.object({
        id: z.string(),
        key: z.string(),
        name: z.string(),
        type: z.string(),
        order: z.number(),
        object: z.string(),
        options: z
          .array(
            z.object({
              id: z.string(),
              key: z.string(),
              label: z.string(),
              color: z.string(),
            }),
          )
          .optional(),
      }),
    )
    .nullable(),
})
export type CustomFieldResponse = z.infer<typeof CustomFieldResponseSchema>

export const WorkspaceInfoSchema = z.object({
  font: z.string(),
})

export type WorkspaceInfo = z.infer<typeof WorkspaceInfoSchema>

export const NotificationsSchema = z.array(
  z.object({
    event: z.string(),
  }),
)
export type Notifications = z.infer<typeof NotificationsSchema>

export const CustomFieldsSchema = z.record(
  z.string(),
  z.union([
    //
    z.number(),
    z.string(),
    z.record(z.string(), z.any()),
    z.array(z.union([z.number(), z.string(), z.record(z.string(), z.any())])),
  ]),
)
export type CustomField = z.infer<typeof CustomFieldsSchema>

export const AppInstallsDataSchema = z.object({
  appId: z.string().optional(),
  displayName: z.string().optional(),
  id: z.string().optional(),
  type: z.string().optional(),
  object: z.string().optional(),
})
export const AppInstallsResponseSchema = z.array(AppInstallsDataSchema)
export type AppInstallsResponse = z.infer<typeof AppInstallsResponseSchema>
