'use client';

import { useState } from 'react';
import Link from 'next/link';

const categories = ['Semua', 'Padi & Beras', 'Jagung', 'Kedelai', 'Cabai', 'Bawang', 'Singkong'];

const products = [
  {
    id: 1,
    name: 'Beras Premium Pandan Wangi',
    origin: 'Karawang, Jawa Barat',
    farmer: 'Koperasi Tani Subur',
    category: 'Padi & Beras',
    price: 12500,
    unit: 'kg',
    minOrder: 1000,
    stock: 45000,
    rating: 4.9,
    reviews: 128,
    certified: true,
    weight: 1,
    tags: ['Organik', 'Premium'],
    co2Saved: 2.4,
    badge: 'Terlaris',
    badgeColor: 'emerald',
  },
  {
    id: 2,
    name: 'Jagung Hibrida Pipilan Kering',
    origin: 'Kediri, Jawa Timur',
    farmer: 'Gapoktan Makmur Sejati',
    category: 'Jagung',
    price: 4800,
    unit: 'kg',
    minOrder: 2000,
    stock: 120000,
    rating: 4.7,
    reviews: 94,
    certified: true,
    weight: 1,
    tags: ['Non-GMO', 'Kering'],
    co2Saved: 1.8,
    badge: 'Stok Besar',
    badgeColor: 'blue',
  },
  {
    id: 3,
    name: 'Kedelai Lokal Grade A',
    origin: 'Grobogan, Jawa Tengah',
    farmer: 'UD. Sumber Rejeki',
    category: 'Kedelai',
    price: 9200,
    unit: 'kg',
    minOrder: 500,
    stock: 18000,
    rating: 4.8,
    reviews: 57,
    certified: false,
    weight: 1,
    tags: ['Lokal', 'Grade A'],
    co2Saved: 3.1,
    badge: 'ESG Pick',
    badgeColor: 'teal',
  },
  {
    id: 4,
    name: 'Cabai Merah Keriting',
    origin: 'Temanggung, Jawa Tengah',
    farmer: 'Kelompok Tani Maju Bersama',
    category: 'Cabai',
    price: 28000,
    unit: 'kg',
    minOrder: 200,
    stock: 5500,
    rating: 4.6,
    reviews: 43,
    certified: true,
    weight: 1,
    tags: ['Segar', 'Langsung Petani'],
    co2Saved: 0.9,
    badge: 'Flash Deal',
    badgeColor: 'red',
  },
  {
    id: 5,
    name: 'Bawang Merah Brebes',
    origin: 'Brebes, Jawa Tengah',
    farmer: 'Koperasi Sumber Agung',
    category: 'Bawang',
    price: 18500,
    unit: 'kg',
    minOrder: 500,
    stock: 32000,
    rating: 4.9,
    reviews: 201,
    certified: true,
    weight: 1,
    tags: ['GI Certified', 'Premium'],
    co2Saved: 1.5,
    badge: 'Indikasi Geografis',
    badgeColor: 'purple',
  },
  {
    id: 6,
    name: 'Singkong Kering Chips',
    origin: 'Lampung Tengah, Lampung',
    farmer: 'PT Cassava Nusantara',
    category: 'Singkong',
    price: 3200,
    unit: 'kg',
    minOrder: 3000,
    stock: 200000,
    rating: 4.5,
    reviews: 38,
    certified: false,
    weight: 1,
    tags: ['Olahan', 'Ekspor Ready'],
    co2Saved: 2.0,
    badge: 'Ekspor',
    badgeColor: 'amber',
  },
];

const badgeStyles = {
  emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  blue: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  teal: 'bg-teal-500/15 text-teal-400 border-teal-500/20',
  red: 'bg-red-500/15 text-red-400 border-red-500/20',
  purple: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  amber: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
};

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3 h-3 ${star <= Math.round(rating) ? 'text-amber-400' : 'text-slate-700'}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function ProductCard({ product, onAddToCart }) {
  const [qty, setQty] = useState(product.minOrder);

  return (
    <div className="group relative bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all duration-300 hover:shadow-[0_0_30px_-8px_rgba(16,185,129,0.2)]">
      {/* Top badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${badgeStyles[product.badgeColor]}`}>
          {product.badge}
        </span>
      </div>

      {/* CO2 pill */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-teal-500/10 border border-teal-500/20 rounded-full px-2 py-0.5">
        <svg className="w-3 h-3 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064" />
        </svg>
        <span className="text-xs text-teal-400 font-medium">-{product.co2Saved}kg CO₂</span>
      </div>

      {/* Product visual */}
      <div className="h-36 bg-gradient-to-br from-emerald-950/60 to-slate-900/80 flex items-center justify-center border-b border-white/5">
        <div className="text-6xl select-none opacity-80">
          {product.category === 'Padi & Beras' && '🌾'}
          {product.category === 'Jagung' && '🌽'}
          {product.category === 'Kedelai' && '🫘'}
          {product.category === 'Cabai' && '🌶️'}
          {product.category === 'Bawang' && '🧅'}
          {product.category === 'Singkong' && '🥔'}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-slate-100 text-sm leading-snug">{product.name}</h3>
          {product.certified && (
            <svg className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          )}
        </div>

        <p className="text-xs text-slate-500 mb-1">{product.farmer}</p>
        <div className="flex items-center gap-1 mb-3">
          <svg className="w-3 h-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span className="text-xs text-slate-500">{product.origin}</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={product.rating} />
          <span className="text-xs text-amber-400 font-medium">{product.rating}</span>
          <span className="text-xs text-slate-600">({product.reviews})</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {product.tags.map((tag) => (
            <span key={tag} className="text-xs bg-slate-800 text-slate-400 rounded px-1.5 py-0.5">{tag}</span>
          ))}
        </div>

        <div className="border-t border-white/5 pt-3">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-lg font-bold text-emerald-400">
                Rp {product.price.toLocaleString('id-ID')}
              </p>
              <p className="text-xs text-slate-500">per {product.unit} · min. {product.minOrder.toLocaleString('id-ID')} {product.unit}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Stok</p>
              <p className="text-sm font-semibold text-slate-300">{(product.stock / 1000).toFixed(0)}t</p>
            </div>
          </div>

          {/* Qty input */}
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => setQty(Math.max(product.minOrder, qty - product.minOrder))}
              className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition flex items-center justify-center text-sm font-bold"
            >−</button>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(Math.max(product.minOrder, parseInt(e.target.value) || product.minOrder))}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg text-center text-sm text-slate-200 py-1 focus:outline-none focus:border-emerald-500/50"
            />
            <button
              onClick={() => setQty(qty + product.minOrder)}
              className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition flex items-center justify-center text-sm font-bold"
            >+</button>
            <span className="text-xs text-slate-600">{product.unit}</span>
          </div>

          <button
            onClick={() => onAddToCart({ ...product, qty })}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold py-2 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Tambah ke Pesanan
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [sortBy, setSortBy] = useState('terlaris');
  const [cart, setCart] = useState([]);
  const [showCartNotif, setShowCartNotif] = useState(false);

  const filtered = products.filter(
    (p) => activeCategory === 'Semua' || p.category === activeCategory
  );

  const handleAddToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + item.qty } : c);
      return [...prev, item];
    });
    setShowCartNotif(true);
    setTimeout(() => setShowCartNotif(false), 2500);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartItems = cart.reduce((sum, item) => sum + 1, 0);

  return (
    <div className="p-4 lg:p-8">
      {/* Cart toast */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${showCartNotif ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <div className="flex items-center gap-3 bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-xl">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-semibold">Produk ditambahkan ke pesanan!</span>
        </div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Katalog Komoditas</h1>
            <p className="text-slate-500 text-sm mt-0.5">Sumber langsung dari petani terverifikasi di seluruh Indonesia</p>
          </div>
          {/* Cart summary */}
          {cart.length > 0 && (
            <Link href="/pembeli/checkout" className="flex items-center gap-3 bg-white/5 border border-white/10 hover:border-emerald-500/30 rounded-xl px-4 py-2.5 transition group">
              <div className="relative">
                <svg className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center font-bold">{cartItems}</span>
              </div>
              <div>
                <p className="text-xs text-slate-500">Total Pesanan</p>
                <p className="text-sm font-bold text-emerald-400">Rp {cartTotal.toLocaleString('id-ID')}</p>
              </div>
              <svg className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Komoditas Aktif', value: '1.240+', icon: '📦' },
          { label: 'Petani Mitra', value: '8.300+', icon: '👨‍🌾' },
          { label: 'Transaksi Bulan Ini', value: 'Rp 42M', icon: '💰' },
          { label: 'CO₂ Dihemat', value: '18.4t', icon: '🌿' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-2xl">{stat.icon}</span>
            <div>
              <p className="text-base font-bold text-slate-100">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-1 flex-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                activeCategory === cat
                  ? 'bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                  : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/8 border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white/5 border border-white/10 text-slate-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500/50 min-w-[150px]"
        >
          <option value="terlaris">Terlaris</option>
          <option value="harga-asc">Harga Terendah</option>
          <option value="harga-desc">Harga Tertinggi</option>
          <option value="co2">Emisi Terendah</option>
        </select>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
        ))}
      </div>

      {/* Load more */}
      <div className="mt-8 flex justify-center">
        <button className="px-6 py-2.5 bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/8 rounded-xl text-sm font-medium transition">
          Muat Lebih Banyak
        </button>
      </div>
    </div>
  );
}
