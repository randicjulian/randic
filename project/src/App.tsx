/**
 * Regalos Warkop - Digital Menu, POS Cashier System, QRIS Payment, & Tawk.to Live Chat
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DigitalMenu } from './components/DigitalMenu';
import { CartDrawer } from './components/CartDrawer';
import { QrisModal } from './components/QrisModal';
import { ReceiptModal } from './components/ReceiptModal';
import { CashierDashboard } from './components/CashierDashboard';
import { LiveChatWidget } from './components/LiveChatWidget';
import { WarkopInfoModal } from './components/WarkopInfoModal';
import { QrisManagementModal } from './components/QrisManagementModal';
import { INITIAL_MENU } from './data/initialMenu';
import { MenuItem, CartItem, Order, OrderStatus, PaymentMethod, QrisConfig } from './types';
import { generateInvoiceNumber } from './utils/formatters';
import { playSuccessChime } from './utils/sound';
import { MessageCircle, Instagram, Coffee, Sparkles } from 'lucide-react';

const SEED_ORDERS: Order[] = [
  {
    id: 'ord-seed-1',
    invoiceNumber: 'REG-2026-8812',
    customerName: 'Mas Dimas',
    tableNumber: 'Meja 03',
    orderType: 'DINE_IN',
    items: [
      { item: INITIAL_MENU[0], quantity: 2, notes: 'Gula sedikit' }, // Kopi Tubruk
      { item: INITIAL_MENU[11], quantity: 1, notes: 'Pedas sedang ya mas' }, // Indomie Nyemek
      { item: INITIAL_MENU[17], quantity: 1 }, // Tempe Mendoan
    ],
    totalAmount: 37000,
    paymentMethod: 'QRIS',
    paymentStatus: 'LUNAS',
    status: 'DIPROSES',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    notes: 'Kopi jangan terlalu manis',
  },
  {
    id: 'ord-seed-2',
    invoiceNumber: 'REG-2026-8819',
    customerName: 'Mbak Rina',
    tableNumber: 'Lesehan A',
    orderType: 'DINE_IN',
    items: [
      { item: INITIAL_MENU[5], quantity: 2 }, // Es Kopi Susu Gula Aren
      { item: INITIAL_MENU[15], quantity: 1 }, // Roti Bakar Coklat Keju
    ],
    totalAmount: 37000,
    paymentMethod: 'TUNAI',
    paymentStatus: 'LUNAS',
    status: 'SELESAI',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  }
];

export default function App() {
  // App Mode: Customer (Menu Tamu) or Cashier (Kasir & POS)
  const [mode, setMode] = useState<'customer' | 'cashier'>('customer');

  // Menu items with LocalStorage persistence
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('regalos_menu_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved menu:', e);
      }
    }
    return INITIAL_MENU;
  });

  useEffect(() => {
    localStorage.setItem('regalos_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  // Orders state with LocalStorage persistence
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('regalos_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved orders:', e);
      }
    }
    return SEED_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('regalos_orders', JSON.stringify(orders));
  }, [orders]);

  // Active table in Customer Mode
  const [selectedTable, setSelectedTable] = useState<string>('Meja 01');

  // Customer Cart
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modals
  const [isQrisModalOpen, setIsQrisModalOpen] = useState(false);
  const [activeQrisOrder, setActiveQrisOrder] = useState<Order | null>(null);

  // QRIS Merchant Configuration with LocalStorage persistence
  const [qrisConfig, setQrisConfig] = useState<QrisConfig>(() => {
    const saved = localStorage.getItem('regalos_qris_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved qris config:', e);
      }
    }
    return {
      merchantName: 'REGALOS WARKOP',
      nmid: 'ID1024395829104',
      city: 'JAKARTA',
      postalCode: '12340',
      acquirerName: 'BCA / QRIS NASIONAL',
    };
  });

  useEffect(() => {
    localStorage.setItem('regalos_qris_config', JSON.stringify(qrisConfig));
  }, [qrisConfig]);

  const [isQrisManagementOpen, setIsQrisManagementOpen] = useState(false);

  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  // Add to cart from digital menu
  const handleAddToCart = (item: MenuItem, notes?: string) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (ci) => ci.item.id === item.id && (ci.notes || '') === (notes || '')
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, { item, quantity: 1, notes }];
    });
  };

  const handleUpdateCartQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      setCartItems((prev) => prev.filter((ci) => ci.item.id !== itemId));
    } else {
      setCartItems((prev) =>
        prev.map((ci) => (ci.item.id === itemId ? { ...ci, quantity: newQty } : ci))
      );
    }
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((ci) => ci.item.id !== itemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Customer Checkout Handler
  const handleCheckout = (details: {
    customerName: string;
    tableNumber: string;
    orderType: 'DINE_IN' | 'TAKEAWAY';
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => {
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.item.price * item.quantity,
      0
    );

    const isQris = details.paymentMethod === 'QRIS';

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      invoiceNumber: generateInvoiceNumber(),
      customerName: details.customerName,
      tableNumber: details.tableNumber,
      orderType: details.orderType,
      items: [...cartItems],
      totalAmount,
      paymentMethod: details.paymentMethod,
      paymentStatus: 'BELUM_BAYAR',
      status: isQris ? 'MENUNGGU_BAYAR' : 'ANTREAN',
      createdAt: new Date().toISOString(),
      notes: details.notes,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setIsCartOpen(false);

    if (isQris) {
      setActiveQrisOrder(newOrder);
      setIsQrisModalOpen(true);
    } else {
      // Cash payment
      playSuccessChime();
      setReceiptOrder(newOrder);
      setIsReceiptOpen(true);
    }
  };

  // QRIS Payment confirmed handler
  const handleQrisPaymentSuccess = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, paymentStatus: 'LUNAS', status: 'DIPROSES' }
          : o
      )
    );

    const completed = orders.find((o) => o.id === orderId);
    if (completed) {
      setReceiptOrder({
        ...completed,
        paymentStatus: 'LUNAS',
        status: 'DIPROSES',
      });
    } else if (activeQrisOrder) {
      setReceiptOrder({
        ...activeQrisOrder,
        paymentStatus: 'LUNAS',
        status: 'DIPROSES',
      });
    }

    setIsQrisModalOpen(false);
    setIsReceiptOpen(true);
  };

  // Cashier: Update Order Status
  const handleUpdateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    paymentStatus?: 'LUNAS' | 'BELUM_BAYAR'
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status,
            paymentStatus: paymentStatus ? paymentStatus : o.paymentStatus,
          };
        }
        return o;
      })
    );
  };

  // Cashier: Toggle menu availability
  const handleToggleMenuAvailability = (itemId: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  // Cashier: Update Item Price
  const handleUpdateItemPrice = (itemId: string, newPrice: number) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, price: newPrice } : item))
    );
  };

  // Cashier: Add new item
  const handleAddNewMenuItem = (newItem: MenuItem) => {
    setMenuItems((prev) => [newItem, ...prev]);
  };

  // Cashier: Reset default menu
  const handleResetMenu = () => {
    if (confirm('Kembalikan semua menu ke setelan awal pabrik Regalos Warkop?')) {
      setMenuItems(INITIAL_MENU);
      localStorage.removeItem('regalos_menu_items');
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans">
      
      {/* Top Navigation */}
      <Navbar
        mode={mode}
        setMode={setMode}
        cartItems={cartItems}
        setIsCartOpen={setIsCartOpen}
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable}
        onOpenInfo={() => setIsInfoModalOpen(true)}
        onOpenChat={() => setIsLiveChatOpen(true)}
        onOpenQrisManagement={() => setIsQrisManagementOpen(true)}
        orderCount={orders.filter((o) => o.status !== 'SELESAI' && o.status !== 'BATAL').length}
      />

      {/* Main Body */}
      <main className="flex-1">
        {mode === 'customer' ? (
          <DigitalMenu
            menuItems={menuItems}
            onAddToCart={handleAddToCart}
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
            onOpenCart={() => setIsCartOpen(true)}
          />
        ) : (
          <CashierDashboard
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            menuItems={menuItems}
            onToggleAvailability={handleToggleMenuAvailability}
            onUpdateItemPrice={handleUpdateItemPrice}
            onAddNewMenuItem={handleAddNewMenuItem}
            onResetMenu={handleResetMenu}
            onOpenReceipt={(order) => {
              setReceiptOrder(order);
              setIsReceiptOpen(true);
            }}
            onNewOrderCreated={(newOrder) => {
              setOrders((prev) => [newOrder, ...prev]);
            }}
            onOpenQrisManagement={() => setIsQrisManagementOpen(true)}
          />
        )}
      </main>

      {/* Floating Customer Cart Indicator (Mobile) */}
      {mode === 'customer' && cartItems.length > 0 && (
        <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40">
          <button
            id="floating-cart-btn"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-3 bg-amber-800 hover:bg-amber-900 text-white font-extrabold px-5 py-3.5 rounded-2xl shadow-2xl transition-transform active:scale-95 border border-amber-700/50"
          >
            <div className="w-7 h-7 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-black text-xs">
              {cartItems.reduce((acc, ci) => acc + ci.quantity, 0)}
            </div>
            <div className="text-left">
              <span className="text-xs block text-amber-200">Lihat Keranjang</span>
              <span className="text-sm font-black font-['Space_Grotesk']">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  maximumFractionDigits: 0,
                }).format(
                  cartItems.reduce((acc, ci) => acc + ci.item.price * ci.quantity, 0)
                )}
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Floating Live Chat Bubble Trigger */}
      <button
        id="floating-live-chat-btn"
        onClick={() => setIsLiveChatOpen(true)}
        className="fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-40 w-12 h-12 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white shadow-xl flex items-center justify-center transition-transform active:scale-95 border-2 border-white"
        title="Buka Live Chat Tawk.to"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full animate-ping"></span>
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"></span>
      </button>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 py-8 border-t border-stone-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-700 flex items-center justify-center text-white">
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-white text-sm">REGALOS WARKOP</span>
              <p className="text-[11px] text-stone-400">
                Menu Digital &bull; Kasir POS &bull; QRIS Nasional &bull; Live Chat Tawk.to
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            <button
              onClick={() => setIsInfoModalOpen(true)}
              className="text-stone-300 hover:text-white"
            >
              Info WiFi & Jam Buka
            </button>
            <a
              href="https://www.instagram.com/regalos.warkop?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-pink-400 hover:text-pink-300"
            >
              <Instagram className="w-4 h-4" />
              <span>@regalos.warkop</span>
            </a>
            <button
              onClick={() => setIsLiveChatOpen(true)}
              className="text-emerald-400 hover:text-emerald-300"
            >
              Live Chat Barista
            </button>
          </div>
        </div>
      </footer>

      {/* Sliding Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable}
        onCheckout={handleCheckout}
      />

      {/* QRIS Payment Modal */}
      <QrisModal
        isOpen={isQrisModalOpen}
        order={activeQrisOrder}
        onClose={() => setIsQrisModalOpen(false)}
        onPaymentSuccess={handleQrisPaymentSuccess}
        qrisConfig={qrisConfig}
        onOpenQrisManagement={() => setIsQrisManagementOpen(true)}
      />

      {/* QRIS Management & Data Modal */}
      <QrisManagementModal
        isOpen={isQrisManagementOpen}
        onClose={() => setIsQrisManagementOpen(false)}
        qrisConfig={qrisConfig}
        onSaveQrisConfig={(newCfg) => setQrisConfig(newCfg)}
        orders={orders}
        onVerifyOrderPayment={handleQrisPaymentSuccess}
        onOpenReceipt={(order) => {
          setReceiptOrder(order);
          setIsReceiptOpen(true);
        }}
      />

      {/* Printable Thermal Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        order={receiptOrder}
        onClose={() => setIsReceiptOpen(false)}
      />

      {/* Tawk.to Live Chat Widget & Fallback Assistant */}
      <LiveChatWidget
        isOpen={isLiveChatOpen}
        onClose={() => setIsLiveChatOpen(false)}
      />

      {/* Warkop Info & WiFi Modal */}
      <WarkopInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />

    </div>
  );
}
