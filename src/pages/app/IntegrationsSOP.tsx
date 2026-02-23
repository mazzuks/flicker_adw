import { useState } from 'react';
import { 
  Globe, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  AlertCircle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

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
          <Globe className="w-4 h-4" /> Registro de Dominio
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
          
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight italic">Fluxo Registro.br</h2>
            
            <div className="space-y-4">
              <SopStep 
                number="01" 
                title="Consulta de Disponibilidade" 
                desc="Verifique se o dominio desejado esta livre no Registro.br" 
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
                title="Configuracao de DNS" 
                desc="Aponte os nameservers para o servidor da Adworks (Cloudflare)." 
                status="pending" 
              />
              <SopStep 
                number="04" 
                title="Validacao de Propagacao" 
                desc="Aguarde ate 24h para que o site entre no ar." 
                status="pending" 
              />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-blue-600 text-white border-none shadow-xl shadow-blue-200 p-8 rounded-[2rem]">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-blue-200">Atalho Rapido</h3>
               <p className="text-sm font-medium mb-6 leading-relaxed">Sempre utilize o CNPJ final do cliente para garantir a propriedade legal do dominio.</p>
               <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold uppercase text-[11px] py-4 h-auto">Abrir Registro.br <ExternalLink className="w-4 h-4 ml-2" /></Button>
            </Card>

            <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 space-y-4">
               <div className="flex items-center gap-2 text-amber-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Atencao Operador</span>
               </div>
               <p className="text-xs text-amber-900 font-medium leading-relaxed italic">
                 "Nao registre dominios .com.br em CPFs pessoais se a empresa ja possui CNPJ ativo."
               </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight italic">Protocolo INPI</h2>
            <div className="space-y-4">
              <SopStep 
                number="01" 
                title="Busca de Anterioridade" 
                desc="Pesquisa profunda no banco de dados do INPI para evitar colisao de marcas." 
                status="active" 
              />
              <SopStep 
                number="02" 
                title="Classificacao de Nice" 
                desc="Definicao das classes de servico/produto (ex: Classe 35 para servicos)." 
                status="pending" 
              />
              <SopStep 
                number="03" 
                title="Emissao e Pagamento de GRU" 
                desc="Gerar a Guia de Recolhimento da Uniao para o protocolo inicial." 
                status="pending" 
              />
              <SopStep 
                number="04" 
                title="Protocolo do Pedido" 
                desc="Envio formal dos documentos e logo para analise do Instituto." 
                status="pending" 
              />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
             <Card className="border border-slate-200 shadow-sm p-8 rounded-[2rem]">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 italic">Checklist de Documentos</h3>
                <div className="space-y-4">
                   <DocCheck label="Logotipo em Alta Resolucao" />
                   <DocCheck label="Contrato Social Assinado" />
                   <DocCheck label="Procuracao Adworks" />
                </div>
             </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function SopStep({ number, title, desc, status }: { number: string, title: string, desc: string, status: 'done' | 'active' | 'pending' }) {
  return (
    <div className={`p-8 rounded-[2rem] border flex items-center gap-8 transition-all ${status === 'active' ? 'bg-white border-blue-600 shadow-2xl shadow-blue-100 scale-[1.02] z-10' : status === 'done' ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-100 opacity-40'}`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${status === 'active' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
        {status === 'done' ? <CheckCircle2 className="w-7 h-7" /> : number}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight italic">{title}</h4>
        <p className="text-[13px] text-slate-500 font-medium mt-1 leading-relaxed">{desc}</p>
      </div>
      {status === 'active' && <Button size="sm" className="bg-blue-600 text-white font-bold uppercase text-[10px] px-6 py-3 h-auto rounded-xl">Concluir Passo</Button>}
    </div>
  );
}

function DocCheck({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
       <div className="w-5 h-5 rounded-lg border-2 border-slate-100 bg-slate-50" />
       <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">{label}</span>
    </div>
  );
}
