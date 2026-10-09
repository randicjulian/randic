import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { X, CheckCircle2, Clock, Copy, ShieldCheck, Sparkles, ArrowRight, Smartphone, Settings, Building2 } from 'lucide-react';
import { Order, QrisConfig } from '../types';
import { formatRupiah } from '../utils/formatters';
import { playSuccessChime } from '../utils/sound';

interface QrisModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  onPaymentSuccess: (orderId: string) => void;
  qrisConfig?: QrisConfig;
  onOpenQrisManagement?: () => void;
}

export const QrisModal: React.FC<QrisModalProps> = ({
  isOpen,
  order,
  onClose,
  onPaymentSuccess,
  qrisConfig,
  onOpenQrisManagement,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes
  const [isCopied, setIsCopied] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const timerRef = useRef<number | null>(null);

  const activeMerchantName = qrisConfig?.merchantName || 'REGALOS WARKOP';
  const activeNmid = qrisConfig?.nmid || 'ID1024395829104';
  const activeCity = qrisConfig?.city || 'JAKARTA';
  const activePostal = qrisConfig?.postalCode || '12340';
  const activeAcquirer = qrisConfig?.acquirerName || 'BCA / QRIS NASIONAL';

  useEffect(() => {
    if (isOpen && order) {
      if (qrisConfig?.customQrImageUrl) {
        setQrDataUrl(qrisConfig.customQrImageUrl);
      } else {
        // Generate realistic standard Indonesian QRIS payload
        const mLen = String(activeMerchantName.length).padStart(2, '0');
        const cLen = String(activeCity.length).padStart(2, '0');
        const payload = qrisConfig?.customQrString || `00020101021226670016ID.CO.QRIS.WWW01189360091800000000000215${activeNmid}0303UME51440014ID.GO.BI.QRIS01189360091800000000000215${activeNmid}0303UME520458125303360540${order.totalAmount}5802ID59${mLen}${activeMerchantName}60${cLen}${activeCity}6105${activePostal}62220118${order.invoiceNumber}6304`;
        
        QRCode.toDataURL(payload, {
          width: 320,
          margin: 1,
          color: {
            dark: '#1c1917',
            light: '#ffffff',
          },
        })
          .then((url) => setQrDataUrl(url))
          .catch((err) => console.error('QR Gen error:', err));
      }

      setTimeLeft(300);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, order, qrisConfig, activeMerchantName, activeNmid, activeCity, activePostal]);

  if (!isOpen || !order) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(order.totalAmount.toString());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSimulatePayment = () => {
    setIsSimulating(true);
    setTimeout(() => {
      playSuccessChime();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#b45309', '#f59e0b', '#10b981', '#ffffff']
      });
      setIsSimulating(false);
      onPaymentSuccess(order.id);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Indonesian QRIS Official Top Banner */}
        <div className="bg-[#b91c1c] text-white px-5 py-3 flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-white p-1 flex items-center justify-center font-black text-[#b91c1c] text-xs shadow-xs">
              QRIS
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider font-extrabold text-red-100">
                Pembayaran Nasional
              </div>
              <div className="text-xs font-bold text-white flex items-center gap-1">
                <span>GPN &bull; Bank Indonesia</span>
              </div>
            </div>
          </div>
          
          <button
            id="btn-close-qris"
            onClick={onClose}
            className="p-1 rounded-full text-red-200 hover:text-white hover:bg-red-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-4">
          
          {/* Merchant Identity */}
          <div className="text-center pb-2 border-b border-stone-100">
            <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 tracking-tight">
              {activeMerchantName}
            </h3>
            <p className="text-[11px] text-stone-500 font-medium">
              NMID: <span className="font-mono font-semibold text-stone-700">{activeNmid}</span> &bull; <span className="text-emerald-700 font-semibold">{activeAcquirer}</span>
            </p>
            <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-100 text-[11px] text-stone-600 font-semibold">
              <span>{order.orderType === 'TAKEAWAY' ? 'Takeaway' : order.tableNumber}</span>
              <span>&bull;</span>
              <span>{order.customerName}</span>
            </div>
          </div>

          {/* QR Code Container with Frame */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex flex-col items-center justify-center shadow-inner relative">
            <div className="p-3 bg-white rounded-xl shadow-md border border-stone-200">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QRIS Regalos Warkop"
                  className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-lg"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-stone-400 text-xs">
                  Membuat kode QRIS...
                </div>
              )}
            </div>

            {/* Countdown Badge */}
            <div className="mt-3 flex items-center gap-2 text-xs text-stone-600 bg-white px-3 py-1.5 rounded-full shadow-xs border border-stone-200">
              <Clock className="w-3.5 h-3.5 text-amber-700 animate-spin" />
              <span>
                Berlaku hingga:{' '}
                <strong className="text-stone-900 font-mono">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </strong>
              </span>
            </div>
          </div>

          {/* Total Nominal */}
          <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-amber-800 font-semibold block uppercase">
                Total Tagihan
              </span>
              <span className="text-2xl font-black text-amber-950 font-['Space_Grotesk']">
                {formatRupiah(order.totalAmount)}
              </span>
            </div>

            <button
              onClick={handleCopyAmount}
              className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 text-xs font-bold hover:bg-amber-100 flex items-center gap-1 shadow-xs transition-all active:scale-95"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{isCopied ? 'Tersalin!' : 'Salin'}</span>
            </button>
          </div>

          {/* Supported Apps Logos Pill */}
          <div className="text-center pt-1">
            <p className="text-[11px] text-stone-500 font-medium mb-1.5">
              Bisa dibayar menggunakan aplikasi apa saja:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-bold text-stone-600">
              <span className="px-2 py-0.5 rounded bg-stone-100 border border-stone-200">BCA Mobile</span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">GoPay</span>
              <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200">OVO</span>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">DANA</span>
              <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-800 border border-orange-200">ShopeePay</span>
              <span className="px-2 py-0.5 rounded bg-stone-100 border border-stone-200">Livin' Mandiri</span>
            </div>
          </div>

          {/* Instant Simulation / Verification Action */}
          <div className="pt-2 space-y-2">
            <button
              id="btn-simulate-qris-paid"
              onClick={handleSimulatePayment}
              disabled={isSimulating}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 active:scale-98 transition-all disabled:opacity-75 cursor-pointer"
            >
              {isSimulating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-emerald-200" />
                  <span>Memverifikasi Pembayaran QRIS...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>Saya Sudah Bayar (Konfirmasi QRIS)</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                id="btn-back-menu"
                onClick={onClose}
                className="py-2 text-xs text-stone-500 hover:text-stone-800 font-semibold"
              >
                Nanti Saja / Bayar Tunai di Kasir
              </button>

              {onOpenQrisManagement && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenQrisManagement();
                  }}
                  className="py-2 text-xs text-amber-800 hover:text-amber-900 font-bold flex items-center gap-1"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Akses Data QRIS</span>
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
