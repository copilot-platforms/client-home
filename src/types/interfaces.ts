import { Notification } from './notifications'

export interface ISettings {
  content: string
  backgroundColor: string
  id: string
  bannerImage: {
    id: string
    url: string
    filename: string
    contentType: string
    size: number
    createdById: string
  } | null
  createdById: string
  displayTasks?: boolean
  notifications?: Notification
}

export interface IClient {
  id: string
  object: string
  createdAt: string
  givenName: string
  familyName: string
  email: string
  companyId: string
  status: string
  address: string
  inviteUrl: string
  firstLoginDate: string
  lastLoginDate: string
  lastActiveDate: string
  customFields: object
  avatarImageUrl: string | null
}

export interface ICustomField {
  id: string
  key: string
  name: string
  type: string
  order: number
  object: string
  options: any
}

export enum Formatter {
  h1 = 'Heading 1',
  h2 = 'Heading 2',
  h3 = 'Heading 3',
  text = 'Text',
  autofillField = 'Autofill Fields',
  bulletList = 'Bullet List',
  numberedList = 'Numbered List',
  upload = 'Upload',
  embed = 'Embed',
  link = 'Link',
  unlink = 'Unlink',
  table = 'Table',
  callout = 'Callout',
  empty = 'No Options',
}

export interface INotification {
  forms: number
  billing: number
  contract: number
}
