import { useState, useEffect } from 'react';
import { 
  Globe, 
  Layout, 
  Palette, 
  Type, 
  Image as ImageIcon, 
  ExternalLink, 
  Eye, 
  Rocket, 
  CheckCircle2,
  AlertCircle,
  Save,
  Monitor,
  Smartphone,
  ChevronRight,
  Zap,
  Sparkles
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../lib/auth';

export function SiteBuilder() {
  const { currentClientId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'template' | 'content' | 'design'>('template');
  
  const [siteData, setSiteData] = useState({
    title: 'Minha Empresa Gourmet',
    description: 'Sabores autênticos e ingredientes selecionados para uma experiência inesquecível.',
    cta_text: 'FAZER PEDIDO',
    theme_color: '#0047FF',
    template: 'modern'
  });

  const templates = [
    { id: 'modern', name: 'Modern Business', desc: 'Visual limpo e focado em conversão.' },
    { id: 'minimal', name: 'Minimalist Dark', desc: 'Elegância e simplicidade máxima.' },
    { id: 'gourmet', name: 'Gourmet Style', desc: 'Focado em fotos grandes e apetitosas.' },
  ];

  const handlePublish = async () => {
    setLoading(true);
    // Simulação de publicação
    setTimeout(() => {
      setLoading(false);
      alert('🚀 Site publicado com sucesso em: empresa.adworks.app');
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <span className="bg-adworks-blue text-white px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase shadow-lg shadow-blue-500/20">Site Builder v1.0</span>
             <h1 className="text-4xl font-black text-adworks-dark tracking-tighter uppercase italic leading-none text-[#2D3E50]">Meu Site</h1>
           </div>
           <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Crie sua presença digital em segundos.</p>
        </div>

        <div className="flex items-center gap-3">
           <button className="bg-white border border-gray-100 text-adworks-dark px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm flex items-center gap-3">
              <Eye className="w-4 h-4 text-gray-400" />
              Visualizar
           </button>
           <button 
            onClick={handlePublish}
            disabled={loading}
            className="bg-adworks-dark text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-adworks-blue transition-all shadow-lg flex items-center gap-3 active:scale-95 disabled:opacity-50"
           >
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Rocket className="w-5 h-5" />}
              Publicar Agora
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* 🎨 EDITOR SIDEBAR */}
        <div className="xl:col-span-4 space-y-6">
           <div className="bg-white rounded-[2.5rem] p-8 shadow-adw-soft border border-gray-100">
              <div className="flex bg-adworks-gray p-1 rounded-2xl mb-8">
                 {['template', 'content', 'design'].map((t) => (
                   <button
                     key={t}
                     onClick={() => setActiveTab(t as any)}
                     className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                       activeTab === t ? 'bg-white text-adworks-dark shadow-sm' : 'text-gray-400 hover:text-adworks-dark'
                     }`}
                   >
                     {t === 'template' ? 'Temas' : t === 'content' ? 'Textos' : 'Cores'}
                   </button>
                 ))}
              </div>

              {activeTab === 'template' && (
                <div className="space-y-4 animate-in slide-in-from-left-2 duration-300">
                   {templates.map(t => (
                     <button 
                      key={t.id}
                      onClick={() => setSiteData({...siteData, template: t.id})}
                      className={`w-full p-6 rounded-[1.5rem] border-2 text-left transition-all group ${siteData.template === t.id ? 'border-adworks-blue bg-blue-50/30 shadow-md' : 'border-transparent bg-adworks-gray/50 hover:bg-white hover:border-gray-200'}`}
                     >
                        <div className="flex items-center justify-between mb-2">
                           <h4 className="font-black text-adworks-dark text-sm uppercase italic tracking-tight">{t.name}</h4>
                           {siteData.template === t.id && <CheckCircle2 className="w-4 h-4 text-adworks-blue" />}
                        </div>
                        <p className="text-[10px] font-medium text-gray-500 leading-relaxed uppercase tracking-wider">{t.desc}</p>
                     </button>
                   ))}
                </div>
              )}

              {activeTab === 'content' && (
                <div className="space-y-6 animate-in slide-in-from-left-2 duration-300">
                   <div>
                      <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Título do Site</label>
                      <input 
                        type="text" 
                        value={siteData.title}
                        onChange={e => setSiteData({...siteData, title: e.target.value})}
                        className="w-full px-5 py-3 bg-adworks-gray border-none rounded-xl focus:ring-1 focus:ring-adworks-blue font-bold text-adworks-dark text-sm outline-none" 
                      />
                   </div>
                   <div>
                      <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Descrição Principal</label>
                      <textarea 
                        value={siteData.description}
                        onChange={e => setSiteData({...siteData, description: e.target.value})}
                        className="w-full px-5 py-3 bg-adworks-gray border-none rounded-xl focus:ring-1 focus:ring-adworks-blue font-medium text-gray-600 text-sm outline-none min-h-[100px]" 
                      />
                   </div>
                   <div>
                      <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Texto do Botão (CTA)</label>
                      <input 
                        type="text" 
                        value={siteData.cta_text}
                        onChange={e => setSiteData({...siteData, cta_text: e.target.value})}
                        className="w-full px-5 py-3 bg-adworks-gray border-none rounded-xl focus:ring-1 focus:ring-adworks-blue font-bold text-adworks-dark text-sm outline-none" 
                      />
                   </div>
                </div>
              )}

              {activeTab === 'design' && (
                <div className="space-y-6 animate-in slide-in-from-left-2 duration-300">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cor da Marca</p>
                   <div className="grid grid-cols-5 gap-3">
                      {['#0047FF', '#EF4444', '#10B981', '#F59E0B', '#2D3E50'].map(c => (
                        <button 
                          key={c}
                          onClick={() => setSiteData({...siteData, theme_color: c})}
                          className={`w-full aspect-square rounded-xl border-2 transition-all ${siteData.theme_color === c ? 'border-adworks-dark scale-110 shadow-lg' : 'border-transparent shadow-inner'}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                   </div>
                </div>
              )}
           </div>

           <div className="bg-adworks-dark p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-adworks-blue/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-adworks-blue/30 transition-all"></div>
              <h3 className="text-xl font-black mb-4 flex items-center gap-2 italic uppercase tracking-tighter">
                <Sparkles className="w-5 h-5 text-adworks-blue" />
                Dica SEO
              </h3>
              <p className="text-gray-400 text-xs font-medium leading-relaxed opacity-80 italic">
                "Usar palavras-chave como 'Artesanal' e o nome da sua cidade aumenta em 40% o tráfego orgânico do Google."
              </p>
           </div>
        </div>

        {/* 📱 PREVIEW CANVAS */}
        <div className="xl:col-span-8 space-y-6">
           <div className="bg-[#E2E8F0] p-4 rounded-[2.5rem] shadow-inner flex flex-col items-center">
              {/* Preview Toggle */}
              <div className="flex gap-2 bg-white/50 backdrop-blur-md p-1 rounded-2xl mb-4 self-center shadow-sm">
                 <button onClick={() => setPreviewMode('desktop')} className={`p-2.5 rounded-xl transition-all ${previewMode === 'desktop' ? 'bg-white text-adworks-blue shadow-md' : 'text-gray-400'}`}><Monitor className="w-5 h-5" /></button>
                 <button onClick={() => setPreviewMode('mobile')} className={`p-2.5 rounded-xl transition-all ${previewMode === 'mobile' ? 'bg-white text-adworks-blue shadow-md' : 'text-gray-400'}`}><Smartphone className="w-5 h-5" /></button>
              </div>

              {/* Dynamic Site Canvas */}
              <div className={`bg-white shadow-[0_30px_60px_-12px_rgba(0,0,0,0.2)] transition-all duration-700 overflow-y-auto ${previewMode === 'desktop' ? 'w-full h-[600px] rounded-2xl' : 'w-[320px] h-[600px] rounded-[3rem] border-[8px] border-adworks-dark'}`}>
                 
                 {/* START SITE PREVIEW */}
                 <div className="font-sans">
                    {/* Header */}
                    <div className="p-6 flex justify-between items-center border-b border-gray-50">
                       <p className="font-black text-lg italic tracking-tighter uppercase" style={{ color: siteData.theme_color }}>adworks</p>
                       <div className="flex gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <span>Início</span>
                          <span>Produtos</span>
                          <span>Contato</span>
                       </div>
                    </div>

                    {/* Hero */}
                    <div className={`p-12 lg:p-20 text-center space-y-8 bg-gradient-to-b from-gray-50 to-white ${siteData.template === 'minimal' ? 'bg-slate-900 text-white' : ''}`}>
                       <h1 className="text-4xl lg:text-5xl font-black text-[#2D3E50] tracking-tighter uppercase leading-[0.9]">{siteData.title}</h1>
                       <p className="max-w-md mx-auto text-sm lg:text-base text-gray-500 font-medium leading-relaxed">{siteData.description}</p>
                       <div className="pt-4">
                          <button className="px-10 py-5 rounded-full font-black text-xs text-white uppercase tracking-[0.2em] shadow-2xl transition-all" style={{ backgroundColor: siteData.theme_color }}>
                             {siteData.cta_text}
                          </button>
                       </div>
                    </div>

                    {/* Image Mock */}
                    <div className="p-10">
                       <div className="aspect-video bg-adworks-gray rounded-[2rem] flex items-center justify-center border-2 border-dashed border-gray-200">
                          <ImageIcon className="w-10 h-10 text-gray-300" />
                          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest ml-3">Banner Principal</p>
                       </div>
                    </div>
                 </div>
                 {/* END SITE PREVIEW */}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
