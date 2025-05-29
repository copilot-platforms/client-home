import { errorHandler } from '@/utils/common'
import { CopilotAPI } from '@/utils/copilotApiUtils'
import { NextResponse, NextRequest } from 'next/server'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get('token')
  if (!token) {
    return errorHandler('Missing token', 422)
  }

  const copilotClient = new CopilotAPI(z.string().parse(token))
  try {
    const clients = await copilotClient.getClients()

    return NextResponse.json(clients)
  } catch (error: unknown) {
    console.error(`There was an error getting clients: ${error}`)
    return errorHandler('Clients not found.', 404)
  }
}
