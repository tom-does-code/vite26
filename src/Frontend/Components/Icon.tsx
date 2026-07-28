interface IconProps {
  name: string;
  size?: number;
  filled?: boolean;
  className?: string;
}

export default function Icon({ name, size = 22, filled = false, className }: IconProps) {
  return (
    <span
      className={className ? `material-symbols-rounded ${className}` : 'material-symbols-rounded'}
      style={{
        fontSize: `${size}px`,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
