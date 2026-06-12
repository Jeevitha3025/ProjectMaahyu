import { DonutSlice } from "@/lib/wrappedUtils";

interface MoodDonutProps {
  slices: DonutSlice[];
  size?: number;
  centerLabel?: string;
  centerSubLabel?: string;
}

const MoodDonut = ({ slices, size = 180, centerLabel, centerSubLabel }: MoodDonutProps) => {
  const strokeWidth = size * 0.14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        {slices.map((slice, i) => {
          const dash = (slice.value / 100) * circumference;
          const el = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={`hsl(var(--${slice.colorVar}))`}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
            />
          );
          offset += dash;
          return el;
        })}
      </svg>
      {(centerLabel || centerSubLabel) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          {centerLabel && <span className="font-display font-bold text-2xl">{centerLabel}</span>}
          {centerSubLabel && <span className="text-xs text-muted-foreground">{centerSubLabel}</span>}
        </div>
      )}
    </div>
  );
};

export default MoodDonut;