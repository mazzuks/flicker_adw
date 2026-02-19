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
      className={`bg-white rounded-[14px] border border-[#E6E8EC] shadow-sm overflow-hidden ${noPadding ? '' : 'p-6'} ${className}`}
    >
      {children}
    </div>
  );
}

export function KpiCard({
  label,
  value,
  delta,
  status = 'info',
}: {
  label: string;
  value: string | number;
  delta?: string;
  status?: 'success' | 'warning' | 'danger' | 'info';
}) {
  const deltaStyles = {
    success: 'text-[#16A34A]',
    warning: 'text-[#F59E0B]',
    danger: 'text-[#EF4444]',
    info: 'text-[#2563EB]',
  };

  return (
    <Card className="hover:shadow-md transition-all group">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-black text-[#5B6475] uppercase tracking-widest leading-none">
          {label}
        </p>
        {delta && <span className={`text-[10px] font-black ${deltaStyles[status]}`}>{delta}</span>}
      </div>
      <h4 className="text-[28px] font-bold text-[#0B1220] tracking-tighter leading-none">
        {value}
      </h4>
    </Card>
  );
}
