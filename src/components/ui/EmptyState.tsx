import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 bg-adworks-bg rounded-3xl flex items-center justify-center mb-6">
        {Icon ? (
          <Icon className="w-10 h-10 text-adworks-muted opacity-20" />
        ) : (
          <div className="w-10 h-10 bg-adworks-border rounded-lg" />
        )}
      </div>
      <h3 className="text-xl font-semibold text-adworks-dark tracking-tight">{title}</h3>
      <p className="text-adworks-muted text-sm mt-2 max-w-sm leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" className="mt-8" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
