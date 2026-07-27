import React, { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

type Props = {
  children: React.ReactNode;
};

const ScrollProvider: React.FC<Props> = ({ children }) => {
  useEffect(() => {
    const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    const lenisOptions: any = {
      duration: isTouch ? 1.2 : 1.6,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: true,
      lerp: isTouch ? 0.12 : 0.07,
      touchMultiplier: isTouch ? 1.1 : 0.55,
      wheelMultiplier: isTouch ? 0.7 : 0.45,
    };

    const lenis = new (Lenis as any)(lenisOptions);

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      if (lenis) (lenis as any).destroy?.();
    };
  }, []);

  return <>{children}</>;
};

export default ScrollProvider;
