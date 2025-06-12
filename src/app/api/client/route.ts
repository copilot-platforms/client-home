import { errorHandler } from '@/utils/common'
import { CopilotAPI } from '@/utils/copilotApiUtils'
import { NextResponse, NextRequest } from 'next/server'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const clientId = searchParams.get('clientId')
  const token = searchParams.get('token')
  if (!token) {
    return errorHandler('Missing token', 422)
  }
  if (!clientId) {
    errorHandler('Missing client Id', 422)
  }
  const copilotClient = new CopilotAPI(z.string().parse(token))
  try {
    const client = await copilotClient.getClient(z.string().parse(clientId))
    return NextResponse.json({ data: client })
  } catch (error) {
    console.error(error)
    return errorHandler('Client not found.', 404)
  }
}
