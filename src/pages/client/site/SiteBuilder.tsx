import { useState, useEffect } from 'react';
import { 
  Globe, 
  Layout as LayoutIcon, 
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
  Sparkles,
  Plus,
  GripVertical,
  Trash2,
  Copy,
  Settings2,
  Wand2,
  MousePointer2
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../lib/auth';

interface Section {
  id: string;
  type: 'hero' | 'features' | 'about' | 'gallery' | 'contact' | 'pricing' | 'footer';
  content: any;
}

const DEFAULT_SECTIONS: Section[] = [
  { 
    id: 'hero-1', 
    type: 'hero', 
    content: { 
      title: 'Soluções Inteligentes para seu Negócio', 
      subtitle: 'Transformamos sua visão em realidade com tecnologia de ponta.',
      cta: 'SAIBA MAIS',
      bg_color: 'bg-white'
    } 
  },
  { 
    id: 'features-1', 
    type: 'features', 
    content: { 
      title: 'Nossos Diferenciais',
      items: [
        { id: 1, title: 'Inovação', desc: 'Sempre à frente com novas tecnologias.' },
        { id: 2, title: 'Qualidade', desc: 'Excelência em cada detalhe entregue.' }
      ]
    } 
  }
];

export function SiteBuilder() {
  const { currentClientId } = useAuth();
  const [sections, setSections] = useState<Section[]>(DEFAULT_SECTIONS);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'sections' | 'design' | 'ai'>('sections');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSections(items);
  };

  const addSection = (type: Section['type']) => {
    const newSection: Section = {
      id: `${type}-${Date.now()}`,
      type,
      content: { title: 'Nova Seção', subtitle: 'Edite este conteúdo...' }
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const handleAIAutoGenerate = () => {
    setLoading(true);
    // Simulação de geração via IA similar ao Durable
    setTimeout(() => {
      alert('🤖 IA Adworks analisando dados do onboarding...');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-6 overflow-hidden">
      {/* 🏁 TOP BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 shrink-0">
        <div>
           <div className="flex items-center gap-3 mb-1">
             <span className="bg-adworks-blue text-white px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase shadow-lg">Site Builder Pro</span>
             <h1 className="text-3xl font-black text-[#2D3E50] tracking-tighter uppercase italic leading-none">Editor de Landing Page</h1>
           </div>
           <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest ml-1">Arquitetura baseada em blocos e IA.</p>
        </div>

        <div className="flex items-center gap-3">
           <button onClick={handleAIAutoGenerate} className="bg-white border border-adworks-blue/20 text-adworks-blue px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all shadow-sm flex items-center gap-3 active:scale-95">
              <Wand2 className="w-4 h-4" />
              Auto-Gerar com IA
           </button>
           <button className="bg-adworks-dark text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-adworks-blue transition-all shadow-lg flex items-center gap-3 active:scale-95">
              <Rocket className="w-4 h-4" />
              Publicar
           </button>
        </div>
      </div>

      <div className="flex-1 flex gap-8 overflow-hidden">
        {/* 🛠️ EDITOR SIDEBAR (Trello/Pipedrive Vibe) */}
        <div className="w-[380px] shrink-0 flex flex-col bg-white rounded-[2.5rem] shadow-adw-soft border border-gray-100 overflow-hidden">
           <div className="flex p-2 bg-adworks-gray/50 border-b border-gray-100">
              {['sections', 'design', 'ai'].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t as any)}
                  className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                    activeTab === t ? 'bg-white text-adworks-dark shadow-sm' : 'text-gray-400 hover:text-adworks-dark'
                  }`}
                >
                  {t === 'sections' ? 'Blocos' : t === 'design' ? 'Estilo' : 'IA'}
                </button>
              ))}
           </div>

           <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {activeTab === 'sections' && (
                <>
                  <div className="space-y-4">
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Estrutura da Página</p>
                     <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="sections-list">
                          {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                              {sections.map((section, index) => (
                                <Draggable key={section.id} draggableId={section.id} index={index}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className={`group bg-adworks-gray/50 p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${selectedSection === section.id ? 'border-adworks-blue bg-white shadow-md' : 'border-transparent hover:border-gray-200'}`}
                                      onClick={() => setSelectedSection(section.id)}
                                    >
                                      <div className="flex items-center gap-3">
                                         <div {...provided.dragHandleProps} className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing"><GripVertical className="w-4 h-4" /></div>
                                         <span className="text-[10px] font-black text-adworks-dark uppercase tracking-widest">{section.type}</span>
                                      </div>
                                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                         <button onClick={() => removeSection(section.id)} className="p-1.5 text-gray-300 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                     </DragDropContext>
                  </div>

                  <div className="pt-6 border-t border-gray-100 space-y-4">
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Adicionar Novo Bloco</p>
                     <div className="grid grid-cols-2 gap-3">
                        {['hero', 'features', 'about', 'gallery', 'contact', 'pricing'].map(type => (
                          <button 
                            key={type}
                            onClick={() => addSection(type as any)}
                            className="p-4 bg-white border border-gray-100 rounded-2xl hover:border-adworks-blue hover:shadow-md transition-all text-left group"
                          >
                             <div className="w-8 h-8 bg-adworks-gray rounded-lg flex items-center justify-center mb-2 group-hover:text-adworks-blue transition-colors">
                                <Plus className="w-4 h-4" />
                             </div>
                             <span className="text-[9px] font-black text-gray-400 group-hover:text-adworks-dark uppercase tracking-widest leading-none">{type}</span>
                          </button>
                        ))}
                     </div>
                  </div>
                </>
              )}
           </div>
        </div>

        {/* 📱 PREVIEW CANVAS (Wix/Durable Style) */}
        <div className="flex-1 flex flex-col bg-[#E2E8F0] rounded-[2.5rem] shadow-inner overflow-hidden border border-gray-200">
           {/* Canvas Header */}
           <div className="p-4 flex items-center justify-between border-b border-gray-200 bg-white/50 backdrop-blur-md">
              <div className="flex gap-2">
                 <button onClick={() => setPreviewMode('desktop')} className={`p-2 rounded-xl transition-all ${previewMode === 'desktop' ? 'bg-white text-adworks-blue shadow-md' : 'text-gray-400 hover:text-adworks-dark'}`}><Monitor className="w-5 h-5" /></button>
                 <button onClick={() => setPreviewMode('mobile')} className={`p-2 rounded-xl transition-all ${previewMode === 'mobile' ? 'bg-white text-adworks-blue shadow-md' : 'text-gray-400 hover:text-adworks-dark'}`}><Smartphone className="w-5 h-5" /></button>
              </div>
              <div className="bg-white/80 px-4 py-2 rounded-xl border border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                 <MousePointer2 className="w-3 h-3" />
                 Editor Visual Ativo
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-bold text-gray-400">100% RESPONSIVO</span>
              </div>
           </div>

           {/* Dynamic Scroll Area */}
           <div className="flex-1 overflow-y-auto p-10 flex flex-col items-center custom-scrollbar">
              <div className={`bg-white transition-all duration-700 shadow-2xl relative ${previewMode === 'desktop' ? 'w-full min-h-[1200px] rounded-xl' : 'w-[360px] min-h-[1200px] rounded-[3rem] border-[12px] border-adworks-dark overflow-hidden'}`}>
                 
                 {/* 🏗️ RENDERIZADOR DE BLOCOS */}
                 {sections.map((section) => (
                    <div 
                      key={section.id} 
                      className={`relative group border-2 border-transparent transition-all ${selectedSection === section.id ? 'border-adworks-blue border-dashed bg-blue-50/5' : 'hover:border-adworks-blue/20 hover:border-dashed'}`}
                    >
                       {/* Section Controls */}
                       <div className="absolute -left-12 top-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button className="w-8 h-8 bg-white rounded-lg shadow-lg flex items-center justify-center text-gray-400 hover:text-adworks-blue"><Settings2 className="w-4 h-4" /></button>
                       </div>

                       {/* Actual Content Rendering */}
                       <div className="p-16 lg:p-24 text-center">
                          {section.type === 'hero' && (
                            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                               <h1 className="text-5xl lg:text-7xl font-black text-[#2D3E50] tracking-tighter uppercase italic leading-[0.9]">{section.content.title}</h1>
                               <p className="text-base lg:text-xl text-gray-500 font-medium leading-relaxed italic">{section.content.subtitle}</p>
                               <div className="pt-6">
                                  <button className="bg-adworks-blue text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/30">
                                     {section.content.cta}
                                  </button>
                               </div>
                            </div>
                          )}
                          {section.type !== 'hero' && (
                            <div className="py-20 border-2 border-dashed border-gray-100 rounded-[2rem] opacity-30">
                               <p className="font-black uppercase tracking-widest text-sm italic">{section.type} BLOCK</p>
                            </div>
                          )}
                       </div>
                    </div>
                 ))}

              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
