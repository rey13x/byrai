import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";

interface Props {
  username?: string;
}

const GithubHeatmap: React.FC<Props> = () => {
  const { theme } = useTheme();

  useEffect(() => {
    // Load Instagram embed script so the blockquote will render inline
    const loadScript = () => {
      if ((window as any).instgrm) {
        try { (window as any).instgrm.Embeds.process(); } catch (e) {}
        return;
      }

      const script = document.createElement('script');
      script.async = true;
      script.defer = true;
      script.src = '//www.instagram.com/embed.js';
      script.onload = () => {
        try { (window as any).instgrm.Embeds.process(); } catch (e) {}
      };
      document.body.appendChild(script);
    };

    loadScript();
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
      className="w-[95%] max-w-3xl mt-6 mb-6 relative flex flex-col items-center gap-4"
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
        <div dangerouslySetInnerHTML={{ __html: `
          <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/DUqGCPOk0Lw/?utm_source=ig_embed&utm_campaign=loading" data-instgrm-version="14" style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%;">
          </blockquote>
        ` }} />
      </div>
    </motion.div>
  );
};

export default GithubHeatmap;
