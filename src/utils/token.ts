export const getTokenWithRetry = async (
  maxRetries = 3,
  delayMs = 250,
): Promise<string | null> => {
  if (typeof document === 'undefined') {
    return null
  }

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const token = new URLSearchParams(document.location?.search).get('token')
    if (token) {
      return token
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }
  return null
}
