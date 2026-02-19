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
      className={`bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden ${noPadding ? '' : 'p-6'} ${className}`}
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
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
      <div>
        <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-none uppercase">
          {title}
        </h3>
        {subtitle && (
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
