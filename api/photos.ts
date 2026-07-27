import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Client, Query, Storage } from 'appwrite';
import dotenv from 'dotenv';

dotenv.config();

const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT || process.env.VITE_APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.APPWRITE_PROJECT_ID || process.env.VITE_APPWRITE_PROJECT_ID || 'portofolio';
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY || 'standard_b0deaebbedf0ca3255dbc5f378986b406c09efa26a97e905550b6a8deee0b9a4e4ea9949b7faf361cae150d2b8ac4b655ef8ada90e643485dbfe91cefeafe26b5f854df94bae73097d352b2ff7a77a34c61299dbba457bf8cffaba4ef5e072792dc74f5101a7d0e1d7dd6c7a754f02944edb2c8cd7adcdb0399125825af653a4';
const APPWRITE_BUCKET_ID = process.env.APPWRITE_BUCKET_ID || 'photos';

const appwriteClient = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setDevKey(APPWRITE_API_KEY);

const storage = new Storage(appwriteClient);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
    return res.status(500).json({
      error: 'Appwrite server-side configuration is missing. Set APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, and APPWRITE_API_KEY.',
    });
  }

  try {
    const photos: Array<{ src: string; type: 'image' | 'video' }> = [];
    let offset = 0;
    const limit = 100;
    const videoExtensionPattern = /\.(mp4|webm|mov|ogg|m4v|avi|flv|mkv|3gp)$/i;

    while (true) {
      const fileList = await storage.listFiles({
        bucketId: APPWRITE_BUCKET_ID,
        queries: [Query.limit(limit), Query.offset(offset)],
        total: false,
      });

      const files = fileList.files ?? [];
      if (files.length === 0) break;

      photos.push(
        ...files
          .filter((file) => file.$id)
          .map((file) => {
            const isVideo = Boolean(
              file.mimeType?.startsWith('video/') ||
              (typeof file.name === 'string' && videoExtensionPattern.test(file.name))
            );

            const type: 'image' | 'video' = isVideo ? 'video' : 'image';

            return {
              src: storage.getFileView({
                bucketId: APPWRITE_BUCKET_ID,
                fileId: file.$id,
              }),
              type,
            };
          })
      );

      if (files.length < limit) break;
      offset += limit;
    }

    if (photos.length === 0) {
      return res.status(200).json({
        photos: [],
        message: 'Bucket "photos" ditemukan, tetapi tidak ada file yang dapat ditampilkan.',
      });
    }

    return res.status(200).json({
      photos,
      message: `Loaded ${photos.length} photo(s) from Appwrite bucket '${APPWRITE_BUCKET_ID}'.`,
    });
  } catch (error) {
    console.error('Appwrite Photos API error:', error);
    return res.status(500).json({ error: 'Internal server error while fetching photos from Appwrite.' });
  }
}
