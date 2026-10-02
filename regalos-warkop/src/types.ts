export type MenuCategory = 'all' | 'kopi-panas' | 'es-segar' | 'makanan' | 'camilan';

export interface MenuItem {
  id: string;
  name: string;
  category: 'kopi-panas' | 'es-segar' | 'makanan' | 'camilan';
  price: number;
  description: string;
  image: string;
  isAvailable: boolean;
  isPopular?: boolean;
  tags?: string[];
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  notes?: string;
}

export type PaymentMethod = 'QRIS' | 'TUNAI';

export type OrderStatus = 'MENUNGGU_BAYAR' | 'ANTREAN' | 'DIPROSES' | 'SELESAI' | 'BATAL';

export interface Order {
  id: string;
  invoiceNumber: string;
  customerName: string;
  tableNumber: string;
  orderType: 'DINE_IN' | 'TAKEAWAY';
  items: CartItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'LUNAS' | 'BELUM_BAYAR';
  status: OrderStatus;
  createdAt: string;
  notes?: string;
}

export interface SalesSummary {
  totalRevenue: number;
  totalOrders: number;
  qrisRevenue: number;
  cashRevenue: number;
  completedOrders: number;
}

export interface QrisConfig {
  merchantName: string;
  nmid: string;
  city: string;
  postalCode: string;
  acquirerName: string;
  customQrString?: string;
  customQrImageUrl?: string;
}

