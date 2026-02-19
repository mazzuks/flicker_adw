import React from 'react';

/**
 * 🧱 TEMPLETERIA ENGINE (Core Component)
 * Dynamic renderer for declarative JSON site schemas.
 */

interface SiteSection {
  type: 'hero' | 'features' | 'cta' | 'footer';
  content: any;
}

interface SiteSchema {
  metadata: { title: string; description: string };
  theme: { primaryColor: string; font: string };
  pages: { id: string; sections: SiteSection[] }[];
}

export function SiteRenderer({ schema }: { schema: SiteSchema }) {
  if (!schema || !schema.pages || schema.pages.length === 0) {
    return <div className="p-20 text-center text-slate-400">Site vazio ou em geração...</div>;
  }

  const primaryPage = schema.pages[0];

  return (
    <div style={{ fontFamily: schema.theme.font }} className="min-h-screen bg-white">
      {primaryPage.sections.map((section, idx) => (
        <RenderSection key={idx} section={section} theme={schema.theme} />
      ))}
    </div>
  );
}

function RenderSection({ section, theme }: { section: SiteSection; theme: any }) {
  switch (section.type) {
    case 'hero':
      return (
        <section className="py-24 px-8 text-center space-y-8 bg-slate-50 border-b border-slate-100">
          <h1 className="text-5xl font-black text-slate-900 max-w-4xl mx-auto leading-tight">
            {section.content.headline}
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">{section.content.subheadline}</p>
          <button
            style={{ backgroundColor: theme.primaryColor }}
            className="px-10 py-5 rounded-2xl text-white font-bold text-lg shadow-xl hover:scale-105 transition-all"
          >
            {section.content.ctaText}
          </button>
        </section>
      );
    case 'features':
      return (
        <section className="py-20 px-8 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {section.content.items.map((item: any, i: number) => (
            <div
              key={i}
              className="space-y-4 p-8 rounded-3xl border border-slate-100 hover:border-slate-200 transition-all"
            >
              <div
                style={{ color: theme.primaryColor }}
                className="text-sm font-black uppercase tracking-widest"
              >
                0{i + 1}
              </div>
              <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>
      );
    default:
      return null;
  }
}
