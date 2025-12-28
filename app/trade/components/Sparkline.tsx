"use client";

type SparklineProps = {
  values: number[];
};

export const Sparkline = ({ values }: SparklineProps) => {
  const width = 320;
  const height = 110;

  const max = Math.max(...values);
  const min = Math.min(...values);

  const volatility =
    values.reduce((a, v, i, arr) =>
      i ? a + Math.abs(v - arr[i - 1]) : 0,
    0) / values.length;

  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / (max - min)) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22ff8850" />
          <stop offset="100%" stopColor="#22ff88" />
        </linearGradient>
      </defs>

      {volatility > 12 && (
        <polyline
          points={points}
          stroke="#22ff8830"
          strokeWidth={6}
          fill="none"
          className="blur-[6px]"
        />
      )}

      <polyline
        points={points}
        stroke="url(#sparkGrad)"
        strokeWidth={2.6}
        fill="none"
        strokeLinecap="round"
      />

      <circle
        cx={width}
        cy={
          height -
          ((values[values.length - 1] - min) / (max - min)) * height
        }
        r="3"
        fill="#22ff88"
        className="animate-pulse"
      />
    </svg>
  );
};
