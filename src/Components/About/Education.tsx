import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";
import { MapPin, ExternalLink } from "lucide-react";
import { useRef, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const SmoothMarquee = ({ badges, theme }: { badges: any[], theme: string }) => {
    const autoplayRef = useRef(
        Autoplay({
            delay: 0,
            playOnInit: true,
            jump: false,
        })
    );
    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: true,
            align: "start",
            skipSnaps: false,
            duration: 18000,
        },
        [autoplayRef.current]
    );

    useEffect(() => {
        const autoplay = autoplayRef.current;
        if (!emblaApi) return;

        emblaApi.on("pointerDown", () => autoplay.stop());
        emblaApi.on("pointerUp", () => {
            setTimeout(() => autoplay.play(), 100);
        });

        return () => {
            autoplay.destroy();
        };
    }, [emblaApi]);

    // Clone badges multiple times for visible scrolling on desktop
    const clonedBadges = Array(5).fill(badges).flat();

    return (
        <div className="w-full overflow-hidden pb-1 mt-4">
            <div ref={emblaRef} className="cursor-grab active:cursor-grabbing">
                <div className="flex gap-2">
                    {clonedBadges.map((badge, idx) => (
                        <div
                            key={`${badge.name}-${idx}`}
                            className={`flex flex-none items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium whitespace-nowrap ${theme === "dark" ? "border-zinc-700 bg-zinc-800/60 text-zinc-200" : "border-slate-200 bg-white/80 text-slate-700"}`}
                        >
                            <img
                                src={badge.image}
                                alt={badge.name}
                                className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-200 flex-shrink-0"
                            />
                            <span className={badge.shimmer ? "shimmer-text" : ""}>{badge.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Education = () => {
    const { theme } = useTheme();

    const sectionText = theme === "dark" ? "text-white" : "text-slate-800";
    const metaText = theme === "dark" ? "text-neutral-400" : "text-slate-500";
    const descText = theme === "dark" ? "text-neutral-400" : "text-slate-600";
    const cardBorder = theme === "dark" ? "border-zinc-800" : "border-slate-200";

    const linkStyle =
        theme === "dark"
            ? "text-neutral-300 hover:text-white"
            : "text-slate-700 hover:text-slate-900";

    const majorBadges = [
        { name: "TET", image: "/images/Work/TET.jpg" },
        { name: "RPL", image: "/images/Work/RPL.jpeg", shimmer: true },
        { name: "TKJ", image: "/images/Work/TKJ.png" },
        { name: "TEI", image: "/images/Work/TEI.png" },
        { name: "TBSM", image: "/images/Work/TBSM.png" },
        { name: "AKL", image: "/images/Work/AKL.png" },
    ];

    return (
        <section className={`${sectionText} px-6 py-10 w-full mb-15 max-w-6xl mx-auto`}>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-6 shimmer-text ${sectionText}`}>Educations</h2>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative"
            >
                {/* Top row: Logo + Info */}
                <div className="flex items-start gap-4">
                    {/* School Logo */}
                        <div className={`flex-shrink-0 h-14 w-14 rounded-full overflow-hidden flex items-center justify-center p-0.5 border ${cardBorder} bg-white`}>
                            <img
                                src="/images/Work/SDN10.jpg"
                                alt="SDN 10 Kota Bekasi"
                                className="h-full w-full object-cover"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <h3 className="text-base font-semibold leading-tight">
                                    Primary School
                                </h3>
                                <div className="flex items-center gap-2.5">
                                    <span className={`text-xs ${metaText}`}>2014 — 2020</span>
                                    <a
                                        href="https://sekolah.data.kemendikdasmen.go.id/profil-sekolah/30159B05-2DF5-E011-A0CA-4DF20E9DDF60"
                                        target="_blank"
                                        rel="noreferrer"
                                        className={`inline-flex items-center gap-1 text-xs font-medium transition-colors ${linkStyle}`}
                                        title="Visit School Profile"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                </div>
                            </div>

                        {/* Degree / School info */}
                        <p className={`text-sm font-medium mt-1 ${theme === "dark" ? "text-neutral-200" : "text-slate-700"}`}>
                            SDN 10 Kota Bekasi
                        </p>

                        {/* Meta info - address */}
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                            <span className={`inline-flex items-center gap-1.5 text-sm ${metaText}`}>
                                <MapPin className="w-3.5 h-3.5" />
                                Jl. Yudhistira Raya No. 118 Kota Bekasi, Jawa Barat
                            </span>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className={`border-t border-dashed ${cardBorder} my-4`} />

                {/* Description */}
                <p className={`text-sm leading-relaxed ${descText} group`}>
                    This school has met the national minimum service standards for education and has successfully maintained an <strong className="font-semibold group-hover:shimmer-text">Accreditation A</strong>.
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-3">
                    {["Accreditation A", "NPSN 20223613"].map((tag) => (
                        <span
                            key={tag}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-900 text-white`}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                {/* Second entry: SMPN 9 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
                    className="relative mt-8"
                >
                    <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 h-14 w-14 rounded-full overflow-hidden flex items-center justify-center p-0.5 border ${cardBorder} bg-white`}>
                            <img src="/images/Work/SMPN9.jpg" alt="SMPN 9 Kota Bekasi" className="h-full w-full object-cover" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <h3 className="text-base font-semibold leading-tight">Middle School</h3>
                                <div className="flex items-center gap-2.5">
                                    <span className={`text-xs ${metaText}`}>2020 — 2023</span>
                                    <a
                                        href="https://smpn9kotabekasi.sch.id/"
                                        target="_blank"
                                        rel="noreferrer"
                                        className={`inline-flex items-center gap-1 text-xs font-medium transition-colors ${linkStyle}`}
                                        title="Visit School Website"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                </div>
                            </div>

                            <p className={`text-sm font-medium mt-1 ${theme === "dark" ? "text-neutral-200" : "text-slate-700"}`}>SMPN 9 Kota Bekasi</p>

                            <div className="flex flex-wrap items-center gap-3 mt-2">
                                <span className={`inline-flex items-center gap-1.5 text-sm ${metaText}`}>
                                    <MapPin className="w-3.5 h-3.5" />
                                    Jl. Swatantra IV No. 4 Kota Bekasi, Jawa Barat 17423
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={`border-t border-dashed ${cardBorder} my-4`} />

                    <p className={`text-sm leading-relaxed ${descText} group`}>
                        This school has met the national minimum service standards for education and has successfully maintained an <strong className="font-semibold group-hover:shimmer-text">Accreditation A</strong>.
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3">
                        {["Accreditation A", "NPSN 20222973"].map((tag) => (
                            <span key={tag} className={`px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-900 text-white`}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.16 }}
                    className="relative mt-8"
                >
                    <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 h-14 w-14 rounded-full overflow-hidden flex items-center justify-center p-0.5 border ${cardBorder} bg-white`}>
                            <img src="/images/Work/SMKN2.jpeg" alt="SMKN 2 Kota Bekasi" className="h-full w-full object-cover" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <h3 className="text-base font-semibold leading-tight">Vocational High School</h3>
                                <div className="flex items-center gap-2.5">
                                    <span className={`text-xs ${metaText}`}>2023 — 2026</span>
                                    <a
                                        href="https://www.smkn2kotabekasi.sch.id/"
                                        target="_blank"
                                        rel="noreferrer"
                                        className={`inline-flex items-center gap-1 text-xs font-medium transition-colors ${linkStyle}`}
                                        title="Visit School Website"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                </div>
                            </div>

                            <p className={`text-sm font-medium mt-1 ${theme === "dark" ? "text-neutral-200" : "text-slate-700"}`}>
                                SMKN 2 Kota Bekasi
                            </p>

                            <div className="flex flex-wrap items-center gap-3 mt-2">
                                <span className={`inline-flex items-center gap-1.5 text-sm ${metaText}`}>
                                    <MapPin className="w-3.5 h-3.5" />
                                    Kota Bekasi, Jawa Barat
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={`border-t border-dashed ${cardBorder} my-4`} />

                    <p className={`text-sm leading-relaxed ${descText} group`}>
                        This school has met the national minimum service standards for education and has successfully maintained an <strong className="font-semibold group-hover:shimmer-text">Accreditation A</strong> as a designated <strong className="font-semibold">Sekolah Maung</strong> (<strong className="font-semibold">Manusia Unggul</strong>) that features <strong className="font-semibold">6 flagship majors</strong> (<strong className="font-semibold">6 jurusan unggulan</strong>).
                    </p>

                    <div className="mt-3 flex flex-col gap-2 sm:gap-3">
                        <SmoothMarquee badges={majorBadges} theme={theme} />

                        <div className="flex flex-wrap items-center gap-2">
                            {['Accreditation A', 'NPSN 20231741'].map((tag) => (
                                <span key={tag} className={`px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-900 text-white`}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Education;
