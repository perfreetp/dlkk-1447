import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className,
  ...props
}: ButtonProps) {
  const baseStyles = 'rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98]';

  const variants = {
    primary: 'gradient-bg text-white glow-hover hover:shadow-lg hover:shadow-primary-500/30',
    secondary: 'bg-dark-700 text-dark-100 hover:bg-dark-600 border border-dark-600',
    ghost: 'text-dark-200 hover:text-white hover:bg-white/5',
    outline: 'border border-neon-purple/50 text-neon-purple hover:bg-neon-purple/10',
    danger: 'bg-neon-pink/20 text-neon-pink border border-neon-pink/30 hover:bg-neon-pink/30',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        props.disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
