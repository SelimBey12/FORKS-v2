
import React, { useState } from 'react';
import { Key, Copy, Check } from 'lucide-react';

interface ProductKeyViewProps {
  productKey: string;
}

const ProductKeyView: React.FC<ProductKeyViewProps> = ({ productKey }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(productKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Key className="text-indigo-500" />
          Ürün Anahtarım
        </h2>
        <p className="text-slate-400 mt-2">Bu anahtar, sisteminize güvenli giriş yapmak için gereklidir.</p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 flex flex-col items-center gap-6">
        <div className="p-6 bg-slate-900 border border-slate-700 rounded-2xl w-full text-center group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
          <p className="text-2xl md:text-3xl font-mono tracking-wider break-all select-all text-indigo-100">
            {productKey}
          </p>
        </div>

        <button 
          onClick={handleCopy}
          className={`
            flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all shadow-xl
            ${copied ? 'bg-emerald-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'}
          `}
        >
          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          {copied ? 'Kopyalandı!' : 'Anahtarı Kopyala'}
        </button>
      </div>

      <div className="mt-8 p-4 border border-amber-500/20 bg-amber-500/5 rounded-2xl flex gap-4">
        <div className="mt-1">⚠️</div>
        <p className="text-sm text-amber-200/60">
          <strong>Önemli:</strong> Bu ürün anahtarını kimseyle paylaşmayın. Forks ekibi sizden asla ürün anahtarınızı istemez.
        </p>
      </div>
    </div>
  );
};

export default ProductKeyView;
