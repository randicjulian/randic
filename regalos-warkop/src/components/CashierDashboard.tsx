import React, { useState } from 'react';
import { 
  ClipboardList, 
  ShoppingBag, 
  TrendingUp, 
  Settings2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Printer, 
  Search, 
  Banknote, 
  QrCode, 
  Flame, 
  RefreshCw,
  ChefHat,
  Coffee
} from 'lucide-react';
import { Order, MenuItem, OrderStatus, PaymentMethod, CartItem } from '../types';
import { formatRupiah, formatDateTime, generateInvoiceNumber } from '../utils/formatters';
import { playSuccessChime } from '../utils/sound';

interface CashierDashboardProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, paymentStatus?: 'LUNAS' | 'BELUM_BAYAR') => void;
  menuItems: MenuItem[];
  onToggleAvailability: (itemId: string) => void;
  onUpdateItemPrice: (itemId: string, newPrice: number) => void;
  onAddNewMenuItem: (item: MenuItem) => void;
  onResetMenu: () => void;
  onOpenReceipt: (order: Order) => void;
  onNewOrderCreated: (order: Order) => void;
  onOpenQrisManagement?: () => void;
}

export const CashierDashboard: React.FC<CashierDashboardProps> = ({
  orders,
  onUpdateOrderStatus,
  menuItems,
  onToggleAvailability,
  onUpdateItemPrice,
  onAddNewMenuItem,
  onResetMenu,
  onOpenReceipt,
  onNewOrderCreated,
  onOpenQrisManagement,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'pos' | 'reports' | 'menu'>('orders');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'ALL' | OrderStatus>('ALL');

  // Quick POS State
  const [posCart, setPosCart] = useState<CartItem[]>([]);
  const [posCustomerName, setPosCustomerName] = useState('Pelanggan Kasir');
  const [posTable, setPosTable] = useState('Area Bar');
  const [posPaymentMethod, setPosPaymentMethod] = useState<PaymentMethod>('QRIS');
  const [posSearch, setPosSearch] = useState('');
  const [cashGiven, setCashGiven] = useState<string>('');

  // Add Item Modal State
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'kopi-panas' | 'es-segar' | 'makanan' | 'camilan'>('kopi-panas');
  const [newItemPrice, setNewItemPrice] = useState<number>(10000);
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemImage, setNewItemImage] = useState('https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80');

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'ALL') return true;
    return o.status === orderStatusFilter;
  });

  // Sales Analytics Calculations
  const completedOrders = orders.filter((o) => o.paymentStatus === 'LUNAS');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const qrisRevenue = completedOrders
    .filter((o) => o.paymentMethod === 'QRIS')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const cashRevenue = completedOrders
    .filter((o) => o.paymentMethod === 'TUNAI')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // Top Selling Items Calculation
  const itemSalesMap: Record<string, { name: string; count: number; total: number }> = {};
  completedOrders.forEach((order) => {
    order.items.forEach((ci) => {
      if (!itemSalesMap[ci.item.id]) {
        itemSalesMap[ci.item.id] = { name: ci.item.name, count: 0, total: 0 };
      }
      itemSalesMap[ci.item.id].count += ci.quantity;
      itemSalesMap[ci.item.id].total += ci.quantity * ci.item.price;
    });
  });
  const topSellingItems = Object.values(itemSalesMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // POS Handlers
  const handleAddToPosCart = (item: MenuItem) => {
    if (!item.isAvailable) return;
    setPosCart((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleUpdatePosQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      setPosCart((prev) => prev.filter((ci) => ci.item.id !== itemId));
    } else {
      setPosCart((prev) =>
        prev.map((ci) => (ci.item.id === itemId ? { ...ci, quantity: qty } : ci))
      );
    }
  };

  const posSubtotal = posCart.reduce((acc, ci) => acc + ci.item.price * ci.quantity, 0);
  const cashNum = parseFloat(cashGiven) || 0;
  const changeAmount = Math.max(0, cashNum - posSubtotal);

  const handlePosCheckout = () => {
    if (posCart.length === 0) return;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      invoiceNumber: generateInvoiceNumber(),
      customerName: posCustomerName.trim() || 'Pelanggan Kasir',
      tableNumber: posTable,
      orderType: posTable === 'Takeaway' ? 'TAKEAWAY' : 'DINE_IN',
      items: [...posCart],
      totalAmount: posSubtotal,
      paymentMethod: posPaymentMethod,
      paymentStatus: 'LUNAS',
      status: 'DIPROSES',
      createdAt: new Date().toISOString(),
      notes: 'Pesanan Langsung Kasir',
    };

    onNewOrderCreated(newOrder);
    playSuccessChime();
    setPosCart([]);
    setCashGiven('');
    onOpenReceipt(newOrder);
  };

  const handleCreateNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory,
      price: newItemPrice,
      description: newItemDesc.trim() || 'Menu spesial Regalos Warkop.',
      image: newItemImage.trim() || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
      tags: ['Baru'],
    };

    onAddNewMenuItem(newItem);
    setIsAddingItem(false);
    setNewItemName('');
    setNewItemPrice(10000);
    setNewItemDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28">
      
      {/* Kasir Top Banner */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-5 sm:p-6 mb-6 shadow-xl border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 mb-2">
            <Coffee className="w-3.5 h-3.5 text-amber-400" />
            <span>Sistem Kasir & Operasional Warkop</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white font-['Space_Grotesk']">
            Terminal Kasir Regalos Warkop
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Kelola antrean pesanan dari meja pengunjung, terima QRIS & kasir langsung, cetak nota, dan rekap pendapatan.
          </p>
        </div>

        {/* Quick Tabs Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-stone-800 p-1.5 rounded-2xl border border-stone-700 w-full md:w-auto">
          <button
            id="tab-btn-orders"
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-amber-700 text-white shadow-md'
                : 'text-stone-300 hover:text-white hover:bg-stone-700/60'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Antrean Pesanan ({orders.filter(o => o.status !== 'SELESAI' && o.status !== 'BATAL').length})</span>
          </button>

          <button
            id="tab-btn-pos"
            onClick={() => setActiveTab('pos')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'pos'
                ? 'bg-amber-700 text-white shadow-md'
                : 'text-stone-300 hover:text-white hover:bg-stone-700/60'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Kasir Cepat</span>
          </button>

          <button
            id="tab-btn-reports"
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'reports'
                ? 'bg-amber-700 text-white shadow-md'
                : 'text-stone-300 hover:text-white hover:bg-stone-700/60'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Rekap Penjualan</span>
          </button>

          <button
            id="tab-btn-menu"
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'menu'
                ? 'bg-amber-700 text-white shadow-md'
                : 'text-stone-300 hover:text-white hover:bg-stone-700/60'
            }`}
          >
            <Settings2 className="w-4 h-4" />
            <span>Kelola Menu & Stok</span>
          </button>

          {onOpenQrisManagement && (
            <button
              id="tab-btn-qris-data"
              onClick={onOpenQrisManagement}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-500/40 shadow-xs cursor-pointer"
              title="Kelola Data & Mutasi QRIS"
            >
              <QrCode className="w-4 h-4 text-red-400" />
              <span>Data QRIS</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: ANTREAN PESANAN (LIVE ORDERS) */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          
          {/* Filter Status Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'ALL', label: 'Semua Pesanan' },
              { id: 'MENUNGGU_BAYAR', label: 'Menunggu Bayar' },
              { id: 'ANTREAN', label: 'Antrean Masuk' },
              { id: 'DIPROSES', label: 'Sedang Dimasak' },
              { id: 'SELESAI', label: 'Selesai' },
              { id: 'BATAL', label: 'Dibatalkan' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setOrderStatusFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  orderStatusFilter === f.id
                    ? 'bg-amber-800 text-white shadow-sm'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 shadow-xs">
              <ClipboardList className="w-12 h-12 text-stone-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-stone-700">Belum Ada Pesanan di Kategori Ini</h3>
              <p className="text-xs text-stone-500 mt-1">
                Pesanan yang dibuat oleh pengunjung lewat Menu Tamu akan otomatis masuk ke sini secara real-time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.map((order) => {
                const isPending = order.status === 'ANTREAN' || order.status === 'MENUNGGU_BAYAR';
                const isCooking = order.status === 'DIPROSES';
                const isDone = order.status === 'SELESAI';
                const isCancelled = order.status === 'BATAL';

                return (
                  <div
                    key={order.id}
                    id={`order-card-${order.id}`}
                    className={`bg-white rounded-2xl border p-4 shadow-sm flex flex-col justify-between transition-all ${
                      isCooking
                        ? 'border-amber-400 bg-amber-50/20 ring-1 ring-amber-400/40'
                        : isDone
                        ? 'border-stone-200 opacity-80'
                        : 'border-stone-200'
                    }`}
                  >
                    <div>
                      {/* Top Meta */}
                      <div className="flex items-start justify-between gap-2 pb-2 border-b border-stone-100 mb-3">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-extrabold text-stone-900 font-mono">
                              {order.invoiceNumber}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500">
                            {formatDateTime(order.createdAt)}
                          </p>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                            order.paymentStatus === 'LUNAS'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {order.paymentStatus === 'LUNAS' ? 'LUNAS' : 'BELUM BAYAR'}
                        </span>
                      </div>

                      {/* Customer & Table */}
                      <div className="flex items-center justify-between mb-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-800">{order.customerName}</span>
                          <span className="px-2 py-0.5 rounded bg-stone-100 font-semibold text-stone-600">
                            {order.orderType === 'TAKEAWAY' ? 'Bungkus' : order.tableNumber}
                          </span>
                        </div>
                        <span className="text-stone-500 flex items-center gap-1">
                          {order.paymentMethod === 'QRIS' ? (
                            <span className="text-amber-800 font-bold flex items-center gap-1">
                              <QrCode className="w-3.5 h-3.5" /> QRIS
                            </span>
                          ) : (
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <Banknote className="w-3.5 h-3.5" /> Tunai
                            </span>
                          )}
                        </span>
                      </div>

                      {/* Item Details */}
                      <div className="bg-stone-50 rounded-xl p-3 space-y-1.5 mb-3 border border-stone-100 text-xs">
                        {order.items.map((ci, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span className="text-stone-700 font-medium">
                              <strong>{ci.quantity}x</strong> {ci.item.name}
                              {ci.notes && (
                                <span className="block text-[10px] text-amber-900 italic pl-3">
                                  - Catatan: {ci.notes}
                                </span>
                              )}
                            </span>
                            <span className="text-stone-500 font-mono">
                              {formatRupiah(ci.item.price * ci.quantity)}
                            </span>
                          </div>
                        ))}

                        {order.notes && (
                          <div className="pt-1.5 mt-1 border-t border-stone-200 text-[11px] text-amber-900 font-medium">
                            Ket: {order.notes}
                          </div>
                        )}
                      </div>

                      {/* Total */}
                      <div className="flex justify-between items-center text-sm font-bold text-stone-900 mb-3">
                        <span className="text-stone-500 text-xs font-normal">Total Tagihan:</span>
                        <span className="text-base text-amber-900 font-extrabold font-['Space_Grotesk']">
                          {formatRupiah(order.totalAmount)}
                        </span>
                      </div>
                    </div>

                    {/* Operational Action Buttons */}
                    <div className="pt-2 border-t border-stone-100 space-y-2">
                      
                      {/* Payment validation if not yet paid */}
                      {order.paymentStatus === 'BELUM_BAYAR' && (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() =>
                              onUpdateOrderStatus(order.id, 'DIPROSES', 'LUNAS')
                            }
                            className="py-2 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Terima Bayar</span>
                          </button>
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'BATAL')}
                            className="py-2 px-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                          >
                            <span>Batalkan</span>
                          </button>
                        </div>
                      )}

                      {/* Kitchen workflow progression */}
                      {order.paymentStatus === 'LUNAS' && !isDone && !isCancelled && (
                        <div className="grid grid-cols-2 gap-2">
                          {isPending && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'DIPROSES')}
                              className="py-2 px-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-xs"
                            >
                              <ChefHat className="w-3.5 h-3.5" />
                              <span>Mulai Masak</span>
                            </button>
                          )}

                          {isCooking && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'SELESAI')}
                              className="col-span-2 py-2 px-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-xs"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Pesanan Disajikan / Selesai</span>
                            </button>
                          )}
                        </div>
                      )}

                      {/* Receipt action */}
                      <button
                        onClick={() => onOpenReceipt(order)}
                        className="w-full py-1.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5 text-stone-500" />
                        <span>Lihat & Cetak Nota Struk</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* TAB 2: KASIR CEPAT (POS TERMINAL) */}
      {activeTab === 'pos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Menu Selection Grid */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Cari item pesanan cepat..."
                  value={posSearch}
                  onChange={(e) => setPosSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[620px] overflow-y-auto pr-1">
              {menuItems
                .filter(
                  (m) =>
                    m.name.toLowerCase().includes(posSearch.toLowerCase()) ||
                    m.category.toLowerCase().includes(posSearch.toLowerCase())
                )
                .map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleAddToPosCart(item)}
                    disabled={!item.isAvailable}
                    className={`p-3 bg-white rounded-xl border text-left shadow-xs transition-all hover:border-amber-700 flex flex-col justify-between ${
                      !item.isAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-xs text-stone-900 truncate">{item.name}</h4>
                        <span className="text-[10px] text-stone-500 uppercase">{item.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-1 pt-1 border-t border-stone-100">
                      <span className="text-xs font-bold text-amber-900">
                        {formatRupiah(item.price)}
                      </span>
                      <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center text-xs font-bold">
                        +
                      </span>
                    </div>
                  </button>
                ))}
            </div>
          </div>

          {/* Right Col: Bill & Instant Checkout */}
          <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-lg flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-extrabold text-base text-stone-900 font-['Space_Grotesk']">
                  Nota Pesanan Kasir
                </h3>
                {posCart.length > 0 && (
                  <button
                    onClick={() => setPosCart([])}
                    className="text-xs text-red-600 hover:text-red-700 font-semibold"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Customer and Table Input */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">
                    Nama Tamu
                  </label>
                  <input
                    type="text"
                    value={posCustomerName}
                    onChange={(e) => setPosCustomerName(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">
                    Meja / Area
                  </label>
                  <select
                    value={posTable}
                    onChange={(e) => setPosTable(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="Meja 01">Meja 01</option>
                    <option value="Meja 02">Meja 02</option>
                    <option value="Meja 03">Meja 03</option>
                    <option value="Meja 04">Meja 04</option>
                    <option value="Meja 05">Meja 05</option>
                    <option value="Lesehan A">Lesehan A</option>
                    <option value="Lesehan B">Lesehan B</option>
                    <option value="Area Bar">Area Bar</option>
                    <option value="Takeaway">Bungkus</option>
                  </select>
                </div>
              </div>

              {/* Items List */}
              <div className="max-h-56 overflow-y-auto space-y-2 pr-1 divide-y divide-stone-100">
                {posCart.length === 0 ? (
                  <p className="text-center py-8 text-xs text-stone-400">
                    Klik menu di sebelah kiri untuk menambah ke tagihan.
                  </p>
                ) : (
                  posCart.map((ci) => (
                    <div key={ci.item.id} className="pt-2 flex items-center justify-between text-xs">
                      <div className="truncate pr-2">
                        <p className="font-bold text-stone-800 truncate">{ci.item.name}</p>
                        <span className="text-[11px] text-stone-500">
                          {formatRupiah(ci.item.price)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleUpdatePosQuantity(ci.item.id, ci.quantity - 1)}
                          className="w-5 h-5 rounded bg-stone-100 text-stone-700 flex items-center justify-center font-bold hover:bg-stone-200"
                        >
                          -
                        </button>
                        <span className="w-5 text-center font-bold">{ci.quantity}</span>
                        <button
                          onClick={() => handleUpdatePosQuantity(ci.item.id, ci.quantity + 1)}
                          className="w-5 h-5 rounded bg-stone-100 text-stone-700 flex items-center justify-center font-bold hover:bg-stone-200"
                        >
                          +
                        </button>
                        <span className="font-bold text-amber-900 ml-2 w-16 text-right">
                          {formatRupiah(ci.item.price * ci.quantity)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Payment Method */}
              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">
                  Metode Bayar
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPosPaymentMethod('QRIS')}
                    className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      posPaymentMethod === 'QRIS'
                        ? 'bg-amber-800 text-white border-amber-800 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>QRIS (Lunas)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPosPaymentMethod('TUNAI')}
                    className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      posPaymentMethod === 'TUNAI'
                        ? 'bg-amber-800 text-white border-amber-800 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    <Banknote className="w-3.5 h-3.5" />
                    <span>Tunai</span>
                  </button>
                </div>
              </div>

              {/* Cash change calculator if TUNAI */}
              {posPaymentMethod === 'TUNAI' && (
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-600 font-semibold">Uang Diterima:</span>
                    <input
                      type="number"
                      placeholder="Cth: 50000"
                      value={cashGiven}
                      onChange={(e) => setCashGiven(e.target.value)}
                      className="w-32 px-2 py-1 text-right text-xs rounded border border-stone-300 font-mono"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold pt-1 border-t border-stone-200">
                    <span className="text-stone-600">Kembalian:</span>
                    <span className="text-emerald-700 font-mono text-sm">
                      {formatRupiah(changeAmount)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Total & Checkout Button */}
            <div className="pt-4 border-t border-stone-200 mt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-stone-500">Total Transaksi</span>
                <span className="text-xl font-extrabold text-stone-900 font-['Space_Grotesk']">
                  {formatRupiah(posSubtotal)}
                </span>
              </div>

              <button
                id="btn-pos-checkout"
                onClick={handlePosCheckout}
                disabled={posCart.length === 0}
                className="w-full py-3 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-200" />
                <span>Simpan Pesanan & Cetak Struk</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* TAB 3: REKAP & LAPORAN PENJUALAN */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Total Omzet Hari Ini
              </span>
              <span className="text-2xl font-black text-amber-950 font-['Space_Grotesk']">
                {formatRupiah(totalRevenue)}
              </span>
              <p className="text-[11px] text-stone-400 mt-1">
                Dari {completedOrders.length} pesanan terbayar
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                  Pembayaran QRIS
                </span>
                <QrCode className="w-4 h-4 text-amber-700" />
              </div>
              <span className="text-2xl font-black text-stone-900 font-['Space_Grotesk']">
                {formatRupiah(qrisRevenue)}
              </span>
              <div className="flex items-center justify-between mt-1">
                <p className="text-[11px] text-emerald-600 font-semibold">
                  {totalRevenue > 0 ? `${Math.round((qrisRevenue / totalRevenue) * 100)}% dari total` : '0%'}
                </p>
                {onOpenQrisManagement && (
                  <button
                    onClick={onOpenQrisManagement}
                    className="text-[10px] font-bold text-amber-800 hover:text-amber-900 underline"
                  >
                    Buka Data QRIS &rarr;
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                  Pembayaran Tunai
                </span>
                <Banknote className="w-4 h-4 text-emerald-700" />
              </div>
              <span className="text-2xl font-black text-stone-900 font-['Space_Grotesk']">
                {formatRupiah(cashRevenue)}
              </span>
              <p className="text-[11px] text-stone-500 font-semibold mt-1">
                {totalRevenue > 0 ? `${Math.round((cashRevenue / totalRevenue) * 100)}% dari total` : '0%'}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Total Transaksi
              </span>
              <span className="text-2xl font-black text-stone-900 font-['Space_Grotesk']">
                {orders.length}
              </span>
              <p className="text-[11px] text-stone-400 mt-1">
                {orders.filter(o => o.status === 'SELESAI').length} pesanan tuntas disajikan
              </p>
            </div>

          </div>

          {/* Top Selling Ranking */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-amber-600" />
              <h3 className="font-extrabold text-base text-stone-900">
                Menu Paling Laris Hari Ini (Top 5)
              </h3>
            </div>

            {topSellingItems.length === 0 ? (
              <p className="text-xs text-stone-400 py-4 text-center">
                Belum ada data penjualan tercatat. Buat pesanan terlebih dahulu.
              </p>
            ) : (
              <div className="space-y-3">
                {topSellingItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-100">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-amber-800 text-white font-black text-xs flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <div>
                        <h4 className="font-bold text-xs text-stone-900">{item.name}</h4>
                        <span className="text-[10px] text-stone-500">Terjual {item.count} porsi</span>
                      </div>
                    </div>
                    <span className="font-bold text-xs text-amber-900 font-mono">
                      {formatRupiah(item.total)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 4: KELOLA MENU & STOK */}
      {activeTab === 'menu' && (
        <div className="space-y-4">
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-stone-900">
                Daftar Menu & Stok Regalos Warkop
              </h3>
              <p className="text-xs text-stone-500">
                Atur ketersediaan menu (Tersedia / Habis) atau ubah harga seketika.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onResetMenu}
                className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Kembalikan Menu Standar"
              >
                <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
                <span>Reset Menu Default</span>
              </button>

              <button
                onClick={() => setIsAddingItem(true)}
                className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Menu Baru</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200">
                  <tr>
                    <th className="p-3.5">Menu</th>
                    <th className="p-3.5">Kategori</th>
                    <th className="p-3.5">Harga</th>
                    <th className="p-3.5">Status Ketersediaan</th>
                    <th className="p-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {menuItems.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover bg-stone-100"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-bold text-stone-900">{item.name}</p>
                            <p className="text-[11px] text-stone-500 truncate max-w-xs">{item.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-medium">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-stone-900">
                        {formatRupiah(item.price)}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            item.isAvailable
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.isAvailable ? 'Tersedia' : 'Habis (Sold Out)'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => onToggleAvailability(item.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            item.isAvailable
                              ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {item.isAvailable ? 'Tandai Habis' : 'Tandai Tersedia'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Add New Menu Item Modal */}
      {isAddingItem && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-extrabold text-lg text-stone-900 mb-1">
              Tambah Menu Baru ke Regalos Warkop
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Menu baru akan langsung tampil di menu digital pengunjung dan POS kasir.
            </p>

            <form onSubmit={handleCreateNewItem} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">
                  Nama Menu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Cth: Kopi V60 Arabika / Toast Cokelat"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">
                    Kategori
                  </label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="kopi-panas">Kopi & Hangat</option>
                    <option value="es-segar">Es & Segar</option>
                    <option value="makanan">Makanan & Indomie</option>
                    <option value="camilan">Roti & Camilan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">
                    Harga (IDR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1000}
                    step={1000}
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">
                  Deskripsi Menu
                </label>
                <textarea
                  rows={2}
                  placeholder="Penjelasan singkat rasa / bahan..."
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">
                  Link Gambar (Opsional)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newItemImage}
                  onChange={(e) => setNewItemImage(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddingItem(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold shadow-md"
                >
                  Simpan Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
