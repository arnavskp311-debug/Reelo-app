import { NextRequest, NextResponse } from 'next/server';
import { getServerSessionUserId } from '@/lib/db';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const userId = getServerSessionUserId(request);
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Size limit: 50MB
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 50MB limit' }, { status: 400 });
    }

    const mime = file.type || '';
    let mediaType: 'image' | 'video' | 'audio' | 'file' = 'file';

    if (mime.startsWith('image/')) {
      mediaType = 'image';
    } else if (mime.startsWith('video/')) {
      mediaType = 'video';
    } else if (mime.startsWith('audio/')) {
      mediaType = 'audio';
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const originalExt = path.extname(file.name) || (mediaType === 'image' ? '.jpg' : mediaType === 'video' ? '.mp4' : '.mp3');
    const safeExt = originalExt.toLowerCase();

    // Directory in public/uploads/<userId>
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', userId);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const uniqueName = `${Date.now()}_${crypto.randomBytes(4).toString('hex')}${safeExt}`;
    const filePath = path.join(uploadsDir, uniqueName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${userId}/${uniqueName}`;

    return NextResponse.json({
      url: publicUrl,
      mediaType,
      size: file.size,
      filename: uniqueName,
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: error.message || 'File upload failed' }, { status: 500 });
  }
}
