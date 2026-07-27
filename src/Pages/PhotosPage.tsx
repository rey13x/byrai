"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "../Components/ui/Button";
import { ArrowLeft } from "lucide-react";

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
        const response = await fetch('/api/photos');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load Appwrite photos');
        }

        if (mounted) {
          setImages(data.photos ?? []);
          setStatusMessage(data.message || 'Loaded photos from Appwrite.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load photos from Appwrite:', err);
        if (mounted) {
          setStatusMessage('Gagal memuat foto. Pastikan Appwrite API key, project, dan bucket sudah benar.');
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
            {statusMessage || "No photos found. Pastikan bucket Appwrite 'photos' berisi file dan API key backend sudah dikonfigurasi."}
          </div>
        )}

        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {images.map((src, i) => (
            <div key={i} className="break-inside-avoid overflow-hidden rounded-[32px] bg-slate-950/5 shadow-[0_14px_50px_rgba(15,23,42,0.08)] transition-transform duration-300 hover:-translate-y-1">
              <button
                type="button"
                onClick={() => setActive(i)}
                className="w-full cursor-zoom-in"
              >
                <img
                  src={src}
                  alt={`photo-${i}`}
                  className="w-full h-auto rounded-[32px] object-contain"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  loading="lazy"
                />
              </button>
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
