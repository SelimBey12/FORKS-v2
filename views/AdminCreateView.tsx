
import React, { useState } from 'react';
import { UserPlus, User, Mail, Key, ShieldCheck, Loader2 } from 'lucide-react';
import { UserAccount } from '../types';

interface AdminCreateViewProps {
  onAdd: (account: UserAccount) => void;
}

const AdminCreateView: React.FC<AdminCreateViewProps> = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    productKey: ''
  });
  const [loading, setLoading] = useState(false);

  const generateRandomKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const segment = () => Array.from({length: 5}, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    return `${segment()}-${segment()}-${segment()}-${segment()}-${segment()}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onAdd({
        id: crypto.randomUUID(),
        ...formData,
        createdAt: Date.now(),
        isActivated: false // Accounts start as unactivated by default
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-amber-600/10 border border-amber-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-8 h-8 text-amber-500" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Yeni Hesap Oluştur</h2>
        <p className="text-slate-500">Yeni bir kullanıcı için erişim anahtarı ve profil tanımlayın.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900 border border-slate-800 p-8 rounded-[40px] shadow-2xl">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-500 ml-1">Kullanıcı Tam Adı</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
              <input
                required
                type="text"
                placeholder="Örn: Mehmet Yılmaz"
                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-2xl outline-none focus:border-amber-500 transition-all"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-500 ml-1">E-posta Adresi</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
              <input
                required
                type="email"
                placeholder="Örn: mehmet@mail.com"
                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-2xl outline-none focus:border-amber-500 transition-all"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-500 ml-1">Ürün Anahtarı</label>
            <div className="relative group">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
              <input
                required
                type="text"
                placeholder="XXXXX-XXXXX-..."
                className="w-full pl-12 pr-24 py-3 bg-slate-800 border border-slate-700 rounded-2xl outline-none focus:border-amber-500 transition-all font-mono"
                value={formData.productKey}
                onChange={e => setFormData({ ...formData, productKey: e.target.value })}
              />
              <button 
                type="button"
                onClick={() => setFormData({...formData, productKey: generateRandomKey()})}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-[10px] font-bold rounded-lg transition-colors"
              >
                OLUŞTUR
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-amber-600/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Hazırlanıyor...
            </>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              Hesabı Kaydet
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AdminCreateView;
