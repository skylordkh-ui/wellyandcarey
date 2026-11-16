import React from 'react';
import { Sparkles, ShieldCheck, ShoppingCart } from 'lucide-react';

export default function Navbar({ onReset, cartCount, onOpenCart }) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={onReset}>
          <div>
            <span className="font-bold text-base sm:text-lg tracking-wide text-slate-900 dark:text-white block leading-tight">WellyandCarey</span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Best Care</span>
          </div>
        </div>

        {/* Right Section: Badges & Cart Button */}
        <div className="flex items-center gap-3">
          
          {/* Trust Badges */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" /> Formulated Clean
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" /> Lab Tested
            </span>
          </div>

          {/* Cart Button */}
          <button 
            onClick={onOpenCart}
            aria-label="View shopping cart"
            className="relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition shadow-xs active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden xs:inline">Cart</span>
            {cartCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-extrabold bg-sky-400 text-slate-950 rounded-full min-w-5 text-center leading-none">
                {cartCount}
              </span>
            )}
          </button>

        </div>

      </div>
    </header>
  );
}
