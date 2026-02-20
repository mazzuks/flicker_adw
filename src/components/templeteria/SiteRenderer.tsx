import React from 'react';

/**
 * SITE RENDERER ENGINE
 * No emojis.
 */

interface SiteSection {
  id: string;
  type: string;
  props: {
    headline?: string;
    content?: string;
    ctaText?: string;
  };
}

interface SiteSchema {
  metadata: { title: string; description: string };
  theme: { palette: string; font: string; primaryColor?: string };
  pages: { id: string; title: string; blocks: SiteSection[] }[];
}

export function SiteRenderer({ schema }: { schema: SiteSchema }) {
  if (!schema || !schema.pages || schema.pages.length === 0) {
    return (
      <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest">
        Nenhum conteudo disponivel
      </div>
    );
  }

  const primaryPage = schema.pages[0];
  const themeColor = schema.theme.palette || schema.theme.primaryColor || '#2563eb';

  return (
    <div style={{ fontFamily: schema.theme.font }} className="min-h-screen bg-white">
      {primaryPage.blocks?.map((block, idx) => (
        <RenderSection key={block.id || idx} block={block} themeColor={themeColor} />
      )) || <div className="p-20 text-center text-slate-300 italic">Pagina sem blocos</div>}
    </div>
  );
}

function RenderSection({ block, themeColor }: { block: SiteSection; themeColor: string }) {
  switch (block.type) {
    case 'hero':
      return (
        <section className="py-24 px-8 text-center space-y-8 bg-slate-50 border-b border-slate-100">
          <h1 className="text-5xl font-black text-slate-900 max-w-4xl mx-auto leading-tight uppercase italic">
            {block.props.headline || 'Bem vindo'}
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
            {block.props.content || 'Estamos preparando algo especial.'}
          </p>
          {block.props.ctaText && (
            <button
              style={{ backgroundColor: themeColor }}
              className="px-10 py-5 rounded-2xl text-white font-bold text-lg shadow-xl hover:scale-105 transition-all uppercase tracking-widest"
            >
              {block.props.ctaText}
            </button>
          )}
        </section>
      );
    case 'services':
    case 'features':
      return (
        <section className="py-20 px-8 max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-12 uppercase italic tracking-tight">
            {block.props.headline || 'Nossos Servicos'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4 p-8 rounded-3xl border border-slate-100 bg-white shadow-sm">
              <div
                style={{ color: themeColor }}
                className="text-sm font-black uppercase tracking-[0.2em]"
              >
                Destaque
              </div>
              <p className="text-slate-600 leading-relaxed font-medium">{block.props.content}</p>
            </div>
          </div>
        </section>
      );
    case 'contact':
      return (
        <section className="py-20 px-8 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-black uppercase italic tracking-widest">
              {block.props.headline || 'Contato'}
            </h2>
            <p className="text-slate-400 font-medium">{block.props.content}</p>
            <div className="pt-8 border-t border-white/10">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
                Adworks Templeteria
              </span>
            </div>
          </div>
        </section>
      );
    default:
      return (
        <section className="p-10 border border-dashed border-slate-200 text-center m-4 rounded-xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Bloco: {block.type}
          </p>
        </section>
      );
  }
}
