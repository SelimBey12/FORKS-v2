
import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Trash2, User, ChevronRight, X, Key } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onDeleteAll: () => void;
  onGoToAccount: () => void;
  productKey: string;
}

const SettingsView: React.FC<SettingsViewProps> = ({ 
  settings, 
  onUpdateSettings, 
  onDeleteAll, 
  onGoToAccount,
  productKey
}) => {
  const [showKeyPrompt, setShowKeyPrompt] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [error, setError] = useState(false);

  const handleToggleSecurity = () => {
    if (!settings.askProductKey) {
      onUpdateSettings({ ...settings, askProductKey: true });
    } else {
      setShowKeyPrompt(true);
    }
  };

  const verifyAndToggle = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyInput === productKey) {
      onUpdateSettings({ ...settings, askProductKey: false });
      setShowKeyPrompt(false);
      setKeyInput('');
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-bold mb-8">Ayarlar</h2>

      <div className="space-y-6">
        <section className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-500" />
              Güvenlik ve Gizlilik
            </h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between group">
              <div>
                <p className="font-semibold mb-1">Ürün Anahtarı Sor</p>
                <p className="text-sm text-slate-500">Uygulama her açıldığında ürün anahtarını girmek gerekir.</p>
              </div>
              <button 
                onClick={handleToggleSecurity}
                className={`
                  relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none
                  ${settings.askProductKey ? 'bg-indigo-600' : 'bg-slate-600'}
                `}
              >
                <span className={`
                  inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200
                  ${settings.askProductKey ? 'translate-x-6' : 'translate-x-1'}
                `} />
              </button>
            </div>
          </div>
        </section>

        <section className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-500" />
              Veri Yönetimi
            </h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold mb-1">Dosyaları Sil</p>
                <p className="text-sm text-slate-500">Tüm FORK'ları ve kayıtlı verileri kalıcı olarak siler.</p>
              </div>
              <button 
                onClick={onDeleteAll}
                className="px-6 py-2 border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all font-medium"
              >
                Hepsini Sil
              </button>
            </div>
          </div>
        </section>

        <section className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-500" />
              Hesap Bilgilerim
            </h3>
          </div>
          <div className="p-6">
            <button 
              onClick={onGoToAccount}
              className="w-full flex items-center justify-between group py-2"
            >
              <div className="text-left">
                <p className="font-semibold mb-1">Hesap Detaylarını Görüntüle</p>
                <p className="text-sm text-slate-500">Profil, isim ve ürün anahtarı bilgilerine erişin.</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-200 transition-colors" />
            </button>
          </div>
        </section>
      </div>

      {showKeyPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-[40px] p-8 relative overflow-hidden shadow-2xl animate-in zoom-in-95">
            <button onClick={() => setShowKeyPrompt(false)} className="absolute top-6 right-6 p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-700">
                <Key className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Güvenlik Onayı</h3>
              <p className="text-slate-400 text-sm mb-8">Kilidi kaldırmak için ürün anahtarınızı doğrulamanız gerekmektedir.</p>
              <form onSubmit={verifyAndToggle} className="space-y-4">
                <input autoFocus type="password" placeholder="Ürün anahtarını girin" className={`w-full px-4 py-3 bg-slate-800 border rounded-2xl outline-none text-center font-mono transition-all ${error ? 'border-red-500' : 'border-slate-700 focus:border-indigo-500'}`} value={keyInput} onChange={e => setKeyInput(e.target.value)} />
                <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg transition-transform active:scale-[0.98]">Onayla ve Kaldır</button>
              </form>
              {error && <p className="text-red-500 text-xs mt-3 font-semibold">Hatalı ürün anahtarı!</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
