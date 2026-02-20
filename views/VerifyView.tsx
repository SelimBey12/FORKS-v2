
import React, { useState } from 'react';
import { ShieldCheck, User, Mail, Phone, Calendar, Loader2, CheckCircle } from 'lucide-react';
import { AppSettings, VerificationData } from '../types';

interface VerifyViewProps {
  settings: AppSettings;
  onVerify: (data: VerificationData) => void;
}

const VerifyView: React.FC<VerifyViewProps> = ({ settings, onVerify }) => {
  const [formData, setFormData] = useState<VerificationData>({
    phone: '',
    email: '',
    dob: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);

  if (settings.isVerified) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] animate-in fade-in duration-700 text-center">
        <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-8">
          <CheckCircle className="w-12 h-12 text-emerald-500" />
        </div>
        <h2 className="text-3xl font-bold mb-3">Hesabınız Doğrulandı</h2>
        <p className="text-slate-400 max-w-sm mb-8">
          Tebrikler! Hesabınız başarıyla doğrulanmıştır. Tüm özelliklere tam erişiminiz bulunmaktadır.
        </p>
        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
           <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Telefon</p>
              <p className="text-sm font-medium">{settings.verificationData?.phone}</p>
           </div>
           <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">E-posta</p>
              <p className="text-sm font-medium truncate">{settings.verificationData?.email}</p>
           </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      onVerify(formData);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-indigo-600/10 border border-indigo-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8 text-indigo-500" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Hesabımı Doğrula</h2>
        <p className="text-slate-400">Güvenliğiniz için lütfen aşağıdaki bilgileri eksiksiz doldurun.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 ml-1">İsim ve Soyisim</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                required
                type="text"
                placeholder="Örn: Demir Uras"
                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-2xl outline-none focus:border-indigo-500 transition-all"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 ml-1">E-posta Adresi</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                required
                type="email"
                placeholder="Örn: demir@mail.com"
                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-2xl outline-none focus:border-indigo-500 transition-all"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 ml-1">Telefon Numarası</label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                required
                type="tel"
                placeholder="05XX XXX XX XX"
                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-2xl outline-none focus:border-indigo-500 transition-all"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 ml-1">Doğum Tarihi</label>
            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                required
                type="date"
                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-2xl outline-none focus:border-indigo-500 transition-all"
                value={formData.dob}
                onChange={e => setFormData({ ...formData, dob: e.target.value })}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Doğrulanıyor...
            </>
          ) : (
            'Bilgileri Kaydet ve Doğrula'
          )}
        </button>
      </form>
    </div>
  );
};

export default VerifyView;
