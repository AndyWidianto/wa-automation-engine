import {
  MapPin,
  Phone,
  Package,
  Image as ImageIcon,
  Truck,
  Search,
  Send,
  X,
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
    handleNotifToWA
  } = useOrder();
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl flex overflow-hidden font-sans">
      <div className="w-full md:w-[360px] border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
        {/* Header List & Search */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Daftar Pesanan</h2>
            <button
              onClick={() => navigate(-1)}
              className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Cari nama atau ID order..."
              className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-transparent rounded-lg text-xs outline-none focus:bg-white focus:border-indigo-500 dark:focus:bg-slate-900 transition-all text-slate-700 dark:text-slate-200"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* Scrollable List */}
        <div ref={containerOrderRef} className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
          {orders.map((order) => {
            const isSelected = order.id === selectedOrderId;
            return (
              <div
                key={order.id}
                onClick={() => {
                  setSelectedOrderId(order.id);
                  setTrackingInput(""); // reset input resi setiap ganti order
                }}
                className={`p-4 cursor-pointer transition-all flex flex-col gap-2 relative ${isSelected
                  ? 'bg-white dark:bg-slate-800/60 shadow-sm border-l-4 border-indigo-600'
                  : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/30 border-l-4 border-transparent'
                  }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{order.id}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{formatDate(order.createdAt)}</span>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[160px]">
                      {order.details && order.details.customerName}
                    </h4>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-400 mt-0.5">
                      {formatCurrency(order.totalPrice)}
                    </p>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${getStatusBadge(order.status)}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={orderRef} className="w-full p-2"></div>
        </div>
      </div>

      {/* ================= RIGHT PANE: SELECTED ORDER DETAILS ================= */}
      {selectedOrderId && <div className="flex-1 min-w-0 flex flex-col bg-white dark:bg-slate-900 overflow-y-auto relative">
        {/* Top Status Indicator Color Line */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${activeOrder.status === 'pending' ? 'bg-slate-400' :
          activeOrder.status === 'on_delivery' ? 'bg-indigo-600' : 'bg-emerald-500'
          }`} />

        {/* Main Content Detail Wrapper */}
        <div className="p-6 md:p-8 flex flex-col gap-6 max-w-4xl">

          {/* Header Detail & Quick Action Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6 mt-2">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {activeOrder.id}
                </h1>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide ${getStatusBadge(activeOrder.status)}`}>
                  {activeOrder.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Terakhir diperbarui: {formatDate(activeOrder.updatedAt)}</p>
            </div>

            {/* ACTION BUTTON JIKA STATUS PENDING */}
            {activeOrder.status === 'pending' && (
              <button
                onClick={() => handleInstantShip(activeOrder.id)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-200 dark:shadow-none transition-all"
              >
                <Send size={14} />
                Kirim Pesanan Sekarang
              </button>
            )}
          </div>

          {/* Form Resi khusus jika status sudah beralih ke ON_DELIVERY */}
          {activeOrder.status === 'on_delivery' && (
            <div className="p-4 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-xl flex flex-col lg:flex-row sm:items-center gap-3 justify-between animate-in slide-in-from-top-3 duration-200">
              <div className="flex items-start gap-2.5">
                <Truck className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <h4 className="text-sm font-bold text-indigo-950 dark:text-indigo-300">Pesanan Sedang Dikirim</h4>
                  <p className="text-xs text-slate-500">Masukkan nomor resi kurir untuk dikirimkan otomatis ke WhatsApp user.</p>
                </div>
              </div>
              <div className="flex gap-2 sm:w-auto w-full">
                <input
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder="Isi No. Resi..."
                  className="px-3 py-1.5 border border-indigo-200 dark:border-indigo-800 rounded-lg text-xs outline-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:border-indigo-600 w-full sm:w-40"
                />
                <button onClick={handleNotifToWA} className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 shrink-0">
                  Simpan & Notif WA
                </button>
              </div>
            </div>
          )}

          {/* Grid: Informasi Pelanggan */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/40 flex items-start gap-3">
              <Package size={18} className="text-slate-400 mt-0.5" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Nama Pelanggan</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{activeOrder.details && activeOrder.details.customerName}</span>
              </div>
            </div>

            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/40 flex items-start gap-3">
              <Phone size={18} className="text-slate-400 mt-0.5" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Kontak WhatsApp</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{activeOrder.details && activeOrder.details.phone}</span>
              </div>
            </div>

            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/40 flex items-start gap-3 md:col-span-3">
              <MapPin size={18} className="text-slate-400 mt-0.5" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Alamat Lengkap Pengiriman</span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{activeOrder.details && activeOrder.details.address}</span>
              </div>
            </div>
          </div>

          {/* Tabel Detail Item Produk */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rincian Item Produk</h3>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {activeOrder.details && activeOrder.details.items && activeOrder.details.items.map((item, idx) => (
                  <div key={item.id || idx} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors bg-white dark:bg-slate-900">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.nameProduct} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <ImageIcon size={18} className="text-slate-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{item.nameProduct}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{formatCurrency(item.price)}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">x{item.quantity}</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Invoice Footer Total */}
              <div className="bg-slate-50 dark:bg-slate-800/30 p-4 flex justify-between items-center border-t border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500 uppercase">Total Akhir</span>
                <span className="text-lg font-black text-slate-950 dark:text-white">
                  {formatCurrency(activeOrder.totalPrice)}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>}

    </div>
  );
}