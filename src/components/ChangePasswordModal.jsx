import React, { useState } from 'react';
import { X, KeyRound } from 'lucide-react';
import { STORAGE_KEY_HASH, hashStringSHA256 } from '../utils.js';

export default function ChangePasswordModal({ isOpen, onClose, onNotify }) {
  if (!isOpen) return null;

  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedHash = localStorage.getItem(STORAGE_KEY_HASH);
    const currHash = await hashStringSHA256(currentPwd);

    if (currHash !== storedHash) {
      setErrorMsg("Current password incorrect.");
      return;
    }
    if (newPwd.length < 6) {
      setErrorMsg("New password must be at least 6 characters.");
      return;
    }
    if (newPwd !== confirmPwd) {
      setErrorMsg("New passwords do not match.");
      return;
    }

    const nextHash = await hashStringSHA256(newPwd);
    localStorage.setItem(STORAGE_KEY_HASH, nextHash);
    onNotify("Master password changed successfully");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Change Master Password</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <p className="text-[11px] text-red-600 mb-3">{errorMsg}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Current Password</label>
            <input 
              type="password" 
              required
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">New Password (Min 6 chars)</label>
            <input 
              type="password" 
              required
              minLength={6}
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Confirm New Password</label>
            <input 
              type="password" 
              required
              minLength={6}
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition"
          >
            Update Password
          </button>
        </form>

      </div>
    </div>
  );
}

