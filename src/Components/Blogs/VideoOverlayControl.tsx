import React from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

type Props = {
  videoRef?: React.RefObject<HTMLVideoElement | null>;
};

export default function VideoOverlayControl({ videoRef }: Props) {
  const { theme } = useTheme();
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [isMuted, setIsMuted] = React.useState(true);

  React.useEffect(() => {
    const v = videoRef?.current;
    if (!v) return;
    setIsMuted(!!v.muted);
    setIsPlaying(!v.paused);
  }, [videoRef]);

  const togglePlayback = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const v = videoRef?.current;
    if (!v) return;
    if (v.paused) {
      try { await v.play(); } catch { /* ignore */ }
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const v = videoRef?.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
    if (!v.muted) {
      try { await v.play(); } catch {}
      setIsPlaying(true);
    }
  };

  const panelClass = theme === 'dark' ? 'border-white/10 bg-black/60' : 'border-slate-300/70 bg-white/80';
  const iconColorClass = theme === 'dark' ? 'text-white' : 'text-slate-800';

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className={`flex items-center gap-3 rounded-full border px-3 py-2 shadow-lg backdrop-blur-sm ${panelClass}`}>
        <button onClick={togglePlayback} className={`${iconColorClass} rounded-full p-2`} aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>

        <button onClick={toggleMute} className={`${iconColorClass} rounded-full p-2`} aria-label={isMuted ? 'Unmute' : 'Mute'}>
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
