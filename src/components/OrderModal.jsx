import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Send } from 'lucide-react';
import { formatRiel, TELEGRAM_USERNAME } from '../utils.js';

export default function OrderModal({ product, onClose }) {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);

  const handleAdjust = (delta) => {
    setQuantity(prev => {
      const next = prev + delta;
      return next < 1 ? 1 : next > 99 ? 99 : next;
    });
  };

  const handleInputChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      setQuantity(val < 1 ? 1 : val > 99 ? 99 : val);
    }
  };

  const sendTelegramOrder = () => {
    let orderLines = "";

    if (product.price > 0) {
      const totalUSD = product.price * quantity;
      const totalKHR = formatRiel(totalUSD);
      orderLines = 
`• Product: ${product.name} (${product.size})
• Quantity: ${quantity}
• Unit Price: $${Number(product.price).toFixed(2)} (${formatRiel(product.price)})
• Total Amount: $${totalUSD.toFixed(2)} (≈ ${totalKHR})
• SKU: ${product.id}`;
    } else {
      orderLines = 
`• Product: ${product.name} (${product.size})
• Quantity: ${quantity}
• Price: Price on Inquiry / Unlisted
• SKU: ${product.id}`;
    }

    const message = `Hello WellyandCarey Skincare! 👋\nI would like to place an order:\n\n${orderLines}\n\nPlease confirm availability and delivery details in Phnom Penh. Thank you!`;

    onClose();
    window.open(`https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const totalUSD = product.price > 0 ? product.price * quantity : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">Order via Telegram</h3>
              <p className="text-[11px] text-slate-400">Select quantity & auto-calculate</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Item Overview */}
        <div className="py-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 mb-4">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-12 h-12 rounded-lg object-contain bg-white p-1 border border-slate-200"
              onError={(e) => { e.currentTarget.src = 'https://placehold.co/80x80/e2e8f0/64748b?text=Item'; }}
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">{product.name}</h4>
              <p className="text-[11px] text-slate-500">{product.size}</p>
              <p className="text-[11px] font-semibold text-emerald-700">
                {product.price > 0 
                  ? `Unit: $${Number(product.price).toFixed(2)} (${formatRiel(product.price)})`
                  : 'Unit: Price on Inquiry'}
              </p>
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-700">Quantity</span>
            <div className="inline-flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
              <button 
                onClick={() => handleAdjust(-1)} 
                className="w-8 h-8 rounded-md bg-white hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center shadow-xs transition"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <input 
                type="number" 
                min="1" 
                max="99" 
                value={quantity} 
                onChange={handleInputChange}
                className="w-12 text-center bg-transparent font-bold text-slate-900 text-sm focus:outline-none"
              />
              <button 
                onClick={() => handleAdjust(1)} 
                className="w-8 h-8 rounded-md bg-white hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center shadow-xs transition"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Auto Calculation Box */}
          <div className="p-3.5 bg-sky-50/60 rounded-xl border border-sky-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block">Estimated Total</span>
              <span className="text-lg font-bold text-slate-900 leading-tight">
                {product.price > 0 ? `$${totalUSD.toFixed(2)}` : 'Price on Inquiry'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Approx. KHR</span>
              <span className="text-xs font-bold text-sky-700 leading-tight">
                {product.price > 0 ? formatRiel(totalUSD) : 'To be confirmed'}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex gap-2 pt-1 border-t border-slate-100">
          <button 
            onClick={onClose} 
            className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
          >
            Cancel
          </button>
          <button 
            onClick={sendTelegramOrder} 
            className="flex-[2] py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Order to Telegram</span>
          </button>
        </div>

      </div>
    </div>
  );
}

