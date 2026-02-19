import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import {
  Building2,
  ArrowRight,
  Lock,
  Mail,
  ShieldCheck,
  UserCircle,
  Briefcase,
  Zap,
} from 'lucide-react';

type UserRole = 'CLIENT' | 'OPERATOR' | 'MASTER';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<UserRole>('CLIENT');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError('Credenciais inválidas. Verifique seu e-mail e senha.');
      setLoading(false);
    } else {
      // O RootRedirect no App.tsx cuidará de jogar para /admin ou /app
      navigate('/');
    }
  };

  const roleConfigs = {
    CLIENT: {
      label: 'Cliente',
      desc: 'Acesso ao painel da minha empresa',
      icon: Building2,
      color: 'blue',
    },
    OPERATOR: {
      label: 'Operador',
      desc: 'Fila de tickets e validações',
      icon: Briefcase,
      color: 'purple',
    },
    MASTER: {
      label: 'Master Admin',
      desc: 'Gestão total e métricas',
      icon: Zap,
      color: 'orange',
    },
  };

  return (
    <div className="min-h-screen bg-adworks-gray flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-adworks-blue rounded-[2rem] mb-6 shadow-2xl shadow-blue-500/20">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-adworks-dark italic tracking-tighter uppercase mb-2">
            ADWORKS
          </h1>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.3em]">
            Access Protocol
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
          <div className="p-10">
            <div className="mb-10">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">
                Login as :
              </label>
              <div className="grid grid-cols-1 gap-2">
                {(['CLIENT', 'OPERATOR', 'MASTER'] as UserRole[]).map((role) => {
                  const config = roleConfigs[role];
                  const isSelected = userType === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setUserType(role)}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? 'border-adworks-blue bg-blue-50 shadow-md translate-y-[-2px]'
                          : 'border-gray-50 bg-gray-50/50 text-gray-400 grayscale'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-2 rounded-xl bg-white shadow-sm ${isSelected ? 'text-adworks-blue' : 'text-gray-300'}`}
                        >
                          <config.icon className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <p
                            className={`text-xs font-black uppercase tracking-widest ${isSelected ? 'text-adworks-blue' : ''}`}
                          >
                            {config.label}
                          </p>
                          <p className="text-[10px] font-medium leading-tight opacity-60">
                            {config.desc}
                          </p>
                        </div>
                      </div>
                      {isSelected && <ShieldCheck className="w-5 h-5 text-adworks-blue" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl text-xs font-bold border border-red-100 animate-shake">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-adworks-blue transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-adworks-gray border-none rounded-2xl focus:ring-2 focus:ring-adworks-blue font-bold text-adworks-dark placeholder-gray-400 outline-none transition-all"
                    placeholder="Seu e-mail profissional"
                  />
                </div>

                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-adworks-blue transition-colors" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-adworks-gray border-none rounded-2xl focus:ring-2 focus:ring-adworks-blue font-bold text-adworks-dark placeholder-gray-400 outline-none transition-all"
                    placeholder="Sua senha secreta"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between px-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-adworks-blue focus:ring-adworks-blue"
                  />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-adworks-dark transition-colors">
                    Lembrar de mim
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  size="sm"
                  className="text-[10px] font-black text-adworks-blue uppercase tracking-widest hover:underline"
                >
                  Recuperar Senha
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-adworks-dark text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-adworks-blue transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <span>ENTRAR NO SISTEMA</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
          <div className="bg-adworks-gray py-6 px-10 border-t border-gray-50 flex items-center justify-between">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">
              Encrypted Connection
            </span>
            <Link
              to="/register"
              className="text-[10px] font-black text-adworks-blue uppercase tracking-widest hover:underline"
            >
              Criar Nova Conta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
