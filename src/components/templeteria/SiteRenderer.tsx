import React from 'react';

/**
 * SITE RENDERER ENGINE
 * Stable contract for declarative JSON sites.
 * No emojis.
 */

interface SiteSection {
  id?: string;
  type: string;
  props: {
    headline?: string;
    content?: string;
    ctaText?: string;
    items?: { title: string; desc: string }[];
  };
}

interface SiteSchema {
  metadata: { title: string; description: string };
  theme: { palette?: string; primaryColor?: string; font: string };
  pages: { id: string; title?: string; blocks: SiteSection[] }[];
}

export function SiteRenderer({ schema }: { schema: SiteSchema }) {
  if (!schema || !schema.pages || schema.pages.length === 0) {
    return (
      <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-[0.2em] italic">
        Nenhum conteudo disponivel para renderizacao
      </div>
    );
  }

  const primaryPage = schema.pages[0];
  const themeColor = schema.theme?.palette || schema.theme?.primaryColor || '#2563eb';

  return (
    <div style={{ fontFamily: schema.theme.font || 'Inter' }} className="min-h-screen bg-white">
      {primaryPage.blocks?.map((block, idx) => (
        <RenderSection key={block.id || idx} block={block} themeColor={themeColor} />
      )) || (
        <div className="p-20 text-center text-slate-300 italic uppercase font-bold tracking-widest">
          Pagina sem blocos estruturados
        </div>
      )}
    </div>
  );
}

function RenderSection({ block, themeColor }: { block: SiteSection; themeColor: string }) {
  switch (block.type) {
    case 'hero':
      return (
        <section className="py-24 px-8 text-center space-y-8 bg-slate-50 border-b border-slate-100 animate-in fade-in slide-in-from-top-4 duration-1000">
           <h1 className="text-5xl font-black text-slate-900 max-w-4xl mx-auto leading-tight uppercase italic tracking-tighter">
             {block.props.headline || 'Seja bem vindo'}
           </h1>
           <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium tracking-tight leading-relaxed">
             {block.props.content || 'Estamos preparando uma experiencia incrível para voce.'}
           </p>
           {block.props.ctaText && (
             <button 
               style={{ backgroundColor: themeColor }}
               className="px-12 py-5 rounded-2xl text-white font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all"
             >
               {block.props.ctaText}
             </button>
           )}
        </section>
      );
    case 'services':
    case 'features':
      return (
        <section className="py-24 px-8 max-w-7xl mx-auto">
           <h2 className="text-3xl font-black text-slate-900 mb-16 uppercase italic tracking-tight text-center">
             {block.props.headline || 'Nossos Servicos'}
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {block.props.items?.map((item, i) => (
                <div key={i} className="space-y-4 p-10 rounded-[2rem] border border-slate-100 bg-white shadow-xl shadow-slate-100/50 hover:border-blue-200 transition-all group">
                   <div style={{ color: themeColor }} className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-50">Destaque 0{i+1}</div>
                   <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{item.title}</h3>
                   <p className="text-slate-500 leading-relaxed font-medium text-sm">{item.desc}</p>
                </div>
              )) || (
                <div className="col-span-full p-10 bg-slate-50 rounded-3xl border border-slate-100 text-slate-400 text-center font-bold uppercase text-xs italic tracking-widest">
                  {block.props.content || 'Conteudo em geracao...'}
                </div>
              )}
           </div>
        </section>
      );
    case 'contact':
      return (
        <section className="py-24 px-8 bg-slate-900 text-white overflow-hidden relative">
           <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
           <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
              <h2 className="text-4xl font-black uppercase italic tracking-[0.2em]">{block.props.headline || 'Vamos Conversar?'}</h2>
              <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-2xl mx-auto">{block.props.content}</p>
              <div className="pt-12 border-t border-white/5 flex flex-col items-center gap-4">
                 <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Adworks Templeteria Engine</span>
              </div>
           </div>
        </section>
      );
    default:
      return (
        <section className="p-12 border-2 border-dashed border-slate-100 text-center m-8 rounded-[2rem]">
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Componente em desenvolvimento: {block.type}</p>
        </section>
      );
  }
}
