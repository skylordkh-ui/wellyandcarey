import React, { useState } from 'react';
import { X, Lock, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { 
  STORAGE_KEY_HASH, 
  MAX_FAILED_ATTEMPTS, 
  LOCKOUT_DURATION_SEC, 
  hashStringSHA256 
} from '../utils.js';

export default function AuthModal({ isOpen, onClose, onSuccess, onNotify }) {
  if (!isOpen) return null;

  const storedHash = localStorage.getItem(STORAGE_KEY_HASH);
  const isFirstTime = !storedHash;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const handleSetup = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    const hash = await hashStringSHA256(password);
    localStorage.setItem(STORAGE_KEY_HASH, hash);
    onNotify("Master password created successfully");
    onSuccess();
    onClose();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLocked) return;

    const enteredHash = await hashStringSHA256(password);
    if (enteredHash === storedHash) {
      setFailedAttempts(0);
      onNotify("Logged in as Owner");
      onSuccess();
      onClose();
    } else {
      const nextFailed = failedAttempts + 1;
      setFailedAttempts(nextFailed);
      const remaining = MAX_FAILED_ATTEMPTS - nextFailed;
      if (remaining <= 0) {
        setIsLocked(true);
        setErrorMessage(`Too many failed attempts. Locked for ${LOCKOUT_DURATION_SEC}s.`);
        setTimeout(() => {
          setIsLocked(false);
          setFailedAttempts(0);
          setErrorMessage('');
        }, LOCKOUT_DURATION_SEC * 1000);
      } else {
        setErrorMessage(`Incorrect password. ${remaining} attempt(s) remaining.`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {isFirstTime ? 'Setup Master Password' : 'Owner Access'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {isFirstTime ? 'Create master password for stock control' : 'Enter master password to continue'}
              </p>
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

        {isFirstTime ? (
          <form onSubmit={handleSetup} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Create Password (Min 6 chars)</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required 
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Confirm Password</label>
              <input 
                type={showPassword ? 'text' : 'password'}
                required 
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <button 
              type="submit" 
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition"
            >
              Set Master Password
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Master Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required 
                  disabled={isLocked}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 pr-9 focus:outline-none focus:border-emerald-600 disabled:bg-slate-100"
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
              disabled={isLocked}
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white rounded-lg text-xs font-semibold transition"
            >
              Unlock Console
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

