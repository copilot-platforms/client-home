import { NextRequest, NextResponse } from 'next/server';
import { del, put } from '@vercel/blob';
import { MediaRequestSchema } from '@/types/media';
import { errorHandler, getCurrentUser } from '@/utils/common';
import { MediaService } from '@/app/api/media/services/media.service';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const form = await request.formData();
    const file = form.get('file') as File;
    if (!file) {
      return errorHandler('File is missing.', 422);
    }
    const token = form.get('token') as string;
    const mediaRequest = MediaRequestSchema.safeParse({ file, token });
    if (!mediaRequest.success) {
      return NextResponse.json(mediaRequest.error.issues);
    }
    const blob = await put(file.name, file, {
      access: 'public',
    });
    const mediaService = new MediaService();
    const media = await mediaService.save(mediaRequest.data, blob.url);

    return NextResponse.json({ data: media });
  } catch (error) {
    console.log(error);
    return errorHandler('Could not upload file.', 500);
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const data = await request.json();
    if (!data.url) {
      return errorHandler('Url is required.', 422);
    }
    if (!data.token) {
      return errorHandler('Token is required.', 422);
    }
    const mediaService = new MediaService();
    const media = await mediaService.findByUrl(data.url);
    if (media === null) {
      return errorHandler('Image not found.', 404);
    }
    const currentUser = await getCurrentUser(data.token);
    if (media.createdById !== currentUser.id) {
      return errorHandler('Permission denied.', 403);
    }
    await del(data.url);
    await mediaService.delete(media.id);

    return NextResponse.json({});
  } catch (error) {
    console.log(error);
    return errorHandler('Could not delete file.', 500);
  }
}
