import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { Building2, ChevronRight, Shield, Lock, User } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    const { error: signUpError } = await signUp(email, password, fullName);

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else {
      navigate('/app/home');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans text-[#0B1220]">
      <div className="w-full max-w-[440px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* LOGO */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 bg-[#2563EB] rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-200">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter text-[#0B1220]">
              Adworks
            </h1>
            <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.2em] mt-1">
              Engine de Ativação Empresarial
            </p>
          </div>
        </div>

        {/* REGISTER CARD */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="mb-8">
             <h2 className="text-xl font-black italic uppercase tracking-tight text-slate-900 leading-none">Criar Conta</h2>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Inicie sua jornada empreendedora agora</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3 text-[10px] font-bold text-red-600 uppercase tracking-tight mb-6 animate-in zoom-in-95">
              <Shield className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#64748B] ml-1">
                Nome Completo
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#2563EB] transition-colors" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border-2 border-slate-50 rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-blue-500/10 focus:border-[#2563EB] focus:bg-white outline-none transition-all"
                  placeholder="Seu nome completo"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#64748B] ml-1">
                E-mail Profissional
              </label>
              <div className="relative group">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#2563EB] transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border-2 border-slate-50 rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-blue-500/10 focus:border-[#2563EB] focus:bg-white outline-none transition-all"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#64748B] ml-1">
                    Senha
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#2563EB] transition-colors" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border-2 border-slate-50 rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-blue-500/10 focus:border-[#2563EB] focus:bg-white outline-none transition-all"
                      placeholder="••••••"
                    />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#64748B] ml-1">
                    Confirmar
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#2563EB] transition-colors" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border-2 border-slate-50 rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-blue-500/10 focus:border-[#2563EB] focus:bg-white outline-none transition-all"
                      placeholder="••••••"
                    />
                  </div>
               </div>
            </div>

            <Button
              type="submit"
              isLoading={loading}
              className="w-full bg-[#0B1220] hover:bg-blue-600 text-white py-6 h-auto rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2 group"
            >
              Criar Minha Conta <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Ja possui uma conta?{' '}
              <Link
                to="/login"
                className="text-[#2563EB] hover:underline font-black"
              >
                Fazer Login
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">
          Ambiente Seguro & Criptografado
        </p>
      </div>
    </div>
  );
}
