import { NextRequest, NextResponse } from 'next/server'
import { parseToken } from '@/utils/api'

export async function GET(request: NextRequest) {
  const { payload, error } = await parseToken(request)
  if (error) {
    NextResponse.json({ error }, { status: 401 })
  }

  if (!payload?.clientId) {
    NextResponse.json(
      { error: 'Failed to parse client from token' },
      { status: 401 },
    )
  }

  // Mock API since notifications support in SDK is still wip
  return NextResponse.json({ billing: 5, forms: 6, contracts: 7 })
}
