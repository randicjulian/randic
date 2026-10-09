import React from 'react';
import { X, Printer, CheckCircle2, Instagram, Wifi, Coffee, Download } from 'lucide-react';
import { Order } from '../types';
import { formatRupiah, formatDateTime } from '../utils/formatters';

interface ReceiptModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  order,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-sm bg-stone-100 rounded-3xl shadow-2xl overflow-hidden border border-stone-300 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header bar */}
        <div className="p-4 bg-stone-900 text-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">Struk / Bukti Pembayaran</span>
          </div>
          <button
            id="btn-close-receipt"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Thermal Receipt Container */}
        <div className="p-6 bg-white font-mono text-xs text-stone-800 space-y-3 print-area shadow-sm mx-3 my-3 rounded-2xl border border-stone-200">
          
          {/* Header */}
          <div className="text-center space-y-0.5 pb-2">
            <h2 className="text-lg font-black tracking-tight text-stone-900 font-sans">
              REGALOS WARKOP
            </h2>
            <p className="text-[10px] text-stone-500">
              Tempat Asyik Nongkrong & Kopi Nikmat
            </p>
            <div className="flex items-center justify-center gap-1 text-[10px] text-pink-700 font-sans font-semibold pt-0.5">
              <Instagram className="w-3 h-3 text-pink-600" />
              <span>@regalos.warkop</span>
            </div>
            <p className="text-[9px] text-stone-400 pt-0.5">
              WiFi: REGALOS-FREE-WIFI (Pass: ngopidulu123)
            </p>
          </div>

          <div className="border-t border-dashed border-stone-400 my-2"></div>

          {/* Meta Information */}
          <div className="text-[11px] space-y-1 text-stone-600">
            <div className="flex justify-between">
              <span>No. Nota:</span>
              <span className="font-bold text-stone-900">{order.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Waktu:</span>
              <span>{formatDateTime(order.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span>Pemesan:</span>
              <span className="font-bold text-stone-900">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span>Posisi:</span>
              <span className="font-bold text-stone-900">
                {order.orderType === 'TAKEAWAY' ? 'Bungkus (Takeaway)' : order.tableNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Metode:</span>
              <span className="font-bold text-amber-800">
                {order.paymentMethod === 'QRIS' ? 'QRIS NASIONAL' : 'TUNAI / KASIR'}
              </span>
            </div>
          </div>

          <div className="border-t border-dashed border-stone-400 my-2"></div>

          {/* Items Table */}
          <div className="space-y-1.5 py-1">
            {order.items.map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between text-stone-900 font-semibold">
                  <span className="truncate pr-2">{item.item.name}</span>
                  <span className="shrink-0">{formatRupiah(item.item.price * item.quantity)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-stone-500">
                  <span>
                    {item.quantity} x {formatRupiah(item.item.price)}
                  </span>
                  {item.notes && <span className="italic text-stone-500 truncate max-w-[120px]">({item.notes})</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-stone-400 my-2"></div>

          {/* Totals */}
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between font-bold text-sm text-stone-900 pt-1">
              <span>TOTAL</span>
              <span>{formatRupiah(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Status Bayar</span>
              <span className={`font-bold ${order.paymentStatus === 'LUNAS' ? 'text-emerald-700' : 'text-amber-700'}`}>
                {order.paymentStatus === 'LUNAS' ? 'LUNAS' : 'MENUNGGU PEMBAYARAN'}
              </span>
            </div>
          </div>

          <div className="border-t border-dashed border-stone-400 my-2"></div>

          {/* Footer Note */}
          <div className="text-center pt-1 text-[10px] text-stone-500 font-sans space-y-1">
            <p className="font-semibold text-stone-700">
              Terima Kasih Sudah Mampir di Regalos Warkop!
            </p>
            <p>
              Jangan lupa tag foto nongkrong kamu ke <strong>@regalos.warkop</strong> di Instagram
            </p>
          </div>

        </div>

        {/* Buttons Action */}
        <div className="p-4 bg-stone-200/80 border-t border-stone-300 flex items-center gap-2">
          <button
            id="btn-print-receipt"
            onClick={handlePrint}
            className="flex-1 py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Cetak Struk</span>
          </button>

          <button
            id="btn-done-receipt"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold border border-stone-300 transition-colors"
          >
            Selesai
          </button>
        </div>

      </div>
    </div>
  );
};
