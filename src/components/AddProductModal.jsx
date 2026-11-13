import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';

const CATEGORIES = [
  'Cleansers', 'Serums', 'Moisturizers', 'Sunscreens', 
  'Masks', 'Shampoo', 'Conditioner', 'Hair Care', 'Accessories'
];

export default function AddProductModal({ isOpen, onClose, onAdd, totalCount }) {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Cleansers');
  const [size, setSize] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [skinType, setSkinType] = useState('All skin types');
  const [ingredients, setIngredients] = useState('');
  const [description, setDescription] = useState('');
  const [howToUse, setHowToUse] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = `SKU-${100 + totalCount + 1}`;
    const newProd = {
      id: newId,
      name: name.trim(),
      category,
      size: size.trim() || 'Standard size',
      price: parseFloat(price) || 0,
      stock: parseInt(stock, 10) || 0,
      skinType: skinType.trim() || 'All skin types',
      ingredients: ingredients ? ingredients.split(',').map(s => s.trim()).filter(Boolean) : ['Active extracts'],
      description: description.trim() || 'Formulated with high-grade skincare actives.',
      howToUse: howToUse.trim() || 'Apply according to instructions.',
      image: image.trim() || 'https://placehold.co/400x300/e2e8f0/64748b?text=Product'
    };

    onAdd(newProd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <PlusCircle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Add New Product</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Product Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. CeraVe Foaming Cleanser"
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 bg-white"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Size / Volume</label>
              <input 
                type="text" 
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="e.g. 50 ml"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Price (USD)</label>
              <input 
                type="number" 
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Initial Stock</label>
              <input 
                type="number" 
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Image Path / URL</label>
            <input 
              type="text" 
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="image/filename.jpg or URL"
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Key Ingredients (comma separated)</label>
            <input 
              type="text" 
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Niacinamide, Hyaluronic Acid, Cica"
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Description</label>
            <textarea 
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product benefits and overview..."
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">How to Use</label>
            <textarea 
              rows="2"
              value={howToUse}
              onChange={(e) => setHowToUse(e.target.value)}
              placeholder="Application instructions..."
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="flex gap-2 pt-2 border-t border-slate-100">
            <button 
              type="button"
              onClick={onClose} 
              className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition"
            >
              Save Product
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

