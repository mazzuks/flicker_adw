import { ShieldCheck } from 'lucide-react';
import { Badge } from './Badge';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: any;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ 
  title, 
  description, 
  icon: Icon = ShieldCheck,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-slate-200 border-dashed rounded-[2.5rem] animate-in fade-in duration-700">
      <div className="p-4 bg-slate-50 text-slate-400 rounded-3xl mb-6">
        <Icon className="w-10 h-10" />
      </div>
      
      <div className="space-y-2 mb-8">
        <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter">{title}</h3>
        <p className="text-sm text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">{description}</p>
      </div>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-slate-200"
        >
          {actionLabel}
        </button>
      )}

      {!actionLabel && (
        <Badge variant="neutral" className="text-[8px] uppercase tracking-[0.4em] font-black py-1 px-4">
          Aguardando Interação
        </Badge>
      )}
    </div>
  );
}
