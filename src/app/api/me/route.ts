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
    const me = await copilotClient.me()

    return NextResponse.json(me)
  } catch (error) {
    console.log(error)
    return errorHandler('User not found.', 404)
  }
}
