export function MadaqLogo({ size = 120, className = '' }: { size?: number; className?: string }) {
  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
      >
        {/* Outer decorative ring */}
        <circle cx="100" cy="100" r="96" stroke="#d4af37" strokeWidth="2" fill="none" />
        <circle cx="100" cy="100" r="90" stroke="#d4af37" strokeWidth="1.5" fill="none" strokeDasharray="4 3" />

        {/* Dark green background circle */}
        <circle cx="100" cy="100" r="85" fill="#0a4d3a" />

        {/* Inner gold ring */}
        <circle cx="100" cy="100" r="78" stroke="#d4af37" strokeWidth="1" fill="none" />
        <circle cx="100" cy="100" r="72" stroke="#d4af37" strokeWidth="0.5" fill="none" strokeDasharray="2 2" />

        {/* Decorative diamond shapes at cardinal points */}
        <path d="M100 16 L104 22 L100 28 L96 22 Z" fill="#d4af37" />
        <path d="M100 172 L104 178 L100 184 L96 178 Z" fill="#d4af37" />
        <path d="M16 100 L22 96 L28 100 L22 104 Z" fill="#d4af37" />
        <path d="M172 100 L178 96 L184 100 L178 104 Z" fill="#d4af37" />

        {/* Small decorative dots between diamonds */}
        <circle cx="72" cy="24" r="1.5" fill="#d4af37" />
        <circle cx="128" cy="24" r="1.5" fill="#d4af37" />
        <circle cx="72" cy="176" r="1.5" fill="#d4af37" />
        <circle cx="128" cy="176" r="1.5" fill="#d4af37" />
        <circle cx="24" cy="72" r="1.5" fill="#d4af37" />
        <circle cx="24" cy="128" r="1.5" fill="#d4af37" />
        <circle cx="176" cy="72" r="1.5" fill="#d4af37" />
        <circle cx="176" cy="128" r="1.5" fill="#d4af37" />

        {/* Central Arabic text "مضيق" */}
        <text
          x="100"
          y="108"
          textAnchor="middle"
          fontFamily="serif"
          fontSize="36"
          fontWeight="bold"
          fill="#d4af37"
          style={{ textRendering: 'optimizeLegibility' }}
        >
          مَضيق
        </text>

        {/* Top decorative line */}
        <line x1="65" y1="68" x2="135" y2="68" stroke="#d4af37" strokeWidth="0.8" />
        {/* Bottom decorative line */}
        <line x1="65" y1="128" x2="135" y2="128" stroke="#d4af37" strokeWidth="0.8" />

        {/* Small decorative element top */}
        <circle cx="100" cy="64" r="2" fill="#d4af37" />
        <circle cx="100" cy="132" r="2" fill="#d4af37" />

        {/* Ornamental corners inside */}
        <path d="M62 38 L58 38 L58 42" stroke="#d4af37" strokeWidth="0.8" fill="none" />
        <path d="M138 38 L142 38 L142 42" stroke="#d4af37" strokeWidth="0.8" fill="none" />
        <path d="M62 162 L58 162 L58 158" stroke="#d4af37" strokeWidth="0.8" fill="none" />
        <path d="M138 162 L142 162 L142 158" stroke="#d4af37" strokeWidth="0.8" fill="none" />
      </svg>
    </div>
  );
}

export function MadaqLogoSmall({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
    >
      <circle cx="100" cy="100" r="96" stroke="#d4af37" strokeWidth="3" fill="none" />
      <circle cx="100" cy="100" r="88" fill="#0a4d3a" />
      <circle cx="100" cy="100" r="82" stroke="#d4af37" strokeWidth="1.5" fill="none" />
      <text
        x="100"
        y="108"
        textAnchor="middle"
        fontFamily="serif"
        fontSize="36"
        fontWeight="bold"
        fill="#d4af37"
      >
        مَضيق
      </text>
      <line x1="65" y1="70" x2="135" y2="70" stroke="#d4af37" strokeWidth="1" />
      <line x1="65" y1="126" x2="135" y2="126" stroke="#d4af37" strokeWidth="1" />
    </svg>
  );
}
