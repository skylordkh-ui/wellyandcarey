import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, Send, ArrowRight } from 'lucide-react';
import { formatRiel, TELEGRAM_USERNAME } from '../utils.js';

export default function CartModal({ isOpen, onClose, cart, onUpdateQuantity, onRemoveFromCart, onClearCart }) {
  if (!isOpen) return null;

  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalUSD = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalKHR = formatRiel(totalUSD);

  const handleSendTelegramOrder = () => {
    if (cart.length === 0) return;

    let itemsText = cart.map((item, index) => {
      const lineTotal = item.price > 0 ? `$${(item.price * item.quantity).toFixed(2)}` : 'Inquiry';
      const unitText = item.price > 0 ? `$${item.price.toFixed(2)}` : 'Inquiry';
      return `${index + 1}. ${item.name} (${item.size})\n   • Qty: ${item.quantity} × ${unitText} = ${lineTotal}\n   • SKU: ${item.id}`;
    }).join('\n\n');

    const message = 
`Hello WellyandCarey Skincare! 👋
I would like to place an order for the following items:

${itemsText}

---------------------------------
📦 Total Items: ${totalItemsCount}
💵 Grand Total: $${totalUSD.toFixed(2)} (≈ ${totalKHR})
---------------------------------

Please confirm product availability and delivery details in Phnom Penh. Thank you!`;

    window.open(`https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">Your Shopping Cart</h3>
              <p className="text-xs text-slate-500">
                {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} ready for Telegram order
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto py-3 divide-y divide-slate-100">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <h4 className="font-semibold text-slate-700 text-sm">Your cart is empty</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Explore our catalog and click "Add to Cart" to build your order!
              </p>
              <button 
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
              >
                Browse Products
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="py-3 flex items-center gap-3">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-14 h-14 rounded-lg object-contain bg-slate-50 border border-slate-200 p-1 shrink-0"
                  onError={(e) => { e.currentTarget.src = 'https://placehold.co/80x80/e2e8f0/64748b?text=Item'; }}
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate" title={item.name}>
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {item.size} &bull; {item.price > 0 ? `$${item.price.toFixed(2)}` : 'Inquiry'}
                  </p>
                  <p className="text-xs font-semibold text-emerald-800 mt-0.5">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 border border-slate-200 shrink-0">
                  <button 
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="w-6 h-6 rounded bg-white hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs transition"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-7 text-center font-bold text-xs text-slate-900">
                    {item.quantity}
                  </span>
                  <button 
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="w-6 h-6 rounded bg-white hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs transition"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Delete Item */}
                <button 
                  onClick={() => onRemoveFromCart(item.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition shrink-0"
                  title="Remove from cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer & Calculations */}
        {cart.length > 0 && (
          <div className="pt-3.5 border-t border-slate-100 space-y-3">
            
            {/* Calculation Summary Box */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Amount</span>
                <span className="text-xl font-bold text-slate-900 leading-tight block">
                  ${totalUSD.toFixed(2)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Approx. KHR</span>
                <span className="text-xs font-bold text-emerald-800 leading-tight">
                  {totalKHR}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button 
                onClick={onClearCart} 
                className="py-2.5 px-3 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 rounded-xl text-xs font-semibold transition"
                title="Clear all items"
              >
                Clear Cart
              </button>
              <button 
                onClick={handleSendTelegramOrder}
                className="flex-1 py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 transition shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Order via Telegram</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

