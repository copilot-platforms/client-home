import { errorHandler } from '@/utils/common'
import { CopilotAPI } from '@/utils/copilotApiUtils'
import { NextResponse, NextRequest } from 'next/server'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const companyId = searchParams.get('companyId')
  const token = searchParams.get('token')
  if (!token) {
    return errorHandler('Missing token', 422)
  }
  if (!companyId) {
    return errorHandler('Missing company Id', 422)
  }
  const copilotClient = new CopilotAPI(z.string().parse(token))
  try {
    const company = await copilotClient.getCompany(z.string().parse(companyId))

    return NextResponse.json({ data: company })
  } catch (error) {
    console.log(error)
    return errorHandler('Company not found.', 404)
  }
}
