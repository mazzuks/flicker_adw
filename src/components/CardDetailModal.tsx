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
  Zap
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
}

export function CardDetailModal({ isOpen, onClose, task }: CardModalProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'activity'>('content');
  const [newComment, setNewComment] = useState('');
  const [checklist, setChecklist] = useState<{id: string, text: string, done: boolean}[]>([]);
  const [newCheckItem, setNewCheckItem] = useState('');

  if (!isOpen || !task) return null;

  const addCheckItem = () => {
    if (!newCheckItem.trim()) return;
    setChecklist([...checklist, { id: Math.random().toString(), text: newCheckItem, done: false }]);
    setNewCheckItem('');
  };

  const toggleCheckItem = (id: string) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const progress = checklist.length > 0 
    ? Math.round((checklist.filter(i => i.done).length / checklist.length) * 100) 
    : 0;

  return (
    <div className="fixed inset-0 bg-adworks-dark/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4 lg:p-10 animate-in fade-in duration-300">
      <div className="bg-[#F4F5F7] rounded-[2.5rem] w-full max-w-5xl h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-white/20">
        
        {/* HEADER AREA */}
        <div className="p-8 lg:p-10 bg-white border-b border-gray-200 flex items-start justify-between relative overflow-hidden">
           {/* Visual Cover Accent */}
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
               <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm min-h-[120px] text-sm text-gray-600 font-medium leading-relaxed group cursor-pointer hover:border-adworks-blue/30 transition-all">
                  Clique para adicionar uma descrição detalhada em Markdown...
               </div>
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
                        onClick={() => toggleCheckItem(item.id)}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${item.done ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-200'}`}
                       >
                          {item.done && <Check className="w-3.5 h-3.5 stroke-[4px]" />}
                       </button>
                       <span className={`text-sm font-medium transition-all ${item.done ? 'text-gray-400 line-through' : 'text-adworks-dark'}`}>{item.text}</span>
                    </div>
                  ))}
                  <div className="flex gap-3 mt-4">
                     <input 
                      type="text" 
                      value={newCheckItem}
                      onChange={e => setNewCheckItem(e.target.value)}
                      placeholder="Adicionar um item..." 
                      className="flex-1 bg-white border-none rounded-xl px-4 py-2 text-xs font-bold shadow-inner focus:ring-1 focus:ring-adworks-blue outline-none" 
                     />
                     <button onClick={addCheckItem} className="bg-adworks-dark text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Add</button>
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
                <ActionButton icon={Copy} label="Copiar" />
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

function FileText(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
  )
}

function AlignLeft(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" x2="3" y1="6" y2="6"/><line x1="15" x2="3" y1="12" y2="12"/><line x1="17" x2="3" y1="18" y2="18"/></svg>
  )
}

function Check(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  )
}

function Copy(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
  )
}
