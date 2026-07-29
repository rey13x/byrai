import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";
import { Mail, Eye } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button";

const AboutContent = () => {
  const { theme } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);

  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [clickedWord, setClickedWord] = useState<string | null>(null);

  const baseText = theme === "dark" ? "text-gray-300" : "text-slate-700";
  const headingText = theme === "dark" ? "text-white" : "text-slate-900";

  const tooltipStyles = theme === "dark"
    ? "bg-white text-black"
    : "bg-slate-900 text-white";

  const ShimmerWord = ({ id, children }: { id: string; children: React.ReactNode }) => {
    const isActive = activeWord === id || clickedWord === id;
    const textColor = theme === "dark" ? "text-white" : "text-black hover:text-slate-800";

    return (
      <span
        className={`font-bold transition-colors duration-300 cursor-pointer shimmer-word ${isActive ? "shimmer-text" : ""} ${textColor}`}
        onMouseEnter={() => setActiveWord(id)}
        onMouseLeave={() => {
          if (clickedWord !== id) setActiveWord(null);
        }}
        onClick={() => setClickedWord((prev) => (prev === id ? null : id))}
      >
        {children}
      </span>
    );
  };

  return (
    <section className={`w-full max-w-3xl mx-auto p-6 leading-relaxed ${baseText}`}>
      <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold shimmer-text ${headingText}`}>I'm Byrai</h2>
      <p className="mt-6 text-lg leading-relaxed text-slate-700 dark:text-gray-400">
        Focused on <ShimmerWord id="entrepreneurship">Entrepreneurship</ShimmerWord> and <ShimmerWord id="digital-innovation">Digital Innovation</ShimmerWord>, I founded <ShimmerWord id="tokko-marketplace">Tokko Marketplace</ShimmerWord> and specialize in building <ShimmerWord id="websites">Websites</ShimmerWord>, <ShimmerWord id="applications">Applications</ShimmerWord>, and <ShimmerWord id="ai-powered-automation">AI-Powered Automation</ShimmerWord>. Open to <ShimmerWord id="business-partnerships">Business Partnerships</ShimmerWord> and <ShimmerWord id="project-collaborations">Project Collaborations</ShimmerWord>.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mt-6">
        <div className="relative">
          <Button
            text=""
            icon={<Eye className="w-4 h-4" />}
          />
          {/*
            Resume preview hover kode disimpan di sini sebagai catatan:
            <div
              className="relative"
              onMouseEnter={() => setShowResumeTooltip(true)}
              onMouseLeave={() => setShowResumeTooltip(false)}
            >
              <Button
                text="Resume"
                icon={<Eye className="w-4 h-4" />}
              />
              {showResumeTooltip && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className={`absolute bottom-full left-0 sm:left-1/2 sm:-translate-x-1/2 mb-4 w-[300px] h-[400px] sm:w-[450px] sm:h-[550px] rounded-xl shadow-2xl overflow-hidden z-50 ring-1 ring-black/5 ${theme === "dark" ? "bg-zinc-900 ring-white/10" : "bg-white"}`}
                >
                  <iframe
                    src="https://drive.google.com/file/d/1STyotpYA8hKFaZh21LX-GruplwNo_odU/preview"
                    className="w-full h-full border-0 bg-white"
                    title="Resume Preview"
                    loading="lazy"
                  />
                  <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 ${theme === "dark" ? "bg-zinc-900" : "bg-white"}`} />
                </motion.div>
              )}
            </div>
          */}
        </div>

        <div className="relative">
          <Button
            text="Email Me"
            icon={<Mail className="w-4 h-4" />}
            href="mailto:bagas139087@gmail.com"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          />
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs rounded whitespace-nowrap z-10 ${tooltipStyles}`}
            >
              bagas139087@gmail.com
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutContent;
