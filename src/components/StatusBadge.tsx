import React from 'react';
import { Badge } from './ui/badge';

type Status = 'open' | 'assigned' | 'in-progress' | 'resolved';

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    open: {
      label: 'Open',
      className: 'bg-[--status-open] text-blue-900 border-blue-200',
    },
    assigned: {
      label: 'Assigned',
      className: 'bg-[--status-assigned] text-indigo-900 border-indigo-200',
    },
    'in-progress': {
      label: 'In Progress',
      className: 'bg-[--status-in-progress] text-yellow-900 border-yellow-200',
    },
    resolved: {
      label: 'Resolved',
      className: 'bg-[--status-resolved] text-green-900 border-green-200',
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
