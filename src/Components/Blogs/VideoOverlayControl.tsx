import React from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

type Props = {
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  autoHideMs?: number;
};

export default function VideoOverlayControl({ videoRef, autoHideMs = 3000 }: Props) {
  const { theme } = useTheme();
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [isMuted, setIsMuted] = React.useState(true);
  const [showControls, setShowControls] = React.useState(true);
  const hideTimerRef = React.useRef<number | null>(null);

  const clearHide = () => {
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    clearHide();
    hideTimerRef.current = window.setTimeout(() => setShowControls(false), autoHideMs);
  };

  React.useEffect(() => {
    const v = videoRef?.current;
    if (!v) return;

    const updateState = () => {
      setIsMuted(!!v.muted);
      setIsPlaying(!v.paused);
    };

    updateState();

    const onPlay = () => { updateState(); showControlsTemporarily(); };
    const onPause = () => { updateState(); showControlsTemporarily(); };
    const onVolume = () => { updateState(); showControlsTemporarily(); };
    const onMouse = () => { showControlsTemporarily(); };
    const onClick = () => { showControlsTemporarily(); };

    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('volumechange', onVolume);
    v.addEventListener('mousemove', onMouse);
    v.addEventListener('click', onClick);

    // auto-hide initially
    showControlsTemporarily();

    return () => {
      clearHide();
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('volumechange', onVolume);
      v.removeEventListener('mousemove', onMouse);
      v.removeEventListener('click', onClick);
    };
  }, [videoRef, autoHideMs]);

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
    showControlsTemporarily();
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
    showControlsTemporarily();
  };

  const panelClass = theme === 'dark' ? 'border-white/10 bg-black/60' : 'border-slate-300/70 bg-white/80';
  const iconColorClass = theme === 'dark' ? 'text-white' : 'text-slate-800';

  return (
    <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${showControls ? '' : 'opacity-0'} transition-opacity duration-200`}>
      <div className={`pointer-events-auto flex items-center gap-3 rounded-full border px-3 py-2 shadow-lg backdrop-blur-sm ${panelClass}`}>
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
