import React, { useState, useEffect } from 'react';
import initialProductsData from './data/products.json';
import Navbar from './components/Navbar.jsx';
import ProductCard from './components/ProductCard.jsx';
import ProductDetailModal from './components/ProductDetailModal.jsx';
import CartModal from './components/CartModal.jsx';
import AdminDrawer from './components/AdminDrawer.jsx';
import AuthModal from './components/AuthModal.jsx';
import AddProductModal from './components/AddProductModal.jsx';
import EditProductModal from './components/EditProductModal.jsx';
import { 
  SESSION_KEY_AUTH, 
  SESSION_KEY_LAST_ACTIVE, 
  SESSION_TIMEOUT_MS 
} from './utils.js';
import { db } from './firebase.js';
import { 
  collection, onSnapshot, doc, updateDoc, 
  deleteDoc, setDoc, writeBatch, getDocs 
} from 'firebase/firestore';
import { 
  Search, SlidersHorizontal, MapPin, PhoneCall, 
  Share2, KeyRound, Droplets, ShoppingBag, ShoppingCart,
  Sun, Moon 
} from 'lucide-react';

const CATEGORIES = [
  'All', 'Cleansers', 'Serums', 'Moisturizers', 
  'Sunscreens', 'Masks', 'Shampoo', 'Conditioner', 
  'Hair Care', 'Accessories'
];

const CONCERNS = [
  { id: 'All', label: 'All Concerns' },
  { id: 'Barrier', label: 'Barrier Repair' },
  { id: 'Acne', label: 'Acne & Pore Control' },
  { id: 'Hydration', label: 'Deep Hydration' },
  { id: 'Sun', label: 'UV Protection' }
];

export default function App() {
  const [products, setProducts] = useState(initialProductsData);

  // Dark mode state with persistence
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('WellyandCarey_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('WellyandCarey_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('WellyandCarey_theme', 'light');
    }
  }, [darkMode]);

  // Cart State (Persisted in localStorage so customer doesn't lose their cart)
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('WellyandCarey_cart_items');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('WellyandCarey_cart_items', JSON.stringify(cart));
    } catch (e) {
      console.error("Cart save error", e);
    }
  }, [cart]);

  // Cart actions
  const handleAddToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock || 99) } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    notify(`Added "${product.name}" to cart`);
  };

  const handleUpdateCartQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const nextQty = item.quantity + delta;
        return nextQty > 0 ? { ...item, quantity: nextQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const handleRemoveFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
    notify("Cart cleared");
  };

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedConcern, setSelectedConcern] = useState('All');

  // Modal states
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);

  // Admin states
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState('');

  const notify = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2500);
  };

  // REAL-TIME FIRESTORE SYNCHRONIZATION
  useEffect(() => {
    const productsCol = collection(db, 'products');

    const checkAndSeed = async () => {
      try {
        const snapshot = await getDocs(productsCol);
        if (snapshot.empty) {
          const batch = writeBatch(db);
          for (const p of initialProductsData) {
            const pRef = doc(db, 'products', p.id);
            batch.set(pRef, p);
          }
          await batch.commit();
        }
      } catch (err) {
        console.warn("Firestore notice:", err.message);
      }
    };

    checkAndSeed();

    const unsubscribe = onSnapshot(productsCol, (snapshot) => {
      if (!snapshot.empty) {
        const remoteProducts = [];
        snapshot.forEach((doc) => {
          remoteProducts.push({ ...doc.data(), id: doc.id });
        });
        setProducts(remoteProducts);
      }
    }, (error) => {
      console.warn("Firestore listener notice:", error.message);
    });

    return () => unsubscribe();
  }, []);

  // Validate admin session
  useEffect(() => {
    const checkSession = () => {
      if (sessionStorage.getItem(SESSION_KEY_AUTH) === 'active') {
        const last = parseInt(sessionStorage.getItem(SESSION_KEY_LAST_ACTIVE) || '0', 10);
        if (Date.now() - last > SESSION_TIMEOUT_MS) {
          setIsAdmin(false);
          sessionStorage.removeItem(SESSION_KEY_AUTH);
          setIsDrawerOpen(false);
        } else {
          setIsAdmin(true);
          sessionStorage.setItem(SESSION_KEY_LAST_ACTIVE, Date.now().toString());
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAdminSuccess = () => {
    setIsAdmin(true);
    sessionStorage.setItem(SESSION_KEY_AUTH, 'active');
    sessionStorage.setItem(SESSION_KEY_LAST_ACTIVE, Date.now().toString());
    setIsDrawerOpen(true);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem(SESSION_KEY_AUTH);
    sessionStorage.removeItem(SESSION_KEY_LAST_ACTIVE);
    setIsDrawerOpen(false);
    notify("Logged out successfully");
  };

  // REAL-TIME STOCK UPDATE
  const handleUpdateStock = async (id, delta) => {
    const p = products.find(x => x.id === id);
    if (!p) return;
    const newStock = Math.max(0, p.stock + delta);

    setProducts(prev => prev.map(item => item.id === id ? { ...item, stock: newStock } : item));

    try {
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, { stock: newStock });
      notify("Stock synced to cloud");
    } catch {
      notify("Stock updated locally");
    }
  };

  // REAL-TIME PRODUCT DELETE
  const handleDeleteProduct = async (id) => {
    const p = products.find(x => x.id === id);
    if (!p) return;

    setProducts(prev => prev.filter(x => x.id !== id));

    try {
      await deleteDoc(doc(db, 'products', id));
      notify(`Deleted "${p.name}" from cloud`);
    } catch {
      notify(`Deleted "${p.name}"`);
    }
  };

  // REAL-TIME PRODUCT ADD
  const handleAddProduct = async (newProd) => {
    setProducts(prev => [newProd, ...prev]);

    try {
      const docRef = doc(db, 'products', newProd.id);
      await setDoc(docRef, newProd);
      notify(`Added "${newProd.name}" to cloud database`);
    } catch {
      notify(`Added "${newProd.name}" locally`);
    }
  };

  // REAL-TIME PRODUCT EDIT
  const handleSaveEditedProduct = async (updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));

    try {
      const docRef = doc(db, 'products', updatedProduct.id);
      await setDoc(docRef, updatedProduct, { merge: true });
      notify(`Updated "${updatedProduct.name}" in cloud database`);
    } catch {
      notify(`Updated "${updatedProduct.name}" locally`);
    }
  };

  // Filtering Logic
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;

    let matchesConcern = true;
    const textCorpus = `${p.name} ${(p.ingredients || []).join(' ')} ${p.description} ${p.skinType || ''}`.toLowerCase();
    
    if (selectedConcern === 'Barrier') {
      matchesConcern = textCorpus.includes('barrier') || textCorpus.includes('ceramide') || textCorpus.includes('centella');
    } else if (selectedConcern === 'Acne') {
      matchesConcern = textCorpus.includes('acne') || textCorpus.includes('pore') || textCorpus.includes('blackhead') || textCorpus.includes('niacinamide') || textCorpus.includes('bha');
    } else if (selectedConcern === 'Hydration') {
      matchesConcern = textCorpus.includes('hydrat') || textCorpus.includes('hyaluronic');
    } else if (selectedConcern === 'Sun') {
      matchesConcern = p.category === 'Sunscreens' || textCorpus.includes('spf') || textCorpus.includes('uv');
    }

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      p.name.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) || 
      (p.ingredients && p.ingredients.some(i => i.toLowerCase().includes(q)));

    return matchesCat && matchesConcern && matchesSearch;
  });

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSelectedConcern('All');
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      
      {/* TOP BAR WITH CART BUTTON */}
      <Navbar 
        onReset={resetAllFilters} 
        cartCount={totalCartCount} 
        onOpenCart={() => setIsCartOpen(true)} 
      />

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 w-full flex-1">
        
        {/* Banner */}
        <div className="mb-6 p-6 rounded-2xl bg-emerald-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Best Skincare</h1>
            <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-xl">
              Great choice, Great quality, Great results. Add items to your cart and order together in one message.
            </p>
          </div>
          <div className="text-xs text-emerald-100 border border-emerald-800 bg-emerald-900/60 px-3.5 py-1.5 rounded-lg flex items-center gap-2">
            <Droplets className="w-4 h-4 text-emerald-300" />
            <span>Better ingredients</span>
          </div>
        </div>

        {/* SEARCH & CATEGORY TOOLBAR */}
        <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs mb-6 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between transition-colors">
          
          {/* Live Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skincare by name, brand, or ingredients..." 
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition shrink-0 ${
                  selectedCategory === cat 
                    ? 'bg-emerald-900 dark:bg-emerald-700 text-white font-semibold' 
                    : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* SKIN CONCERN QUICK FILTER PILLS */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 text-xs">
          <span className="text-slate-400 dark:text-slate-500 font-semibold text-[11px] uppercase tracking-wider shrink-0 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Concern:
          </span>
          {CONCERNS.map(concern => (
            <button
              key={concern.id}
              onClick={() => setSelectedConcern(concern.id)}
              className={`px-2.5 py-1 rounded-full font-medium border transition shrink-0 ${
                selectedConcern === concern.id
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 font-semibold'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {concern.label}
            </button>
          ))}
        </div>

        {/* PRODUCT GRID */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onSelect={setSelectedProductDetail}
                onAddToCart={handleAddToCart}
                isInCart={cart.some(item => item.id === product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 p-6">
            <ShoppingBag className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2 mx-auto" />
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 text-base">No products found</h3>
            <p className="text-xs text-slate-400 mt-1">Try typing a different name or choosing another category.</p>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="mt-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-8">
          <div className="max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Contact Us</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Have any questions about our products, orders, or stock? Reach out to our team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80">
            {/* Address */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Address</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Street 271, Sangkat Steung Meanchey, Ou Bek K'om, Phnom Penh, Cambodia
                </p>
              </div>
            </div>

            {/* Phone & Email */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div className="space-y-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Phone</h4>
                  <a href="tel:+855762226921" className="text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-emerald-700 dark:hover:text-emerald-400 block mt-0.5">
                    (+855) 0762226921
                  </a>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Email</h4>
                  <a href="mailto:Bothlina3@gmail.com" className="text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-emerald-700 dark:hover:text-emerald-400 block mt-0.5">
                    Bothlina3@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Socials */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900">
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Connect With Us</h4>
                <div className="flex flex-col gap-1.5 mt-1.5">
                  <a href="https://web.facebook.com/linnaboth" target="_blank" rel="noopener noreferrer" 
                     className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-blue-500 transition">
                    Facebook
                  </a>
                  <a href="https://t.me/linnaboth" target="_blank" rel="noopener noreferrer" 
                     className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-sky-400 transition">
                    Telegram (@linnaboth)
                  </a>
                  <a href="https://www.instagram.com/linnaboth" target="_blank" rel="noopener noreferrer" 
                     className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-pink-400 transition">
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-bar */}
        <div className="border-t border-slate-100 dark:border-slate-800 py-6">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800 dark:text-slate-300">WellyandCarey</span>
              <span>•</span>
              <span>ENJOY THE PRODUCTS</span>
            </div>
            <span>Phnom Penh, Cambodia</span>
          </div>
        </div>
      </footer>

      {/* FLOATING ACTION BUTTONS */}
      {/* 1. Floating Cart Pill (Bottom Right) */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>View Cart ({totalCartCount})</span>
          </button>
        </div>
      )}

      {/* 2. Bottom Left Controls: Dark Mode Toggle & Owner Key */}
      <div className="fixed bottom-6 left-6 z-40 flex flex-col items-center gap-2.5">
        
        {/* Dark Mode Toggle (Upper the admin key) */}
        <div className="relative group">
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle Dark Mode"
            className="w-10 h-10 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-md"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400 animate-in zoom-in-75 duration-200" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 animate-in zoom-in-75 duration-200" />
            )}
          </button>
          <div className="absolute left-12 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-medium px-2.5 py-1 rounded shadow-lg border border-slate-700/50">
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </div>
        </div>

        {/* Owner Access Key */}
        <div className="relative group">
          <button 
            onClick={() => {
              if (isAdmin) setIsDrawerOpen(true);
              else setIsAuthOpen(true);
            }}
            aria-label="Owner Access" 
            className="w-10 h-10 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-md"
          >
            <KeyRound className="w-4 h-4" />
          </button>
          <div className="absolute left-12 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-medium px-2.5 py-1 rounded shadow-lg border border-slate-700/50">
            Owner Access
          </div>
        </div>

      </div>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toastMessage}
        </div>
      )}

      {/* MODALS */}
      <ProductDetailModal 
        product={selectedProductDetail} 
        onClose={() => setSelectedProductDetail(null)}
        onAddToCart={handleAddToCart}
      />

      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      <AdminDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        products={products}
        onUpdateStock={handleUpdateStock}
        onDeleteProduct={handleDeleteProduct}
        onOpenAddModal={() => setIsAddProductOpen(true)}
        onEditProduct={(prod) => setEditingProduct(prod)}
        onLogout={handleLogout}
        onNotify={notify}
      />

      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAdminSuccess}
        onNotify={notify}
      />

      <AddProductModal 
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onAdd={handleAddProduct}
        totalCount={products.length}
      />

      <EditProductModal 
        isOpen={!!editingProduct}
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onSave={handleSaveEditedProduct}
      />

    </div>
  );
}
