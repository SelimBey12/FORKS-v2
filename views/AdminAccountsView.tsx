
import React from 'react';
import { Users, Trash2, Mail, Calendar, Key, UserCheck, ShieldCheck, ShieldAlert } from 'lucide-react';
import { UserAccount } from '../types';

interface AdminAccountsViewProps {
  accounts: UserAccount[];
  onDelete: (id: string) => void;
  onToggleActivation: (id: string, isActivated: boolean) => void;
}

const AdminAccountsView: React.FC<AdminAccountsViewProps> = ({ accounts, onDelete, onToggleActivation }) => {
  const formatDate = (ts: number) => {
    return new Intl.DateTimeFormat('tr-TR', { dateStyle: 'medium' }).format(ts);
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3 text-amber-500">
            <Users className="w-8 h-8" />
            Hesap Yönetimi
          </h2>
          <p className="text-slate-500 mt-1">Sistemdeki tüm kayıtlı kullanıcıları buradan yönetebilirsiniz.</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-sm font-bold text-slate-300">
          {accounts.length} AKTİF HESAP
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {accounts.map(acc => (
          <div key={acc.id} className="bg-slate-900 border border-slate-800 hover:border-amber-500/30 transition-all rounded-3xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4 min-w-[200px]">
              <div className="w-14 h-14 bg-amber-600/10 border border-amber-600/20 rounded-2xl flex items-center justify-center text-amber-500 font-bold text-xl shadow-lg">
                {acc.fullName.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold">{acc.fullName}</h3>
                <p className="text-sm text-slate-500 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  {acc.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Key className="w-3 h-3" /> Ürün Anahtarı
                </p>
                <p className="text-xs font-mono text-amber-200/80 truncate">{acc.productKey}</p>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                   Durum
                </p>
                <div className="flex items-center gap-2">
                   {acc.isActivated ? (
                      <span className="text-emerald-400 text-xs flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Aktif</span>
                   ) : (
                      <span className="text-red-400 text-xs flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> Devre Dışı</span>
                   )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => onToggleActivation(acc.id, !acc.isActivated)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${acc.isActivated ? 'bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white'}`}
              >
                {acc.isActivated ? 'Pasifleştir' : 'Aktifleştir'}
              </button>
              <button 
                onClick={() => {
                  if(window.confirm(`${acc.fullName} hesabını silmek istediğinize emin misiniz?`)) {
                    onDelete(acc.id);
                  }
                }}
                className="p-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        {accounts.length === 0 && (
          <div className="py-20 text-center bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-[40px]">
            <UserCheck className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500">Hiç hesap bulunamadı. Yeni bir tane oluşturun.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAccountsView;
