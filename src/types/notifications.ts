export type NotificationOption = 'billing' | 'forms' | 'contracts'

interface NotificationOptionState {
  show: boolean
  order: number
}
export interface NotificationState {
  billing: NotificationOptionState
  forms: NotificationOptionState
  contracts: NotificationOptionState
}
