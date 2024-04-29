import { NextResponse } from 'next/server'
import { CopilotAPI } from './copilotApiUtils'
import { MeResponse, Token } from '@/types/common'

export async function getCurrentUser(apiToken: string): Promise<MeResponse> {
  const copilotClient = new CopilotAPI(apiToken)

  const me = await copilotClient.me()
  if (!me) {
    throw new Error('You are not logged in')
  }

  return me
}

export async function getTokenPayload(
  apiToken: string,
): Promise<Token | undefined> {
  const copilotClient = new CopilotAPI(apiToken)
  return await copilotClient.getTokenPayload()
}

export function errorHandler(message: string, status: number = 200) {
  return NextResponse.json(
    { message },
    {
      status,
    },
  )
}
