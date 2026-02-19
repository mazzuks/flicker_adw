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

// 🧱 FASE 0 & 1 Baseline Architecture
export function SiteBuilder() {
  const { currentClientId } = useAuth();
  const [sections, setSections] = useState<any[]>([
    { id: 'h-1', type: 'hero', content: { title: 'Nova Empresa Adworks', subtitle: 'Site gerado automaticamente.', cta: 'CONHECER' } }
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

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col overflow-hidden bg-[#F1F5F9] -m-8 font-sans">
      
      {/* 🛠️ TOP BAR (Webflow-like Clean) */}
      <div className="h-12 bg-[#1E293B] border-b border-white/5 flex items-center justify-between px-4 shrink-0 z-[100]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white border-r border-white/10 pr-4 mr-2">
             <div className="w-6 h-6 bg-adworks-blue rounded flex items-center justify-center"><Globe className="w-3 h-3" /></div>
             <span className="text-[10px] font-black uppercase tracking-widest italic">adworks build</span>
          </div>
          
          <div className="flex items-center gap-3 text-white/40 border-r border-white/10 pr-4 mr-2">
             <button className="hover:text-white transition-colors"><Undo2 className="w-4 h-4" /></button>
             <button className="hover:text-white transition-colors"><Redo2 className="w-4 h-4" /></button>
          </div>

          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg">
             <button onClick={() => setPreviewMode('desktop')} className={`p-1.5 rounded transition-all ${previewMode === 'desktop' ? 'bg-adworks-blue text-white shadow-lg' : 'text-white/30 hover:text-white'}`}><Monitor className="w-3.5 h-3.5" /></button>
             <button onClick={() => setPreviewMode('tablet')} className={`p-1.5 rounded transition-all ${previewMode === 'tablet' ? 'bg-adworks-blue text-white shadow-lg' : 'text-white/30 hover:text-white'}`}><Layers className="w-3.5 h-3.5" /></button>
             <button onClick={() => setPreviewMode('mobile')} className={`p-1.5 rounded transition-all ${previewMode === 'mobile' ? 'bg-adworks-blue text-white shadow-lg' : 'text-white/30 hover:text-white'}`}><Smartphone className="w-3.5 h-3.5" /></button>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 text-white/30 text-[9px] font-bold mr-2 uppercase tracking-tighter">
              <History className="w-3 h-3" /> Autosafe: 2m ago
           </div>
           <button className="text-white/60 hover:text-white p-2 transition-all"><Eye className="w-4 h-4" /></button>
           <button className="bg-adworks-blue text-white px-5 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:brightness-110 active:scale-95 transition-all">Publish</button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        
        {/* 🧰 TOOLS RAIL (Left Sidebar Minimal) */}
        <div className="w-12 bg-[#2D3E50] flex flex-col items-center py-4 gap-4 border-r border-white/5 z-50">
           {[
             { id: 'blocks', icon: Plus },
             { id: 'navigator', icon: Layers },
             { id: 'theme', icon: Palette },
             { id: 'seo', icon: Search }
           ].map(tool => (
             <button 
              key={tool.id}
              onClick={() => setActiveSidePanel(activeSidePanel === tool.id ? null : tool.id as any)}
              className={`p-2.5 rounded-lg transition-all ${activeSidePanel === tool.id ? 'bg-adworks-blue text-white shadow-lg' : 'text-white/30 hover:text-white hover:bg-white/5'}`}
             >
                <tool.icon className="w-4.5 h-4.5" />
             </button>
           ))}
        </div>

        {/* 📑 FLOATING DRAWER PANEL (Contextual Overlay) */}
        {activeSidePanel && (
          <div className="absolute left-12 top-0 bottom-0 w-[280px] bg-[#1E293B] text-white border-r border-white/10 shadow-2xl z-40 animate-in slide-in-from-left duration-300">
             <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white/60 italic">{activeSidePanel}</h3>
                <button onClick={() => setActiveSidePanel(null)} className="text-white/20 hover:text-white"><ChevronLeft className="w-4 h-4" /></button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
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
                                    className={`p-3 rounded-lg flex items-center justify-between transition-all cursor-pointer ${selectedBlockId === section.id ? 'bg-adworks-blue text-white' : 'hover:bg-white/5 text-white/40'}`}
                                    onClick={() => setSelectedBlockId(section.id)}
                                  >
                                     <div className="flex items-center gap-3">
                                        <div {...provided.dragHandleProps} className="opacity-20"><GripVertical className="w-3.5 h-3.5" /></div>
                                        <span className="text-[9px] font-black uppercase tracking-wider">{section.type}</span>
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

        {/* 📱 THE CANVAS (The Star of the Show) */}
        <div className="flex-1 overflow-hidden flex flex-col bg-[#0F172A] relative">
           
           <div className="flex-1 overflow-y-auto p-12 flex justify-center custom-scrollbar">
              <div className={`bg-white transition-all duration-500 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative h-fit ${
                previewMode === 'desktop' ? 'w-full max-w-[1200px] min-h-[1400px]' : 
                previewMode === 'tablet' ? 'w-[768px] min-h-[1400px]' :
                'w-[375px] min-h-[812px]'
              }`}>
                 
                 {/* RENDER ENGINE */}
                 {sections.map((section) => (
                    <div 
                      key={section.id}
                      className={`relative group border-2 border-transparent transition-all ${selectedBlockId === section.id ? 'border-adworks-blue border-dashed ring-4 ring-adworks-blue/10' : 'hover:border-adworks-blue/20 hover:border-dashed'}`}
                      onClick={() => setSelectedBlockId(section.id)}
                    >
                       <div className="p-16 lg:p-24 text-center">
                          {section.type === 'hero' && (
                            <div className="max-w-2xl mx-auto space-y-6 pointer-events-none">
                               <h1 className="text-5xl lg:text-7xl font-black text-[#1E293B] tracking-tighter uppercase italic leading-[0.9]">{section.content.title}</h1>
                               <p className="text-base lg:text-xl text-slate-500 font-medium leading-relaxed italic">{section.content.subtitle}</p>
                               <button className="mt-8 bg-adworks-blue text-white px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-xl">{section.content.cta}</button>
                            </div>
                          )}
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* ⚙️ RIGHT INSPECTOR (The Webflow Core) */}
        <div className="w-[260px] bg-[#1E293B] border-l border-white/10 flex flex-col shadow-2xl z-[100] shrink-0 overflow-hidden">
           <div className="h-10 border-b border-white/5 flex items-center bg-white/5 px-2">
              <div className="flex-1 flex gap-1 p-1">
                 {['Style', 'Config'].map(tab => (
                   <button key={tab} className={`flex-1 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${tab === 'Style' ? 'bg-[#2D3E50] text-white shadow-sm' : 'text-white/30 hover:text-white'}`}>{tab}</button>
                 ))}
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {selectedBlockId ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-300">
                   <div className="space-y-4">
                      <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-2"><Box className="w-3 h-3" /> Layout</p>
                      <div className="grid grid-cols-2 gap-3">
                         <div className="space-y-2">
                            <label className="text-[8px] font-black text-white/20 uppercase tracking-widest ml-1">Display</label>
                            <select className="w-full bg-[#2D3E50] border-none rounded-lg p-2 text-[10px] font-bold text-white/80 outline-none">
                               <option>Block</option>
                               <option>Flex</option>
                            </select>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4 pt-6 border-t border-white/5">
                      <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-2"><Type className="w-3 h-3" /> Spacing</p>
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/5 shadow-inner">
                         <div className="grid grid-cols-3 gap-2">
                            <div className="col-start-2 flex flex-col items-center gap-1">
                               <span className="text-[7px] font-black text-white/10">TOP</span>
                               <input type="text" defaultValue="80" className="w-10 bg-[#2D3E50] border-none rounded p-1 text-center text-[9px] font-black text-adworks-blue" />
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20 p-10 space-y-4">
                   <MousePointer2 className="w-10 h-10 text-white" />
                   <p className="text-[10px] font-black text-white uppercase tracking-widest leading-relaxed">Select an element to edit properties.</p>
                </div>
              )}
           </div>

           {/* Advanced Tab (Collapsed) */}
           <div className="p-6 border-t border-white/5 bg-black/10">
              <button className="flex items-center justify-between w-full text-white/30 hover:text-white transition-colors">
                 <span className="text-[9px] font-black uppercase tracking-widest">Advanced Settings</span>
                 <ChevronRight className="w-3 h-3" />
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}
