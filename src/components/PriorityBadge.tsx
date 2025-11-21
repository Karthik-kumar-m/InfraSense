import React from 'react';
import { Badge } from './ui/badge';

type Priority = 'low' | 'medium' | 'high';

interface PriorityBadgeProps {
  priority: Priority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const priorityConfig = {
    low: {
      label: 'Low',
      className: 'bg-[--priority-low] text-green-800 border-green-200',
    },
    medium: {
      label: 'Medium',
      className: 'bg-[--priority-medium] text-orange-800 border-orange-200',
    },
    high: {
      label: 'High',
      className: 'bg-[--priority-high] text-red-800 border-red-200',
    },
  };

  const config = priorityConfig[priority];

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
