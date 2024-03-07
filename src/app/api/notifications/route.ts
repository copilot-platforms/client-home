import { NextRequest, NextResponse } from 'next/server'
import { parseClientToken } from '@/utils/api'
import { notificationEvents } from '@/utils/notifications'

export async function GET(request: NextRequest) {
  try {
    const { copilot, payload } = await parseClientToken(request)
    const notifications = await copilot.getNotifications(payload.clientId)
    const counts = {
      forms: 0,
      billing: 0,
      contract: 0,
    }

    notifications.forEach(({ event }) => {
      if (event === notificationEvents.forms) {
        counts.forms += 1
      } else if (event === notificationEvents.billing) {
        counts.billing += 1
      } else if (event === notificationEvents.contracts) {
        counts.contract += 1
      }
    })

    return NextResponse.json({ ...counts })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 },
    )
  }
}
