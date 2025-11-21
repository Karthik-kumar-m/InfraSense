import React from 'react';
import { Activity } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
  className?: string;
}

export function Logo({ size = 'md', variant = 'full', className = '' }: LogoProps) {
  const sizes = {
    sm: {
      icon: 'w-6 h-6',
      text: 'text-lg',
      container: 'gap-2',
    },
    md: {
      icon: 'w-8 h-8',
      text: 'text-xl',
      container: 'gap-2',
    },
    lg: {
      icon: 'w-12 h-12',
      text: 'text-3xl',
      container: 'gap-3',
    },
  };

  const currentSize = sizes[size];

  if (variant === 'icon') {
    return (
      <div className={`rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-2 flex items-center justify-center ${className}`}>
        <Activity className={`${currentSize.icon} text-white`} />
      </div>
    );
  }

  return (
    <div className={`flex items-center ${currentSize.container} ${className}`}>
      <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-2 flex items-center justify-center">
        <Activity className={`${currentSize.icon} text-white`} />
      </div>
      <span className={`${currentSize.text} font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent`}>
        InfraSense
      </span>
    </div>
  );
}
