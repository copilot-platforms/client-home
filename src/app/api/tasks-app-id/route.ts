import { tasksAppId } from '@/config'
import { errorHandler } from '@/utils/common'
import { CopilotAPI } from '@/utils/copilotApiUtils'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const token = searchParams.get('token')
  if (!token) {
    return errorHandler('Missing token', 422)
  }

  const copilot = new CopilotAPI(z.string().parse(token))
  const appId = await copilot.getAppId(tasksAppId)
  return NextResponse.json({ appId })
}
