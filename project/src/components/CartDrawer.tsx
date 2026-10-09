import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, QrCode, Banknote, Coffee, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CartItem, PaymentMethod } from '../types';
import { formatRupiah } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  selectedTable: string;
  setSelectedTable: (table: string) => void;
  onCheckout: (details: {
    customerName: string;
    tableNumber: string;
    orderType: 'DINE_IN' | 'TAKEAWAY';
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  selectedTable,
  setSelectedTable,
  onCheckout,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [orderType, setOrderType] = useState<'DINE_IN' | 'TAKEAWAY'>('DINE_IN');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('QRIS');
  const [orderNotes, setOrderNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.item.price * item.quantity, 0);
  const totalAmount = subtotal; // Warkop no hidden service tax, clean transparent pricing

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (!customerName.trim()) {
      setErrorMsg('Harap isi nama pemesan!');
      return;
    }

    setErrorMsg('');
    onCheckout({
      customerName: customerName.trim(),
      tableNumber: orderType === 'TAKEAWAY' ? 'Takeaway' : selectedTable,
      orderType,
      paymentMethod,
      notes: orderNotes.trim() ? orderNotes.trim() : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-50 border-l border-stone-200 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-5 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-600/30 text-amber-300">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold font-['Space_Grotesk'] text-white">
                  Pesanan Saya
                </h2>
                <p className="text-xs text-stone-400">Regalos Warkop</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cartItems.length > 0 && (
                <button
                  id="btn-clear-cart"
                  onClick={onClearCart}
                  className="text-xs text-stone-400 hover:text-red-400 transition-colors p-1"
                  title="Kosongkan Keranjang"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                id="btn-close-cart"
                onClick={onClose}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Body */}
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 mb-4">
                <Coffee className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-stone-800">Keranjang Masih Kosong</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-xs">
                Yuk pilih kopi tubruk, kopi susu aren, indomie, atau roti bakar favoritmu di menu.
              </p>
              <button
                id="btn-start-ordering"
                onClick={onClose}
                className="mt-5 px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shadow-md"
              >
                Lihat Menu
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              
              {/* Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider">
                  <span>Daftar Menu ({cartItems.length})</span>
                  <span>Subtotal</span>
                </div>

                {cartItems.map((cartItem) => (
                  <div
                    key={cartItem.item.id}
                    id={`cart-item-${cartItem.item.id}`}
                    className="p-3 bg-white rounded-xl border border-stone-200 shadow-sm flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={cartItem.item.image}
                          alt={cartItem.item.name}
                          className="w-12 h-12 rounded-lg object-cover bg-stone-100 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-stone-900">{cartItem.item.name}</h4>
                          <span className="text-xs text-stone-500">
                            {formatRupiah(cartItem.item.price)}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-amber-900">
                        {formatRupiah(cartItem.item.price * cartItem.quantity)}
                      </span>
                    </div>

                    {cartItem.notes && (
                      <div className="text-[11px] bg-amber-50 text-amber-900 px-2 py-1 rounded-md border border-amber-200/60 flex items-center gap-1">
                        <span className="font-semibold">Catatan:</span>
                        <span>{cartItem.notes}</span>
                      </div>
                    )}

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                      <button
                        onClick={() => onRemoveItem(cartItem.item.id)}
                        className="text-[11px] text-red-600 hover:text-red-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>

                      <div className="flex items-center gap-2 bg-stone-100 rounded-lg p-1">
                        <button
                          onClick={() => onUpdateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                          className="w-6 h-6 rounded bg-white flex items-center justify-center text-stone-700 hover:bg-stone-200 shadow-xs text-xs font-bold"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-stone-800 px-1 min-w-4 text-center">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                          className="w-6 h-6 rounded bg-white flex items-center justify-center text-stone-700 hover:bg-stone-200 shadow-xs text-xs font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Details Form */}
              <form onSubmit={handleSubmitOrder} className="pt-2 space-y-4">
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Informasi Meja & Pemesan
                  </h3>

                  {/* Customer Name */}
                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">
                      Nama Pemesan <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="cart-customer-name"
                      type="text"
                      required
                      placeholder="Masukkan nama Anda (cth: Mas Budi)"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-800"
                    />
                  </div>

                  {/* Order Type */}
                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">
                      Tipe Pesanan
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setOrderType('DINE_IN')}
                        className={`py-2 px-3 rounded-lg text-xs font-bold border text-center transition-all ${
                          orderType === 'DINE_IN'
                            ? 'bg-amber-800 text-white border-amber-800'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        Makan / Minum di Sini
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderType('TAKEAWAY')}
                        className={`py-2 px-3 rounded-lg text-xs font-bold border text-center transition-all ${
                          orderType === 'TAKEAWAY'
                            ? 'bg-amber-800 text-white border-amber-800'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        Bungkus (Takeaway)
                      </button>
                    </div>
                  </div>

                  {/* Table Selection if DINE_IN */}
                  {orderType === 'DINE_IN' && (
                    <div>
                      <label className="block text-xs font-bold text-stone-600 mb-1">
                        Nomor Meja Anda
                      </label>
                      <select
                        id="cart-table-select"
                        value={selectedTable}
                        onChange={(e) => setSelectedTable(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-800 bg-white"
                      >
                        <option value="Meja 01">Meja 01 (Indoor LT1)</option>
                        <option value="Meja 02">Meja 02 (Indoor LT1)</option>
                        <option value="Meja 03">Meja 03 (Indoor LT1)</option>
                        <option value="Meja 04">Meja 04 (Indoor LT1)</option>
                        <option value="Meja 05">Meja 05 (Indoor LT1)</option>
                        <option value="Meja 06">Meja 06 (Indoor LT1)</option>
                        <option value="Meja 07">Meja 07 (Indoor LT1)</option>
                        <option value="Lesehan A">Lesehan A</option>
                        <option value="Lesehan B">Lesehan B</option>
                        <option value="Area Bar">Area Bar</option>
                      </select>
                    </div>
                  )}

                  {/* Payment Method Selector */}
                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1.5">
                      Metode Pembayaran
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        id="pay-opt-qris"
                        onClick={() => setPaymentMethod('QRIS')}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                          paymentMethod === 'QRIS'
                            ? 'border-amber-700 bg-amber-50/80 ring-2 ring-amber-700/20'
                            : 'border-stone-200 bg-white hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900">
                            <QrCode className="w-4 h-4 text-amber-700" />
                            <span>QRIS Instan</span>
                          </div>
                          {paymentMethod === 'QRIS' && (
                            <CheckCircle2 className="w-4 h-4 text-amber-700" />
                          )}
                        </div>
                        <span className="text-[10px] text-stone-500">
                          BCA, GoPay, OVO, Dana, ShopeePay
                        </span>
                      </button>

                      <button
                        type="button"
                        id="pay-opt-cash"
                        onClick={() => setPaymentMethod('TUNAI')}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                          paymentMethod === 'TUNAI'
                            ? 'border-amber-700 bg-amber-50/80 ring-2 ring-amber-700/20'
                            : 'border-stone-200 bg-white hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900">
                            <Banknote className="w-4 h-4 text-emerald-700" />
                            <span>Tunai di Kasir</span>
                          </div>
                          {paymentMethod === 'TUNAI' && (
                            <CheckCircle2 className="w-4 h-4 text-amber-700" />
                          )}
                        </div>
                        <span className="text-[10px] text-stone-500">
                          Bayar langsung saat pesanan diantar / di kasir
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* General Kitchen Notes */}
                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">
                      Catatan Tambahan untuk Barista / Dapur (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="Cth: Sambal dipisah, kopi jangan terlalu manis"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-800"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-xs text-red-600 font-bold bg-red-50 p-2 rounded-lg border border-red-200">
                    {errorMsg}
                  </p>
                )}

                {/* Checkout Bar */}
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-md">
                  <div className="flex items-center justify-between mb-3 text-sm">
                    <span className="text-stone-600">Total Pembayaran</span>
                    <span className="text-xl font-extrabold text-amber-950 font-['Space_Grotesk']">
                      {formatRupiah(totalAmount)}
                    </span>
                  </div>

                  <button
                    type="submit"
                    id="btn-confirm-order"
                    className="w-full py-3.5 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20 active:scale-[0.98] transition-transform"
                  >
                    <span>
                      {paymentMethod === 'QRIS'
                        ? 'Bayar Sekarang dengan QRIS'
                        : 'Kirim Pesanan ke Kasir'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
