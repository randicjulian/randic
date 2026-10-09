import React, { useState, useMemo } from 'react';
import { Search, Flame, Plus, Check, Coffee, GlassWater, Utensils, Sandwich, Sparkles, MessageSquare } from 'lucide-react';
import { MenuItem, MenuCategory } from '../types';
import { formatRupiah } from '../utils/formatters';
import { playOrderAddedSound } from '../utils/sound';

interface DigitalMenuProps {
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem, notes?: string) => void;
  selectedTable: string;
  setSelectedTable: (table: string) => void;
  onOpenCart: () => void;
}

export const DigitalMenu: React.FC<DigitalMenuProps> = ({
  menuItems,
  onAddToCart,
  selectedTable,
  setSelectedTable,
  onOpenCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [noteModalItem, setNoteModalItem] = useState<MenuItem | null>(null);
  const [itemNote, setItemNote] = useState('');
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  const categories = [
    { id: 'all' as MenuCategory, label: 'Semua Menu', icon: Sparkles },
    { id: 'kopi-panas' as MenuCategory, label: 'Kopi & Hangat', icon: Coffee },
    { id: 'es-segar' as MenuCategory, label: 'Es & Segar', icon: GlassWater },
    { id: 'makanan' as MenuCategory, label: 'Makanan & Indomie', icon: Utensils },
    { id: 'camilan' as MenuCategory, label: 'Roti & Camilan', icon: Sandwich },
  ];

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchCategory && matchSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  const handleQuickAdd = (item: MenuItem) => {
    if (!item.isAvailable) return;
    onAddToCart(item);
    playOrderAddedSound();
    triggerAddedNotice(item.name);
  };

  const handleConfirmWithNote = () => {
    if (noteModalItem) {
      onAddToCart(noteModalItem, itemNote.trim() ? itemNote.trim() : undefined);
      playOrderAddedSound();
      triggerAddedNotice(noteModalItem.name);
      setNoteModalItem(null);
      setItemNote('');
    }
  };

  const triggerAddedNotice = (name: string) => {
    setAddedItemNotice(name);
    setTimeout(() => {
      setAddedItemNotice(null);
    }, 2200);
  };

  return (
    <div className="pb-24 pt-4 sm:pt-6">
      {/* Mini Notification Toast */}
      {addedItemNotice && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-amber-200 px-5 py-2.5 rounded-full shadow-2xl border border-amber-600/40 flex items-center gap-2 text-sm font-semibold animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>"{addedItemNotice}" masuk keranjang!</span>
        </div>
      )}

      {/* Hero Banner Regalos Warkop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-amber-50 p-6 sm:p-8 border border-amber-900/40 shadow-xl">
          {/* Background subtle coffee art watermark */}
          <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none">
            <Coffee className="w-64 h-64 text-amber-300" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 mb-3">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Nongkrong Santai &bull; Kopi Asli &bull; Bayar QRIS Instan</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 font-['Space_Grotesk']">
              Pesan Menu Regalos Warkop Langsung dari Meja Anda
            </h1>
            <p className="text-stone-300 text-xs sm:text-base leading-relaxed mb-4">
              Pilih makanan & minuman favoritmu, bayar mudah dengan scan QRIS atau bayar tunai di kasir. Pesanan langsung diteruskan ke dapur!
            </p>

            {/* Mobile table selector inline */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-2 bg-stone-800/90 px-3 py-2 rounded-xl border border-stone-700">
                <span className="text-xs text-stone-300 font-medium">Posisi Duduk:</span>
                <select
                  id="hero-table-select"
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  className="bg-transparent text-amber-300 text-xs sm:text-sm font-bold focus:outline-none"
                >
                  <option value="Meja 01" className="bg-stone-900">Meja 01</option>
                  <option value="Meja 02" className="bg-stone-900">Meja 02</option>
                  <option value="Meja 03" className="bg-stone-900">Meja 03</option>
                  <option value="Meja 04" className="bg-stone-900">Meja 04</option>
                  <option value="Meja 05" className="bg-stone-900">Meja 05</option>
                  <option value="Meja 06" className="bg-stone-900">Meja 06</option>
                  <option value="Meja 07" className="bg-stone-900">Meja 07</option>
                  <option value="Lesehan A" className="bg-stone-900">Lesehan A</option>
                  <option value="Lesehan B" className="bg-stone-900">Lesehan B</option>
                  <option value="Area Bar" className="bg-stone-900">Area Bar</option>
                  <option value="Takeaway" className="bg-stone-900">Bungkus (Takeaway)</option>
                </select>
              </div>

              <a
                href="https://www.instagram.com/regalos.warkop?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-pink-600/30 hover:bg-pink-600/40 text-pink-200 text-xs font-semibold border border-pink-500/40 transition-colors"
              >
                <span>Follow IG @regalos.warkop</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`cat-btn-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-amber-800 text-white shadow-md shadow-amber-900/30'
                      : 'bg-stone-800/10 hover:bg-stone-800/20 text-stone-700 border border-stone-300/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-200' : 'text-stone-500'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px] sm:min-w-[280px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              id="menu-search-input"
              type="text"
              placeholder="Cari kopi, indomie, roti bakar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-800 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700/50 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-300 p-8">
            <Coffee className="w-12 h-12 text-stone-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-stone-700">Menu tidak ditemukan</h3>
            <p className="text-sm text-stone-500 mt-1">Coba gunakan kata kunci lain atau pilih kategori lain.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-amber-800 text-white text-xs font-semibold rounded-lg hover:bg-amber-900"
            >
              Tampilkan Semua Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                id={`menu-card-${item.id}`}
                className={`group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                  !item.isAvailable ? 'opacity-60 grayscale-[0.5]' : ''
                }`}
              >
                {/* Image Section */}
                <div className="relative h-44 sm:h-48 overflow-hidden bg-stone-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {item.isPopular && item.isAvailable && (
                      <span className="px-2.5 py-1 bg-amber-600/90 backdrop-blur-sm text-white text-[11px] font-bold rounded-lg shadow-sm flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-200" />
                        Favorit
                      </span>
                    )}
                    {!item.isAvailable && (
                      <span className="px-2.5 py-1 bg-red-700 text-white text-[11px] font-bold rounded-lg shadow-sm">
                        Habis / Sold Out
                      </span>
                    )}
                  </div>

                  {item.tags && item.tags.length > 0 && item.isAvailable && (
                    <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                      {item.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-stone-900/80 backdrop-blur-sm text-stone-200 text-[10px] font-medium rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-stone-900 text-base group-hover:text-amber-900 transition-colors">
                        {item.name}
                      </h3>
                    </div>
                    <p className="text-stone-500 text-xs line-clamp-2 mb-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-stone-400 font-medium block">Harga</span>
                      <span className="text-base sm:text-lg font-black text-amber-900">
                        {formatRupiah(item.price)}
                      </span>
                    </div>

                    {item.isAvailable ? (
                      <div className="flex items-center gap-1.5">
                        {/* Custom note button */}
                        <button
                          id={`btn-note-${item.id}`}
                          onClick={() => {
                            setNoteModalItem(item);
                            setItemNote('');
                          }}
                          className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                          title="Tambah Catatan (misal: pedas, gula sedikit)"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        
                        {/* Add button */}
                        <button
                          id={`btn-add-${item.id}`}
                          onClick={() => handleQuickAdd(item)}
                          className="px-3 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Pesan</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-stone-400 italic">
                        Stok Kosong
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Note Customization Modal */}
      {noteModalItem && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-bold text-lg text-stone-900 mb-1">
              Catatan Khusus untuk {noteModalItem.name}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Contoh: "Gula sedikit", "Jangan pedas", "Es batu dipisah", "Indomie kuah kental ya bang".
            </p>

            <textarea
              id="input-item-note"
              value={itemNote}
              onChange={(e) => setItemNote(e.target.value)}
              placeholder="Tulis request kamu di sini..."
              rows={3}
              className="w-full p-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800 mb-4"
              autoFocus
            />

            <div className="flex items-center justify-end gap-2">
              <button
                id="btn-cancel-note"
                onClick={() => setNoteModalItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
              >
                Batal
              </button>
              <button
                id="btn-save-note"
                onClick={handleConfirmWithNote}
                className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold shadow-md"
              >
                Tambahkan ke Pesanan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
