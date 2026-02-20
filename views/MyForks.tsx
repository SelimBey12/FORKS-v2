
import React, { useState, useEffect } from 'react';
import { File, MoreVertical, Trash2, Download, Calendar, HardDrive, Loader2 } from 'lucide-react';
import { ForkFile } from '../types';
import { supabase } from '../lib/supabase';
import { STORAGE_BUCKET } from '../constants';

interface MyForksProps {
  forks: ForkFile[];
  onDelete: (id: string) => void;
  loading?: boolean;
}

const MyForks: React.FC<MyForksProps> = ({ forks, onDelete, loading }) => {
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, fileId: string } | null>(null);

  const handleContextMenu = (e: React.MouseEvent, fileId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, fileId });
  };

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleDownload = async (file: ForkFile) => {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .download(file.data);
    
    if (error) {
      alert("İndirme hatası: " + error.message);
      return;
    }

    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400">Bulut verileri senkronize ediliyor...</p>
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold">FORK'larım</h2>
          <p className="text-slate-400 mt-1">{forks.length} adet bulut dosyası senkronize edildi.</p>
        </div>
        <div className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl flex items-center gap-2 text-sm">
          <HardDrive className="w-4 h-4 text-indigo-400" />
          <span className="text-slate-300">{(forks.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024)).toFixed(2)} MB Bulut Kullanımı</span>
        </div>
      </div>

      {forks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-800/20 border border-slate-700 border-dashed rounded-[40px]">
          <File className="w-16 h-16 text-slate-700 mb-4" />
          <p className="text-slate-500 font-medium">Bulut üzerinde henüz dosyanız yok.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {forks.map(file => (
            <div 
              key={file.id} onContextMenu={(e) => handleContextMenu(e, file.id)}
              className="p-5 bg-slate-800 border border-slate-700 rounded-3xl hover:border-indigo-500/50 hover:bg-slate-700/30 transition-all group relative"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-700"><File className="w-6 h-6 text-indigo-400" /></div>
                <button onClick={(e) => handleContextMenu(e as any, file.id)} className="p-2 text-slate-500"><MoreVertical className="w-4 h-4" /></button>
              </div>
              <h3 className="font-bold text-slate-200 truncate pr-4">{file.name}</h3>
              <div className="mt-4 flex items-center gap-4 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                <div className="flex items-center gap-1.5"><HardDrive className="w-3 h-3" />{formatSize(file.size)}</div>
              </div>
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-all pointer-events-none group-hover:pointer-events-auto">
                <button onClick={() => handleDownload(file)} className="p-3 bg-indigo-600 rounded-xl shadow-lg"><Download className="w-5 h-5" /></button>
                <button onClick={() => onDelete(file.id)} className="p-3 bg-red-600 rounded-xl shadow-lg"><Trash2 className="w-5 h-5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {contextMenu && (
        <div 
          className="fixed z-[100] w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={() => { const f = forks.find(x => x.id === contextMenu.fileId); if(f) handleDownload(f); setContextMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-slate-700 flex items-center gap-3 text-sm text-slate-200"><Download className="w-4 h-4 text-indigo-400" /> İndir</button>
          <button onClick={() => { onDelete(contextMenu.fileId); setContextMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-red-950/30 flex items-center gap-3 text-sm text-red-400"><Trash2 className="w-4 h-4" /> Sil</button>
        </div>
      )}
    </div>
  );
};

export default MyForks;
