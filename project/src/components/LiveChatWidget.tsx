import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Settings, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';

interface LiveChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'barista' | 'user';
  text: string;
  time: string;
}

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({
  isOpen,
  onClose,
}) => {
  // Config state for real tawk.to property & widget ID
  const [tawkPropertyId, setTawkPropertyId] = useState<string>(() => {
    return localStorage.getItem('regalos_tawk_property_id') || '';
  });
  const [tawkWidgetId, setTawkWidgetId] = useState<string>(() => {
    return localStorage.getItem('regalos_tawk_widget_id') || 'default';
  });
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [isTawkLoaded, setIsTawkLoaded] = useState(false);

  // In-app interactive warkop chat messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'barista',
      text: 'Halo kak! Selamat datang di Regalos Warkop ☕ Ada yang bisa kami bantu? Mau tanya menu rekomendasi, password WiFi, atau pesanan?',
      time: 'Baru saja'
    }
  ]);
  const [inputText, setInputText] = useState('');

  // Dynamically load Tawk.to if property ID is configured
  useEffect(() => {
    if (tawkPropertyId.trim()) {
      try {
        const existingScript = document.getElementById('tawk-script');
        if (existingScript) existingScript.remove();

        const s1 = document.createElement('script');
        s1.id = 'tawk-script';
        s1.async = true;
        s1.src = `https://embed.tawk.to/${tawkPropertyId.trim()}/${tawkWidgetId.trim() || 'default'}`;
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');
        document.head.appendChild(s1);

        s1.onload = () => {
          setIsTawkLoaded(true);
        };
      } catch (err) {
        console.warn('Tawk.to load warning:', err);
      }
    }
  }, [tawkPropertyId, tawkWidgetId]);

  const handleSaveTawkConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('regalos_tawk_property_id', tawkPropertyId.trim());
    localStorage.setItem('regalos_tawk_widget_id', tawkWidgetId.trim() || 'default');
    setShowConfigModal(false);

    // If configured and tawk is available, maximize
    const w = window as any;
    if (w.Tawk_API && typeof w.Tawk_API.maximize === 'function') {
      w.Tawk_API.maximize();
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    const query = inputText.trim().toLowerCase();
    setInputText('');

    // Instant helpful barista replies
    setTimeout(() => {
      let reply = 'Terima kasih kak! Barista kami akan segera melayani pesanan Anda.';
      if (query.includes('wifi') || query.includes('password') || query.includes('sandi')) {
        reply = 'Password WiFi Regalos Warkop: "ngopidulu123" (SSID: REGALOS-WARKOP-FREE-WIFI) 📶 Kecepatannya up to 100 Mbps kak!';
      } else if (query.includes('rekomendasi') || query.includes('enak') || query.includes('kopi')) {
        reply = 'Wajib cobain Es Kopi Susu Gula Aren Regalos atau Kopi Tubruk Robusta asli kami kak! Buat makanannya, Indomie Nyemek Spesial Telur Kornet dan Roti Bakar Coklat Keju juaranya!';
      } else if (query.includes('buka') || query.includes('jam') || query.includes('tutup')) {
        reply = 'Regalos Warkop buka setiap hari dari jam 08.00 pagi sampai jam 02.00 dini hari kak. Silakan nongkrong sepuasnya!';
      } else if (query.includes('qris') || query.includes('bayar')) {
        reply = 'Bisa bayar pakai QRIS langsung dari web ini atau tunai di kasir! QRIS kami mendukung BCA, GoPay, OVO, DANA, ShopeePay, dan Livin Mandiri.';
      } else if (query.includes('instagram') || query.includes('ig')) {
        reply = 'Instagram resmi kami di @regalos.warkop kak! Yuk difollow untuk info promo & giveaway nongkrong.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'barista',
          text: reply,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 700);
  };

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
    setTimeout(() => {
      handleSendMessage();
    }, 50);
  };

  const handleOpenTawkDirect = () => {
    const w = window as any;
    if (w.Tawk_API && typeof w.Tawk_API.maximize === 'function') {
      w.Tawk_API.maximize();
    } else {
      setShowConfigModal(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-stone-950/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-sm sm:max-w-md h-full bg-white shadow-2xl flex flex-col z-10 border-l border-stone-200">
        
        {/* Chat Header */}
        <div className="p-4 bg-emerald-800 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-emerald-700 border-2 border-emerald-400 flex items-center justify-center font-bold text-sm">
                RW
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-emerald-800"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm font-['Space_Grotesk']">
                  Live Chat Regalos Warkop
                </h3>
              </div>
              <p className="text-[11px] text-emerald-200 flex items-center gap-1">
                <span>Didukung Tawk.to & Tim Barista</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowConfigModal(true)}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/60"
              title="Pengaturan Tawk.to Property ID"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tawk.to Connection Status Bar */}
        <div className="bg-emerald-900/10 px-4 py-2 border-b border-emerald-900/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-emerald-900 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              {tawkPropertyId ? 'Tawk.to Terhubung' : 'Live Chat Asisten Aktif'}
            </span>
          </div>

          {tawkPropertyId ? (
            <button
              onClick={handleOpenTawkDirect}
              className="text-[11px] text-emerald-800 font-bold hover:underline flex items-center gap-1"
            >
              <span>Buka Widget Tawk.to</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          ) : (
            <button
              onClick={() => setShowConfigModal(true)}
              className="text-[11px] text-emerald-700 font-bold hover:underline"
            >
              + Sambung ID Tawk.to
            </button>
          )}
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50/60">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-amber-800 text-white rounded-br-none'
                    : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-stone-400 mt-1 px-1">{msg.time}</span>
            </div>
          ))}
        </div>

        {/* Quick Question Shortcuts */}
        <div className="p-2.5 bg-stone-100 border-t border-stone-200 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
          <button
            onClick={() => handleQuickQuestion('Bisa minta password WiFi?')}
            className="px-2.5 py-1 bg-white hover:bg-stone-200 rounded-full border border-stone-200 text-stone-700 whitespace-nowrap font-medium text-[11px]"
          >
            📶 Password WiFi?
          </button>
          <button
            onClick={() => handleQuickQuestion('Apa menu kopi paling enak di sini?')}
            className="px-2.5 py-1 bg-white hover:bg-stone-200 rounded-full border border-stone-200 text-stone-700 whitespace-nowrap font-medium text-[11px]"
          >
            ☕ Rekomendasi Menu?
          </button>
          <button
            onClick={() => handleQuickQuestion('Buka sampai jam berapa malam ini?')}
            className="px-2.5 py-1 bg-white hover:bg-stone-200 rounded-full border border-stone-200 text-stone-700 whitespace-nowrap font-medium text-[11px]"
          >
            ⏰ Jam Operasional?
          </button>
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ketik pesan ke barista..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold transition-transform active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

      {/* Tawk.to Custom ID Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-60 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-base text-stone-900 font-['Space_Grotesk']">
                Pengaturan Tawk.to Live Chat
              </h3>
              <button
                onClick={() => setShowConfigModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed mb-4">
              Masukkan <strong>Property ID</strong> & <strong>Widget ID</strong> dari dashboard akun 
              <a href="https://www.tawk.to" target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-bold ml-1 hover:underline">
                tawk.to
              </a> Anda untuk mengaktifkan live chat resmi Regalos Warkop.
            </p>

            <form onSubmit={handleSaveTawkConfig} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Tawk.to Property ID
                </label>
                <input
                  type="text"
                  placeholder="Cth: 651234567890abcdef123456"
                  value={tawkPropertyId}
                  onChange={(e) => setTawkPropertyId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 font-mono"
                />
                <span className="text-[10px] text-stone-400 block mt-1">
                  Didapat dari menu Admin &gt; Property Settings &gt; Property ID di tawk.to
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Widget ID (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="default"
                  value={tawkWidgetId}
                  onChange={(e) => setTawkWidgetId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md"
                >
                  Simpan & Terapkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
