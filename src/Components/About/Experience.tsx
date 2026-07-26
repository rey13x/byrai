import { ChevronRight, ExternalLink } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";

export default function Experience() {
    const { theme } = useTheme();
    const [showCompanyInfo, setShowCompanyInfo] = useState(false);
    const [showHutamaInfo, setShowHutamaInfo] = useState(false);
    const [showITDigitalInfo, setShowITDigitalInfo] = useState(false);
    const [showKabtourPreview, setShowKabtourPreview] = useState(false);
    const [showHutamaPreview, setShowHutamaPreview] = useState(false);

    const headingText = theme === "dark" ? "text-zinc-100" : "text-slate-900";
    const companyText = theme === "dark" ? "text-zinc-100" : "text-slate-900";
    const companyHoverText = theme === "dark" ? "hover:text-white" : "hover:text-slate-700";
    const subtitleText = theme === "dark" ? "text-zinc-300" : "text-slate-600";
    const dateText = theme === "dark" ? "text-zinc-400" : "text-slate-500";
    const companyLinkText = theme === "dark" ? "text-zinc-500" : "text-slate-500";

    return (
        <section className="w-full max-w-3xl mx-auto p-6">
            <h2 className={`text-xl font-bold ${headingText}`}>
                cool places I worked at
            </h2>

            <div
                className="mt-5 group"
                onMouseEnter={() => setShowCompanyInfo(true)}
                onMouseLeave={() => setShowCompanyInfo(false)}
            >
                <div className="flex items-start sm:items-center justify-between gap-4 rounded-xl px-2.5 py-2.5">
                    <div className="flex items-start gap-3.5 min-w-0">
                        <a
                            href="https://www.linkedin.com/company/pt-implementasi-teknologi-indonesia/?originalSubdomain=id"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-10 w-10 overflow-hidden rounded-full bg-orange-500 text-white grid place-items-center font-extrabold text-xs shrink-0"
                        >
                            <img
                                src="/images/Work/ITindonesia.webp"
                                alt="PT Implementasi Teknologi Indonesia"
                                className="h-full w-full object-cover"
                            />
                        </a>

                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => setShowCompanyInfo((prev) => !prev)}
                                    className={`text-left text-md sm:text-lg font-semibold leading-tight cursor-pointer transition-colors ${companyText} ${companyHoverText}`}
                                    aria-label="Toggle PT Implementasi Teknologi Indonesia details"
                                >
                                    PT Implementasi Teknologi Indonesia
                                </button>
                                <button
                                    type="button"
                                    aria-label="Toggle company info"
                                    onClick={() => setShowCompanyInfo((prev) => !prev)}
                                    className={`rounded p-0.5 cursor-pointer transition-colors ${dateText} ${companyHoverText}`}
                                >
                                    <ChevronRight
                                        className={`w-4 h-4 transition-transform ${showCompanyInfo ? "rotate-90" : "rotate-0"}`}
                                    />
                                </button>
                            </div>
                            <p className={`text-xs sm:text-sm ${subtitleText}`}>
                                Internship | Web Development
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                        <a
                            href="https://www.linkedin.com/company/pt-implementasi-teknologi-indonesia/?originalSubdomain=id"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-1 text-[10px] sm:text-xs uppercase tracking-wide ${companyLinkText}`}
                        >
                            Visit Site
                            <ExternalLink className="w-3 h-3" />
                        </a>
                        <p className={`text-xs sm:text-sm whitespace-nowrap ${dateText}`}>
                            Januari - Mei 2025
                        </p>
                    </div>
                </div>

                <AnimatePresence>
                    {showCompanyInfo && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <div className="relative mt-1 pl-[3.4rem]">
                                <p className={`text-xs sm:text-sm ${subtitleText}`}>
                                    Completed a <span className="font-semibold">6 month internship</span> at <span className="font-semibold">PT Implementasi Teknologi Indonesia</span>, contributing to the planning and development of the <a
                                        href="https://www.kabtour.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`font-semibold underline decoration-2 underline-offset-2 transition-colors ${theme === "dark" ? "text-sky-400 hover:text-sky-300" : "text-blue-600 hover:text-blue-700"}`}
                                        onMouseEnter={() => setShowKabtourPreview(true)}
                                        onMouseLeave={() => setShowKabtourPreview(false)}
                                    >
                                        kabtour.com
                                    </a> website as part of the web development team.
                                </p>
                                <AnimatePresence>
                                    {showKabtourPreview && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            className={`absolute left-0 top-full mt-2 z-50 w-[280px] h-[180px] overflow-hidden rounded-xl border shadow-2xl ${theme === "dark" ? "border-zinc-700 bg-zinc-900" : "border-slate-200 bg-white"}`}
                                        >
                                            <iframe
                                                src="https://www.kabtour.com/"
                                                title="kabtour preview"
                                                loading="lazy"
                                                className="h-full w-full border-0 bg-white"
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div
                className="mt-4 group"
                onMouseEnter={() => setShowHutamaInfo(true)}
                onMouseLeave={() => setShowHutamaInfo(false)}
            >
                <div className="flex items-start sm:items-center justify-between gap-4 rounded-xl px-2.5 py-2.5">
                    <div className="flex items-start gap-3.5 min-w-0">
                        <a
                            href="https://www.hutamakarya.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-10 w-10 overflow-hidden rounded-full bg-orange-500 text-white grid place-items-center font-extrabold text-xs shrink-0"
                        >
                            <img
                                src="/images/Work/HK.webp"
                                alt="PT Hutama Karya (Persero)"
                                className="h-full w-full object-cover"
                            />
                        </a>

                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => setShowHutamaInfo((prev) => !prev)}
                                    className={`text-left text-md sm:text-lg font-semibold leading-tight cursor-pointer transition-colors ${companyText} ${companyHoverText}`}
                                    aria-label="Toggle PT Hutama Karya details"
                                >
                                    PT Hutama Karya (Persero)
                                </button>
                                <button
                                    type="button"
                                    aria-label="Toggle company info"
                                    onClick={() => setShowHutamaInfo((prev) => !prev)}
                                    className={`rounded p-0.5 cursor-pointer transition-colors ${dateText} ${companyHoverText}`}
                                >
                                    <ChevronRight
                                        className={`w-4 h-4 transition-transform ${showHutamaInfo ? "rotate-90" : "rotate-0"}`}
                                    />
                                </button>
                            </div>
                            <p className={`text-xs sm:text-sm ${subtitleText}`}>
                                Internship | Computer Vision
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                        <a
                            href="https://www.hutamakarya.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            onMouseEnter={() => setShowHutamaPreview(true)}
                            onMouseLeave={() => setShowHutamaPreview(false)}
                            className={`inline-flex items-center gap-1 text-[10px] sm:text-xs uppercase tracking-wide ${companyLinkText}`}
                        >
                            Visit Site
                            <ExternalLink className="w-3 h-3" />
                        </a>
                        <p className={`text-xs sm:text-sm whitespace-nowrap ${dateText}`}>
                            Juni - Juli 2025
                        </p>
                    </div>
                </div>

                <AnimatePresence>
                    {showHutamaInfo && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <div className="relative mt-1 pl-[3.4rem]">
                                <p className={`text-xs sm:text-sm ${subtitleText}`}>
                                    Completed a <span className="font-semibold">2-month internship</span> at <span className="font-semibold">PT Hutama Karya (Persero)</span>, a state-owned enterprise (BUMN), where I assisted in the planning and training for the development of an Artificial Intelligence (AI) system intended to support road construction and infrastructure development projects.
                                </p>
                                <AnimatePresence>
                                    {showHutamaPreview && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            className={`absolute left-0 top-full mt-2 z-50 w-[280px] h-[180px] overflow-hidden rounded-xl border shadow-2xl ${theme === "dark" ? "border-zinc-700 bg-zinc-900" : "border-slate-200 bg-white"}`}
                                        >
                                            <iframe
                                                src="https://www.hutamakarya.com/"
                                                title="Hutama Karya preview"
                                                loading="lazy"
                                                className="h-full w-full border-0 bg-white"
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div
                className="mt-4 group"
                onMouseEnter={() => setShowITDigitalInfo(true)}
                onMouseLeave={() => setShowITDigitalInfo(false)}
            >
                <div className="flex items-start sm:items-center justify-between gap-4 rounded-xl px-2.5 py-2.5">
                    <div className="flex items-start gap-3.5 min-w-0">
                        <a
                            href="https://www.instagram.com/itd_itdigital/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-10 w-10 overflow-hidden rounded-full bg-orange-500 text-white grid place-items-center font-extrabold text-xs shrink-0"
                        >
                            <img
                                src="/images/Work/ITD.webp"
                                alt="PT Implementasi Teknologi Digital"
                                className="h-full w-full object-cover"
                            />
                        </a>

                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => setShowITDigitalInfo((prev) => !prev)}
                                    className={`text-left text-md sm:text-lg font-semibold leading-tight cursor-pointer transition-colors ${companyText} ${companyHoverText}`}
                                    aria-label="Toggle PT Implementasi Teknologi Digital details"
                                >
                                    PT Implementasi Teknologi Digital
                                </button>
                                <button
                                    type="button"
                                    aria-label="Toggle company info"
                                    onClick={() => setShowITDigitalInfo((prev) => !prev)}
                                    className={`rounded p-0.5 cursor-pointer transition-colors ${dateText} ${companyHoverText}`}
                                >
                                    <ChevronRight
                                        className={`w-4 h-4 transition-transform ${showITDigitalInfo ? "rotate-90" : "rotate-0"}`}
                                    />
                                </button>
                            </div>
                            <p className={`text-xs sm:text-sm ${subtitleText}`}>
                                Internship | Web Development
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                        <a
                            href="https://www.instagram.com/itd_itdigital/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-1 text-[10px] sm:text-xs uppercase tracking-wide ${companyLinkText}`}
                        >
                            Visit Site
                            <ExternalLink className="w-3 h-3" />
                        </a>
                        <p className={`text-xs sm:text-sm whitespace-nowrap ${dateText}`}>
                            April - Juli 2025
                        </p>
                    </div>
                </div>

                <AnimatePresence>
                    {showITDigitalInfo && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <div className="relative mt-1 pl-[3.4rem]">
                                <p className={`text-xs sm:text-sm ${subtitleText}`}>
                                    Completed a <span className="font-semibold">4-month internship</span> at <span className="font-semibold">PT Implementasi Teknologi Digital</span>, contributing to the planning and development of the <a
                                        href="https://www.kabtour.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`font-semibold underline decoration-2 underline-offset-2 transition-colors ${theme === "dark" ? "text-sky-400 hover:text-sky-300" : "text-blue-600 hover:text-blue-700"}`}
                                    >
                                        kabtour.com
                                    </a> website as part of the web development team.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
