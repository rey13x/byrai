import { motion, AnimatePresence } from "framer-motion";
import { X, Globe, Github, Pause, Play, Volume2, VolumeX, RotateCcw, Gauge } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import type { Project } from "./Projects";

interface ProjectModalProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
    onOpenGallery?: (items: { label: string; url: string }[], startIndex?: number, title?: string) => void;
}

const ProjectModal = ({ project, isOpen, onClose, onOpenGallery }: ProjectModalProps) => {
    const { theme } = useTheme();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const hideControlsTimeoutRef = useRef<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [showControls, setShowControls] = useState(true);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    const modalBg = theme === "dark" ? "bg-zinc-900 border border-zinc-800" : "bg-white border border-slate-200";
    const textColor = theme === "dark" ? "text-white" : "text-slate-900";
    const subTextColor = theme === "dark" ? "text-zinc-400" : "text-slate-500";
    const buttonBg = theme === "dark" ? "bg-white text-black hover:bg-zinc-200" : "bg-slate-900 text-white hover:bg-slate-800";
    const subtlePanel = theme === "dark" ? "border-zinc-800 bg-zinc-950/40" : "border-slate-200 bg-slate-50";
    const detailText = theme === "dark" ? "text-zinc-300" : "text-slate-600";
    const fineText = theme === "dark" ? "text-zinc-400" : "text-slate-500";
    const activePeriodColor = theme === "dark" ? "text-amber-400" : "text-orange-600";

    const clearHideTimer = () => {
        if (hideControlsTimeoutRef.current) {
            window.clearTimeout(hideControlsTimeoutRef.current);
        }
    };

    const showControlsTemporarily = () => {
        setShowControls(true);
        clearHideTimer();
        hideControlsTimeoutRef.current = window.setTimeout(() => {
            setShowControls(false);
        }, 2000);
    };

    useEffect(() => {
        if (!isOpen || !project?.video.src || !videoRef.current) return;

        const video = videoRef.current;
        video.currentTime = 0;
        video.volume = 1;
        video.playbackRate = 1;
        video.muted = false;
        setIsMuted(false);
        setPlaybackSpeed(1);
        setIsPlaying(true);
        setShowControls(true);
        video.load();
        const playPromise = video.play();

        if (playPromise) {
            playPromise.catch(() => undefined);
        }

        showControlsTemporarily();

        return () => {
            clearHideTimer();
        };
    }, [isOpen, project?.title, project?.video.src]);

    const togglePlayback = async () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            video.volume = 1;
            await video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }

        showControlsTemporarily();
    };

    const toggleMute = async () => {
        const video = videoRef.current;
        if (!video) return;

        const nextMuted = !video.muted;
        video.muted = nextMuted;
        setIsMuted(nextMuted);

        if (!nextMuted) {
            video.volume = 1;
            await video.play();
            setIsPlaying(true);
        }

        showControlsTemporarily();
    };

    const cyclePlaybackSpeed = () => {
        const nextSpeed = playbackSpeed === 1 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : playbackSpeed === 1.5 ? 2 : 1;
        const video = videoRef.current;

        if (video) {
            video.playbackRate = nextSpeed;
        }

        setPlaybackSpeed(nextSpeed);
        showControlsTemporarily();
    };

    const replayVideo = () => {
        const video = videoRef.current;
        if (!video) return;

        video.currentTime = 0;
        video.play().catch(() => undefined);
        setIsPlaying(true);
        showControlsTemporarily();
    };

    return (
        <AnimatePresence>
            {isOpen && project && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className={`relative w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-xl ${modalBg} overflow-hidden flex flex-col min-h-0`}
                    >
                        <div
                            className="relative flex-1 min-h-0 overflow-y-auto overscroll-contain p-6 custom-scrollbar"
                            style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
                            onWheelCapture={(e) => e.stopPropagation()}
                            onTouchMoveCapture={(e) => e.stopPropagation()}
                            onWheel={(e) => e.stopPropagation()}
                            onTouchMove={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={onClose}
                                className={`cursor-pointer absolute top-4 right-4 z-10 p-2 rounded-full transition-colors bg-white/10 backdrop-blur-sm ${theme === "dark" ? "hover:bg-zinc-800 text-zinc-400 hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-slate-900"}`}
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="space-y-6">
                                {/* Header Image/Video */}
                                <div className={`w-full aspect-video rounded-xl overflow-hidden flex items-center justify-center ${theme === 'dark' ? 'bg-neutral-900' : 'bg-slate-100'}`}>
                                    {project.video.src ? (
                                        <div
                                            className="relative w-full h-full bg-black"
                                            onClick={() => showControlsTemporarily()}
                                        >
                                            <video
                                                ref={videoRef}
                                                data-project-video={project.title}
                                                src={project.video.src}
                                                autoPlay
                                                loop
                                                muted={isMuted}
                                                playsInline
                                                preload="auto"
                                                className="w-full h-full object-contain"
                                            />
                                            <div className={`absolute inset-0 flex items-end justify-center p-3 transition-opacity duration-200 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                                                <div className={`flex items-center gap-2 rounded-full border px-2 py-2 shadow-lg backdrop-blur-sm ${theme === "dark" ? "border-white/10 bg-black/60" : "border-slate-300/70 bg-white/80"}`}>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            void togglePlayback();
                                                        }}
                                                        className={`rounded-full p-2 transition-colors ${theme === "dark" ? "text-white hover:bg-white/10" : "text-slate-800 hover:bg-slate-200"}`}
                                                        aria-label={isPlaying ? "Pause video" : "Play video"}
                                                    >
                                                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            cyclePlaybackSpeed();
                                                        }}
                                                        className={`rounded-full p-2 transition-colors ${theme === "dark" ? "text-white hover:bg-white/10" : "text-slate-800 hover:bg-slate-200"}`}
                                                        aria-label="Change playback speed"
                                                    >
                                                        <Gauge className="h-4 w-4" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            void toggleMute();
                                                        }}
                                                        className={`rounded-full p-2 transition-colors ${theme === "dark" ? "text-white hover:bg-white/10" : "text-slate-800 hover:bg-slate-200"}`}
                                                        aria-label={isMuted ? "Unmute video" : "Mute video"}
                                                    >
                                                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            replayVideo();
                                                        }}
                                                        className={`rounded-full p-2 transition-colors ${theme === "dark" ? "text-white hover:bg-white/10" : "text-slate-800 hover:bg-slate-200"}`}
                                                        aria-label="Replay video"
                                                    >
                                                        <RotateCcw className="h-4 w-4" />
                                                    </button>

                                                    <span className={`px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${theme === "dark" ? "text-zinc-200" : "text-slate-700"}`}>
                                                        {playbackSpeed}x
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : project.imageLink ? (
                                        <img
                                            src={project.imageLink}
                                            alt={project.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className={`text-lg font-semibold opacity-50 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                            {project.category}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                        <div>
                                            <h2 id="modal-title" className={`text-2xl font-bold ${textColor}`}>{project.title}</h2>
                                            <p className={`text-sm ${subTextColor}`}>
                                                <span className={project.period === "In Progress" ? activePeriodColor : ""}>{project.period}</span>
                                                <span> - {project.category}</span>
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            {project.website.url && (
                                                <a
                                                    href={project.website.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${buttonBg}`}
                                                >
                                                    <Globe className="w-4 h-4" />
                                                    Website
                                                </a>
                                            )}
                                            {project.github?.url && (
                                                <a
                                                    href={project.github.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors border ${theme === "dark" ? "border-zinc-700 hover:bg-zinc-800 text-white" : "border-slate-200 hover:bg-slate-100 text-slate-900"}`}
                                                >
                                                    <Github className="w-4 h-4" />
                                                    Source
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <h3 className={`text-sm font-semibold mb-3 ${textColor}`}>Tech Stack</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {project.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className={`px-3 py-1 text-xs font-medium rounded-full ${theme === "dark" ? "bg-zinc-800 text-zinc-300 border border-zinc-700" : "bg-slate-100 text-slate-600 border border-slate-200"}`}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className={`prose ${theme === "dark" ? "prose-invert" : ""} max-w-none`}>
                                        <p className={`${theme === 'dark' ? 'text-zinc-300' : 'text-slate-600'} leading-relaxed`}>
                                            {project.description}
                                        </p>
                                    </div>

                                    {project.details && (
                                        <div className="mt-6 space-y-6">
                                            {Boolean(project.details.overview?.length) && (
                                                <div className="space-y-3">
                                                    {project.details.overview?.map((paragraph) => (
                                                        <p key={paragraph} className={`${detailText} leading-relaxed`}>
                                                            {paragraph}
                                                        </p>
                                                    ))}
                                                </div>
                                            )}

                                            {Boolean(project.details.links?.length) && (
                                                <div className="flex flex-wrap gap-2">
                                                    {project.details.links?.map((link) => (
                                                        <a
                                                            key={link.url}
                                                            href={link.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${theme === "dark"
                                                                ? "border-zinc-700 text-zinc-200 hover:bg-zinc-800"
                                                                : "border-slate-200 text-slate-700 hover:bg-slate-100"
                                                                }`}
                                                        >
                                                            <Globe className="h-3.5 w-3.5" />
                                                            {link.label}
                                                        </a>
                                                    ))}
                                                </div>
                                            )}

                                            {Boolean(project.details.gallery?.length) && (
                                                <div>
                                                    <h3 className={`text-sm font-semibold mb-3 ${textColor}`}>Screenshots</h3>
                                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                        {project.details.gallery?.map((image, index) => (
                                                            <button
                                                                key={image.url}
                                                                type="button"
                                                                onClick={() => onOpenGallery?.(project.details?.gallery ?? [], index, project.title)}
                                                                className={`group overflow-hidden rounded-md border text-left transition-colors ${subtlePanel}`}
                                                            >
                                                                <div className="flex min-h-48 items-center justify-center bg-black/5 p-2">
                                                                    <img
                                                                        src={image.url}
                                                                        alt={`${project.title} ${image.label}`}
                                                                        loading="lazy"
                                                                        className="max-h-64 w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                                                                    />
                                                                </div>
                                                                <div className={`px-3 py-2 text-xs font-semibold ${fineText}`}>
                                                                    {image.label}
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {project.details.sections?.map((section) => (
                                                <div key={section.title}>
                                                    <h3 className={`text-sm font-semibold mb-3 ${textColor}`}>{section.title}</h3>
                                                    <div className="space-y-3">
                                                        {section.items.map((item) => (
                                                            <div
                                                                key={item.title}
                                                                className={`border-l-2 pl-3 ${theme === "dark" ? "border-zinc-700" : "border-slate-300"}`}
                                                            >
                                                                <h4 className={`text-sm font-semibold ${textColor}`}>{item.title}</h4>
                                                                <p className={`mt-1 text-sm leading-relaxed ${fineText}`}>{item.description}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}

                                            {Boolean(project.details.stack?.length) && (
                                                <div>
                                                    <h3 className={`text-sm font-semibold mb-3 ${textColor}`}>Architecture</h3>
                                                    <dl className={`rounded-md border px-3 ${subtlePanel}`}>
                                                        {project.details.stack?.map((item) => (
                                                            <div
                                                                key={item.label}
                                                                className={`grid gap-1 py-2 text-sm sm:grid-cols-[120px_1fr] ${theme === "dark" ? "border-b border-zinc-800 last:border-b-0" : "border-b border-slate-200 last:border-b-0"}`}
                                                            >
                                                                <dt className={`font-semibold ${textColor}`}>{item.label}</dt>
                                                                <dd className={fineText}>{item.value}</dd>
                                                            </div>
                                                        ))}
                                                    </dl>
                                                </div>
                                            )}

                                            {project.details.snippet && (
                                                <div>
                                                    <h3 className={`text-sm font-semibold mb-3 ${textColor}`}>{project.details.snippet.title}</h3>
                                                    <pre className={`overflow-x-auto rounded-md border p-3 text-xs leading-relaxed ${subtlePanel} ${detailText}`}>
                                                        <code>{project.details.snippet.code}</code>
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProjectModal;
