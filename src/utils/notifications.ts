// These events are included in the `event` key from Assembly API notifications response
// "tasks" is not included because we can directly access the tasks from its API
export const notificationEvents = {
  forms: 'formResponse.requested',
  billing: 'invoice.requested',
  contracts: 'contract.requested',
}

// Default ordering and settings of Notification options modal
export const defaultNotificationOptions = [
  { key: 'billing', show: true, order: 0 },
  { key: 'forms', show: true, order: 1 },
  { key: 'contracts', show: true, order: 2 },
  { key: 'tasks', show: true, order: 3 },
]
