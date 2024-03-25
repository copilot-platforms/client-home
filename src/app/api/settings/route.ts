import { NextRequest, NextResponse } from 'next/server';
import { SettingService } from '@/app/api/settings/services/setting.service';
import { SettingRequestSchema } from '@/types/setting';
import { errorHandler, getTokenPayload } from '@/utils/common';
import { z } from 'zod';
import { defaultNotificationOptions } from '@/utils/notifications';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');
  if (!token) {
    return errorHandler('Missing token', 422);
  }

  const payload = await getTokenPayload(z.string().parse(token));
  if (!payload) {
    return NextResponse.json(
      { error: 'Failed to parse token payload' },
      { status: 500 }
    );
  }

  const settingService = new SettingService();
  const setting = await settingService.findByWorkspaceId(payload.workspaceId);

  return NextResponse.json({ data: setting || null });
}

export async function PUT(request: NextRequest) {
  const data = await request.json();
  const setting = SettingRequestSchema.safeParse(data);
  if (!setting.success) {
    return NextResponse.json(setting.error.issues, { status: 400 });
  }

  const payload = await getTokenPayload(z.string().parse(setting.data.token));
  if (!payload) {
    return NextResponse.json(
      { error: 'Failed to parse token payload' },
      { status: 500 }
    );
  }

  const settingService = new SettingService();
  const newData = {
    ...setting.data,
    workspaceId: payload.workspaceId,
  };

  // Add notification settings if displayTasks is enabled
  if (setting.data.displayTasks) {
    // Ensure default values are saved if user doesn't customize them on the frontend
    newData.notifications = !setting.data.notifications
      ? defaultNotificationOptions
      : setting.data.notifications;
  }
  await settingService.save(newData);

  return NextResponse.json({ message: 'Successfully saved new settings' });
}
