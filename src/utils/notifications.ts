// These events are included in the `event` key from Copilot API notifications response
export const notificationEvents = {
  forms: 'forms.requested',
  billing: 'invoice.requested',
  contracts: 'contract.requested',
}

// Default ordering and settings of Notification options modal
export const defaultNotificationOptions = [
  { key: 'billing', show: true, order: 0 },
  { key: 'forms', show: true, order: 1 },
  { key: 'contracts', show: true, order: 2 },
]
