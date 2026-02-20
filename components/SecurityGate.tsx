
import React, { useState } from 'react';
import { Lock, ShieldAlert } from 'lucide-react';

interface SecurityGateProps {
  // Fixed: Updated signature to support asynchronous validation (e.g., Supabase database checks)
  onUnlock: (key: string) => Promise<boolean> | boolean;
}

const SecurityGate: React.FC<SecurityGateProps> = ({ onUnlock }) => {
  const [keyInput, setKeyInput] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fixed: Made handleSubmit async to properly handle the Promise returned by onUnlock
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const success = await onUnlock(keyInput);
      if (success) {
        // Success is handled by parent changing auth state
      } else {
        setError(true);
        setKeyInput('');
        setTimeout(() => setError(false), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950 px-4">
      <div className="max-w-md w-full p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-600/10 blur-[100px] rounded-full"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-600/10 blur-[100px] rounded-full"></div>

        <div className="relative z-10 text-center">
          <div className={`
            w-16 h-16 mx-auto mb-6 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center
            ${error ? 'animate-shake border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'text-indigo-500'}
          `}>
            {error ? <ShieldAlert className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Forks Giriş</h2>
          <p className="text-slate-400 text-sm mb-8">
            Devam etmek için Ürün Anahtarınızı girin.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="•••••-•••••-•••••-•••••-•••••"
              value={keyInput}
              disabled={loading}
              onChange={(e) => setKeyInput(e.target.value)}
              className={`
                w-full px-4 py-3 bg-slate-800 border rounded-xl outline-none transition-all font-mono text-center
                ${error ? 'border-red-500 focus:ring-1 ring-red-500' : 'border-slate-700 focus:border-indigo-500'}
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              autoFocus
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Kontrol Ediliyor...' : 'Kilidi Aç'}
            </button>
          </form>
          
          <p className="mt-6 text-[10px] text-slate-500 uppercase tracking-widest">
            Uçtan uca şifrelenmiş oturum
          </p>
        </div>
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default SecurityGate;
