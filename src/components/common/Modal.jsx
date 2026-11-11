'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { animateModalIn } from '@/lib/animations';

export function Modal({ open, onClose, title, subtitle, children, large = false, footer = null }) {
  const backdropRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    animateModalIn(backdropRef.current, panelRef.current);
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleEsc);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={backdropRef}
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose?.();
      }}
    >
      <div ref={panelRef} className={`modal-panel ${large ? 'modal-panel-lg' : ''}`}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div>
            {title && <h3 className="h3">{title}</h3>}
            {subtitle && (
              <p className="text-sm text-muted" style={{ marginTop: 4 }}>
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-icon"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div>{children}</div>

        {footer && (
          <div
            style={{
              marginTop: 20,
              paddingTop: 16,
              borderTop: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 10,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

