export enum PortalRoutes {
  Messages = 'messages',
  Files = 'files',
  Contracts = 'contracts',
  Forms = 'forms',
  Billing = 'billing',
  Helpdesk = 'helpdesk',
  Profile = 'profile',
  Settings = 'settings',
  Notifications = 'notifications',
}

export type AvailablePortalRoutes = `${PortalRoutes}`; // NOTE: this creates string union of enum values
