import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Globe,
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck,
  ShieldCheck,
  ArrowRight,
  Info,
  AlertCircle,
} from 'lucide-react';

/**
 * 🌐 DOMAIN & BRAND SOP (Strategic Operational Procedures)
 * Interface guiada para Registro de Domínio e Marca INPI.
 * Foco: Execução sem erro e clareza para o operador.
 */

export function IntegrationsSOP() {
  const [activeTab, setActiveTab] = useState<'domain' | 'brand'>('domain');

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      {/* HEADER TABS */}
      <div className="flex p-1.5 bg-slate-100 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('domain')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'domain' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Globe className="w-4 h-4" /> Registro de Domínio
        </button>
        <button
          onClick={() => setActiveTab('brand')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'brand' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <ShieldCheck className="w-4 h-4" /> Registro de Marca (INPI)
        </button>
      </div>

      {activeTab === 'domain' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* STEP BY STEP (8/12) */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
              Fluxo Registro.br
            </h2>

            <div className="space-y-4">
              <SopStep
                number="01"
                title="Consulta de Disponibilidade"
                desc="Verifique se o domínio desejado está livre no Registro.br"
                status="done"
              />
              <SopStep
                number="02"
                title="Cadastro do Titular (CNPJ)"
                desc="Utilize os dados da empresa cadastrada no Adworks para o WHOIS."
                status="active"
              />
              <SopStep
                number="03"
                title="Configuração de DNS"
                desc="Aponte os nameservers para o servidor da Adworks (Cloudflare)."
                status="pending"
              />
              <SopStep
                number="04"
                title="Validação de Propagação"
                desc="Aguarde até 24h para que o site entre no ar."
                status="pending"
              />
            </div>
          </div>

          {/* SIDEBAR TOOLS (4/12) */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-blue-600 text-white border-none shadow-xl shadow-blue-200">
              <h3 className="text-xs font-black uppercase tracking-widest mb-4 text-blue-200">
                Atalho Rápido
              </h3>
              <p className="text-sm font-medium mb-6">
                Sempre utilize o CNPJ final do cliente para garantir a propriedade legal do domínio.
              </p>
              <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
                Abrir Registro.br <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Card>

            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 space-y-3">
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Atenção Operador
                </span>
              </div>
              <p className="text-xs text-amber-900 font-medium leading-relaxed italic">
                "Não registre domínios .com.br em CPFs pessoais se a empresa já possui CNPJ ativo."
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
              Protocolo INPI
            </h2>
            <div className="space-y-4">
              <SopStep
                number="01"
                title="Busca de Anterioridade"
                desc="Pesquisa profunda no banco de dados do INPI para evitar colisão de marcas."
                status="active"
              />
              <SopStep
                number="02"
                title="Classificação de Nice"
                desc="Definição das classes de serviço/produto (ex: Classe 35 para serviços)."
                status="pending"
              />
              <SopStep
                number="03"
                title="Emissão e Pagamento de GRU"
                desc="Gerar a Guia de Recolhimento da União para o protocolo inicial."
                status="pending"
              />
              <SopStep
                number="04"
                title="Protocolo do Pedido"
                desc="Envio formal dos documentos e logo para análise do Instituto."
                status="pending"
              />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Card className="border border-slate-200 shadow-sm">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                Checklist de Documentos
              </h3>
              <div className="space-y-3">
                <DocCheck label="Logotipo em Alta Resolução" />
                <DocCheck label="Contrato Social Assinado" />
                <DocCheck label="Procuração Adworks" />
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function SopStep({
  number,
  title,
  desc,
  status,
}: {
  number: string;
  title: string;
  desc: string;
  status: 'done' | 'active' | 'pending';
}) {
  return (
    <div
      className={`p-6 rounded-2xl border flex items-center gap-6 transition-all ${status === 'active' ? 'bg-white border-blue-600 shadow-lg scale-[1.02] z-10' : status === 'done' ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-100 opacity-40'}`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${status === 'active' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}
      >
        {status === 'done' ? <CheckCircle2 className="w-6 h-6" /> : number}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{title}</h4>
        <p className="text-xs text-slate-500 font-medium mt-1">{desc}</p>
      </div>
      {status === 'active' && (
        <Button size="sm" className="bg-blue-600 text-white">
          Concluir Passo
        </Button>
      )}
    </div>
  );
}

function DocCheck({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-4 h-4 rounded border border-slate-200" />
      <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{label}</span>
    </div>
  );
}
