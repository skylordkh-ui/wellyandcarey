import React, { useState } from 'react';
import { formatRiel } from '../utils.js';
import { Eye, ShoppingCart, Check } from 'lucide-react';

export default function ProductCard({ product, onSelect, onAddToCart, isInCart }) {
  const isOutOfStock = product.stock <= 0;
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    if (isOutOfStock) return;
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group">
      
      {/* Image Wrap */}
      <div 
        className="relative h-64 bg-white dark:bg-slate-950 cursor-pointer overflow-hidden flex items-center justify-center p-3 border-b border-slate-100 dark:border-slate-800/80"
        onClick={() => onSelect(product)}
      >
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x300/e2e8f0/64748b?text=Product'; }}
        />
        
        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 dark:bg-slate-800/90 text-white uppercase tracking-wider backdrop-blur-xs">
          {product.category}
        </span>

        {/* Stock Badge - ONLY in stock or out of stock */}
        {isOutOfStock ? (
          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
            Out of Stock
          </span>
        ) : (
          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
            In Stock
          </span>
        )}
      </div>

      {/* Info Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 
            className="font-bold text-sm text-slate-900 dark:text-white hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer line-clamp-1 transition"
            onClick={() => onSelect(product)}
            title={product.name}
          >
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{product.size}</p>

          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <div>
            {product.price > 0 ? (
              <>
                <span className="text-base font-bold text-slate-900 dark:text-white leading-tight block">
                  ${Number(product.price).toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                  {formatRiel(product.price)}
                </span>
              </>
            ) : (
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Price on Inquiry
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSelect(product)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              disabled={isOutOfStock}
              onClick={handleAdd}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                isOutOfStock 
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                  : justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
