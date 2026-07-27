"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function PhotosPage() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchImages = async () => {
      if (!supabase) {
        // fallback: use local public images
        const fallback = [
          "/images/ProjectImage/1.png",
          "/images/ProjectImage/2.png",
          "/images/ProjectImage/3.png",
        ];
        if (mounted) {
          setImages(fallback);
          setLoading(false);
        }
        return;
      }

      try {
        // try listing files in a bucket named 'photos'
        const { data, error } = await supabase.storage.from("photos").list("", { limit: 100, offset: 0 });
        if (error) throw error;
        const urls: string[] = [];
        if (data && data.length) {
          for (const item of data) {
            if (item.name) {
              // get public url (works if bucket is public)
              const { publicURL } = supabase.storage.from("photos").getPublicUrl(item.name);
              urls.push(publicURL);
            }
          }
        }

        if (mounted) {
          setImages(urls);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch photos from Supabase:", err);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchImages();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-white text-slate-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Photos</h1>

        {loading && <div className="text-sm text-slate-500">Loading photos…</div>}

        {!loading && images.length === 0 && (
          <div className="text-sm text-slate-500">No photos found.</div>
        )}

        <div className="photos-masonry columns-1 sm:columns-2 lg:columns-3 gap-4 [&>img]:mb-4">
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
                className="max-w-[90vw] max-h-[90vh] overflow-hidden"
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
                  className="absolute top-6 right-6 p-2 rounded-md bg-white/90"
                >
                  <X />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
