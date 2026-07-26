"use client";

import { MapPin } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import { SiBuymeacoffee } from "react-icons/si";
import { FaInstagram, FaLinkedin, FaTiktok } from "react-icons/fa6";
import { useTheme } from "../../contexts/ThemeContext";
import LiveViewCounter from "../LiveFeatures/LiveViewCounter";
import LivePingChat from "../LiveFeatures/LivePingChat";

interface SocialIconProps {
    icon: React.ReactNode;
    username: string;
    link: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ icon, username, link }) => {
    const { theme } = useTheme();
    const baseStyles = theme === "dark"
        ? "text-white border border-zinc-700 bg-zinc-900/40 hover:border-gray-500"
        : "text-slate-800 border border-slate-300 bg-slate-50 hover:border-slate-400";
    const labelColor = theme === "dark" ? "text-white" : "text-slate-800";
    const depthEffect = theme === "dark"
        ? "shadow-[inset_4px_4px_12px_rgba(0,0,0,0.7),inset_-4px_-4px_12px_rgba(161,161,170,0.25)] hover:shadow-[inset_3px_3px_9px_rgba(0,0,0,0.75),inset_-3px_-3px_9px_rgba(200,200,210,0.22)]"
        : "shadow-[inset_6px_6px_16px_rgba(148,163,184,0.3),inset_-6px_-6px_16px_rgba(255,255,255,0.95)] hover:shadow-[inset_4px_4px_12px_rgba(148,163,184,0.35),inset_-4px_-4px_12px_rgba(255,255,255,0.9)]";

    return (
        <a href={link} target="_blank" rel="noopener noreferrer">
            <motion.div
                className={`group flex items-center px-3 py-2 rounded-lg cursor-pointer overflow-hidden w-12 transition ${baseStyles} ${depthEffect}`}
                whileHover={{ width: 165 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
                <div className="w-5 h-5 flex items-center justify-center text-2xl">
                    {React.isValidElement(icon) && (icon.type === 'img' || (typeof icon.type === 'string' && icon.type === 'img')) ? (
                        <img
                            src={(icon as any).props?.src}
                            alt={(icon as any).props?.alt || ''}
                            className="w-full h-full object-cover rounded-full"
                        />
                    ) : (
                        icon
                    )}
                </div>
                <span className={`ml-3 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 ${labelColor}`}>
                    {username}
                </span>
            </motion.div>
        </a>
    );
};

const InteractiveEyeButton = ({ theme, className }: { theme: string, className?: string }) => {
    const [eyePos, setEyePos] = useState({ left: { x: 0, y: 0 }, right: { x: 0, y: 0 } });
    const buttonRef = useRef<HTMLAnchorElement>(null);
    const eyeLeftRef = useRef<HTMLDivElement>(null);
    const eyeRightRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!eyeLeftRef.current || !eyeRightRef.current || !buttonRef.current) return;

            const buttonRect = buttonRef.current.getBoundingClientRect();
            const buttonCenterX = buttonRect.left + buttonRect.width / 2;
            const buttonCenterY = buttonRect.top + buttonRect.height / 2;

            const distFromButton = Math.hypot(e.clientX - buttonCenterX, e.clientY - buttonCenterY);
            const trackingRadius = 250;

            if (distFromButton > trackingRadius) {
                setEyePos({ left: { x: 0, y: 0 }, right: { x: 0, y: 0 } });
                return;
            }

            const calculate = (eyeRect: DOMRect) => {
                const eyeCenterX = eyeRect.left + eyeRect.width / 2;
                const eyeCenterY = eyeRect.top + eyeRect.height / 2;

                const dx = e.clientX - eyeCenterX;
                const dy = e.clientY - eyeCenterY;
                const angle = Math.atan2(dy, dx);
                const maxRadius = 4;
                const dist = Math.hypot(dx, dy);
                const distance = Math.min(maxRadius, dist / 8);

                return {
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance
                };
            };

            setEyePos({
                left: calculate(eyeLeftRef.current.getBoundingClientRect()),
                right: calculate(eyeRightRef.current.getBoundingClientRect())
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Giving it a polished, deep dark look for both modes
    const baseClass = theme === "dark"
        ? "text-white bg-[#0a0a0a] hover:bg-[#1a1a1a] border border-zinc-800"
        : "text-white bg-black hover:bg-gray-900 border border-slate-800";

    return (
        <a
            ref={buttonRef}
            href="https://cal.com/byrai/30min"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-3 px-6 py-2.5 rounded-md transition-all duration-300 font-medium text-[15px] shadow-md hover:shadow-lg ${baseClass} ${className || ''}`}
        >
            <span className="tracking-wide">Let's Connect</span>
            <div className="flex gap-1.5 ml-1">
                <div ref={eyeLeftRef} className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] bg-white rounded-full flex items-center justify-center relative shadow-inner overflow-hidden">
                    <div
                        className="w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] bg-black rounded-full absolute transition-transform duration-100 ease-out"
                        style={{ transform: `translate(${eyePos.left.x}px, ${eyePos.left.y}px)` }}
                    />
                </div>
                <div ref={eyeRightRef} className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] bg-white rounded-full flex items-center justify-center relative shadow-inner overflow-hidden">
                    <div
                        className="w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] bg-black rounded-full absolute transition-transform duration-100 ease-out"
                        style={{ transform: `translate(${eyePos.right.x}px, ${eyePos.right.y}px)` }}
                    />
                </div>
            </div>
        </a>
    );
};

export default function AboutMe() {
    const [showKaizenTip, setShowKaizenTip] = useState(false);
    const [currentTime, setCurrentTime] = useState<string>("");
    const { theme } = useTheme();

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'Asia/Jakarta'
            });
            setCurrentTime(timeString);
        };
        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, []);


    const roleColor = theme === "dark" ? "text-gray-400" : "text-slate-600";


    return (
        <section className={`relative w-full max-w-4xl mx-auto ${theme === "dark" ? "" : "text-slate-800"}`}>
            {/* First Section */}
            <div className="flex flex-col items-center justify-center w-full mb-4 select-none relative z-30 pt-8 pb-10">
                <div
                    className={`absolute inset-0 z-0 bg-cover bg-center pointer-events-none rounded-lg overflow-hidden ${theme === "dark" ? "opacity-10" : "opacity-60"}`}
                    style={{
                        backgroundImage: "url('/images/Common/header-portfolio.webp')",
                        maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%), linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%), linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
                        maskComposite: 'intersect',
                        WebkitMaskComposite: 'source-in',
                        filter: 'blur(2px)'
                    }}
                />
                <div className="absolute top-0 left-5 pt-4">
                    <LiveViewCounter />
                </div>
                <div
                    className="relative inline-block cursor-help group"
                    onMouseEnter={() => setShowKaizenTip(true)}
                    onMouseLeave={() => setShowKaizenTip(false)}
                >
                    <span className={`transition-all duration-700 text-center font-serif italic text-7xl sm:text-8xl md:text-7xl font-bold whitespace-nowrap ${theme === "dark" ? "text-zinc-400/50 group-hover:text-white group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" : "text-zinc-800/50 group-hover:text-zinc-900 group-hover:drop-shadow-[0_0_15px_rgba(0,0,0,0.3)]"
                        }`}>
                        Byrai
                    </span>
                    <AnimatePresence>
                        {showKaizenTip && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                className={`absolute left-1/2 -translate-x-1/2 top-full mt-4 w-64 p-4 rounded-xl overflow-hidden backdrop-blur-md shadow-2xl z-50 ${theme === "dark"
                                    ? "bg-zinc-900/80 text-zinc-100 border border-zinc-700/50"
                                    : "bg-white/80 text-slate-700 border border-slate-200/50"
                                    }`}
                            >
                                <div
                                    className="absolute inset-0 z-0 bg-cover bg-center opacity-40 mix-blend-overlay"
                                    style={{
                                        backgroundImage: 'url("https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=2092&auto=format&fit=crop")',
                                        filter: 'blur(1px)'
                                    }}
                                />
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="space-y-3 text-center relative z-10"
                                >
                                    <p className="text-sm leading-relaxed font-medium">
                                        Derived from <span className="font-bold text-base mx-1">Sayan</span> (Sanskrit/Indian).
                                    </p>
                                    <div className="w-full h-px bg-current opacity-10" />
                                    <p className="text-sm italic font-serif text-center">
                                        "Precious Friend"
                                        <br />
                                        <span className="text-xs opacity-70 not-italic font-sans">
                                            (Companion & Guardian)
                                        </span>
                                    </p>
                                    <div className="w-full h-px bg-current opacity-10" />
                                    <p className="text-xs opacity-80 uppercase tracking-wider font-semibold">
                                        Core Attributes
                                    </p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className={`flex flex-col items-center p-2 rounded-lg ${theme === "dark" ? "bg-zinc-800/50" : "bg-slate-100/50"}`}>
                                            <span className="text-lg font-bold mb-1">Kind</span>
                                            <span className="text-[10px] opacity-70">Hearted</span>
                                        </div>
                                        <div className={`flex flex-col items-center p-2 rounded-lg ${theme === "dark" ? "bg-zinc-800/50" : "bg-slate-100/50"}`}>
                                            <span className="text-lg font-bold mb-1">Gentle</span>
                                            <span className="text-[10px] opacity-70">Nature</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <span className="text-lg m-6"></span>
                <div className={`absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm transition-all duration-300 ${theme === "dark" ? "bg-zinc-900/40 border-zinc-800 text-zinc-500 hover:text-zinc-300" : "bg-white border-slate-200 text-slate-400 hover:text-slate-600"}`}>
                    <div className="flex items-center gap-1.5 border-r pr-2 border-current opacity-80">
                        <MapPin size={12} />
                        <span className="text-[11px] font-bold tracking-widest uppercase">Indonesia</span>
                    </div>
                    <div className="flex items-center gap-1.5 pl-0.5">
                        <span className="text-[11px] font-mono font-medium">{currentTime}</span>
                        <span className="text-[9px] font-bold opacity-60">WIB</span>
                    </div>
                </div>
            </div>

            {/* <div className={`w-full h-[1px] my-8 bg-gradient-to-r from-transparent ${theme === "dark" ? "via-zinc-700" : "via-slate-300"} to-transparent opacity-60`} /> */}

            <div className="flex flex-row items-center md:items-start">
                {/* Left - Profile Image */}
                <div className="w-auto md:w-1/4 p-3 md:p-6 md:pr-4 md:pb-3 flex flex-col items-center md:items-start gap-4 relative">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-lg overflow-hidden relative">
                        <img
                            src="/images/Common/Temp_Profile.webp"
                            alt="Byrai"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <LivePingChat
                        orientation="horizontal"
                        maxWidthClass="w-[160px] sm:w-40"
                        inputWidthClass="w-[160px]"
                        className="hidden justify-center sm:flex sm:justify-center"
                    />
                </div>

                {/* Right - Info */}
                <div className="relative flex-1 md:w-2/3 pt-2 md:pt-4 pl-2 md:pl-2 flex flex-col items-start justify-center text-left">
                    {/* Header */}
                    <div className="flex w-full flex-col gap-2 items-center md:flex-row md:items-center md:gap-3 mb-3">
                    </div>

                    <div className={`text-base font-medium ${roleColor} flex justify-start w-full`}>
                        Raihaan Bagastiam Pratama
                    </div>
                    {/* Social Icons */}
                    <div className="relative group">
                        <div className="flex flex-col gap-3 my-3 w-fit">
                            <div className="flex flex-wrap gap-3">
                                <SocialIcon
                                    icon={<FaInstagram />}
                                    username="sixsevenrai"
                                    link="https://www.instagram.com/sixsevenrai/"
                                />
                                <SocialIcon
                                    icon={<FaLinkedin />}
                                    username="Raihaan Bagastiam Pratama"
                                    link="https://www.linkedin.com/in/raihaanbagastiampratama/"
                                />
                                <SocialIcon
                                    icon={<FaTiktok />}
                                    username="sixsevenrai"
                                    link="https://www.tiktok.com/@sixsevenrai"
                                />
                                
                                {/* <SocialIcon
                                icon={<SiBuymeacoffee />}
                                username="BuyMeACoffee"
                                link="https://buymeacoffee.com/byrai"
                            /> */}
                            </div>
                            <InteractiveEyeButton theme={theme} className="hidden md:flex w-full" />
                        </div>
                        <div className="hidden md:block absolute -right-[140px] top-4 text-center">
                            <svg className="w-24 h-12 text-slate-500/60 rotate-0" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M 80 10 Q 50 40 10 30" />
                                <path d="M 10 30 L 20 25 M 10 30 L 20 38" />
                            </svg>
                            <p className="text-[10px] font-handwriting text-slate-500/80 -rotate-6 mt-1 whitespace-nowrap">
                                hover to see cool effect
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Schedule Button */}
            <div className="md:hidden w-full px-3 mt-1 mb-4 relative z-20">
                <InteractiveEyeButton theme={theme} className="w-full" />
            </div>


            <div className={`w-full h-[1px] my-8 bg-gradient-to-r from-transparent ${theme === "dark" ? "via-zinc-700" : "via-slate-300"} to-transparent opacity-60`} />
        </section >
    );
}
