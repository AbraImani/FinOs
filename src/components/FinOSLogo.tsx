interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  variant?: 'icon' | 'full' | 'app';
}

/**
 * FinOS branded logo component.
 * - icon: wallet logo on transparent bg (iconLogo.png)
 * - full: full logo with FinOS text (PrincipalLogo.png)
 * - app: app icon with dark bg (iconeAPP.png)
 */
export function FinOSLogo({ size = 32, className = '', showText = false, variant = 'icon' }: LogoProps) {
  const src = variant === 'full'
    ? '/PrincipalLogo.png'
    : variant === 'app'
      ? '/iconeAPP.png'
      : '/iconLogo.png';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src={src}
        alt="FinOS"
        width={size}
        height={size}
        className={`object-contain ${variant === 'app' ? 'rounded-xl' : ''}`}
        style={{ width: size, height: size }}
      />
      {showText && (
        <span className="font-bold text-lg tracking-tight text-finos-text">
          Fin<span className="text-finos-accent">OS</span>
        </span>
      )}
    </div>
  );
}
