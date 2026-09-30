import { Icon } from "./Icon";

export function Rating({
  value,
  count,
  size = 18,
  showValue = true,
  light = false,
}: {
  value: number;
  count?: number;
  size?: number;
  showValue?: boolean;
  light?: boolean;
}) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center" style={{ color: "var(--brand-mustard)" }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Icon
            key={i}
            name={i < full ? "star" : i === full && half ? "star_half" : "star"}
            fill={i < full || (i === full && half)}
            size={size}
            className={i < full || (i === full && half) ? "" : "text-muted-foreground/40"}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm" style={{ fontWeight: 600, color: light ? "#fff" : "var(--brand-text)" }}>
          {value.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className={`text-sm ${light ? "" : "text-muted-foreground"}`} style={{ color: light ? "rgba(255,255,255,0.65)" : undefined }}>({count})</span>
      )}
    </div>
  );
}
