'use client';

import Image from 'next/image';

export function MadaqLogo({ size = 120, className = '' }: { size?: number; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/madaq-logo.png"
        alt="Madaq Logo"
        fill
        className="object-contain"
        sizes={`${size}px`}
        priority
      />
    </div>
  );
}

export function MadaqLogoSmall({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/madaq-logo.png"
        alt="Madaq Logo"
        fill
        className="object-contain"
        sizes={`${size}px`}
      />
    </div>
  );
}

export function MadaqLogoRect({ height = 60, className = '' }: { height?: number; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width: height * 1.7, height }}
    >
      <Image
        src="/madaq-logo.png"
        alt="Madaq Logo"
        fill
        className="object-contain"
        sizes={`${height * 1.7}px`}
      />
    </div>
  );
}
