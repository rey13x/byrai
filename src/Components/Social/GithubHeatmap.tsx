import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";

const INSTAGRAM_EMBED_SRC = "https://www.instagram.com/p/DUqGCPOk0Lw/embed";

interface Props {
  username?: string;
}

const GithubHeatmap: React.FC<Props> = () => {
  const { theme } = useTheme();

  useEffect(() => {
    // No external instagram script required when using iframe embed.
    return () => {};
  }, []);

  const isDark = theme === "dark";
  const textColor = isDark ? "text-white" : "text-slate-900";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-[95%] max-w-3xl mt-10 mb-16 relative flex flex-col items-center gap-4"
    >
      <div className={`flex items-start gap-2 ${textColor} opacity-80`}>
        <svg width="25" height="35" viewBox="0 0 100 100" className="opacity-70 stroke-current flex-shrink-0" style={{ marginTop: '-5px' }}>
          <path d="M90,10 Q45,10 20,60" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M5,50 L15,75" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M20,73 L38,60" strokeWidth="5" fill="none" strokeLinecap="round" />
        </svg>
        <span className="text-sm font-handwriting transform -rotate-6">lets see My Insta</span>
      </div>

      <div className="w-full flex justify-center relative">
        <iframe
          src={INSTAGRAM_EMBED_SRC}
          title="Instagram post (preview only)"
          loading="lazy"
          className="w-full max-w-[540px] h-[720px] border-0 rounded-xl pointer-events-none"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
        {/* Overlay to prevent clicks on any links inside the embed. */}
        <div
          className="absolute inset-0 z-20"
          aria-hidden="true"
          onClick={(e) => e.preventDefault()}
        />
      </div>
    </motion.div>
  );
};

export default GithubHeatmap;
