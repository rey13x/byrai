"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "../Components/ui/Button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function PhotosPage() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [active, setActive] = useState<number | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    let mounted = true;
    const fetchImages = async () => {
      try {
        if (!supabase) {
          throw new Error('Supabase client not configured');
        }

        const supabaseClient = supabase;

        async function listAllFiles(path = ''): Promise<string[]> {
          const { data, error } = await supabaseClient.storage.from('photos').list(path, { limit: 200, offset: 0 });
          if (error) {
            throw error;
          }

          const files: string[] = [];
          for (const item of data ?? []) {
            const itemName = (item as any).name ?? '';
            const isDirectory = itemName === 'photos' || itemName.endsWith('/');
            if (!itemName) continue;

            if (isDirectory) {
              const nextPath = itemName.endsWith('/') ? itemName : `${itemName}/`;
              const nestedFiles = await listAllFiles(nextPath);
              files.push(...nestedFiles);
            } else {
              const filePath = path ? `${path}${itemName}` : itemName;
              files.push(filePath);
            }
          }

          return files;
        }

        const files = await listAllFiles('');
        const urls: string[] = [];

        for (const itemPath of files) {
          const publicRes = await supabaseClient.storage.from('photos').getPublicUrl(itemPath);
          const publicData = publicRes.data;
          const publicError = (publicRes as any).error;

          if (publicError || !publicData?.publicUrl) {
            console.warn('Could not get public URL for', itemPath, publicError);
            continue;
          }
          urls.push(publicData.publicUrl);
        }

        if (mounted) {
          setImages(urls);
          setStatusMessage(urls.length > 0 ? `Loaded ${urls.length} photo(s).` : 'No photos found in Supabase bucket.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load photos from Supabase:', err);
        if (mounted) {
          setStatusMessage('Gagal memuat foto. Periksa VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, dan bucket Supabase.');
          setImages([]);
          setLoading(false);
        }
      }
    };

    fetchImages();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const mainStyles = theme === "dark" ? "bg-black text-white" : "bg-white text-slate-800";
  const headingStyles = theme === "dark" ? "text-white" : "text-slate-900";
  const hintText = theme === "dark" ? "text-gray-400" : "text-slate-600";
  return (
    <main className={`min-h-screen w-full py-8 md:py-10 px-4 md:px-6 overflow-x-hidden ${mainStyles}`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-start gs_reveal">
          <Button
            text="Back to home"
            icon={<ArrowLeft className="w-3 h-3" />}
            to="/"
            variant="outline"
            className="rounded-lg px-3 py-2 text-xs font-semibold"
          />
        </div>

        <div className="mb-8">
          <h1 className={`text-2xl md:text-3xl font-bold ${headingStyles}`}>Photos</h1>
        </div>

        {loading && <div className={`text-sm ${hintText}`}>Loading photos…</div>}

        {!loading && images.length === 0 && (
          <div className={`text-sm ${hintText}`}>
            {statusMessage || "No photos found. Make sure your Supabase bucket is named 'photos' and files are uploaded."}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {images.map((src, i) => (
            <div key={i} className="overflow-hidden rounded-lg cursor-pointer group min-h-[220px]">
              <img
                src={src}
                alt={`photo-${i}`}
                className="w-full h-full min-h-[220px] object-cover transition-transform duration-300 group-hover:scale-105"
                onClick={() => setActive(i)}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[active]}
                alt={`photo-${active}`}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />

              <button
                onClick={() => setActive(null)}
                className={`absolute top-2 right-2 md:top-4 md:right-4 p-2 rounded-md ${theme === 'dark' ? 'bg-black/80 hover:bg-black text-white' : 'bg-white/90 hover:bg-white text-slate-900'} transition-colors`}
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
