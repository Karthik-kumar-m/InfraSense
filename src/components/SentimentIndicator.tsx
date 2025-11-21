import React from 'react';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

type SentimentLevel = 'low' | 'medium' | 'high';

interface SentimentIndicatorProps {
  level: SentimentLevel;
  showLabel?: boolean;
}

export function SentimentIndicator({ level, showLabel = true }: SentimentIndicatorProps) {
  const sentimentConfig = {
    low: {
      label: 'Low Urgency',
      icon: Info,
      className: 'bg-[--sentiment-low] text-green-900',
      iconClassName: 'text-green-700',
    },
    medium: {
      label: 'Medium Urgency',
      icon: AlertTriangle,
      className: 'bg-[--sentiment-medium] text-yellow-900',
      iconClassName: 'text-yellow-700',
    },
    high: {
      label: 'High Urgency',
      icon: AlertCircle,
      className: 'bg-[--sentiment-high] text-red-900',
      iconClassName: 'text-red-700',
    },
  };

  const config = sentimentConfig[level];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.className}`}>
      <Icon className={`w-4 h-4 ${config.iconClassName}`} />
      {showLabel && <span className="text-sm">{config.label}</span>}
    </div>
  );
}
