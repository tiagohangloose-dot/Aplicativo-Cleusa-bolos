import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

interface LoginViewProps {
  onSuccessLogin: () => void;
}

export default function LoginView({ onSuccessLogin }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() === 'cleusadalmas' && password === 'nota10') {
      setError(null);
      onSuccessLogin();
    } else {
      setError('Usuário ou senha incorretos! Tente novamente.');
    }
  };

  return (
    <div className="w-full max-w-[440px] mx-auto flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-on-surface">
      {/* Login Card Container */}
      <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-[0px_12px_40px_rgba(75,54,33,0.08)] border border-outline-variant/10 flex flex-col items-center">
        
        {/* Brand Section */}
        <div className="mb-6 text-center">
          <div className="w-24 h-24 mb-3 mx-auto overflow-hidden rounded-full border-2 border-primary-container p-1 bg-white flex items-center justify-center">
            <img
              alt="Cleusa Bolos circular logo" 
              className="w-[90%] h-[90%] object-contain" 
              src="https://lh3.googleusercontent.com/aida/AP1WRLsqRWCaKEwqdilIzW9bIHyAuvWIiSFnM4GKkYlHCfqLEbMcjPAmTHvNWlT2s9274p_L4ULWhP-Vz7_tqB7-M---rb2Rq-dCQj47TDjhxymftLwxg76Zp9UyIB6B8CdJNkkBXZlnvIMqp3ZhZR_Aip4sMVsRyLdczK5wGupB7H8ynkWviRWYHH006-CFFpsu37Z6O-7Rk_4-XXaBXiDxBeTM9jv67igYIa45_GQ7u9AMttJT6_HKpf_D2-d_" 
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="font-serif text-2xl font-bold text-primary mb-1">Painel Administrativo</h1>
          <p className="font-sans text-xs text-on-surface-variant px-4 leading-normal">
            Bem-vinda de volta, Cleusa! Gerencie suas encomendas com carinho.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-[#ba1a1a] text-xs font-semibold p-3 rounded-lg text-center leading-normal animate-in fade-in duration-200">
              ⚠️ {error}
            </div>
          )}

          {/* Email/User Field */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-xs text-on-surface-variant flex items-center gap-1.5" htmlFor="username">
              <User className="w-4 h-4 text-secondary" />
              <span>Usuário</span>
            </label>
            <input
              id="username"
              type="text"
              required
              className="w-full h-11 px-4 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-sans text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-outline/40"
              placeholder="Digite o usuário de acesso"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="font-label-md text-xs text-on-surface-variant flex items-center gap-1.5" htmlFor="password">
                <Lock className="w-4 h-4 text-secondary" />
                <span>Senha</span>
              </label>
            </div>
            
            <div className="relative flex items-center">
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                required
                className="w-full h-11 pl-4 pr-10 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-sans text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me Toggle */}
          <div className="flex items-center gap-2 select-none">
            <input
              id="remember"
              type="checkbox"
              className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer accent-primary"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label className="font-sans text-xs text-on-surface-variant cursor-pointer" htmlFor="remember">
              Manter conectado
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-12 bg-primary text-white font-sans font-semibold text-xs rounded-lg shadow-md hover:bg-opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 group cursor-pointer"
          >
            <span>Acessar Painel</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>

      {/* Footer Support */}
      <footer className="text-center flex flex-col gap-2 pt-2">
        <p className="font-sans text-xs text-on-surface-variant">
          Precisa de ajuda técnica?{' '}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              alert('Dúvidas técnicas: entre em contato com tiagohangloose@gmail.com');
            }}
            className="text-primary font-bold hover:underline"
          >
            Fale com o suporte
          </a>
        </p>
        <div className="flex items-center justify-center gap-4 text-outline/35 mt-1">
          <span className="w-8 h-px bg-current"></span>
          <span className="font-sans text-[9px] tracking-widest uppercase">Desde 1998</span>
          <span className="w-8 h-px bg-current"></span>
        </div>
      </footer>
    </div>
  );
}
