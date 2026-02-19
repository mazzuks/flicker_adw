import React from 'react';

export function Card({
  children,
  className = '',
  noPadding = false,
}: {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}) {
  return (
    <div
      className={`bg-adworks-surface rounded-adw-lg border border-adworks-border shadow-adw-card overflow-hidden ${noPadding ? '' : 'p-6 md:p-8'} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-8 pb-4 border-b border-adworks-bg">
      <div>
        <h3 className="text-lg font-bold text-adworks-dark tracking-tight leading-none italic uppercase">
          {title}
        </h3>
        {subtitle && (
          <p className="text-adworks-muted text-[10px] font-black uppercase tracking-widest mt-2">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
