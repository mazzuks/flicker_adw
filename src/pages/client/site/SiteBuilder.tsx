import { useState, useEffect } from 'react';
import { 
  Globe, 
  Layout as LayoutIcon, 
  Palette, 
  Type, 
  Image as ImageIcon, 
  Rocket, 
  Monitor, 
  Smartphone, 
  Plus, 
  GripVertical, 
  Trash2, 
  Settings2, 
  Wand2, 
  Layers,
  Save,
  MousePointer2,
  ChevronLeft,
  ChevronRight,
  History,
  Code
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../lib/auth';

// 🧱 BIBLIOTECA DE BLOCOS (The Core Library)
const BLOCK_LIBRARY = [
  { type: 'hero', label: 'Hero / Banner', icon: ImageIcon, defaultContent: { title: 'Seu Título Aqui', subtitle: 'Uma breve descrição impactante.', cta: 'Saiba Mais' } },
  { type: 'features', label: 'Diferenciais', icon: LayoutIcon, defaultContent: { items: [{title: 'Fácil', desc: 'Simples de usar'}, {title: 'Rápido', desc: 'Velocidade total'}] } },
  { type: 'about', label: 'Sobre Nós', icon: Type, defaultContent: { title: 'Nossa História', text: 'Conte como tudo começou...' } },
  { type: 'pricing', label: 'Preços', icon: Globe, defaultContent: { plans: [{name: 'Básico', price: 'R$ 99'}] } },
  { type: 'contact', label: 'Contato/Form', icon: MousePointer2, defaultContent: { title: 'Fale Conosco', email: true, phone: true } },
];

interface Section {
  id: string;
  type: string;
  content: any;
  isHidden?: boolean;
}

export function SiteBuilder() {
  const { currentClientId } = useAuth();
  const [sections, setSections] = useState<Section[]>([
    { id: 'h-1', type: 'hero', content: { title: 'Nova Empresa Adworks', subtitle: 'Site gerado automaticamente.', cta: 'CONHECER' } }
  ]);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');
  const [activeSidePanel, setActiveSidePanel] = useState<'blocks' | 'layers' | 'theme' | 'seo'>('blocks');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSections(items);
  };

  const addBlock = (type: string) => {
    const libItem = BLOCK_LIBRARY.find(b => b.type === type);
    const newBlock: Section = {
      id: `${type}-${Date.now()}`,
      type,
      content: libItem?.defaultContent || {}
    };
    setSections([...sections, newBlock]);
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col overflow-hidden bg-[#F1F5F9] -m-8">
      
      {/* 🛠️ TOP BUILDER BAR (Figma Style) */}
      <div className="h-14 bg-[#1E293B] border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-[100]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-white">
             <div className="w-8 h-8 bg-adworks-blue rounded-lg flex items-center justify-center"><Globe className="w-4 h-4" /></div>
             <span className="text-xs font-black uppercase tracking-widest italic">Templeteria v2.0</span>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl">
             <button onClick={() => setPreviewMode('desktop')} className={`p-2 rounded-lg transition-all ${previewMode === 'desktop' ? 'bg-adworks-blue text-white shadow-lg' : 'text-white/40 hover:text-white'}`}><Monitor className="w-4 h-4" /></button>
             <button onClick={() => setPreviewMode('tablet')} className={`p-2 rounded-lg transition-all ${previewMode === 'tablet' ? 'bg-adworks-blue text-white shadow-lg' : 'text-white/40 hover:text-white'}`}><Layers className="w-4 h-4" /></button>
             <button onClick={() => setPreviewMode('mobile')} className={`p-2 rounded-lg transition-all ${previewMode === 'mobile' ? 'bg-adworks-blue text-white shadow-lg' : 'text-white/40 hover:text-white'}`}><Smartphone className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold mr-4">
              <History className="w-3.5 h-3.5" /> Salvo há 2 min
           </div>
           <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Preview link</button>
           <button className="bg-adworks-blue text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:brightness-110 active:scale-95 transition-all">Publicar Site</button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* 🧰 LEFT TOOLBAR (Library & Layers) */}
        <div className="w-16 bg-[#2D3E50] flex flex-col items-center py-6 gap-6 border-r border-white/5">
           {[
             { id: 'blocks', icon: Plus },
             { id: 'layers', icon: Layers },
             { id: 'theme', icon: Palette },
             { id: 'seo', icon: Search }
           ].map(tool => (
             <button 
              key={tool.id}
              onClick={() => setActiveSidePanel(tool.id as any)}
              className={`p-3 rounded-xl transition-all ${activeSidePanel === tool.id ? 'bg-adworks-blue text-white shadow-lg' : 'text-white/30 hover:text-white hover:bg-white/5'}`}
             >
                <tool.icon className="w-5 h-5" />
             </button>
           ))}
        </div>

        {/* 📑 SIDE PANEL (Contextual) */}
        <div className="w-[320px] bg-white border-r border-gray-200 flex flex-col shadow-xl z-50">
           <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xs font-black text-adworks-dark uppercase tracking-widest italic">{activeSidePanel}</h3>
              <button className="text-gray-300 hover:text-adworks-dark"><ChevronLeft className="w-4 h-4" /></button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {activeSidePanel === 'blocks' && (
                <div className="grid grid-cols-2 gap-3">
                   {BLOCK_LIBRARY.map(block => (
                     <button 
                      key={block.type}
                      onClick={() => addBlock(block.type)}
                      className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border-2 border-transparent hover:border-adworks-blue hover:bg-white transition-all group"
                     >
                        <block.icon className="w-6 h-6 text-gray-400 group-hover:text-adworks-blue mb-2" />
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">{block.label}</span>
                     </button>
                   ))}
                </div>
              )}

              {activeSidePanel === 'layers' && (
                <DragDropContext onDragEnd={onDragEnd}>
                   <Droppable droppableId="layers-list">
                     {(provided) => (
                       <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                          {sections.map((section, index) => (
                            <Draggable key={section.id} draggableId={section.id} index={index}>
                              {(provided) => (
                                <div 
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`p-4 bg-gray-50 rounded-xl border-2 flex items-center justify-between transition-all ${selectedBlockId === section.id ? 'border-adworks-blue bg-white shadow-md' : 'border-transparent hover:bg-white'}`}
                                  onClick={() => setSelectedBlockId(section.id)}
                                >
                                   <div className="flex items-center gap-3">
                                      <div {...provided.dragHandleProps} className="text-gray-300"><GripVertical className="w-4 h-4" /></div>
                                      <span className="text-[10px] font-bold text-[#2D3E50] uppercase tracking-widest">{section.type}</span>
                                   </div>
                                   <button onClick={() => setSections(sections.filter(s => s.id !== section.id))} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                       </div>
                     )}
                   </Droppable>
                </DragDropContext>
              )}
           </div>
        </div>

        {/* 📱 THE CANVAS (Vibe Webflow) */}
        <div className="flex-1 overflow-y-auto bg-[#F1F5F9] flex justify-center p-12 custom-scrollbar relative">
           {/* Grid Helper Background */}
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

           <div className={`bg-white transition-all duration-700 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] relative h-fit ${
             previewMode === 'desktop' ? 'w-full max-w-[1200px] min-h-[1400px] rounded-sm' : 
             previewMode === 'tablet' ? 'w-[768px] min-h-[1400px] rounded-xl' :
             'w-[375px] min-h-[812px] rounded-[3rem] border-[12px] border-[#1E293B] overflow-hidden'
           }`}>
              
              {/* RENDERER ENGINE */}
              {sections.map((section) => (
                <div 
                  key={section.id}
                  className={`group relative border-2 border-transparent transition-all ${selectedBlockId === section.id ? 'border-adworks-blue border-dashed bg-blue-50/5' : 'hover:border-adworks-blue/20 hover:border-dashed'}`}
                >
                   {/* Contextual Floating Toolbar */}
                   {selectedBlockId === section.id && (
                     <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-adworks-dark text-white px-4 py-2 rounded-xl shadow-2xl flex items-center gap-4 z-[100] animate-in slide-in-from-bottom-2">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">{section.type} Settings</span>
                        <div className="h-4 w-px bg-white/20" />
                        <button className="hover:text-adworks-blue transition-colors"><Settings2 className="w-4 h-4" /></button>
                        <button className="hover:text-adworks-blue transition-colors"><Wand2 className="w-4 h-4" /></button>
                     </div>
                   )}

                   {/* Components Mapping */}
                   <div className="p-12 lg:p-24 text-center">
                      {section.type === 'hero' && (
                        <div className="max-w-2xl mx-auto space-y-6">
                           <h1 className="text-5xl lg:text-7xl font-black text-[#2D3E50] tracking-tighter uppercase italic leading-[0.9]">{section.content.title}</h1>
                           <p className="text-base lg:text-xl text-gray-500 font-medium leading-relaxed italic">{section.content.subtitle}</p>
                           <button className="mt-8 bg-adworks-blue text-white px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-xl">{section.content.cta}</button>
                        </div>
                      )}
                      {section.type !== 'hero' && (
                        <div className="py-20 border-2 border-dashed border-gray-100 rounded-[2.5rem] opacity-30">
                           <p className="font-black uppercase tracking-widest text-xs italic">{section.type} Component</p>
                        </div>
                      )}
                   </div>
                </div>
              ))}

           </div>
        </div>

        {/* ⚙️ RIGHT INSPECTOR (Figma Style) */}
        <div className="w-72 bg-white border-l border-gray-200 p-8 space-y-8 shadow-xl">
           <div className="space-y-6">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Propriedades do Bloco</p>
              
              {selectedBlockId ? (
                <div className="space-y-6">
                   <div>
                      <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Alinhamento</label>
                      <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button className="flex-1 py-2 bg-white rounded-lg shadow-sm font-black text-[9px]">LEFT</button>
                        <button className="flex-1 py-2 text-gray-400 font-black text-[9px]">CENTER</button>
                        <button className="flex-1 py-2 text-gray-400 font-black text-[9px]">RIGHT</button>
                      </div>
                   </div>
                   <div>
                      <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Background</label>
                      <div className="w-full h-10 bg-white border-2 border-gray-100 rounded-xl cursor-pointer flex items-center px-3 gap-2">
                         <div className="w-5 h-5 rounded-md bg-white border border-gray-200" />
                         <span className="text-[10px] font-bold text-[#2D3E50]">#FFFFFF</span>
                      </div>
                   </div>
                </div>
              ) : (
                <p className="text-[10px] font-medium text-gray-400 italic">Selecione um bloco no canvas para editar propriedades.</p>
              )}
           </div>

           <div className="pt-8 border-t border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Ações Rápidas</p>
              <button className="w-full bg-[#1E293B] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-adworks-blue transition-all">
                 <Code className="w-4 h-4" />
                 Custom CSS
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}
