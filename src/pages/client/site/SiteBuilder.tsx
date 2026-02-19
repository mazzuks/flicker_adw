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
  Code,
  Search,
  AlignLeft,
  Check,
  CheckCircle2,
  Undo2,
  Redo2,
  Eye,
  Box,
  Maximize2
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../lib/auth';

// 🧱 BIBLIOTECA DE BLOCOS
const BLOCK_LIBRARY = [
  { type: 'hero', label: 'Hero / Banner', icon: ImageIcon, defaultContent: { title: 'Seu Título Aqui', subtitle: 'Uma breve descrição impactante.', cta: 'Saiba Mais' } },
  { type: 'features', label: 'Diferenciais', icon: LayoutIcon, defaultContent: { items: [{title: 'Fácil', desc: 'Simples de usar'}, {title: 'Rápido', desc: 'Velocidade total'}] } },
  { type: 'about', label: 'Sobre Nós', icon: Type, defaultContent: { title: 'Nossa História', text: 'Conte como tudo começou...' } },
  { type: 'pricing', label: 'Preços', icon: Globe, defaultContent: { plans: [{name: 'Básico', price: 'R$ 99'}] } },
  { type: 'contact', label: 'Contato/Form', icon: MousePointer2, defaultContent: { title: 'Fale Conosco', email: true, phone: true } },
];

export function SiteBuilder() {
  const { currentClientId } = useAuth();
  const [sections, setSections] = useState<any[]>([
    { id: 'h-1', type: 'hero', content: { title: 'NOVA EMPRESA ADWORKS', subtitle: 'Site gerado automaticamente.', cta: 'CONHECER' } }
  ]);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');
  const [activeSidePanel, setActiveSidePanel] = useState<'blocks' | 'navigator' | 'theme' | 'seo' | null>(null);
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
    const newBlock = {
      id: `${type}-${Date.now()}`,
      type,
      content: libItem?.defaultContent || {}
    };
    setSections([...sections, newBlock]);
    setActiveSidePanel(null);
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-[#0F172A] font-sans selection:bg-adworks-blue selection:text-white">
      
      {/* 🛠️ TOP BAR (Figma Style) */}
      <div className="h-14 bg-[#1E293B] border-b border-white/5 flex items-center justify-between px-4 shrink-0 z-[100]">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-all pr-4 border-r border-white/10 group"
            title="Voltar ao Painel"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Painel</span>
          </button>

          <div className="flex items-center gap-2 text-white border-r border-white/10 pr-4 mr-2">
             <div className="w-8 h-8 bg-adworks-blue rounded-lg flex items-center justify-center shadow-lg"><Globe className="w-4 h-4" /></div>
             <span className="text-[11px] font-black uppercase tracking-widest italic">adworks build</span>
          </div>
          
          <div className="flex items-center gap-3 text-white/40 border-r border-white/10 pr-4 mr-2">
             <button className="hover:text-white transition-colors"><Undo2 className="w-4 h-4" /></button>
             <button className="hover:text-white transition-colors"><Redo2 className="w-4 h-4" /></button>
          </div>

          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl">
             <button onClick={() => setPreviewMode('desktop')} className={`p-2 rounded-lg transition-all ${previewMode === 'desktop' ? 'bg-adworks-blue text-white shadow-lg' : 'text-white/30 hover:text-white'}`}><Monitor className="w-4 h-4" /></button>
             <button onClick={() => setPreviewMode('tablet')} className={`p-2 rounded-lg transition-all ${previewMode === 'tablet' ? 'bg-adworks-blue text-white shadow-lg' : 'text-white/30 hover:text-white'}`}><Layers className="w-4 h-4" /></button>
             <button onClick={() => setPreviewMode('mobile')} className={`p-2 rounded-lg transition-all ${previewMode === 'mobile' ? 'bg-adworks-blue text-white shadow-lg' : 'text-white/30 hover:text-white'}`}><Smartphone className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 text-white/30 text-[9px] font-bold mr-2 uppercase tracking-widest">
              <History className="w-3.5 h-3.5" /> Autosafe: 2m ago
           </div>
           <button className="text-white/60 hover:text-white p-2 transition-all"><Eye className="w-5 h-5" /></button>
           <button className="bg-adworks-blue text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:brightness-110 active:scale-95 transition-all">Publish Site</button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        
        {/* 🧰 TOOLS RAIL (Left Sidebar) */}
        <div className="w-16 bg-[#2D3E50] flex flex-col items-center py-6 gap-6 border-r border-white/5 z-50 shadow-2xl">
           {[
             { id: 'blocks', icon: Plus },
             { id: 'navigator', icon: Layers },
             { id: 'theme', icon: Palette },
             { id: 'seo', icon: Search }
           ].map(tool => (
             <button 
              key={tool.id}
              onClick={() => setActiveSidePanel(activeSidePanel === tool.id ? null : tool.id as any)}
              className={`p-3 rounded-xl transition-all ${activeSidePanel === tool.id ? 'bg-adworks-blue text-white shadow-lg' : 'text-white/30 hover:text-white hover:bg-white/5'}`}
             >
                <tool.icon className="w-5 h-5" />
             </button>
           ))}
        </div>

        {/* 📑 FLOATING DRAWER PANEL */}
        {activeSidePanel && (
          <div className="absolute left-16 top-0 bottom-0 w-[300px] bg-[#1E293B] text-white border-r border-white/10 shadow-2xl z-40 animate-in slide-in-from-left duration-300">
             <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white/60 italic">{activeSidePanel}</h3>
                <button onClick={() => setActiveSidePanel(null)} className="text-white/20 hover:text-white"><ChevronLeft className="w-5 h-5" /></button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {activeSidePanel === 'blocks' && (
                  <div className="grid grid-cols-1 gap-3">
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Basic Elements</p>
                    {BLOCK_LIBRARY.map(block => (
                      <button 
                        key={block.type}
                        onClick={() => addBlock(block.type)}
                        className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-transparent hover:border-adworks-blue/50 hover:bg-white/10 transition-all group"
                      >
                         <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40 group-hover:text-adworks-blue transition-colors">
                            <block.icon className="w-5 h-5" />
                         </div>
                         <span className="text-[11px] font-black text-white/80 uppercase tracking-widest">{block.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {activeSidePanel === 'navigator' && (
                  <DragDropContext onDragEnd={onDragEnd}>
                     <Droppable droppableId="navigator-tree">
                       {(provided) => (
                         <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-1">
                            {sections.map((section, index) => (
                              <Draggable key={section.id} draggableId={section.id} index={index}>
                                {(provided) => (
                                  <div 
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`p-4 rounded-xl flex items-center justify-between transition-all cursor-pointer ${selectedBlockId === section.id ? 'bg-adworks-blue text-white shadow-lg' : 'hover:bg-white/5 text-white/40'}`}
                                    onClick={() => setSelectedBlockId(section.id)}
                                  >
                                     <div className="flex items-center gap-3">
                                        <div {...provided.dragHandleProps} className="opacity-20"><GripVertical className="w-4 h-4" /></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest italic">{section.type}</span>
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
                )}
             </div>
          </div>
        )}

        {/* 📱 THE CANVAS (Fullscreen Isolation) */}
        <div className="flex-1 overflow-hidden flex flex-col bg-[#0F172A] relative">
           <div className="flex-1 overflow-y-auto p-12 lg:p-20 flex justify-center custom-scrollbar">
              {/* Central site preview unit */}
              <div className={`bg-white transition-all duration-700 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative h-fit ${
                previewMode === 'desktop' ? 'w-full max-w-[1200px] min-h-[1400px] rounded-sm' : 
                previewMode === 'tablet' ? 'w-[768px] min-h-[1400px] rounded-xl' :
                'w-[375px] min-h-[812px] rounded-[3rem] border-[12px] border-[#1E293B] overflow-hidden'
              }`}>
                 
                 {/* RENDER ENGINE */}
                 {sections.map((section) => (
                    <div 
                      key={section.id}
                      className={`relative group border-2 border-transparent transition-all ${selectedBlockId === section.id ? 'border-adworks-blue border-dashed ring-4 ring-adworks-blue/5' : 'hover:border-adworks-blue/20 hover:border-dashed'}`}
                      onClick={() => setSelectedBlockId(section.id)}
                    >
                       <div className="p-16 lg:p-32 text-center">
                          {section.type === 'hero' && (
                            <div className="max-w-2xl mx-auto space-y-8 pointer-events-none">
                               <h1 className="text-5xl lg:text-8xl font-black text-[#1E293B] tracking-tighter uppercase italic leading-[0.85]">{section.content.title}</h1>
                               <p className="text-base lg:text-xl text-slate-400 font-medium leading-relaxed italic tracking-tight">{section.content.subtitle}</p>
                               <div className="pt-4">
                                  <button className="bg-adworks-blue text-white px-12 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl">
                                     {section.content.cta}
                                  </button>
                               </div>
                            </div>
                          )}
                          {section.type !== 'hero' && (
                            <div className="py-20 border-2 border-dashed border-slate-100 rounded-[2.5rem] opacity-30">
                               <p className="font-black uppercase tracking-widest text-xs italic">{section.type} section</p>
                            </div>
                          )}
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* ⚙️ RIGHT INSPECTOR (Clean Board) */}
        <div className="w-[280px] bg-[#1E293B] border-l border-white/10 flex flex-col shadow-2xl z-50 shrink-0">
           <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">Properties</h3>
              <Settings2 className="w-4 h-4 text-white/20" />
           </div>

           <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              {selectedBlockId ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                   <div className="space-y-5">
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-2"><Box className="w-3.5 h-3.5" /> Layout</p>
                      <div className="space-y-3">
                         <label className="text-[8px] font-black text-white/20 uppercase tracking-widest ml-1">Display Mode</label>
                         <div className="grid grid-cols-2 gap-2 bg-black/20 p-1 rounded-xl">
                            <button className="bg-[#2D3E50] text-white py-2 rounded-lg text-[9px] font-black uppercase shadow-sm">Block</button>
                            <button className="text-white/30 py-2 rounded-lg text-[9px] font-black uppercase">Flex</button>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-5 pt-8 border-t border-white/5">
                      <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-2"><Maximize2 className="w-3.5 h-3.5" /> Spacing (px)</p>
                      <div className="bg-black/20 rounded-[2rem] p-6 border border-white/5 shadow-inner">
                         <div className="flex flex-col items-center gap-4">
                            <div className="flex flex-col items-center gap-1">
                               <span className="text-[7px] font-black text-white/10 uppercase">Top</span>
                               <input type="text" defaultValue="120" className="w-12 bg-[#2D3E50] border-none rounded-lg p-2 text-center text-[10px] font-black text-adworks-blue outline-none focus:ring-1 focus:ring-adworks-blue" />
                            </div>
                            <div className="flex items-center gap-4">
                               <div className="flex flex-col items-center gap-1">
                                  <span className="text-[7px] font-black text-white/10 uppercase">Left</span>
                                  <input type="text" defaultValue="0" className="w-10 bg-[#2D3E50] border-none rounded-lg p-2 text-center text-[10px] font-black text-white/40 outline-none" />
                               </div>
                               <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                  <div className="w-4 h-4 border border-adworks-blue/30 rounded-sm" />
                               </div>
                               <div className="flex flex-col items-center gap-1">
                                  <span className="text-[7px] font-black text-white/10 uppercase">Right</span>
                                  <input type="text" defaultValue="0" className="w-10 bg-[#2D3E50] border-none rounded-lg p-2 text-center text-[10px] font-black text-white/40 outline-none" />
                               </div>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                               <span className="text-[7px] font-black text-white/10 uppercase">Bottom</span>
                               <input type="text" defaultValue="120" className="w-12 bg-[#2D3E50] border-none rounded-lg p-2 text-center text-[10px] font-black text-adworks-blue outline-none" />
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-10 p-10 space-y-4">
                   <MousePointer2 className="w-12 h-12 text-white" />
                   <p className="text-[10px] font-black text-white uppercase tracking-widest leading-relaxed">Select an element on canvas</p>
                </div>
              )}
           </div>

           <div className="p-8 border-t border-white/5 bg-black/20">
              <button className="w-full bg-[#3D5266] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-adworks-blue transition-all shadow-lg">
                 <Code className="w-4 h-4" />
                 View Page Code
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}
