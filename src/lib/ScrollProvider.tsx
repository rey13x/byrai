import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: React.ReactNode;
};

const ScrollProvider: React.FC<Props> = ({ children }) => {
  useEffect(() => {
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
      ScrollTrigger.getAll().forEach((st) => st.kill());
      ScrollTrigger.removeEventListener('refreshInit', () => {});
    };
  }, []);

  return <>{children}</>;
};

export default ScrollProvider;
