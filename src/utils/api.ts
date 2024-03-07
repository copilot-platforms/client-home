import { NextRequest } from 'next/server'
import { z } from 'zod'
import Error from '@/app/error'
import { CopilotAPI } from './copilotApiUtils'
import { ClientToken, ClientTokenSchema, Token } from '@/types/common'

const parseToken = async (
  request: NextRequest,
): Promise<{ token: string; payload: Token; copilot: CopilotAPI }> => {
  const searchParams = request.nextUrl.searchParams
  const token = z.string().safeParse(searchParams?.get('token'))
  if (!token.success) throw new APIError(400, 'Please provide a valid token')

  const copilot = new CopilotAPI(token.data)
  const payload = await copilot.getTokenPayload?.()
  if (!payload)
    throw new APIError(401, 'Cannot parse authorization data from token')

  return { token: token.data, payload, copilot }
}

export const parseClientToken = async (
  request: NextRequest,
): Promise<{ token: string; payload: ClientToken; copilot: CopilotAPI }> => {
  const { token, payload, copilot } = await parseToken(request)

  const clientPayload = ClientTokenSchema.safeParse(payload)
  if (!clientPayload.success)
    throw new APIError(401, 'Unable to authorize client from token')

  return { token, payload: clientPayload.data, copilot }
}

// @ts-expect-error Extending JS base error class
export class APIError extends Error {
  public status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}
