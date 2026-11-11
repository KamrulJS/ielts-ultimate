'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { getInitials } from '@/lib/utils';

export function SafeAvatar({ src, name, size = 38, radius = '999px', style = {} }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        aria-label={name}
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: 'var(--accent-purple-soft)',
          color: 'var(--accent-purple)',
          border: '1px solid var(--border)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: Math.max(11, Math.round(size * 0.36)),
          flexShrink: 0,
          ...style,
        }}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={name || 'Avatar'}
      width={size}
      height={size}
      unoptimized
      onError={() => setFailed(true)}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        objectFit: 'cover',
        border: '1px solid var(--border)',
        flexShrink: 0,
        ...style,
      }}
    />
  );
}
