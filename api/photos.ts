import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!supabase) {
    return res.status(500).json({
      error: 'Supabase server-side configuration is missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
    });
  }

  const supabaseClient = supabase;

  try {
    async function listAllFiles(path = ''): Promise<string[]> {
      const { data, error } = await supabaseClient.storage.from('photos').list(path, { limit: 200, offset: 0 });
      if (error) {
        throw error;
      }

      const files: string[] = [];
      for (const item of data ?? []) {
        const itemName = (item as any).name ?? '';
        if (!itemName) continue;

        if (itemName.endsWith('/')) {
          const subfolder = path ? `${path}${itemName}` : itemName;
          const nestedFiles = await listAllFiles(subfolder);
          files.push(...nestedFiles);
        } else {
          const filePath = path ? `${path}${itemName}` : itemName;
          files.push(filePath);
        }
      }
      return files;
    }

    const files = await listAllFiles('');

    if (files.length === 0) {
      return res.status(200).json({
        photos: [],
        message: 'Bucket "photos" ditemukan, tetapi tidak ada file yang dapat ditampilkan.',
      });
    }

    const signedUrls = await Promise.all(
      files.map(async (itemPath) => {
        const { data: signedData, error: signedError } = await supabaseClient.storage.from('photos').createSignedUrl(itemPath, 60 * 60);
        return {
          path: itemPath,
          signedUrl: signedData?.signedUrl ?? null,
          error: signedError?.message ?? null,
        };
      })
    );

    const photos = signedUrls
      .filter((item) => item.signedUrl)
      .map((item) => item.signedUrl as string);

    if (photos.length === 0) {
      return res.status(200).json({
        photos: [],
        message: 'Ditemukan file, tetapi tidak dapat membuat signed URL. Periksa SUPABASE_SERVICE_ROLE_KEY dan izin bucket.',
      });
    }

    return res.status(200).json({
      photos,
      message: `Loaded ${photos.length} photo(s) from Supabase using signed URLs.`,
    });
  } catch (error) {
    console.error('Photos API error:', error);
    return res.status(500).json({ error: 'Internal server error while fetching photos.' });
  }
}
