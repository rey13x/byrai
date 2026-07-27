"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "../Components/ui/Button";
import { ArrowLeft } from "lucide-react";

export default function PhotosPage() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<number | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    let mounted = true;
    const fetchImages = async () => {
      const fallback = [
        "/images/ProjectImage/1.png",
        "/images/ProjectImage/2.png",
        "/images/ProjectImage/3.png",
      ];

      if (!supabase) {
        if (mounted) {
          setImages(fallback);
          setLoading(false);
        }
        return;
      }

      try {
        const { data, error } = await supabase.storage.from("photos").list("", { limit: 100, offset: 0 });
        if (error) {
          console.warn("Supabase storage.list error:", error);
          if (mounted) {
            setImages(fallback);
            setLoading(false);
          }
          return;
        }

        const urls: string[] = [];
        if (data && data.length) {
          for (const item of data) {
            if (item.name) {
              // supabase-js v2: getPublicUrl returns { data: { publicUrl } }
              const res = await supabase.storage.from("photos").getPublicUrl(item.name);
              const publicUrl = res && (res as any).data && (res as any).data.publicUrl ? (res as any).data.publicUrl : (res as any).publicURL || null;
              if (publicUrl) urls.push(publicUrl);
            }
          }
        }

        if (mounted) {
          setImages(urls.length ? urls : fallback);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch photos from Supabase:", err);
        if (mounted) {
          setImages(fallback);
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
    <main className={`min-h-screen max-w-6xl mx-auto py-10 px-6 ${mainStyles}`}>
      <div className="mb-6 flex justify-start gs_reveal">
        <Button
          text="Back to home"
          icon={<ArrowLeft className="w-3 h-3" />}
          to="/"
          variant="outline"
          className="rounded-lg px-3 py-2 text-xs font-semibold"
        />
      </div>

      <div className="mb-6">
        <h1 className={`text-3xl font-bold ${headingStyles}`}>Photos</h1>
        <p className={`text-sm mt-1 ${hintText}`}>UI designs and screenshots — responsive gallery.</p>
      </div>

      {loading && <div className={`text-sm ${hintText}`}>Loading photos…</div>}

      {!loading && images.length === 0 && (
        <div className={`text-sm ${hintText}`}>No photos found.</div>
      )}

      <div className="photos-masonry columns-1 sm:columns-2 lg:columns-3 gap-4">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`photo-${i}`}
            className="w-full h-auto mb-4 block break-inside-avoid"
            onClick={() => setActive(i)}
            style={{ borderRadius: 0 }}
          />
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="max-w-[90vw] max-h-[90vh] overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[active]}
                alt={`photo-${active}`}
                className="w-auto max-w-full max-h-[80vh] h-auto object-contain"
                style={{ borderRadius: 0 }}
              />

              <button
                onClick={() => setActive(null)}
                className={`absolute top-6 right-6 p-2 rounded-md ${theme === 'dark' ? 'bg-black/80 text-white' : 'bg-white/90 text-slate-900'}`}
              >
                <X />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
