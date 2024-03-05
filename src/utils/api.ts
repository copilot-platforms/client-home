import { Token } from '@/types/common'
import { NextRequest } from 'next/server'
import { getTokenPayload } from './common'
import { z } from 'zod'

export const parseToken = async (
  request: NextRequest,
): Promise<{
  token: string | null
  payload: Token | null
  error: string | null
}> => {
  const searchParams = request.nextUrl.searchParams
  const token = z.string().safeParse(searchParams?.get('token'))
  if (!token.success)
    return { token: null, payload: null, error: 'Please provide a token' }

  const payload = await getTokenPayload(token.data)
  if (!payload)
    return {
      token: null,
      payload: null,
      error: 'Could not parse payload from token',
    }

  return { token: token.data, payload, error: null }
}
