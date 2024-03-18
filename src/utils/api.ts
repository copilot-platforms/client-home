import { NextRequest } from 'next/server'
import { z } from 'zod'
import { CopilotAPI } from '@/utils/copilotApiUtils'
import { ClientToken, ClientTokenSchema, Token } from '@/types/common'
import { ApiError } from '@/exceptions/ApiError'
import httpStatus from 'http-status'

const parseToken = async (
  request: NextRequest,
): Promise<{ token: string; payload: Token; copilot: CopilotAPI }> => {
  const searchParams = request.nextUrl.searchParams
  const token = z.string().safeParse(searchParams?.get('token'))
  if (!token.success)
    throw new ApiError(
      httpStatus.UNPROCESSABLE_ENTITY,
      'Please provide a valid token',
    )

  const copilot = new CopilotAPI(token.data)
  const payload = await copilot.getTokenPayload?.()
  if (!payload)
    throw new ApiError(
      httpStatus.UNPROCESSABLE_ENTITY,
      'Cannot parse authorization data from token',
    )

  return { token: token.data, payload, copilot }
}

export const parseClientToken = async (
  request: NextRequest,
): Promise<{ token: string; payload: ClientToken; copilot: CopilotAPI }> => {
  const { token, payload, copilot } = await parseToken(request)

  const clientPayload = ClientTokenSchema.safeParse(payload)
  if (!clientPayload.success)
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Unable to authorize client from token',
    )

  return { token, payload: clientPayload.data, copilot }
}
