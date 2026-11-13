import React, { useState } from 'react';
import { 
  ShieldCheck, X, LogOut, Download, Plus, 
  Trash2, Search 
} from 'lucide-react';

export default function AdminDrawer({ 
  isOpen, 
  onClose, 
  products, 
  onUpdateStock, 
  onDeleteProduct, 
  onOpenAddModal, 
  onLogout,
  onNotify
}) {
  const [drawerSearch, setDrawerSearch] = useState('');

  if (!isOpen) return null;

  const totalItems = products.length;
  const inStockCount = products.filter(p => p.stock > 0).length;
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock < 10).length;
  const totalValuation = products.reduce((acc, p) => acc + (p.price * p.stock), 0);

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(drawerSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(drawerSearch.toLowerCase()) ||
    p.id.toLowerCase().includes(drawerSearch.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ["ID", "Name", "Category", "Size", "Price (USD)", "Stock Units", "Status", "Skin Type", "Key Ingredients"];
    const rows = products.map(p => [
      `"${p.id}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      `"${p.size}"`,
      p.price.toFixed(2),
      p.stock,
      p.stock === 0 ? "Out of Stock" : "In Stock",
      `"${(p.skinType || '').replace(/"/g, '""')}"`,
      `"${(p.ingredients || []).join('; ').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `wellyandcarey_inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onNotify("Exported inventory CSV backup");
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity"
      />

      {/* Drawer */}
      <aside className="fixed inset-y-0 left-0 max-w-2xl w-full bg-white shadow-2xl z-50 flex flex-col border-r border-slate-200 animate-in slide-in-from-left duration-200">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">Owner Control & Stock Log</h2>
              <p className="text-[11px] text-slate-400">Inventory & product management console</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={onLogout} 
              title="Log out" 
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/80 text-slate-300 hover:text-red-200 transition text-sm"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metric Summary Strip */}
        <div className="grid grid-cols-4 gap-2 p-4 bg-slate-50 border-b border-slate-200 text-center">
          <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-xs">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Items</span>
            <span className="text-sm font-bold text-slate-800">{totalItems}</span>
          </div>
          <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-xs">
            <span className="block text-[10px] uppercase font-bold text-slate-400">In Stock</span>
            <span className="text-sm font-bold text-emerald-600">{inStockCount}</span>
          </div>
          <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-xs">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Low (&lt;10)</span>
            <span className="text-sm font-bold text-amber-600">{lowStockCount}</span>
          </div>
          <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-xs">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Valuation</span>
            <span className="text-sm font-bold text-slate-800">${totalValuation.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-3.5 px-4 bg-white border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={drawerSearch}
              onChange={(e) => setDrawerSearch(e.target.value)}
              placeholder="Filter table..." 
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
            />
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={exportCSV} 
              title="Download CSV Backup"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-200 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV Export</span>
            </button>
            <button 
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-700 hover:bg-emerald-800 text-white transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 font-bold" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Stock Table */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-2">Size</th>
                  <th className="py-2.5 px-2">Price</th>
                  <th className="py-2.5 px-2 text-center">Units</th>
                  <th className="py-2.5 px-2">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <img 
                          src={p.image} 
                          alt={p.name} 
                          className="w-8 h-8 rounded object-contain bg-slate-50 border border-slate-200 p-0.5" 
                          onError={(e) => { e.currentTarget.src = 'https://placehold.co/40x40/e2e8f0/64748b?text=P'; }}
                        />
                        <div className="max-w-[140px]">
                          <span className="font-semibold text-slate-900 block truncate" title={p.name}>{p.name}</span>
                          <span className="text-[10px] text-slate-400">{p.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-slate-500">{p.size}</td>
                    <td className="py-2.5 px-2 font-medium text-slate-900">
                      {p.price > 0 ? `$${p.price.toFixed(2)}` : 'Inquiry'}
                    </td>
                    <td className="py-2.5 px-2">
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          onClick={() => onUpdateStock(p.id, -1)}
                          className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold"
                        >
                          -
                        </button>
                        <span className="w-7 text-center font-bold text-slate-800">{p.stock}</span>
                        <button 
                          onClick={() => onUpdateStock(p.id, 1)}
                          className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-2.5 px-2">
                      {p.stock === 0 ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-100 text-red-700">Out</span>
                      ) : p.stock < 10 ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-700">Low</span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-700">OK</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button 
                        onClick={() => onDeleteProduct(p.id)}
                        className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Synced with Firebase Cloud</span>
          <span className="text-emerald-700 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Session Active
          </span>
        </div>

      </aside>
    </>
  );
}
