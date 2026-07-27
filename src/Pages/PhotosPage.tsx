"use client";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export default function PhotosPage() {
  const [items, setItems] = useState<Array<{ src: string; type: 'image' | 'video' }>>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [selected, setSelected] = useState<number | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    let mounted = true;

    const fetchImages = async () => {
      try {
        const response = await fetch('/api/photos');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load Appwrite photos');
        }

        if (mounted) {
          setItems(data.photos ?? []);
          setStatusMessage(data.message || 'Loaded photos from Appwrite.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load photos from Appwrite:', err);
        if (mounted) {
          setStatusMessage('Gagal memuat foto. Pastikan Appwrite API key, project, dan bucket sudah benar.');
          setItems([]);
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
      if (e.key === 'Escape') setSelected(null);
      if (selected !== null) {
        if (e.key === 'ArrowRight' && selected < items.length - 1) {
          setSelected(selected + 1);
        }
        if (e.key === 'ArrowLeft' && selected > 0) {
          setSelected(selected - 1);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, items.length]);

  const mainStyles = theme === "dark" ? "bg-black text-white" : "bg-white text-slate-800";
  const headingStyles = theme === "dark" ? "text-white" : "text-slate-900";
  const hintText = theme === "dark" ? "text-gray-400" : "text-slate-600";

  return (
    <main className={`min-h-screen w-full py-8 md:py-10 px-4 md:px-6 overflow-x-hidden ${mainStyles}`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-start gs_reveal">
          <Link
            to="/"
            className={`inline-flex items-center gap-3 rounded-md border px-4 py-2.5 text-xs font-semibold transition-colors ${theme === 'dark' ? 'border-white/10 bg-white/5 text-white hover:bg-white/10' : 'border-slate-200 bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
          >
            <span className="text-[10px]">←</span>
            Back
          </Link>
        </div>

        <div className="mb-8">
          <h1 className={`text-2xl md:text-3xl font-bold ${headingStyles}`}>Photos</h1>
        </div>

        {loading && <div className={`text-sm ${hintText}`}>Loading photos…</div>}

        {!loading && items.length === 0 && (
          <div className={`text-sm ${hintText}`}>
            {statusMessage || "No photos found. Pastikan bucket Appwrite 'photos' berisi file dan API key backend sudah dikonfigurasi."}
          </div>
        )}

        <div className="columns-2 sm:columns-3 lg:columns-4 gap-2 space-y-2">
          {items.map((item, i) => (
            <motion.button
              key={`${item.src}-${i}`}
              type="button"
              onClick={() => setSelected(i)}
              className="break-inside-avoid inline-block w-full overflow-hidden transition-transform duration-300 hover:-translate-y-1 rounded-none p-0"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              {item.type === 'video' ? (
                <video
                  src={item.src}
                  className="w-full block h-auto"
                  loop
                  muted
                  playsInline
                  autoPlay
                  preload="metadata"
                  onError={(e) => { (e.currentTarget as HTMLVideoElement).style.display = 'none'; }}
                />
              ) : (
                <img
                  src={item.src}
                  alt={`photo-${i}`}
                  className="w-full block h-auto"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  loading="lazy"
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected !== null && items[selected] && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="relative w-full max-w-5xl max-h-[90vh]"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              {items[selected].type === 'video' ? (
                <video
                  src={items[selected].src}
                  className="w-full h-auto max-h-[90vh] object-contain"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                />
              ) : (
                <img
                  src={items[selected].src}
                  alt={`photo-${selected}`}
                  className="w-full h-auto max-h-[90vh] object-contain"
                />
              )}
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 rounded-full bg-black/80 p-2 text-white shadow-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
