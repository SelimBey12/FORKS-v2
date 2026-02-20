
import React from 'react';
import { Sparkles, HardDrive, ShieldCheck, Folder } from 'lucide-react';
import { MAX_FILE_SIZE } from '../constants';
import { ForkFile } from '../types';

interface HomeProps {
  forks: ForkFile[];
  userName: string;
}

const Home: React.FC<HomeProps> = ({ forks, userName }) => {
  const totalSize = forks.reduce((acc, f) => acc + f.size, 0);
  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
  const maxLimitMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-in fade-in duration-700">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600/10 border border-indigo-600/20 text-indigo-400 text-sm font-medium mb-6">
        <Sparkles className="w-4 h-4" />
        <span>Sistem Aktif</span>
      </div>
      
      <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
        Hoşgeldiniz, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{userName}</span>
      </h1>
      
      <p className="text-slate-400 text-lg max-w-xl mb-12 leading-relaxed">
        Forks, dijital varlıklarınızı güvenli bir şekilde saklamanız ve yönetmeniz için tasarlanmış modern bir ekosistemdir.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-3xl backdrop-blur-sm">
          <div className="flex justify-center mb-2">
            <Folder className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-1">Toplam Fork</p>
          <p className="text-3xl font-bold text-slate-100 mb-1">{forks.length}</p>
          <p className="text-xs text-slate-500">Aktif dosya</p>
        </div>

        <div className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-3xl backdrop-blur-sm">
          <div className="flex justify-center mb-2">
            <HardDrive className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-1">Kullanılan Alan</p>
          <p className="text-3xl font-bold text-slate-100 mb-1">{totalSizeMB} MB</p>
          <p className="text-xs text-slate-500">/ {maxLimitMB} MB Limit</p>
        </div>

        <div className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-3xl backdrop-blur-sm">
          <div className="flex justify-center mb-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-1">Güvenlik Seviyesi</p>
          <p className="text-3xl font-bold text-slate-100 mb-1">Ultra</p>
          <p className="text-xs text-slate-500">Ürün Anahtarı Korunuyor</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
