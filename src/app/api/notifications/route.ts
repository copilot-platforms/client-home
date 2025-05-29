import { NextRequest, NextResponse } from 'next/server'
import { parseToken } from '@/utils/api'
import { notificationEvents } from '@/utils/notifications'
import { errorHandler } from '@/utils/common'
import httpStatus from 'http-status'
import { ApiError } from '@/exceptions/ApiError'

export async function GET(request: NextRequest) {
  try {
    const { copilot, payload } = await parseToken(request)
    const clientId =
      request.nextUrl.searchParams?.get('clientId') || payload.clientId
    const companyId =
      request.nextUrl.searchParams?.get('companyId') || payload.companyId

    if (!clientId) {
      throw new ApiError(
        httpStatus.UNPROCESSABLE_ENTITY,
        'Failed to parse clientId',
      )
    }

    const [notifications, taskCounts] = await Promise.all([
      copilot.getNotifications(clientId),
      copilot.getIncompleteTaskCounts(clientId, companyId),
    ])
    const counts = {
      forms: 0,
      billing: 0,
      contracts: 0,
      tasks: taskCounts,
    }

    notifications.forEach(({ event }) => {
      if (event === notificationEvents.forms) {
        counts.forms += 1
      } else if (event === notificationEvents.billing) {
        counts.billing += 1
      } else if (event === notificationEvents.contracts) {
        counts.contracts += 1
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
