import React, { useState } from 'react';
import { X, ShoppingCart, Check } from 'lucide-react';
import { formatRiel } from '../utils.js';

export default function ProductDetailModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

  const isOutOfStock = product.stock <= 0;
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    if (isOutOfStock) return;
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
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
          <span className={`absolute bottom-3 right-3 px-2.5 py-1 rounded-md text-[11px] font-bold ${
            isOutOfStock ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
          }`}>
            {isOutOfStock ? 'Out of Stock' : 'In Stock'}
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
            onClick={handleAdd}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition shadow-sm ${
              isOutOfStock 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
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
