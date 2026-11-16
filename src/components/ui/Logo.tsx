type LogoProps = {
  tone?: "dark" | "light";
  compact?: boolean;
  className?: string;
};

/** Marca de três traços do HPE, redesenhada em vetor a partir do logotipo oficial. */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 340 420"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className="logo-mark"
    >
      <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="40">
        <path d="M32 390 L32 82 L86 130" stroke="#F7A21B" />
        <path d="M118 202 L308 20 L308 350 L258 295" stroke="#2EA44F" />
        <path d="M32 395 L238 218" stroke="#E5262A" />
      </g>
    </svg>
  );
}

export default function Logo({ tone = "dark", compact = false, className = "" }: LogoProps) {
  return (
    <span className={`logo logo--${tone} ${className}`}>
      <LogoMark />
      <span className="logo__text">
        <span className="logo__hpe">HPE</span>
        {compact ? null : <span className="logo__full">High Performance English</span>}
      </span>
    </span>
  );
}
