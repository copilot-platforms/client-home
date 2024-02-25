export const copilotAPIUrl = process.env.COPILOT_API_URL || ''
export const copilotAPIKey = process.env.COPILOT_API_KEY || ''

export const apiUrl = `${
  process.env.VERCEL_ENV === 'development' ? 'http://' : 'https://'
}${process.env.VERCEL_URL}`

export const SentryConfig = {
  DSN: {
    CLIENT: process.env.SENTRY_DSN_CLIENT || '',
    SERVER: process.env.SENTRY_DSN_SERVER || '',
  },
  AUTH_TOKEN: process.env.SENTRY_TOKEN,
}
