import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SiteRenderer } from '../../components/templeteria/SiteRenderer';
import {
  Eye,
  Settings2,
  CheckCircle2,
  RefreshCw,
  Monitor,
  Smartphone,
  ArrowLeft,
  Palette,
  Type,
  Layout as LayoutIcon,
  ShieldCheck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * 🎨 TEMPLETERIA REFINER (Designer/Operator Tool)
 * Visual editor for adjusting the AI-generated declarative schema.
 */

export function TempleteriaRefiner() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Mock Schema (Simulando o que a IA gerou)
  const [schema, setSchema] = useState<any>({
    metadata: { title: 'Café de Elite', description: 'O melhor grão da Serra' },
    theme: { primaryColor: '#2563eb', font: 'Inter' },
    pages: [
      {
        id: 'home',
        sections: [
          {
            type: 'hero',
            content: {
              headline: 'Experiência Única em Cada Xícara',
              subheadline:
                'Descubra o sabor autêntico do café artesanal colhido nas montanhas. Entrega rápida em todo o Brasil.',
              ctaText: 'Comprar Agora',
            },
          },
          {
            type: 'features',
            content: {
              items: [
                {
                  title: 'Grãos Selecionados',
                  desc: 'Apenas 1% dos grãos passam pelo nosso controle de qualidade.',
                },
                {
                  title: 'Torra Artesanal',
                  desc: 'Processo lento que preserva todas as notas aromáticas.',
                },
                {
                  title: 'Sustentabilidade',
                  desc: 'Trabalhamos diretamente com pequenos produtores locais.',
                },
              ],
            },
          },
        ],
      },
    ],
  });

  return (
    <div className="fixed inset-0 bg-[#F1F5F9] flex flex-col z-[100] animate-in fade-in duration-500">
      {/* TOOLBAR */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>
          <div>
            <h1 className="text-sm font-black text-slate-900 uppercase tracking-tighter italic">
              Refino de Projeto
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
              Ajustes Finais de IA
            </p>
          </div>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setViewMode('desktop')}
            className={`p-2.5 rounded-lg transition-all ${viewMode === 'desktop' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
          >
            <Monitor className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`p-2.5 rounded-lg transition-all ${viewMode === 'mobile' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
          >
            <Smartphone className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            className="gap-2 text-[11px] uppercase tracking-widest font-black"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-Gerar Texto
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 gap-2 text-[11px] uppercase tracking-widest font-black">
            <ShieldCheck className="w-4 h-4" /> Aprovar Publicação
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* INSPECTOR (LEFT) */}
        <aside className="w-80 bg-white border-r border-slate-200 overflow-y-auto p-6 space-y-10">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic flex items-center gap-2">
              <Palette className="w-3.5 h-3.5" /> Identidade Visual
            </h3>
            <div className="space-y-4">
              <label className="block space-y-2">
                <span className="text-[11px] font-bold text-slate-600">Cor Principal</span>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={schema.theme.primaryColor}
                    onChange={(e) =>
                      setSchema({
                        ...schema,
                        theme: { ...schema.theme, primaryColor: e.target.value },
                      })
                    }
                    className="w-10 h-10 rounded-lg cursor-pointer border-none p-0 overflow-hidden"
                  />
                  <input
                    type="text"
                    value={schema.theme.primaryColor}
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-lg px-3 text-xs font-bold uppercase"
                  />
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic flex items-center gap-2">
              <LayoutIcon className="w-3.5 h-3.5" /> Seções do Site
            </h3>
            <div className="space-y-2">
              {schema.pages[0].sections.map((s: any, i: number) => (
                <div
                  key={i}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-all cursor-pointer"
                >
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">
                    {s.type}
                  </span>
                  <Settings2 className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                </div>
              ))}
              <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:border-blue-200 hover:text-blue-500 transition-all">
                + Adicionar Seção
              </button>
            </div>
          </div>
        </aside>

        {/* CANVAS */}
        <main className="flex-1 overflow-y-auto bg-slate-100 p-12 flex justify-center scrollbar-hide">
          <div
            className={`bg-white shadow-2xl transition-all duration-500 overflow-hidden rounded-[2rem] border border-slate-200 ${viewMode === 'mobile' ? 'w-[375px] min-h-[667px]' : 'w-full max-w-5xl h-fit min-h-full'}`}
          >
            <SiteRenderer schema={schema} />
          </div>
        </main>
      </div>
    </div>
  );
}
