
import React, { useState, useRef } from 'react';
import { Upload, File, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { ForkFile } from '../types';
import { MAX_FILE_SIZE, STORAGE_BUCKET } from '../constants';
import { supabase } from '../lib/supabase';

interface CreateForkProps {
  onUpload: (file: ForkFile) => void;
  userId: string;
}

const CreateFork: React.FC<CreateForkProps> = ({ onUpload, userId }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      setError("Dosya boyutu 10MB limitini aşıyor.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // 1. Upload to Supabase Storage
      const filePath = `${userId}/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Save metadata to DB
      const { data: dbData, error: dbError } = await supabase
        .from('files')
        .insert({
          user_id: userId,
          name: file.name,
          size: file.size,
          type: file.type,
          storage_path: filePath
        })
        .select()
        .single();

      if (dbError) throw dbError;

      onUpload({
        id: dbData.id,
        name: dbData.name,
        size: dbData.size,
        type: dbData.type,
        data: dbData.storage_path,
        createdAt: new Date(dbData.created_at).getTime()
      });
    } catch (err: any) {
      setError(`Dosya yüklenirken bir hata oluştu: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) processFile(e.target.files[0]);
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-bold mb-8">Bir FORK Oluştur</h2>
      <div className="max-w-2xl mx-auto">
        <div 
          onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center w-full min-h-[350px] border-2 border-dashed rounded-[40px] transition-all duration-300 ${dragActive ? 'border-indigo-500 bg-indigo-500/5 scale-[1.02]' : 'border-slate-700 bg-slate-800/30 hover:border-slate-500'} ${uploading ? 'pointer-events-none opacity-60' : ''}`}
        >
          <input ref={fileInputRef} type="file" className="hidden" onChange={handleChange} />
          <div className="text-center p-8">
            {uploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-16 h-16 text-indigo-500 animate-spin mb-4" />
                <p className="text-xl font-medium">Supabase Cloud'a Yükleniyor...</p>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-slate-700">
                  <Upload className="w-10 h-10 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Dosyayı Sürükleyin</h3>
                <button onClick={() => fileInputRef.current?.click()} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-2xl transition-all shadow-lg active:scale-95">Dosya Seç</button>
              </>
            )}
          </div>
        </div>
        {error && <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400"><AlertCircle className="w-5 h-5 flex-shrink-0" /><span>{error}</span></div>}
      </div>
    </div>
  );
};

export default CreateFork;
