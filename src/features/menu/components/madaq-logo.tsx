'use client';

import Image from 'next/image';

interface MadaqLogoProps {
  size?: number;
  className?: string;
  priority?: boolean;
}

export function MadaqLogo({ size = 120, className = '', priority = false }: MadaqLogoProps) {
  return (
    <Image
      src="/madaq-logo.png"
      alt="Madaq"
      width={size}
      height={size * 0.59}
      className={`object-contain ${className}`}
      priority={priority}
    />
  );
}

export function MadaqLogoSmall({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <Image
      src="/madaq-logo.png"
      alt="Madaq"
      width={size}
      height={size * 0.59}
      className={`object-contain ${className}`}
    />
  );
}
