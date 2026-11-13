import React, { useState } from 'react';
import { X, Lock, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { ADMIN_MASTER_PASSWORD } from '../utils.js';

export default function AuthModal({ isOpen, onClose, onSuccess, onNotify }) {
  if (!isOpen) return null;

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_MASTER_PASSWORD) {
      setErrorMessage('');
      onNotify("Logged in as Owner");
      onSuccess();
      onClose();
    } else {
      setErrorMessage("Incorrect password. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Owner Access</h3>
              <p className="text-[11px] text-slate-500">Enter master password to manage inventory</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Master Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'}
                required 
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 pr-9 focus:outline-none focus:border-emerald-600"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition"
          >
            Unlock Console
          </button>
        </form>

      </div>
    </div>
  );
}
