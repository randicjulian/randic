import React, { useState } from 'react';
import { X, Wifi, Instagram, Clock, MapPin, Zap, Check, ExternalLink, Coffee, Heart } from 'lucide-react';

interface WarkopInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WarkopInfoModal: React.FC<WarkopInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedWifi, setCopiedWifi] = useState(false);

  if (!isOpen) return null;

  const wifiSsid = 'REGALOS-WARKOP-FREE-WIFI';
  const wifiPass = 'ngopidulu123';

  const handleCopyWifi = () => {
    navigator.clipboard.writeText(wifiPass);
    setCopiedWifi(true);
    setTimeout(() => setCopiedWifi(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 mb-2">
            <Coffee className="w-3.5 h-3.5" />
            <span>Tentang Regalos Warkop</span>
          </div>

          <h2 className="text-2xl font-black tracking-tight font-['Space_Grotesk'] text-white">
            Regalos Warkop
          </h2>
          <p className="text-xs text-stone-300 mt-1 leading-relaxed">
            Tempat nongkrong santai, racikan kopi autentik nusantara, mie nyemek juara, dan koneksi internet cepat.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* WiFi Card */}
          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Wifi className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Free High-Speed WiFi (100 Mbps)
                </span>
                <p className="text-xs text-stone-700">
                  SSID: <strong className="font-mono text-stone-900">{wifiSsid}</strong>
                </p>
                <p className="text-xs text-stone-700">
                  Password: <strong className="font-mono text-stone-900">{wifiPass}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={handleCopyWifi}
              className="px-3 py-2 rounded-xl bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
            >
              {copiedWifi ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <span>Salin Sandi</span>
              )}
            </button>
          </div>

          {/* Instagram Official Card */}
          <div className="p-4 bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 rounded-2xl border border-pink-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white flex items-center justify-center shadow-xs">
                <Instagram className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wider block">
                  Instagram Resmi
                </span>
                <p className="text-sm font-extrabold text-stone-900">
                  @regalos.warkop
                </p>
                <p className="text-[11px] text-stone-500">
                  Cek update event nongkrong, live music & promo!
                </p>
              </div>
            </div>

            <a
              href="https://www.instagram.com/regalos.warkop?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <span>Follow</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Opening Hours & Location Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-stone-900">
                <Clock className="w-4 h-4 text-amber-700" />
                <span>Jam Operasional</span>
              </div>
              <p className="text-stone-600">
                Buka Setiap Hari:
              </p>
              <p className="font-extrabold text-amber-900">
                08.00 WIB &ndash; 02.00 Subuh
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-stone-900">
                <Zap className="w-4 h-4 text-amber-700" />
                <span>Fasilitas Warkop</span>
              </div>
              <ul className="text-stone-600 list-disc list-inside space-y-0.5 text-[11px]">
                <li>Colokan Listrik Tiap Meja</li>
                <li>Area Indoor AC & Outdoor Smoking</li>
                <li>Toilet & Musholla Bersih</li>
              </ul>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <span className="text-xs text-stone-500 flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for Regalos Warkop
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
