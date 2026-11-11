'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

export function registerGsap() {
  if (typeof window === 'undefined' || registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function animatePageEnter(containerEl) {
  if (!containerEl || prefersReducedMotion()) return null;
  registerGsap();
  return gsap.fromTo(
    containerEl,
    { opacity: 0, y: 12 },
    {
      opacity: 1,
      y: 0,
      duration: 0.36,
      ease: 'power2.out',
      clearProps: 'transform,opacity',
    }
  );
}

export function animateStaggerCards(containerEl, selector = '[data-animate="card"]') {
  if (!containerEl || prefersReducedMotion()) return null;
  registerGsap();
  const nodes = containerEl.querySelectorAll(selector);
  if (!nodes.length) return null;
  return gsap.fromTo(
    nodes,
    { opacity: 0, y: 14 },
    {
      opacity: 1,
      y: 0,
      duration: 0.38,
      stagger: 0.045,
      ease: 'power2.out',
      clearProps: 'transform,opacity',
    }
  );
}

export function animateSectionReveal(containerEl, selector = '[data-animate="reveal"]') {
  if (!containerEl || prefersReducedMotion()) return null;
  registerGsap();
  const sections = containerEl.querySelectorAll(selector);
  if (!sections.length) return null;

  const triggers = [];
  sections.forEach((sec) => {
    const tween = gsap.fromTo(
      sec,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: sec,
          start: 'top 90%',
          once: true,
        },
      }
    );
    triggers.push(tween);
  });
  return triggers;
}

export function animateProgressBars(containerEl, selector = '[data-progress]') {
  if (!containerEl || prefersReducedMotion()) return null;
  registerGsap();
  const bars = containerEl.querySelectorAll(selector);
  if (!bars.length) return null;
  return gsap.fromTo(
    bars,
    { scaleX: 0, transformOrigin: 'left center' },
    {
      scaleX: 1,
      duration: 0.55,
      stagger: 0.04,
      ease: 'power2.out',
      clearProps: 'transform',
    }
  );
}

export function animateModalIn(backdropEl, panelEl) {
  if (prefersReducedMotion()) return;
  registerGsap();
  if (backdropEl) {
    gsap.fromTo(backdropEl, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power1.out' });
  }
  if (panelEl) {
    gsap.fromTo(
      panelEl,
      { opacity: 0, y: 16, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: 'power2.out', clearProps: 'transform' }
    );
  }
}

export function animateModalOut(backdropEl, panelEl, onComplete) {
  if (prefersReducedMotion()) {
    onComplete?.();
    return;
  }
  registerGsap();
  const tl = gsap.timeline({ onComplete });
  if (panelEl) {
    tl.to(panelEl, { opacity: 0, y: 10, scale: 0.98, duration: 0.16, ease: 'power2.in' }, 0);
  }
  if (backdropEl) {
    tl.to(backdropEl, { opacity: 0, duration: 0.16, ease: 'power1.in' }, 0);
  }
}

export function animateTabSwitch(el) {
  if (!el || prefersReducedMotion()) return null;
  registerGsap();
  return gsap.fromTo(
    el,
    { opacity: 0, y: 6 },
    { opacity: 1, y: 0, duration: 0.24, ease: 'power2.out', clearProps: 'transform,opacity' }
  );
}

