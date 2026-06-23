import {
  MapPin,
  Phone,
  Package,
  Image as ImageIcon,
  Truck,
  Search,
  Send,
  X,
  ChevronLeft,
} from 'lucide-react';
import useOrder from '../../hooks/orderDashboard';
import { useNavigate } from 'react-router';


const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function OrderDashboard() {
  const {
    orders,
    setSelectedOrderId,
    setTrackingInput,
    handleInstantShip,
    getStatusBadge,
    trackingInput,
    selectedOrderId,
    activeOrder,
    formatCurrency,
    orderRef,
    containerOrderRef,
    handleNotifToWA,
    hasMore
  } = useOrder();
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen md:h-[calc(100vh-2rem)] bg-white dark:bg-slate-950 shadow-2xl shadow-slate-200/50 dark:shadow-none flex overflow-hidden font-sans relative">

      <div
        className={`w-full md:w-[380px] border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xl shrink-0 transition-all duration-300 ${selectedOrderId ? 'hidden md:flex' : 'flex' // Sembunyikan di mobile jika order dipilih
          }`}
      >
        {/* Header List & Search */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md z-10 sticky top-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">Daftar Pesanan</h2>
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
              aria-label="Close"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>

          <div className="relative group">
            <input
              type="text"
              placeholder="Cari nama atau ID order..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 shadow-sm"
            />
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
        </div>

        {/* Scrollable List */}
        <div
          ref={containerOrderRef}
          className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-track]:bg-transparent"
        >
          {orders.map((order) => {
            const isSelected = order.id === selectedOrderId;
            return (
              <div
                key={order.id}
                onClick={() => {
                  setSelectedOrderId(order.id);
                  setTrackingInput("");
                }}
                className={`p-5 cursor-pointer transition-all flex flex-col gap-2.5 relative group ${isSelected
                    ? 'bg-white dark:bg-slate-800/80 shadow-sm'
                    : 'hover:bg-white/60 dark:hover:bg-slate-800/40'
                  }`}
              >
                {/* Indikator Aktif Kiri */}
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full" />
                )}

                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{order.id}</span>
                  <span className="text-[10px] text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {formatDate(order.createdAt)}
                  </span>
                </div>

                <div className="flex justify-between items-end gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                      {order.details?.customerName || "Pelanggan Anonim"}
                    </h4>
                    <p className="text-sm font-black text-indigo-600 dark:text-indigo-400 mt-1">
                      {formatCurrency(order.totalPrice)}
                    </p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold tracking-wide uppercase shrink-0 ${getStatusBadge(order.status)}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Loading State */}
          <div ref={orderRef} className="w-full p-6">
            {hasMore && (
              <div className="w-full flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-4 border-indigo-100 dark:border-indigo-900/30 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memuat Data...</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedOrderId && activeOrder ? (
        <div className={`flex-1 min-w-0 flex-col bg-white dark:bg-slate-950 overflow-y-auto relative [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-800 ${selectedOrderId ? 'flex' : 'hidden md:flex' // Tampil penuh di mobile jika dipilih
          }`}>
          <div className={`sticky top-0 left-0 right-0 h-1.5 z-20 ${activeOrder.status === 'pending' ? 'bg-amber-400' :
              activeOrder.status === 'on_delivery' ? 'bg-indigo-600' : 'bg-emerald-500'
            }`} />

          <div className="p-5 md:p-8 flex flex-col gap-6 lg:gap-8 max-w-4xl mx-auto w-full">
            <button
              onClick={() => setSelectedOrderId(null)}
              className="md:hidden flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors w-fit -mt-2"
            >
              <ChevronLeft size={18} />
              Kembali ke Daftar
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-slate-100 dark:border-slate-800/80">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {activeOrder.id}
                  </h1>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold tracking-wide ${getStatusBadge(activeOrder.status)}`}>
                    {activeOrder.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Update terakhir: {formatDate(activeOrder.updatedAt)}
                </p>
              </div>

              {activeOrder.status === 'pending' && (
                <button
                  onClick={() => handleInstantShip(activeOrder.id)}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/20 dark:shadow-none transition-all w-full sm:w-auto"
                >
                  <Send size={16} />
                  Kirim Pesanan
                </button>
              )}
            </div>


            {activeOrder.status === 'on_delivery' && (
              <div className="p-5 bg-gradient-to-r from-indigo-50 to-blue-50/50 dark:from-indigo-900/20 dark:to-blue-900/10 border border-indigo-100 dark:border-indigo-800/50 rounded-2xl flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-indigo-100 dark:bg-indigo-800/50 rounded-xl shrink-0">
                    <Truck className="text-indigo-600 dark:text-indigo-400" size={20} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-indigo-950 dark:text-indigo-300">Pesanan Sedang Dikirim</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">Masukkan nomor resi agar notifikasi otomatis terkirim via WhatsApp pelanggan.</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0 mt-2 lg:mt-0">
                  <input
                    type="text"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    placeholder="CONTOH: JX123456789..."
                    className="px-4 py-2.5 border border-indigo-200 dark:border-indigo-700/50 rounded-xl text-sm outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-600 w-full sm:w-56 font-medium shadow-sm uppercase placeholder:normal-case"
                  />
                  <button
                    onClick={handleNotifToWA}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-bold rounded-xl transition-colors shadow-md shadow-indigo-600/20 shrink-0 w-full sm:w-auto"
                  >
                    Simpan & Notif WA
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 flex items-start gap-4 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm shrink-0">
                  <Package size={18} className="text-slate-400" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Pelanggan</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeOrder.details?.customerName || '-'}
                  </span>
                </div>
              </div>

              <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 flex items-start gap-4 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm shrink-0">
                  <Phone size={18} className="text-slate-400" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">WhatsApp</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeOrder.details?.phone || '-'}
                  </span>
                </div>
              </div>

              <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 flex items-start gap-4 md:col-span-2 lg:col-span-3 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm shrink-0">
                  <MapPin size={18} className="text-slate-400" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Alamat Pengiriman</span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                    {activeOrder.details?.address || 'Tidak ada alamat terlampir.'}
                  </span>
                </div>
              </div>
            </div>


            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Rincian Item Produk
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs px-2 py-0.5 rounded-full">
                  {activeOrder.details?.items?.length || 0}
                </span>
              </h3>

              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-slate-900">
                <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {activeOrder.details?.items?.map((item, idx) => (
                    <div key={item.id || idx} className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                      <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0 overflow-hidden relative">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.nameProduct} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <ImageIcon size={20} className="text-slate-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-bold text-slate-900 dark:text-white truncate">{item.nameProduct}</h4>
                        <p className="text-sm text-slate-500 mt-1">{formatCurrency(item.price)} <span className="mx-1 text-slate-300 dark:text-slate-600">×</span> {item.quantity}</p>
                      </div>

                      <div className="text-left sm:text-right mt-2 sm:mt-0 bg-slate-50 sm:bg-transparent dark:bg-slate-800/50 sm:dark:bg-transparent p-3 sm:p-0 rounded-lg">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest sm:hidden mb-1">Subtotal</p>
                        <p className="text-base font-black text-slate-900 dark:text-white">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-indigo-50/50 dark:bg-indigo-950/20 p-5 flex flex-col sm:flex-row justify-between sm:items-center border-t border-slate-200 dark:border-slate-800 gap-2">
                  <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Total Pembayaran</span>
                  <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    {formatCurrency(activeOrder.totalPrice)}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 text-slate-400 text-center p-8">
          <div className="w-24 h-24 mb-6 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center">
            <Package size={40} className="text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-600 dark:text-slate-300 mb-2">Belum Ada Pesanan Terpilih</h3>
          <p className="text-sm max-w-sm">Pilih salah satu pesanan dari daftar di sebelah kiri untuk melihat rincian lengkap, memproses pengiriman, dan mengirimkan notifikasi resi.</p>
        </div>
      )}

    </div>
  );
}