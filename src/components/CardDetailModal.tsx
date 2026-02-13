import { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Tag, 
  CheckSquare, 
  Clock, 
  Paperclip, 
  Image as ImageIcon, 
  MessageSquare, 
  Activity as ActivityIcon,
  Plus,
  Trash2,
  ChevronRight,
  MoreVertical,
  History,
  FileText,
  AlignLeft,
  Check,
  Zap,
  Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
  onUpdate?: () => void;
}

export function CardDetailModal({ isOpen, onClose, task, onUpdate }: CardModalProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'activity'>('content');
  const [newComment, setNewComment] = useState('');
  const [checklist, setChecklist] = useState<{id: string, text: string, is_done: boolean}[]>([]);
  const [newCheckItem, setNewCheckItem] = useState('');
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [isEditingDesc, setIsEditingDesc] = useState(false);

  useEffect(() => {
    if (isOpen && task) {
      loadCardData();
    }
  }, [isOpen, task]);

  const loadCardData = async () => {
    setLoading(true);
    // Carregar Descrição
    setDescription(task.data_json?.description || '');
    
    // Carregar Checklist
    const { data: items } = await supabase
      .from('ticket_checklist_items')
      .select('*, ticket_checklists!inner(ticket_id)')
      .eq('ticket_checklists.ticket_id', task.id);
    
    if (items) setChecklist(items);
    setLoading(false);
  };

  const addCheckItem = async () => {
    if (!newCheckItem.trim()) return;
    
    // 1. Garantir que existe um checklist pai
    let { data: parent } = await supabase.from('ticket_checklists').select('id').eq('ticket_id', task.id).maybeSingle();
    
    if (!parent) {
      const { data: newParent } = await supabase.from('ticket_checklists').insert({ ticket_id: task.id }).select().single();
      parent = newParent;
    }

    if (parent) {
      const { error } = await supabase.from('ticket_checklist_items').insert({
        checklist_id: parent.id,
        text: newCheckItem,
        is_done: false
      });
      if (!error) {
        setNewCheckItem('');
        loadCardData();
      }
    }
  };

  const toggleCheckItem = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('ticket_checklist_items')
      .update({ is_done: !currentStatus })
      .eq('id', id);
    if (!error) loadCardData();
  };

  const saveDescription = async () => {
    const newDataJson = { ...task.data_json, description };
    await supabase.from('tickets').update({ data_json: newDataJson }).eq('id', task.id);
    setIsEditingDesc(false);
    if (onUpdate) onUpdate();
  };

  const progress = checklist.length > 0 
    ? Math.round((checklist.filter(i => i.is_done).length / checklist.length) * 100) 
    : 0;

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-adworks-dark/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4 lg:p-10 animate-in fade-in duration-300">
      <div className="bg-[#F4F5F7] rounded-[2.5rem] w-full max-w-5xl h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-white/20">
        
        {/* HEADER AREA */}
        <div className="p-8 lg:p-10 bg-white border-b border-gray-200 flex items-start justify-between relative overflow-hidden text-[#2D3E50]">
           <div className="absolute top-0 left-0 right-0 h-2 bg-adworks-blue"></div>
           
           <div className="flex gap-6 items-start">
              <div className="w-14 h-14 bg-adworks-gray rounded-2xl flex items-center justify-center text-adworks-blue shadow-inner border border-gray-100">
                 <FileText className="w-7 h-7" />
              </div>
              <div>
                 <h2 className="text-3xl font-black text-adworks-dark uppercase italic tracking-tighter leading-none mb-2">{task.title}</h2>
                 <div className="flex items-center gap-3">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No grupo <span className="text-adworks-dark underline">{task.status}</span></p>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <p className="text-xs font-black text-adworks-blue uppercase tracking-tighter">{task.client_name}</p>
                 </div>
              </div>
           </div>
           
           <button onClick={onClose} className="w-12 h-12 rounded-xl bg-adworks-gray text-gray-400 hover:text-red-500 transition-all flex items-center justify-center shadow-sm">
              <X className="w-5 h-5" />
           </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* LEFT SIDE: CONTENT */}
          <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
            
            {/* Description */}
            <div className="space-y-4">
               <div className="flex items-center gap-3 text-adworks-dark uppercase font-black tracking-widest text-xs">
                  <AlignLeft className="w-4 h-4" />
                  Descrição
               </div>
               {isEditingDesc ? (
                 <div className="space-y-3">
                    <textarea 
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      className="w-full bg-white border-2 border-adworks-blue/20 rounded-2xl p-6 text-sm text-gray-600 font-medium leading-relaxed outline-none min-h-[150px]"
                    />
                    <div className="flex gap-2">
                       <button onClick={saveDescription} className="bg-adworks-blue text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase">Salvar</button>
                       <button onClick={() => setIsEditingDesc(false)} className="text-gray-400 px-4 py-2 font-black text-[10px] uppercase">Cancelar</button>
                    </div>
                 </div>
               ) : (
                 <div 
                  onClick={() => setIsEditingDesc(true)}
                  className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm min-h-[120px] text-sm text-gray-600 font-medium leading-relaxed group cursor-pointer hover:border-adworks-blue/30 transition-all"
                 >
                    {description || 'Clique para adicionar uma descrição detalhada...'}
                 </div>
               )}
            </div>

            {/* Checklist */}
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-adworks-dark uppercase font-black tracking-widest text-xs">
                     <CheckSquare className="w-4 h-4" />
                     Checklist Operacional
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${progress === 100 ? 'bg-green-500 text-white' : 'bg-adworks-gray text-gray-400'}`}>
                    {progress}%
                  </span>
               </div>
               <div className="bg-adworks-gray/50 rounded-full h-2 overflow-hidden border border-white/50 shadow-inner">
                  <div className={`h-full transition-all duration-700 ${progress === 100 ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-adworks-blue'}`} style={{ width: `${progress}%` }}></div>
               </div>
               
               <div className="space-y-2 mt-4">
                  {checklist.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 group">
                       <button 
                        onClick={() => toggleCheckItem(item.id, item.is_done)}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${item.is_done ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-200'}`}
                       >
                          {item.is_done && <Check className="w-3.5 h-3.5 stroke-[4px]" />}
                       </button>
                       <span className={`text-sm font-medium transition-all ${item.is_done ? 'text-gray-400 line-through' : 'text-adworks-dark'}`}>{item.text}</span>
                    </div>
                  ))}
                  <div className="flex gap-3 mt-4">
                     <input 
                      type="text" 
                      value={newCheckItem}
                      onChange={e => setNewCheckItem(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && addCheckItem()}
                      placeholder="Adicionar um item..." 
                      className="flex-1 bg-white border-none rounded-xl px-4 py-3 text-xs font-bold shadow-inner focus:ring-1 focus:ring-adworks-blue outline-none" 
                     />
                     <button onClick={addCheckItem} className="bg-adworks-dark text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95">Adicionar</button>
                  </div>
               </div>
            </div>

            {/* Activity / Comments */}
            <div className="space-y-6 pt-10 border-t border-gray-200">
               <div className="flex items-center gap-3 text-adworks-dark uppercase font-black tracking-widest text-xs">
                  <ActivityIcon className="w-4 h-4" />
                  Atividade do Processo
               </div>
               <div className="flex gap-4">
                  <div className="w-10 h-10 bg-adworks-blue rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg">MG</div>
                  <div className="flex-1 space-y-3">
                     <textarea 
                      placeholder="Escreva um comentário ou nota interna..." 
                      className="w-full bg-white border-none rounded-2xl p-4 text-sm font-medium shadow-sm focus:ring-2 focus:ring-adworks-blue outline-none min-h-[80px]"
                     />
                     <div className="flex justify-end gap-2">
                        <button className="bg-adworks-gray text-gray-400 px-4 py-2 rounded-lg font-black text-[10px] uppercase">Nota Interna</button>
                        <button className="bg-adworks-blue text-white px-6 py-2 rounded-lg font-black text-[10px] uppercase shadow-lg shadow-blue-500/20">Salvar</button>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* RIGHT SIDE: ACTIONS BAR */}
          <div className="w-64 border-l border-gray-200 p-8 space-y-8 bg-[#F4F5F7]">
             <div className="space-y-3">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Gerenciar</p>
                <ActionButton icon={User} label="Membros" />
                <ActionButton icon={Tag} label="Etiquetas" />
                <ActionButton icon={CheckSquare} label="Checklist" />
                <ActionButton icon={Clock} label="Prazo (SLA)" />
             </div>

             <div className="space-y-3">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Arquivos</p>
                <ActionButton icon={Paperclip} label="Anexos" />
                <ActionButton icon={ImageIcon} label="Capa" />
             </div>

             <div className="space-y-3 pt-8 border-t border-gray-200">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Ações</p>
                <ActionButton icon={ChevronRight} label="Mover" />
                <ActionButton icon={History} label="Copiar" />
                <ActionButton icon={Zap} label="Automação" />
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest">
                   <Trash2 className="w-4 h-4" /> Arquivar
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-gray-100 hover:bg-adworks-gray hover:border-gray-200 transition-all group text-left">
       <Icon className="w-4 h-4 text-gray-400 group-hover:text-adworks-dark" />
       <span className="text-[10px] font-black text-gray-500 group-hover:text-adworks-dark uppercase tracking-widest">{label}</span>
    </button>
  );
}
