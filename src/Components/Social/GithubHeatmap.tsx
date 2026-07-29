import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";

interface Props {
  username?: string;
}

const GithubHeatmap: React.FC<Props> = () => {
  const { theme } = useTheme();
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

      <div className="w-full flex justify-end relative">
          <div className="w-full max-w-[520px] overflow-x-auto rounded-xl shadow-md bg-white px-2 py-4">
          <div className="ml-auto min-w-[360px]">
            <iframe
              title="Instagram post"
              src="https://www.instagram.com/p/DbWG-i-k3SA/embed/captioned/"
              className="w-[360px] h-[640px] border-0"
              allowTransparency={true}
              scrolling="yes"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GithubHeatmap;
