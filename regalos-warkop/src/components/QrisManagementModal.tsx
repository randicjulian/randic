import React, { useState, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  X, 
  Download, 
  Save, 
  Upload, 
  CheckCircle2, 
  Copy, 
  Printer, 
  Building2, 
  FileSpreadsheet, 
  ShieldCheck, 
  RefreshCw,
  Eye,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { QrisConfig, Order } from '../types';
import { formatRupiah, formatDateTime } from '../utils/formatters';

interface QrisManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrisConfig: QrisConfig;
  onSaveQrisConfig: (newConfig: QrisConfig) => void;
  orders: Order[];
  onVerifyOrderPayment?: (orderId: string) => void;
  onOpenReceipt?: (order: Order) => void;
}

export const QrisManagementModal: React.FC<QrisManagementModalProps> = ({
  isOpen,
  onClose,
  qrisConfig,
  onSaveQrisConfig,
  orders,
  onVerifyOrderPayment,
  onOpenReceipt,
}) => {
  const [activeTab, setActiveTab] = useState<'config' | 'transactions' | 'standee'>('config');

  // Form State
  const [merchantName, setMerchantName] = useState(qrisConfig.merchantName);
  const [nmid, setNmid] = useState(qrisConfig.nmid);
  const [city, setCity] = useState(qrisConfig.city);
  const [postalCode, setPostalCode] = useState(qrisConfig.postalCode);
  const [acquirerName, setAcquirerName] = useState(qrisConfig.acquirerName);
  const [customQrString, setCustomQrString] = useState(qrisConfig.customQrString || '');
  const [customQrImageUrl, setCustomQrImageUrl] = useState(qrisConfig.customQrImageUrl || '');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [copiedNmid, setCopiedNmid] = useState(false);

  // Standee dynamic QR preview
  const [standeeQrUrl, setStandeeQrUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setMerchantName(qrisConfig.merchantName);
    setNmid(qrisConfig.nmid);
    setCity(qrisConfig.city);
    setPostalCode(qrisConfig.postalCode);
    setAcquirerName(qrisConfig.acquirerName);
    setCustomQrString(qrisConfig.customQrString || '');
    setCustomQrImageUrl(qrisConfig.customQrImageUrl || '');
  }, [qrisConfig]);

  React.useEffect(() => {
    // Generate sample QR for standee preview
    if (customQrImageUrl) {
      setStandeeQrUrl(customQrImageUrl);
    } else {
      const payload = customQrString || `00020101021126670016ID.CO.QRIS.WWW01189360091800000000000215${nmid || 'ID1024395829104'}0303UME51440014ID.GO.BI.QRIS01189360091800000000000215${nmid || 'ID1024395829104'}0303UME5204581253033605802ID59${String(merchantName.length).padStart(2, '0')}${merchantName}60${String(city.length).padStart(2, '0')}${city}6105${postalCode || '12340'}6304`;
      QRCode.toDataURL(payload, {
        width: 320,
        margin: 1,
        color: { dark: '#1c1917', light: '#ffffff' },
      }).then((url) => setStandeeQrUrl(url)).catch((e) => console.error(e));
    }
  }, [merchantName, nmid, city, postalCode, customQrString, customQrImageUrl]);

  if (!isOpen) return null;

  // Filter QRIS transactions
  const qrisOrders = orders.filter((o) => o.paymentMethod === 'QRIS');
  const totalQrisRevenue = qrisOrders
    .filter((o) => o.paymentStatus === 'LUNAS')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingQrisOrders = qrisOrders.filter((o) => o.paymentStatus === 'BELUM_BAYAR');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: QrisConfig = {
      merchantName: merchantName.trim() || 'REGALOS WARKOP',
      nmid: nmid.trim() || 'ID1024395829104',
      city: city.trim() || 'JAKARTA',
      postalCode: postalCode.trim() || '12340',
      acquirerName: acquirerName.trim() || 'BCA / QRIS NASIONAL',
      customQrString: customQrString.trim() ? customQrString.trim() : undefined,
      customQrImageUrl: customQrImageUrl.trim() ? customQrImageUrl.trim() : undefined,
    };
    onSaveQrisConfig(updated);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCustomQrImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportCsv = () => {
    const headers = ['No. Invoice', 'Waktu Transaksi', 'Nama Pemesan', 'Meja / Area', 'Metode Bayar', 'Total Nominal (Rp)', 'Status Bayar', 'Status Pesanan'];
    const rows = qrisOrders.map((o) => [
      o.invoiceNumber,
      `"${formatDateTime(o.createdAt)}"`,
      `"${o.customerName}"`,
      `"${o.orderType === 'TAKEAWAY' ? 'Takeaway' : o.tableNumber}"`,
      'QRIS',
      o.totalAmount,
      o.paymentStatus,
      o.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `laporan-qris-regalos-warkop-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyNmid = () => {
    navigator.clipboard.writeText(nmid);
    setCopiedNmid(true);
    setTimeout(() => setCopiedNmid(false), 2000);
  };

  const handlePrintStandee = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        
        {/* Top Header */}
        <div className="p-5 bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white flex items-center justify-between border-b border-stone-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#b91c1c] text-white flex items-center justify-center font-black text-xs shadow-md border border-red-400/40">
              QRIS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold font-['Space_Grotesk'] text-white">
                  Pusat Data & Pengaturan QRIS
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Resmi Terverifikasi
                </span>
              </div>
              <p className="text-xs text-stone-300">
                Kelola data merchant, pantau mutasi pembayaran QRIS pengunjung, & cetak standee meja.
              </p>
            </div>
          </div>

          <button
            id="btn-close-qris-mgmt"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-3 bg-stone-100 border-b border-stone-200 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'config'
                ? 'bg-white text-stone-900 border-t-2 border-amber-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <Building2 className="w-4 h-4 text-amber-700" />
            <span>Pengaturan Identitas Merchant</span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'transactions'
                ? 'bg-white text-stone-900 border-t-2 border-amber-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Data Mutasi Transaksi QRIS ({qrisOrders.length})</span>
            {pendingQrisOrders.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-stone-950 font-black text-[10px] flex items-center justify-center">
                {pendingQrisOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('standee')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'standee'
                ? 'bg-white text-stone-900 border-t-2 border-amber-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <Printer className="w-4 h-4 text-purple-700" />
            <span>Cetak Standee QRIS Meja Warkop</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-stone-50">
          
          {/* TAB 1: PENGATURAN IDENTITAS MERCHANT */}
          {activeTab === 'config' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left 2 Cols: Form */}
              <form onSubmit={handleSave} className="lg:col-span-2 space-y-4">
                
                {saveSuccessMsg && (
                  <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Data QRIS Regalos Warkop berhasil diperbarui dan tersimpan!</span>
                  </div>
                )}

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                  <h3 className="font-extrabold text-sm text-stone-900 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Data Profil Merchant Bank Indonesia</span>
                  </h3>

                  {/* Merchant Name */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Nama Merchant QRIS (Tampil pada struk & scan HP pelanggan)
                    </label>
                    <input
                      type="text"
                      required
                      value={merchantName}
                      onChange={(e) => setMerchantName(e.target.value)}
                      placeholder="REGALOS WARKOP"
                      className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-800 uppercase"
                    />
                  </div>

                  {/* NMID */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-stone-700">
                        NMID (National Merchant Identifier)
                      </label>
                      <button
                        type="button"
                        onClick={handleCopyNmid}
                        className="text-[11px] text-amber-800 font-bold hover:underline flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedNmid ? 'Tersalin!' : 'Salin NMID'}</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={nmid}
                      onChange={(e) => setNmid(e.target.value)}
                      placeholder="ID1024395829104"
                      className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-800"
                    />
                    <span className="text-[10px] text-stone-400 mt-1 block">
                      Kode unik 13–15 digit yang diberikan oleh Bank / Penyelenggara Jasa Pembayaran (PJP).
                    </span>
                  </div>

                  {/* Bank & Kota */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Bank / Acquirer Penyelenggara
                      </label>
                      <select
                        value={acquirerName}
                        onChange={(e) => setAcquirerName(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                      >
                        <option value="BCA / QRIS NASIONAL">BCA (Merchant QRIS)</option>
                        <option value="Bank Mandiri (Livin Usaha)">Bank Mandiri (Livin' Usaha)</option>
                        <option value="Bank BRI (BRImo Merchant)">Bank BRI (Merchant)</option>
                        <option value="Bank BNI">Bank BNI</option>
                        <option value="GoPay Merchant">GoPay Merchant</option>
                        <option value="DANA Bisnis">DANA Bisnis</option>
                        <option value="ShopeePay Merchant">ShopeePay Merchant</option>
                        <option value="Bank Nobu / OVO">Bank Nobu / OVO</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Kota Domisili Warkop
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="JAKARTA"
                        className="w-full px-3 py-2 text-xs uppercase rounded-xl border border-stone-300"
                      />
                    </div>
                  </div>

                </div>

                {/* Upload Real QRIS Image / Custom String */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                  <h3 className="font-extrabold text-sm text-stone-900 uppercase tracking-wider flex items-center gap-2">
                    <Upload className="w-4 h-4 text-amber-700" />
                    <span>Upload Foto Stiker QRIS Asli Toko Anda (Opsional)</span>
                  </h3>
                  <p className="text-xs text-stone-500">
                    Jika warkop Anda sudah memiliki stiker atau gambar QRIS resmi dari bank, Anda dapat mengunggah fotonya di sini agar pelanggan scan gambar stiker asli Anda secara langsung!
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl border border-stone-300 flex items-center gap-2 shadow-xs"
                    >
                      <Upload className="w-4 h-4 text-stone-600" />
                      <span>Pilih File Gambar QRIS</span>
                    </button>

                    {customQrImageUrl && (
                      <button
                        type="button"
                        onClick={() => setCustomQrImageUrl('')}
                        className="text-xs text-red-600 hover:underline font-semibold"
                      >
                        Hapus Gambar & Gunakan QR Dinamis Otomatis
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Atau Masukkan Custom EMVCo QRIS Payload Text
                    </label>
                    <textarea
                      rows={2}
                      value={customQrString}
                      onChange={(e) => setCustomQrString(e.target.value)}
                      placeholder="00020101021126670016ID.CO.QRIS.WWW0118..."
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-stone-300"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    id="btn-save-qris-data"
                    className="px-6 py-3 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-amber-900/20 active:scale-95 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan Data QRIS</span>
                  </button>
                </div>

              </form>

              {/* Right Col: Live Active QRIS Card */}
              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-md flex flex-col items-center text-center space-y-3">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  Tampilan Aktif Pelanggan
                </span>

                <div className="w-full bg-[#b91c1c] text-white p-2.5 rounded-t-2xl flex items-center justify-between shadow-inner">
                  <div className="flex items-center gap-1.5 text-xs font-black">
                    <span className="bg-white text-[#b91c1c] px-1.5 py-0.5 rounded text-[10px]">QRIS</span>
                    <span className="text-[10px]">GPN</span>
                  </div>
                  <span className="text-[9px] uppercase font-bold text-red-100">National QR</span>
                </div>

                <div className="p-3 bg-white border border-stone-200 rounded-2xl shadow-sm">
                  {standeeQrUrl ? (
                    <img
                      src={standeeQrUrl}
                      alt="Active QRIS"
                      className="w-44 h-44 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-44 h-44 flex items-center justify-center text-xs text-stone-400">
                      Memuat QR...
                    </div>
                  )}
                </div>

                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-sm text-stone-900">{merchantName}</h4>
                  <p className="text-[10px] font-mono text-stone-500">NMID: {nmid}</p>
                  <p className="text-[10px] text-emerald-700 font-semibold">{acquirerName}</p>
                </div>

                <div className="w-full pt-3 border-t border-stone-100 text-[11px] text-stone-500">
                  <p className="leading-relaxed">
                    Setiap pelanggan yang scan melalui aplikasi Mobile Banking (BCA, Mandiri, BRI) atau E-Wallet (GoPay, OVO, DANA) akan membaca data merchant ini.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: DATA MUTASI TRANSAKSI QRIS */}
          {activeTab === 'transactions' && (
            <div className="space-y-4">
              
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                  <span className="text-xs text-stone-500 font-semibold block mb-1">
                    Total Mutasi QRIS Masuk
                  </span>
                  <span className="text-xl font-black text-amber-950 font-['Space_Grotesk']">
                    {formatRupiah(totalQrisRevenue)}
                  </span>
                  <p className="text-[10px] text-emerald-600 mt-1 font-semibold">
                    {qrisOrders.filter(o => o.paymentStatus === 'LUNAS').length} transaksi berhasil
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                  <span className="text-xs text-stone-500 font-semibold block mb-1">
                    Menunggu Verifikasi QRIS
                  </span>
                  <span className="text-xl font-black text-stone-900 font-['Space_Grotesk']">
                    {pendingQrisOrders.length}
                  </span>
                  <p className="text-[10px] text-amber-700 mt-1 font-semibold">
                    {formatRupiah(pendingQrisOrders.reduce((sum, o) => sum + o.totalAmount, 0))} belum lunas
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
                  <span className="text-xs text-stone-500 font-semibold block mb-1">
                    Ekspor Laporan Transaksi
                  </span>
                  <button
                    onClick={handleExportCsv}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Laporan CSV</span>
                  </button>
                </div>
              </div>

              {/* Transaction Ledger Table */}
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                <div className="p-4 border-b border-stone-100 flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-stone-900">
                    Buku Rekening & Mutasi Pembayaran QRIS
                  </h3>
                  <span className="text-xs text-stone-500">
                    Total {qrisOrders.length} Catatan Transaksi
                  </span>
                </div>

                {qrisOrders.length === 0 ? (
                  <div className="text-center py-12 text-xs text-stone-400">
                    Belum ada riwayat transaksi QRIS.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200">
                        <tr>
                          <th className="p-3">Waktu</th>
                          <th className="p-3">No. Invoice</th>
                          <th className="p-3">Pemesan</th>
                          <th className="p-3">Meja</th>
                          <th className="p-3">Nominal QRIS</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {qrisOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-stone-50/70">
                            <td className="p-3 text-stone-600">
                              {formatDateTime(order.createdAt)}
                            </td>
                            <td className="p-3 font-mono font-bold text-stone-900">
                              {order.invoiceNumber}
                            </td>
                            <td className="p-3 font-bold text-stone-800">
                              {order.customerName}
                            </td>
                            <td className="p-3 text-stone-600">
                              {order.orderType === 'TAKEAWAY' ? 'Takeaway' : order.tableNumber}
                            </td>
                            <td className="p-3 font-black text-amber-900">
                              {formatRupiah(order.totalAmount)}
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  order.paymentStatus === 'LUNAS'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {order.paymentStatus === 'LUNAS' ? 'LUNAS' : 'MENUNGGU BAYAR'}
                              </span>
                            </td>
                            <td className="p-3 text-right space-x-1">
                              {order.paymentStatus === 'BELUM_BAYAR' && onVerifyOrderPayment && (
                                <button
                                  onClick={() => onVerifyOrderPayment(order.id)}
                                  className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px]"
                                >
                                  Verifikasi Lunas
                                </button>
                              )}
                              {onOpenReceipt && (
                                <button
                                  onClick={() => onOpenReceipt(order)}
                                  className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-semibold"
                                >
                                  Nota
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: CETAK STANDEE QRIS MEJA */}
          {activeTab === 'standee' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-stone-900">
                    Template Standee QRIS Meja Kasir / Meja Pengunjung
                  </h3>
                  <p className="text-xs text-stone-500">
                    Cetak langsung atau simpan sebagai PDF untuk dipasang di akrilik meja warkop Anda.
                  </p>
                </div>

                <button
                  onClick={handlePrintStandee}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-4 h-4 text-amber-300" />
                  <span>Cetak Standee Meja</span>
                </button>
              </div>

              {/* Printable Standee Sheet */}
              <div className="max-w-sm mx-auto bg-white p-6 rounded-3xl border-2 border-stone-300 shadow-xl text-center space-y-4 print-area">
                
                {/* Header Red GPN */}
                <div className="bg-[#b91c1c] text-white p-3 rounded-2xl flex items-center justify-between shadow-inner">
                  <span className="font-black text-sm tracking-wider bg-white text-[#b91c1c] px-2 py-0.5 rounded">
                    QRIS
                  </span>
                  <span className="text-xs font-bold tracking-wide">
                    PEMBAYARAN DIGITAL NASIONAL
                  </span>
                </div>

                <div>
                  <h2 className="text-xl font-black text-stone-950 font-['Space_Grotesk'] tracking-tight">
                    {merchantName}
                  </h2>
                  <p className="text-xs text-stone-500">
                    NMID: <strong className="font-mono text-stone-800">{nmid}</strong>
                  </p>
                  <p className="text-[10px] text-emerald-800 font-bold">
                    A.S.P: {acquirerName}
                  </p>
                </div>

                {/* QR Code Container */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 inline-block shadow-inner">
                  {standeeQrUrl && (
                    <img
                      src={standeeQrUrl}
                      alt="QRIS Standee"
                      className="w-56 h-56 object-contain rounded-lg mx-auto"
                    />
                  )}
                </div>

                {/* Supported Wallets */}
                <div className="pt-2 border-t border-stone-100 space-y-1">
                  <p className="text-[11px] font-bold text-stone-700">
                    Mendukung Semua E-Wallet & Mobile Banking:
                  </p>
                  <p className="text-[10px] text-stone-500">
                    BCA &bull; Livin' Mandiri &bull; BRImo &bull; BNI &bull; GoPay &bull; OVO &bull; DANA &bull; ShopeePay &bull; LinkAja
                  </p>
                </div>

                <div className="text-[10px] text-stone-400 pt-1">
                  Dicetak untuk Regalos Warkop &bull; Instagram: @regalos.warkop
                </div>

              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
