export const copilotAPIUrl = process.env.COPILOT_API_URL || ''
export const copilotAPIKey = process.env.COPILOT_API_KEY || ''

export const apiUrl = `${
  process.env.VERCEL_ENV === 'development' ? 'http://' : 'https://'
}${process.env.VERCEL_URL}`

export const SentryConfig = {
  DSN: process.env.SENTRY_DSN || '',
  AUTH_TOKEN: process.env.SENTRY_TOKEN,
}
