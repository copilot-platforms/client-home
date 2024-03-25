import { NextRequest } from 'next/server'
import { z } from 'zod'
import { CopilotAPI } from '@/utils/copilotApiUtils'
import { Token } from '@/types/common'
import { ApiError } from '@/exceptions/ApiError'
import httpStatus from 'http-status'

export const parseToken = async (
  request: NextRequest
): Promise<{ token: string; payload: Token; copilot: CopilotAPI }> => {
  const searchParams = request.nextUrl.searchParams
  const token = z.string().safeParse(searchParams?.get('token'))
  if (!token.success)
    throw new ApiError(
      httpStatus.UNPROCESSABLE_ENTITY,
      'Please provide a valid token'
    )

  const copilot = new CopilotAPI(token.data)
  const payload = await copilot.getTokenPayload?.()
  if (!payload)
    throw new ApiError(
      httpStatus.UNPROCESSABLE_ENTITY,
      'Cannot parse authorization data from token'
    )

  return { token: token.data, payload: payload, copilot }
}
