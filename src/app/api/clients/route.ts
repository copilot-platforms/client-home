import { errorHandler } from '@/utils/common'
import { CopilotAPI } from '@/utils/copilotApiUtils'
import { NextResponse, NextRequest } from 'next/server'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get('token')
  const nextToken = searchParams.get('nextToken') || undefined
  const limit = searchParams.get('limit') || '100'
  if (!token) {
    return errorHandler('Missing token', 422)
  }

  const copilotClient = new CopilotAPI(z.string().parse(token))
  try {
    const clients = await copilotClient.getClients(+limit, nextToken)

    return NextResponse.json(clients)
  } catch (error: unknown) {
    console.log(`There was an error getting clients: ${error}`)
    return errorHandler('Clients not found.', 404)
  }
}
