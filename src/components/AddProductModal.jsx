import React, { useState, useRef } from 'react';
import { X, PlusCircle, UploadCloud, Image as ImageIcon, Trash2 } from 'lucide-react';

const CATEGORIES = [
  'Cleansers', 'Toners', 'Serums', 'Moisturizers', 'Sunscreens', 
  'Masks', 'Shampoo', 'Conditioner', 'Hair Care', 'Accessories'
];

export default function AddProductModal({ isOpen, onClose, onAdd, existingProducts = [] }) {
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
  
  // Image handling
  const [imagePreview, setImagePreview] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const resetForm = () => {
    setName('');
    setCategory('Cleansers');
    setSize('');
    setPrice('');
    setStock('10');
    setSkinType('All skin types');
    setIngredients('');
    setDescription('');
    setHowToUse('');
    setImagePreview('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Resize and convert image to lightweight Base64 web-safe string
  const processImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas to resize to max 800px width/height for fast load & low storage
        const canvas = document.createElement('canvas');
        const maxDim = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // JPEG format with 0.82 quality keeps it crisp under ~70KB
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.82);
        setImagePreview(compressedBase64);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Find highest SKU number in database to guarantee a 100% unique ID that never overwrites
    const existingNumbers = existingProducts
      .map(p => {
        const match = p.id && p.id.match(/^SKU-(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(n => !isNaN(n));
    
    const maxNum = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 100;
    const newId = `SKU-${maxNum + 1}`;

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
      image: imagePreview || 'https://placehold.co/400x300/e2e8f0/64748b?text=Product'
    };

    onAdd(newProd);
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <PlusCircle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Add New Product</h3>
          </div>
          <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {/* DRAG AND DROP IMAGE UPLOAD BOX */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Product Photo <span className="text-emerald-600 font-normal">(Drop file or click to browse)</span>
            </label>

            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {imagePreview ? (
              <div className="relative border-2 border-emerald-500/40 rounded-xl p-2 bg-emerald-50/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-14 h-14 object-contain rounded-lg bg-white border border-slate-200" 
                  />
                  <div>
                    <span className="text-xs font-semibold text-emerald-900 block truncate">Photo ready!</span>
                    <span className="text-[10px] text-slate-500">Auto-compressed for fast loading</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setImagePreview('')}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Remove image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                  isDragging 
                    ? 'border-emerald-600 bg-emerald-50 scale-102' 
                    : 'border-slate-300 hover:border-emerald-600 hover:bg-slate-50'
                }`}
              >
                <UploadCloud className={`w-8 h-8 mx-auto mb-1.5 transition ${isDragging ? 'text-emerald-700' : 'text-slate-400'}`} />
                <p className="text-xs font-bold text-slate-700">
                  Drag & Drop image here, or <span className="text-emerald-700 underline">browse</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Supports JPG, PNG, WEBP</p>
              </div>
            )}
          </div>

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
              onClick={handleClose} 
              className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition shadow-xs"
            >
              Save Product
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
