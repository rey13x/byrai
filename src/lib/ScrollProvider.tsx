import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: React.ReactNode;
};

const ScrollProvider: React.FC<Props> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Initialize Lenis smooth scrolling
    const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    const lenisOptions: any = {
      // heavier, slower scroll feel while preserving smoothness
      duration: isTouch ? 3.2 : 1.6,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: true,
      lerp: 0.07,
      // heavier mobile gesture feel: slower response and larger momentum
      touchMultiplier: isTouch ? 0.35 : 0.55,
      wheelMultiplier: isTouch ? 0.7 : 0.45,
    };

    const lenis = new (Lenis as any)(lenisOptions);

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      ScrollTrigger.update();
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    // Make ScrollTrigger use Lenis' scroll position
    try {
      ScrollTrigger.scrollerProxy(document.documentElement, {
        scrollTop(value?: number) {
          if (typeof value === 'number') {
            lenis.scrollTo(value);
          }
          // return current scroll position (ensure number)
          const y = (lenis as any).scroll && (lenis as any).scroll.instance ? (lenis as any).scroll.instance.scroll.y : window.scrollY;
          return typeof y === 'number' ? y : window.scrollY;
        },
        getBoundingClientRect() {
          return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        // `pinType` depends on transform support
        pinType: document.documentElement.style.transform ? 'transform' : 'fixed',
      });
    } catch (e) {
      // scrollerProxy may fail in some environments; ignore silently
    }

    // ensure ScrollTrigger calculates with Lenis
    ScrollTrigger.refresh();
    // Default reveal for elements with .gs_reveal
    const reveals = document.querySelectorAll<HTMLElement>('.gs_reveal');

    reveals.forEach((el) => {
      // Reset initial state in case of hot reload
      gsap.set(el, { autoAlpha: 0, y: 30 });

      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 30 },
        {
          duration: 0.8,
          autoAlpha: 1,
          y: 0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    // Simple parallax: elements with data-parallax attribute
    const parallaxEls = document.querySelectorAll<HTMLElement>('[data-parallax]');
    parallaxEls.forEach((el) => {
      const speed = parseFloat(el.getAttribute('data-parallax') || '0.3');
      gsap.to(el, {
        yPercent: speed * -100,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    // Refresh ScrollTrigger on resize/load to ensure correct positions
    ScrollTrigger.addEventListener('refreshInit', () => {
      // no-op placeholder
    });

    return () => {
      // cleanup Lenis RAF and ScrollTrigger
      cancelAnimationFrame(rafId);
      if (lenis) (lenis as any).destroy?.();
      ScrollTrigger.getAll().forEach((st) => st.kill());
      ScrollTrigger.removeEventListener('refreshInit', () => {});
    };
  }, []);

  useEffect(() => {
    const reveals = document.querySelectorAll<HTMLElement>('.gs_reveal');
    if (!reveals.length) return;

    const spies: gsap.core.Tween[] = [];
    reveals.forEach((el) => {
      gsap.set(el, { autoAlpha: 0, y: 30 });
      const tween = gsap.fromTo(
        el,
        { autoAlpha: 0, y: 30 },
        {
          duration: 0.8,
          autoAlpha: 1,
          y: 0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );
      if (tween.scrollTrigger) spies.push(tween);
    });

    return () => {
      spies.forEach((tween) => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    };
  }, [location.pathname]);

  return <>{children}</>;
};

export default ScrollProvider;
