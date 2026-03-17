import { useEffect, useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

function getScoreColor(score) {
  if (score < 40) {
    return "#ef4444";
  }

  if (score < 70) {
    return "#f59e0b";
  }

  return "#22c55e";
}

function getScoreLabel(score) {
  if (score < 40) {
    return "Needs work";
  }

  if (score < 70) {
    return "Promising";
  }

  return "Strong fit";
}

function ScoreGauge({ score }) {
  const safeScore = Math.max(0, Math.min(100, Number(score) || 0));
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(safeScore);
    }, 50);

    return () => clearTimeout(timer);
  }, [safeScore]);

  const radius = 86;
  const stroke = 16;
  const normalizedRadius = radius - stroke / 2;
  const circumference = useMemo(
    () => 2 * Math.PI * normalizedRadius,
    [normalizedRadius],
  );
  const dashOffset = circumference * (1 - animatedScore / 100);
  const scoreColor = getScoreColor(animatedScore);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Match Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative mx-auto flex h-64 w-64 items-center justify-center animate-fade-in">
          <svg
            width={radius * 2}
            height={radius * 2}
            viewBox={`0 0 ${radius * 2} ${radius * 2}`}
            className="-rotate-90"
          >
            <defs>
              <linearGradient id="scoreGaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#fb7185" />
              </linearGradient>
            </defs>

            <circle
              cx={radius}
              cy={radius}
              r={normalizedRadius}
              fill="none"
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-700"
              strokeWidth={stroke}
            />
            <circle
              cx={radius}
              cy={radius}
              r={normalizedRadius}
              fill="none"
              stroke={animatedScore >= 40 ? "url(#scoreGaugeGradient)" : scoreColor}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: "stroke-dashoffset 900ms ease, stroke 250ms ease" }}
            />
          </svg>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-5xl font-bold leading-none text-foreground dark:text-white">
              {Math.round(animatedScore)}
            </p>
            <p className="mt-1 text-sm font-medium text-muted-foreground dark:text-gray-300">
              /100
            </p>
            <p className="mt-2 text-sm font-semibold text-muted-foreground dark:text-gray-300">
              {getScoreLabel(animatedScore)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ScoreGauge;
