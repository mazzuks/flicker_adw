import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  className?: string;
}

export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  const styles = {
    success: 'bg-status-successTint text-status-success border-status-success/10',
    warning: 'bg-status-warningTint text-status-warning border-status-warning/10',
    danger: 'bg-status-dangerTint text-status-danger border-status-danger/10',
    info: 'bg-status-infoTint text-status-info border-status-info/10',
    neutral: 'bg-adworks-bg text-adworks-muted border-adworks-border',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
