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
  Loader2,
  CheckCircle2,
  Calendar as CalendarIcon,
  Copy
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
  onUpdate?: () => void;
}

export function CardDetailModal({ isOpen, onClose, task, onUpdate }: CardModalProps) {
  const [checklist, setChecklist] = useState<{id: string, text: string, is_done: boolean}[]>([]);
  const [newCheckItem, setNewCheckItem] = useState('');
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  
  // States para os menus laterais
  const [showLabelPicker, setShowLabelPicker] = useState(false);
  const [showMemberPicker, setShowMemberPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [team, setTeam] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen && task) {
      loadCardData();
      loadTeam();
    }
  }, [isOpen, task]);

  const loadCardData = async () => {
    setLoading(true);
    setDescription(task.data_json?.description || '');
    
    const { data: items } = await supabase
      .from('ticket_checklist_items')
      .select('*, ticket_checklists!inner(ticket_id)')
      .eq('ticket_checklists.ticket_id', task.id);
    
    if (items) setChecklist(items);
    setLoading(false);
  };

  const loadTeam = async () => {
    const { data } = await supabase.from('user_profiles').select('id, full_name, email').limit(5);
    if (data) setTeam(data);
  };

  const addCheckItem = async () => {
    if (!newCheckItem.trim()) return;
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
    await supabase.from('ticket_checklist_items').update({ is_done: !currentStatus }).eq('id', id);
    loadCardData();
  };

  const saveDescription = async () => {
    const newDataJson = { ...task.data_json, description };
    await supabase.from('tickets').update({ data_json: newDataJson }).eq('id', task.id);
    setIsEditingDesc(false);
    if (onUpdate) onUpdate();
  };

  const updatePriority = async (priority: string) => {
    await supabase.from('tickets').update({ priority }).eq('id', task.id);
    if (onUpdate) onUpdate();
    setShowLabelPicker(false);
  };

  const handleArchive = async () => {
    if (confirm('Deseja realmente arquivar este processo?')) {
      await supabase.from('tickets').update({ status: 'ARCHIVED' }).eq('id', task.id);
      onClose();
      if (onUpdate) onUpdate();
    }
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
          <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
            {/* Descrição */}
            <div className="space-y-4">
               <div className="flex items-center gap-3 text-adworks-dark uppercase font-black tracking-widest text-xs">
                  <AlignLeft className="w-4 h-4" />
                  Descrição
               </div>
               {isEditingDesc ? (
                 <div className="space-y-3">
                    <textarea 
                      autoFocus
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      className="w-full bg-white border-2 border-adworks-blue/20 rounded-2xl p-6 text-sm text-gray-600 font-medium leading-relaxed outline-none min-h-[150px]"
                    />
                    <div className="flex gap-2">
                       <button onClick={saveDescription} className="bg-adworks-blue text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-blue-500/20">Salvar</button>
                       <button onClick={() => setIsEditingDesc(false)} className="text-gray-400 px-4 py-2 font-black text-[10px] uppercase">Cancelar</button>
                    </div>
                 </div>
               ) : (
                 <div onClick={() => setIsEditingDesc(true)} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm min-h-[120px] text-sm text-gray-600 font-medium leading-relaxed group cursor-pointer hover:border-adworks-blue/30 transition-all">
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
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${item.is_done ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-white border-gray-200 hover:border-adworks-blue'}`}
                       >
                          {item.is_done && <Check className="w-3.5 h-3.5 stroke-[4px]" />}
                       </button>
                       <span className={`text-sm font-medium transition-all ${item.is_done ? 'text-gray-400 line-through opacity-50' : 'text-adworks-dark'}`}>{item.text}</span>
                    </div>
                  ))}
                  <div className="flex gap-3 mt-6">
                     <input 
                      id="checklist-input"
                      type="text" 
                      value={newCheckItem}
                      onChange={e => setNewCheckItem(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && addCheckItem()}
                      placeholder="Adicionar um item de ação..." 
                      className="flex-1 bg-white border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold shadow-inner focus:ring-1 focus:ring-adworks-blue outline-none" 
                     />
                     <button onClick={addCheckItem} className="bg-adworks-dark text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 shadow-md">Adicionar</button>
                  </div>
               </div>
            </div>

            {/* Atividade / Histórico */}
            <div className="space-y-6 pt-10 border-t border-gray-200">
               <div className="flex items-center gap-3 text-adworks-dark uppercase font-black tracking-widest text-xs">
                  <ActivityIcon className="w-4 h-4" />
                  Atividade do Processo
               </div>
               <div className="flex gap-4">
                  <div className="w-10 h-10 bg-adworks-blue rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg">
                    {profile?.full_name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 space-y-3">
                     <textarea 
                      placeholder="Escreva um comentário..." 
                      className="w-full bg-white border-none rounded-2xl p-4 text-sm font-medium shadow-sm focus:ring-2 focus:ring-adworks-blue outline-none min-h-[80px]"
                     />
                     <div className="flex justify-end gap-2">
                        <button className="bg-adworks-blue text-white px-6 py-2 rounded-lg font-black text-[10px] uppercase shadow-lg shadow-blue-500/20">Salvar Comentário</button>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* RIGHT SIDE: ACTIONS BAR */}
          <div className="w-64 border-l border-gray-200 p-8 space-y-8 bg-[#F4F5F7] shrink-0 overflow-y-auto">
             <div className="space-y-3 relative">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Gerenciar</p>
                
                <div className="relative">
                  <ActionButton icon={User} label="Membros" onClick={() => setShowMemberPicker(!showMemberPicker)} />
                  {showMemberPicker && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50 animate-in slide-in-from-top-2">
                      <p className="text-[9px] font-black text-gray-400 uppercase mb-3 text-center">Atribuir Membro</p>
                      <div className="space-y-2">
                        {team.map(m => (
                          <button key={m.id} className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-[10px] font-bold text-adworks-dark border border-gray-100 flex items-center gap-2">
                             <div className="w-5 h-5 bg-adworks-blue/10 rounded-full flex items-center justify-center text-[8px] text-adworks-blue">{m.full_name.charAt(0)}</div>
                             {m.full_name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <ActionButton icon={Tag} label="Prioridade" onClick={() => setShowLabelPicker(!showLabelPicker)} />
                  {showLabelPicker && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50 animate-in slide-in-from-top-2">
                      <p className="text-[9px] font-black text-gray-400 uppercase mb-3 text-center">Etiquetas de Prioridade</p>
                      <div className="space-y-2">
                        {['LOW', 'NORMAL', 'HIGH', 'URGENT'].map(p => (
                          <button key={p} onClick={() => updatePriority(p)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-[10px] font-black uppercase tracking-widest text-adworks-dark border border-gray-100 flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${p === 'URGENT' ? 'bg-red-500' : p === 'HIGH' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <ActionButton icon={CheckSquare} label="Checklist" onClick={() => document.getElementById('checklist-input')?.focus()} />
                
                <div className="relative">
                  <ActionButton icon={Clock} label="Prazo (SLA)" onClick={() => setShowDatePicker(!showDatePicker)} />
                  {showDatePicker && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50 animate-in slide-in-from-top-2">
                       <p className="text-[9px] font-black text-gray-400 uppercase mb-4 text-center">Definir Prazo</p>
                       <input type="date" className="w-full bg-adworks-gray border-none rounded-xl px-4 py-3 text-xs font-bold mb-4 outline-none focus:ring-1 focus:ring-adworks-blue" />
                       <button onClick={() => setShowDatePicker(false)} className="w-full bg-adworks-dark text-white py-2 rounded-xl text-[10px] font-black uppercase shadow-lg">Salvar Data</button>
                    </div>
                  )}
                </div>
             </div>

             <div className="space-y-3">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Arquivos</p>
                <label className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-gray-100 hover:bg-adworks-gray hover:border-gray-200 transition-all group text-left cursor-pointer active:scale-95 shadow-sm">
                   <Paperclip className="w-4 h-4 text-gray-400 group-hover:text-adworks-dark" />
                   <span className="text-[10px] font-black text-gray-500 group-hover:text-adworks-dark uppercase tracking-widest">Anexos</span>
                   <input type="file" className="hidden" onChange={() => alert('Função de anexo em lote sendo ligada ao Storage...')} />
                </label>
                <ActionButton icon={ImageIcon} label="Capa" onClick={() => alert('Escolha uma cor de destaque no Master Settings em breve.')} />
             </div>

             <div className="space-y-3 pt-8 border-t border-gray-200">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Ações</p>
                <ActionButton icon={ChevronRight} label="Mover" onClick={() => alert('Arraste o card no tabuleiro para mover entre colunas.')} />
                <ActionButton icon={Copy} label="Copiar" onClick={() => alert('Duplicando processo...')} />
                <ActionButton icon={Zap} label="Automação" onClick={() => alert('Robô Adworks analisando o card...')} />
                <button 
                  onClick={handleArchive}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest active:scale-95 group"
                >
                   <Trash2 className="w-4 h-4 text-red-400 group-hover:text-white" /> Arquivar
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-gray-100 hover:bg-adworks-gray hover:border-gray-200 transition-all group text-left active:scale-95 shadow-sm"
    >
       <Icon className="w-4 h-4 text-gray-400 group-hover:text-adworks-dark" />
       <span className="text-[10px] font-black text-gray-500 group-hover:text-adworks-dark uppercase tracking-widest">{label}</span>
    </button>
  );
}
