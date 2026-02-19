import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Globe,
  Mail,
  Layout as LayoutIcon,
  Award,
  FileText,
  AlertTriangle,
  Clock,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  DollarSign,
  Zap,
  Plus,
  Search,
  Filter,
  Layers,
  ListTodo,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

/**
 * 🏛️ ADWORKS DECISION PANEL (Refoundation)
 * Purpose: Operational Execution Engine
 * Goal: Zero decorative fluff. Pure action.
 */

export function AdworksDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 400);
  }, []);

  if (loading)
    return (
      <div className="p-10 animate-pulse space-y-6">
        <div className="h-10 bg-gray-200 rounded w-1/4" />
        <div className="h-64 bg-gray-100 rounded-xl" />
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-full font-sans text-[#0B1220] bg-[#F6F7FB] min-h-screen -m-8 p-12">
      {/* 🚀 TOP EXECUTION BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-[#E6E9F2]">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-[#0B1220]">Decision Panel</h1>
          <p className="text-[#5B667A] text-sm font-medium">
            Foco em execução e resolução de bloqueios.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            size="lg"
            className="bg-[#0B1220] text-white hover:bg-slate-800 gap-3 px-10 shadow-xl"
            onClick={() => navigate('/operator/tasks')}
          >
            OPEN PIPELINE <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* 🚨 BLOCKERS & CRITICAL ISSUES (Left Side - 7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          <section className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#5B667A] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#EF4444]" /> Blocked Processes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="border-l-4 border-l-[#EF4444] p-6 hover:shadow-lg transition-all cursor-pointer bg-white group">
                <p className="text-[9px] font-bold text-[#5B667A] uppercase mb-1">SLA Breaches</p>
                <h4 className="text-4xl font-bold text-[#0B1220] tracking-tighter">14</h4>
                <p className="text-[10px] font-black text-[#EF4444] mt-4 flex items-center gap-1">
                  URGENTE • RESOLVER AGORA
                </p>
              </Card>
              <Card className="border-l-4 border-l-[#F59E0B] p-6 hover:shadow-lg transition-all cursor-pointer bg-white group">
                <p className="text-[9px] font-bold text-[#5B667A] uppercase mb-1">
                  Waiting Documents
                </p>
                <h4 className="text-4xl font-bold text-[#0B1220] tracking-tighter">32</h4>
                <p className="text-[10px] font-black text-[#F59E0B] mt-4 flex items-center gap-1">
                  PENDÊNCIA DO CLIENTE
                </p>
              </Card>
            </div>
          </section>

          <section className="bg-white rounded-[14px] border border-[#E6E9F2] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#F6F7FB] flex items-center justify-between">
              <h3 className="font-bold text-[#0B1220] text-xs uppercase tracking-widest">
                Recommended Actions
              </h3>
              <Zap className="w-4 h-4 text-[#1E5BFF]" />
            </div>
            <div className="divide-y divide-[#F6F7FB]">
              {[
                { label: 'Reativar Negócios Parados > 7 dias', count: 8, target: 'Leads' },
                { label: 'Auditar Documentos Pendentes', count: 5, target: 'CNPJ' },
                { label: 'Processar Inscrições Municipais', count: 12, target: 'Accounting' },
                { label: 'Validar Briefings de Marca', count: 3, target: 'Brand' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-6 hover:bg-[#F6F7FB] transition-all group cursor-pointer"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-[#0B1220] group-hover:text-[#1E5BFF] transition-colors">
                      {item.label}
                    </p>
                    <p className="text-[9px] font-black text-[#5B667A] uppercase tracking-widest">
                      Etapa: {item.target}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-lg font-black text-[#0B1220]">{item.count}</span>
                    <div className="w-10 h-10 rounded-xl bg-[#F6F7FB] text-[#5B667A] group-hover:bg-[#1E5BFF] group-hover:text-white transition-all flex items-center justify-center">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 💰 MONEY & OPERATION (Right Side - 5 Cols) */}
        <div className="lg:col-span-5 space-y-8">
          <section className="bg-[#0B1220] rounded-[14px] p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1E5BFF]/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-6 italic">
              Money Stalled by Stage
            </p>
            <div className="space-y-6">
              {[
                { stage: 'CNPJ', value: 'R$ 1.2M', perc: '45%' },
                { stage: 'Marca INPI', value: 'R$ 840k', perc: '25%' },
                { stage: 'Site Builder', value: 'R$ 420k', perc: '15%' },
                { stage: 'Contábil', value: 'R$ 2.7M', perc: '70%' },
              ].map((s, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span>{s.stage}</span>
                    <span className="text-[#1E5BFF] font-black">{s.value}</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="bg-[#1E5BFF] h-full" style={{ width: s.perc }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-[14px] border border-[#E6E9F2] p-8 shadow-sm">
            <h3 className="text-[10px] font-black text-[#5B667A] uppercase tracking-[0.3em] mb-8">
              Pipeline Summary
            </h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-[#5B667A] uppercase">Active Deals</p>
                <p className="text-3xl font-black text-[#0B1220]">1.6k</p>
              </div>
              <div className="space-y-1 border-l border-[#F6F7FB] pl-8">
                <p className="text-[9px] font-bold text-[#5B667A] uppercase">Conversion</p>
                <p className="text-3xl font-black text-[#16A34A]">16.9%</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-[#5B667A] uppercase">Avg. Ticket</p>
                <p className="text-3xl font-black text-[#0B1220]">R$ 3.2k</p>
              </div>
              <div className="space-y-1 border-l border-[#F6F7FB] pl-8">
                <p className="text-[9px] font-bold text-[#5B667A] uppercase">Revenue</p>
                <p className="text-3xl font-black text-[#1E5BFF]">R$ 1.2M</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
