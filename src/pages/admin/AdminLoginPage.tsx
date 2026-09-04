import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLoginPageProps {
  onSuccess: () => void;
  onBackToStore: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onSuccess, onBackToStore }) => {
  const { login } = useAuth();

  const [email, setEmail] = useState('balochrohan50@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success && email.trim().toLowerCase() === 'balochrohan50@gmail.com') {
      onSuccess();
    } else if (res.success) {
      setError('Access denied. This account does not possess store administrative privileges.');
    } else {
      setError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-[#111116] border border-[#262632] rounded-2xl p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-[#1b1b24] border border-[#d4af37]/40 flex items-center justify-center mx-auto text-[#d4af37]">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-cinzel font-bold text-[#fbfaf8]">
            Rohan Atelier Console
          </h1>
          <p className="text-xs text-[#8c887f]">
            Administrative Portal for Store & COD Order Management
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-300 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#cfccc4] mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#6e6a62] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rohanperfume.com"
                className="w-full bg-[#171720] border border-[#2b2b36] rounded-lg pl-9 pr-3 py-2.5 text-xs text-[#f4f2ee] focus:border-[#d4af37] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#cfccc4] mb-1">
              Master Passcode
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#6e6a62] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#171720] border border-[#2b2b36] rounded-lg pl-9 pr-3 py-2.5 text-xs text-[#f4f2ee] focus:border-[#d4af37] outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d4af37] hover:bg-[#be9c2f] disabled:bg-[#4d401e] text-[#0c0c0e] font-bold text-xs uppercase tracking-wider py-3.5 rounded-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Enter Admin Management'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#1f1f26] text-center">
          <button
            onClick={onBackToStore}
            className="text-xs text-[#8c887f] hover:text-[#d4af37] transition-colors"
          >
            ← Return to Rohan Perfume Storefront
          </button>
        </div>
      </div>
    </div>
  );
};
