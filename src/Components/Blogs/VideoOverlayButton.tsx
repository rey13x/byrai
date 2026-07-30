import { Play, Volume2, VolumeX } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { Link } from "react-router-dom";
import React from "react";

type Props = {
  to: string;
  isMuted?: boolean;
  className?: string;
};

export default function VideoOverlayButton({ to, isMuted = true, className = "" }: Props) {
  const { theme } = useTheme();

  const panelClass = theme === "dark" ? "border-white/10 bg-black/60" : "border-slate-300/70 bg-white/80";
  const iconColorClass = theme === "dark" ? "text-white" : "text-slate-800";

  return (
    <Link to={to} className={`absolute inset-0 flex items-center justify-center ${className}`}>
      <div className={`flex items-center gap-2 rounded-full border px-3 py-2 shadow-lg backdrop-blur-sm ${panelClass}`}>
        <div className={`rounded-full p-2 ${iconColorClass} hover:opacity-80`} aria-hidden>
          <Play className="h-4 w-4" />
        </div>
        <div className={`rounded-full p-2 ${iconColorClass} opacity-90`} aria-hidden>
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </div>
      </div>
    </Link>
  );
}
