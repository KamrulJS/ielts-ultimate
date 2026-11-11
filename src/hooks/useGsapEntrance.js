'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  animatePageEnter,
  animateStaggerCards,
  animateProgressBars,
  registerGsap,
} from '@/lib/animations';

/**
 * Runs leak-free GSAP entrance animations once on mount (or when key changes).
 */
export function useGsapEntrance(depsKey = 'mount') {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    registerGsap();
    const ctx = gsap.context(() => {
      animatePageEnter(el);
      animateStaggerCards(el);
      animateProgressBars(el);
    }, el);

    return () => ctx.revert();
  }, [depsKey]);

  return containerRef;
}

