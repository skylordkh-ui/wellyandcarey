import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

export default function Navbar({ onReset }) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={onReset}>
          <img 
            src="image/welly logo.png" 
            alt="WellyandCarey Logo" 
            className="w-10 h-10 object-contain rounded-lg"
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/80x80/1c3627/ffffff?text=W'; }}
          />
          <div>
            <span className="font-bold text-base tracking-wide text-slate-900 block leading-tight">WellyandCarey</span>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Best Care</span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Formulated Clean
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Lab Tested
          </span>
        </div>

      </div>
    </header>
  );
}

