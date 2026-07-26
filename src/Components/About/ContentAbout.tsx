import { useTheme } from "../../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Eye } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/Button";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AboutContent = () => {
  const { theme } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);
  const [showResumeTooltip, setShowResumeTooltip] = useState(false);

  const baseText = theme === "dark" ? "text-gray-300" : "text-slate-700";
  const headingText = theme === "dark" ? "text-white" : "text-slate-900";

  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLElement | null>(null);
  const paragraphRef = useRef<HTMLElement | null>(null);

  // Styling constants
  const tooltipStyles = theme === "dark"
    ? "bg-white text-black"
    : "bg-slate-900 text-white";

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const items = paragraphRef.current ? paragraphRef.current.querySelectorAll('.reveal-item') : [];

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=600',
          scrub: 0.6,
          pin: true,
        },
      });

      tl.from(headingRef.current, { y: -40, scale: 0.96, opacity: 0, duration: 0.8 });
      tl.from(items, { y: 24, opacity: 0, stagger: 0.16, duration: 0.6 }, '-=0.4');
    }, sectionRef);

    return () => ctx.revert();
  }, [theme]);

  return (
    <section
      ref={sectionRef}
      className={`w-full max-w-3xl mx-auto p-6 leading-relaxed ${baseText}`}
    >
      <h2 ref={headingRef} className={`text-3xl sm:text-4xl md:text-5xl font-bold ${headingText}`}>I'm Byrai</h2>
      <p ref={paragraphRef} className="mt-6 leading-relaxed text-slate-700 dark:text-gray-400">
        Focused on <span className={`reveal-item font-bold transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-black hover:text-slate-800'}`}>Entrepreneurship</span> and <span className={`reveal-item font-bold transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-black hover:text-slate-800'}`}>Digital Innovation</span>, I founded <span className={`reveal-item font-bold transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-black hover:text-slate-800'}`}>Tokko Marketplace</span> and specialize in building <span className={`reveal-item font-bold transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-black hover:text-slate-800'}`}>Websites</span>, <span className={`reveal-item font-bold transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-black hover:text-slate-800'}`}>Applications</span>, and <span className={`reveal-item font-bold transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-black hover:text-slate-800'}`}>AI-Powered Automation</span>. Open to <span className={`reveal-item font-bold transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-black hover:text-slate-800'}`}>Business Partnerships</span> and <span className={`reveal-item font-bold transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-black hover:text-slate-800'}`}>Project Collaborations</span>.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mt-6">
        <div
          className="relative"
          onMouseEnter={() => setShowResumeTooltip(true)}
          onMouseLeave={() => setShowResumeTooltip(false)}
        >
          <Button
            text="Resume"
            icon={<Eye className="w-4 h-4" />}
          />
          <AnimatePresence>
            {showResumeTooltip && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`absolute bottom-full left-0 sm:left-1/2 sm:-translate-x-1/2 mb-4 w-[300px] h-[400px] sm:w-[450px] sm:h-[550px] rounded-xl shadow-2xl overflow-hidden z-50 ring-1 ring-black/5 ${theme === "dark" ? "bg-zinc-900 ring-white/10" : "bg-white"
                  }`}
              >
                <iframe
                  src="https://drive.google.com/file/d/1STyotpYA8hKFaZh21LX-GruplwNo_odU/preview"
                  className="w-full h-full border-0 bg-white"
                  title="Resume Preview"
                  loading="lazy"
                />

                {/* Pointer arrow */}
                <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 ${theme === "dark" ? "bg-zinc-900" : "bg-white"
                  }`} />
              </motion.div>
            )}
          </AnimatePresence>
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
