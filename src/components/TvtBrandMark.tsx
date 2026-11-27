import React, { useId } from 'react';

interface TvtBrandMarkProps {
  size?: number;
  className?: string;
}

/**
 * TVT STUDIO — Architectural Monolith Vector Emblem
 * Precision-milled obsidian squircle with beveled titanium-vermilion rim,
 * unified architectural T-canopy, and split platinum / vermilion V-blade.
 * Renders razor-sharp at 16px favicon, 36px navbar, and 512px display sizes.
 */
export const TvtBrandMark: React.FC<TvtBrandMarkProps> = ({ size = 36, className = '' }) => {
  const uid = useId().replace(/:/g, '');
  const bgId = `tvt-bg-${uid}`;
  const rimId = `tvt-rim-${uid}`;
  const glowId = `tvt-glow-${uid}`;
  const topId = `tvt-top-${uid}`;
  const bladeId = `tvt-blade-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 group-hover:scale-[1.04] ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={bgId} x1="4" y1="2" x2="44" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1D222E" />
          <stop offset="55%" stopColor="#11141C" />
          <stop offset="100%" stopColor="#090B0F" />
        </linearGradient>
        <linearGradient id={rimId} x1="2" y1="2" x2="46" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.34" />
          <stop offset="48%" stopColor="#FFFFFF" stopOpacity="0.09" />
          <stop offset="100%" stopColor="#FF551A" stopOpacity="0.72" />
        </linearGradient>
        <radialGradient id={glowId} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(30 28) rotate(135) scale(24)">
          <stop offset="0%" stopColor="#FF551A" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#FF551A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={topId} x1="8" y1="11" x2="40" y2="17" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#DCE4F0" />
        </linearGradient>
        <linearGradient id={bladeId} x1="22" y1="19" x2="36" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF8243" />
          <stop offset="55%" stopColor="#FF5216" />
          <stop offset="100%" stopColor="#E03100" />
        </linearGradient>
      </defs>

      {/* Sculpted obsidian tile + beveled titanium-to-vermilion rim */}
      <rect
        x="1.5"
        y="1.5"
        width="45"
        height="45"
        rx="12"
        fill={`url(#${bgId})`}
        stroke={`url(#${rimId})`}
        strokeWidth="1.5"
      />

      {/* Subtle ambient internal glow behind the vermilion blade */}
      <rect x="2.25" y="2.25" width="43.5" height="43.5" rx="11.25" fill={`url(#${glowId})`} />

      {/* Top micro architectural signal highlight */}
      <path
        d="M14 2H34"
        stroke="#FF6328"
        strokeOpacity="0.72"
        strokeWidth="1.35"
        strokeLinecap="round"
      />

      {/* Architectural T-Canopy Beam */}
      <path d="M8.5 11.8H39.5L37.1 17.1H10.9L8.5 11.8Z" fill={`url(#${topId})`} />

      {/* Split-Blade Precision V Monolith (Platinum Left + Engineering Vermilion Right) */}
      <path d="M13.2 19.6H19.4L24.0 30.8L21.3 37.3L13.2 19.6Z" fill="#FFFFFF" />
      <path d="M34.8 19.6H28.6L21.3 37.3H26.7L34.8 19.6Z" fill={`url(#${bladeId})`} />
    </svg>
  );
};

interface TvtBrandLockupProps {
  size?: 'sm' | 'md' | 'lg';
  subtitle?: string;
  showSubtitle?: boolean;
}

export const TvtBrandLockup: React.FC<TvtBrandLockupProps> = ({
  size = 'md',
  subtitle = 'ARCHITECTURAL IT',
  showSubtitle = true,
}) => {
  const iconPx = size === 'lg' ? 42 : size === 'sm' ? 32 : 36;
  const titleCls =
    size === 'lg'
      ? 'text-lg tracking-[0.04em]'
      : size === 'sm'
        ? 'text-sm tracking-[0.04em]'
        : 'text-[15px] tracking-[0.04em] sm:text-base';

  return (
    <div className="group inline-flex min-w-0 items-center gap-2.5 sm:gap-3">
      <TvtBrandMark size={iconPx} />
      <div className="flex min-w-0 flex-col leading-none">
        <div className={`font-display flex items-baseline gap-1.5 whitespace-nowrap font-extrabold ${titleCls}`}>
          <span style={{ color: 'var(--ink-primary)' }}>TVT</span>
          <span
            className="font-semibold tracking-[0.16em]"
            style={{ color: 'var(--accent)' }}
          >
            STUDIO
          </span>
        </div>
        {showSubtitle && (
          <span
            className="font-mono-num mt-1 hidden whitespace-nowrap text-[9.5px] font-medium tracking-[0.22em] uppercase sm:block"
            style={{ color: 'var(--ink-muted)' }}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
