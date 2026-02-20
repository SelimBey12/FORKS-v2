
import React, { useState } from 'react';
import { User, Key, Mail, ShieldCheck, Phone, Calendar, CheckCircle2, Edit3, Save, X } from 'lucide-react';
import { AppSettings, UserAccount } from '../types';

interface AccountViewProps {
  settings: AppSettings;
  account: UserAccount;
  onUpdateName: (newName: string) => void;
}

const AccountView: React.FC<AccountViewProps> = ({ settings, account, onUpdateName }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(account.fullName);

  const handleSaveName = () => {
    if (newName.trim()) {
      onUpdateName(newName.trim());
      setIsEditingName(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Hesabım</h2>
        {settings.isVerified && (
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            Doğrulanmış
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center text-2xl font-bold border-2 border-indigo-500">
              {account.fullName.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input 
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 outline-none text-white w-full"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    autoFocus
                  />
                  <button onClick={handleSaveName} className="p-1.5 bg-emerald-600 rounded-lg text-white hover:bg-emerald-500 transition-colors"><Save className="w-4 h-4" /></button>
                  <button onClick={() => { setIsEditingName(false); setNewName(account.fullName); }} className="p-1.5 bg-slate-700 rounded-lg text-white hover:bg-slate-600 transition-colors"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                   <h3 className="text-xl font-bold">{account.fullName}</h3>
                   <button onClick={() => setIsEditingName(true)} className="p-1.5 text-slate-500 hover:text-indigo-400 transition-colors"><Edit3 className="w-4 h-4" /></button>
                </div>
              )}
              <p className="text-sm text-slate-500">Kullanıcı Kimliği: #{account.id.substring(0, 5)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-indigo-500" />
                <span className="text-sm font-medium">İsim Soyisim</span>
              </div>
              <span className="text-sm text-slate-300">
                {settings.verificationData?.fullName || account.fullName}
              </span>
            </div>

            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
              <div className="flex items-center gap-3 mb-2">
                <Key className="w-5 h-5 text-indigo-500" />
                <span className="text-sm font-medium">Ürün Anahtarım</span>
              </div>
              <p className="text-xs font-mono text-slate-400 break-all">{account.productKey}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6">
            <h4 className="font-bold flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-indigo-400" />
              İletişim Bilgileri
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">E-posta</span>
                <span className="text-slate-300">{account.email}</span>
              </div>
              {settings.isVerified && settings.verificationData && (
                <>
                  <div className="flex items-center justify-between text-sm border-t border-slate-700/50 pt-3">
                    <div className="flex items-center gap-2">
                       <Phone className="w-4 h-4 text-slate-500" />
                       <span className="text-slate-500">Telefon</span>
                    </div>
                    <span className="text-slate-300">{settings.verificationData.phone}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm border-t border-slate-700/50 pt-3">
                    <div className="flex items-center gap-2">
                       <Calendar className="w-4 h-4 text-slate-500" />
                       <span className="text-slate-500">Doğum Tarihi</span>
                    </div>
                    <span className="text-slate-300">{settings.verificationData.dob}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {!settings.isVerified && (
             <div className="bg-amber-600/10 border border-amber-600/20 p-6 rounded-3xl">
                <h4 className="font-bold flex items-center gap-2 mb-2 text-amber-400">
                  <ShieldCheck className="w-5 h-5" />
                  Eksik Doğrulama
                </h4>
                <p className="text-sm text-slate-400 mb-4">Hesabınız henüz doğrulanmamış. Lütfen doğrulama sekmesinden bilgilerinizi tamamlayın.</p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountView;
