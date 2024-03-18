export const notificationEvents = {
  forms: 'forms.requested',
  billing: 'invoice.requested',
  contracts: 'contract.requested',
}

export const defaultNotificationOptions = [
  { key: 'billing', show: true, order: 0 },
  { key: 'forms', show: true, order: 1 },
  { key: 'contracts', show: true, order: 2 },
]
