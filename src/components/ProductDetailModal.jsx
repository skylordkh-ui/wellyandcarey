import React from 'react';
import { X, Send } from 'lucide-react';
import { formatRiel } from '../utils.js';

export default function ProductDetailModal({ product, onClose, onOrder }) {
  if (!product) return null;

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header Image */}
        <div className="relative h-64 bg-slate-100 flex items-center justify-center p-4">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-contain"
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x300/e2e8f0/64748b?text=Product'; }}
          />
          <button 
            onClick={onClose} 
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-700 flex items-center justify-center shadow transition"
          >
            <X className="w-4 h-4" />
          </button>
          <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-900/80 text-white uppercase tracking-wider">
            {product.category}
          </span>
        </div>

        {/* Details Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              {product.size} &bull; {product.price > 0 ? `$${Number(product.price).toFixed(2)} (${formatRiel(product.price)})` : 'Price on Inquiry'}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-1">Description & Benefits</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{product.description}</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-1">Recommended Skin Type</h4>
            <p className="text-xs text-slate-700 font-medium">{product.skinType || 'All skin types'}</p>
          </div>

          {product.ingredients && product.ingredients.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-1">Key Active Ingredients</h4>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {product.ingredients.map((ing, i) => (
                  <span key={i} className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-md text-[11px]">
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.howToUse && (
            <div>
              <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-1">How to Use</h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {product.howToUse}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button 
            disabled={isOutOfStock}
            onClick={() => {
              onClose();
              onOrder(product);
            }} 
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition shadow-sm ${
              isOutOfStock 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-sky-600 hover:bg-sky-700 text-white'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Order via Telegram</span>
          </button>
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-medium rounded-lg transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

