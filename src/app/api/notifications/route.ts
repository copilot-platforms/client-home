import { NextRequest, NextResponse } from 'next/server'
import { parseClientToken } from '@/utils/api'
import { notificationEvents } from '@/utils/notifications'
import { errorHandler } from '@/utils/common'

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
  } catch (error: unknown) {
    if (error instanceof Error) {
      const status = 'status' in error ? Number(error.status) : 500
      return errorHandler(error.message, status)
    }
  }
}
