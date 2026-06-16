import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TagProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'purple' | 'gold';
  size?: 'sm' | 'md';
  className?: string;
}

export default function Tag({ children, variant = 'default', size = 'sm', className }: TagProps) {
  const variants = {
    default: 'bg-dark-600/50 text-dark-200 border-dark-500/30',
    success: 'bg-neon-green/15 text-neon-green border-neon-green/30',
    warning: 'bg-neon-amber/15 text-neon-amber border-neon-amber/30',
    danger: 'bg-neon-pink/15 text-neon-pink border-neon-pink/30',
    purple: 'bg-neon-purple/15 text-neon-purple border-neon-purple/30',
    gold: 'bg-neon-gold/15 text-neon-gold border-neon-gold/30',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full border font-medium',
      variants[variant],
      sizes[size],
      className
    )}>
      {children}
    </span>
  );
}
