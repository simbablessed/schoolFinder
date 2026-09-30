import { CSSProperties } from "react";

type IconProps = {
  name: string;
  className?: string;
  fill?: boolean;
  size?: number;
  weight?: number;
  style?: CSSProperties;
};

export function Icon({ name, className = "", fill = false, size = 24, weight = 400, style }: IconProps) {
  return (
    <span
      className={`material-symbols-rounded select-none ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
        ...style,
      }}
    >
      {name}
    </span>
  );
}
