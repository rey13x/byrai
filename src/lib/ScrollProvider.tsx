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
      // longer duration => smoother, heavier feeling
      duration: isTouch ? 2.6 : 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      // heavier touch feel: smaller multiplier + higher duration
      smoothTouch: true,
      touchMultiplier: isTouch ? 0.6 : 1,
      wheelMultiplier: isTouch ? 0.9 : 1,
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

    // Auto text char-reveal for most text nodes (safe: only replace text nodes, preserve children)
    const blacklist = new Set(['SCRIPT','STYLE','IFRAME','INPUT','TEXTAREA','SELECT','BUTTON','IMG','SVG','CANVAS','PATH','CODE','PRE']);

    const splitTextNodes = (root: Node) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node: Node) {
          if (!node.nodeValue) return NodeFilter.FILTER_REJECT;
          if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          if (blacklist.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      } as any);

      const textNodes: Text[] = [];
      let tn: Node | null;
      while ((tn = walker.nextNode())) {
        textNodes.push(tn as Text);
      }

      if (!textNodes.length) return;

      textNodes.forEach((textNode) => {
        const parent = textNode.parentElement!;
        const text = textNode.nodeValue || '';
        const frag = document.createDocumentFragment();
        for (const ch of text) {
          const span = document.createElement('span');
          span.className = 'char';
          if (ch === ' ') span.innerHTML = '&nbsp;';
          else span.textContent = ch;
          frag.appendChild(span);
        }
        parent.replaceChild(frag, textNode);
      });

      if (root instanceof HTMLElement) {
        root.classList.add('gs-split-done');
      }
    };

    const targets = document.querySelectorAll<HTMLElement>('h1,h2,h3,h4,h5,h6,p,li,blockquote,figcaption,label,td,th');
    targets.forEach((el) => {
      if (blacklist.has(el.tagName)) return;
      if (el.classList.contains('gs-split-done')) return;
      // Only process elements that contain visible text
      if (!el.textContent || !el.textContent.trim()) return;
      splitTextNodes(el);
      const chars = el.querySelectorAll<HTMLElement>('.char');
      if (!chars.length) return;
      gsap.set(chars, { opacity: 0, y: 6, display: 'inline-block' });
      gsap.to(chars, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.01,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 92%',
          toggleActions: 'play none none reverse',
        },
      });
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
