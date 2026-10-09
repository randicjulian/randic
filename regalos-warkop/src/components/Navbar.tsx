import React from 'react';
import { Coffee, ShoppingBag, Store, User, Wifi, Instagram, MessageCircle, Clock, QrCode } from 'lucide-react';
import { CartItem } from '../types';

interface NavbarProps {
  mode: 'customer' | 'cashier';
  setMode: (mode: 'customer' | 'cashier') => void;
  cartItems: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  selectedTable: string;
  setSelectedTable: (table: string) => void;
  onOpenInfo: () => void;
  onOpenChat: () => void;
  onOpenQrisManagement: () => void;
  orderCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  mode,
  setMode,
  cartItems,
  setIsCartOpen,
  selectedTable,
  setSelectedTable,
  onOpenInfo,
  onOpenChat,
  onOpenQrisManagement,
  orderCount
}) => {
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md text-amber-50 border-b border-amber-900/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setMode('customer')}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-inner border border-amber-500/40">
              <Coffee className="w-6 h-6 sm:w-7 sm:h-7 text-amber-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-2xl tracking-tight text-amber-100 font-['Space_Grotesk']">
                  REGALOS
                </span>
                <span className="text-xs sm:text-sm font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  WARKOP
                </span>
              </div>
              <p className="text-[11px] text-stone-400 hidden sm:flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Buka 08.00 - 02.00 WIB &bull; Nongkrong & Kopi Nikmat
              </p>
            </div>
          </div>

          {/* Center Actions / Mode Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="bg-stone-800/90 p-1 rounded-xl border border-stone-700/60 flex items-center shadow-inner">
              <button
                id="tab-customer-mode"
                onClick={() => setMode('customer')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  mode === 'customer'
                    ? 'bg-amber-700 text-white shadow-md'
                    : 'text-stone-300 hover:text-white hover:bg-stone-700/40'
                }`}
              >
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Menu Tamu</span>
              </button>
              <button
                id="tab-cashier-mode"
                onClick={() => setMode('cashier')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all relative ${
                  mode === 'cashier'
                    ? 'bg-amber-700 text-white shadow-md'
                    : 'text-stone-300 hover:text-white hover:bg-stone-700/40'
                }`}
              >
                <Store className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Kasir POS</span>
                {orderCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-stone-950 font-black rounded-full text-[10px]">
                    {orderCount}
                  </span>
                )}
              </button>
            </div>

            {/* Table Selection in Customer Mode */}
            {mode === 'customer' && (
              <div className="hidden md:flex items-center gap-2 bg-stone-800/90 px-3 py-1.5 rounded-xl border border-stone-700/60">
                <span className="text-xs text-stone-400 font-medium">Meja:</span>
                <select
                  id="navbar-table-select"
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  className="bg-transparent text-amber-300 text-xs sm:text-sm font-bold focus:outline-none cursor-pointer"
                >
                  <option value="Meja 01" className="bg-stone-900 text-stone-100">Meja 01</option>
                  <option value="Meja 02" className="bg-stone-900 text-stone-100">Meja 02</option>
                  <option value="Meja 03" className="bg-stone-900 text-stone-100">Meja 03</option>
                  <option value="Meja 04" className="bg-stone-900 text-stone-100">Meja 04</option>
                  <option value="Meja 05" className="bg-stone-900 text-stone-100">Meja 05</option>
                  <option value="Meja 06" className="bg-stone-900 text-stone-100">Meja 06</option>
                  <option value="Meja 07" className="bg-stone-900 text-stone-100">Meja 07</option>
                  <option value="Outdoor" className="bg-stone-900 text-stone-100">Outdoor LT3 Meja 1</option>
                  <option value="Outdoor" className="bg-stone-900 text-stone-100">Outdoor LT3 Meja 2</option>
                  <option value="Outdoor" className="bg-stone-900 text-stone-100">Outdoor L3 Meja 3</option>
                  <option value="Outdoor" className="bg-stone-900 text-stone-100">Outdoor LT3 Meja 4</option>
                  <option value="TakeAway" className="bg-stone-900 text-stone-100">TakeAway (Bungkus)</option>

                </select>
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* WiFi & Info Trigger */}
            <button
              id="btn-warkop-info"
              onClick={onOpenInfo}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-stone-800/80 hover:bg-stone-700/80 text-amber-200 border border-stone-700/60 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Info Warkop & WiFi"
            >
              <Wifi className="w-4 h-4 text-emerald-400" />
              <span className="hidden lg:inline">WiFi & Info</span>
            </button>

            {/* QRIS Data & Management */}
            <button
              id="btn-nav-qris-data"
              onClick={onOpenQrisManagement}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-red-950/60 hover:bg-red-900/70 text-red-200 border border-red-500/40 transition-all flex items-center gap-1.5 text-xs font-bold"
              title="Akses Data QRIS & Mutasi"
            >
              <QrCode className="w-4 h-4 text-red-400" />
              <span className="hidden lg:inline">Data QRIS</span>
            </button>

            {/* Instagram Official Link */}
            <a
              id="link-instagram"
              href="https://www.instagram.com/regalos.warkop?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-gradient-to-r from-pink-600/20 to-purple-600/20 hover:from-pink-600/30 hover:to-purple-600/30 text-pink-200 border border-pink-500/30 transition-all flex items-center gap-1.5 text-xs font-semibold"
              title="Instagram @regalos.warkop"
            >
              <Instagram className="w-4 h-4 text-pink-400" />
              <span className="hidden sm:inline">@regalos.warkop</span>
            </a>

            {/* Live Chat Trigger */}
            <button
              id="btn-open-live-chat"
              onClick={onOpenChat}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-200 border border-emerald-500/30 transition-all flex items-center gap-1.5 text-xs font-semibold"
              title="Tawk.to Live Chat"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">Live Chat</span>
            </button>

            {/* Cart Button */}
            {mode === 'customer' && (
              <button
                id="btn-open-cart"
                onClick={() => setIsCartOpen(true)}
                className="relative px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold transition-transform active:scale-95 flex items-center gap-2 shadow-md shadow-amber-900/20"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Keranjang</span>
                {totalCartCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-stone-950 text-amber-300 text-xs font-extrabold flex items-center justify-center">
                    {totalCartCount}
                  </span>
                )}
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
