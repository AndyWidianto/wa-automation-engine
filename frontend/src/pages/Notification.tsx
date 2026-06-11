import { useState } from 'react';
import { 
  X, 
  ChevronDown, 
  MapPin, 
  Phone, 
  Package, 
  ImageIcon,
  Maximize2,
  ThumbsUp,
  Link2,
  MoreHorizontal
} from 'lucide-react';

// --- Helper Formatting ---
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

export default function OrderDetailView() {
  // Data simulasi berdasarkan JSON yang Anda berikan
  const orderData = {
    id: "ORD-9921-XY",
    isOrderValid: true,
    customerName: "Ahmad Dani",
    phone: "081234567890",
    address: "Jl. Sudirman No. 45, RT 01/RW 02, Kebayoran Baru, Jakarta Selatan",
    totalPrice: 225000,
    items: [
      {
        id: "product1",
        price: 140000,
        nameProduct: "Celana Chino Panjang Premium",
        imageUrl: "", // Kosong untuk simulasi placeholder
        quantity: 1,
      },
      {
        id: "product2",
        price: 85000,
        nameProduct: "Kaos Polos Oversize Hitam",
        imageUrl: "",
        quantity: 1,
      }
    ]
  };

  // State untuk Update Status (seperti tombol di kanan atas Asana)
  const [currentStatus, setCurrentStatus] = useState("On Delivery");

  // Mock Riwayat Status (Untuk sidebar kiri meniru Asana)
  const statusHistory = [
    {
      id: 1,
      title: "Pesanan siap dikirim ke tujuan...",
      date: "Okt 24",
      status: "On Delivery",
      color: "bg-blue-500",
      bgBadge: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      isActive: true
    },
    {
      id: 2,
      title: "Pembayaran telah dikonfirmasi...",
      date: "Okt 23",
      status: "Process",
      color: "bg-yellow-500",
      bgBadge: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
      isActive: false
    },
    {
      id: 3,
      title: "Pesanan baru dibuat oleh sistem...",
      date: "Okt 23",
      status: "Pending",
      color: "bg-gray-500",
      bgBadge: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
      isActive: false
    }
  ];

  const onClose = () => {}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/50 backdrop-blur-sm transition-opacity">
      {/* Main Container */}
      <div className="bg-white dark:bg-[#111827] w-full max-w-6xl h-[85vh] md:h-[80vh] rounded-xl shadow-2xl flex flex-col overflow-hidden font-sans border border-gray-200 dark:border-gray-800">
        
        {/* Header Component */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827]">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Status of '{orderData.id}'
          </h2>
          <div className="flex items-center gap-3">
            {/* Update Status Dropdown */}
            <div className="relative">
              <select 
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value)}
                className="appearance-none bg-white dark:bg-[#1f2937] border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-1.5 pl-4 pr-10 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="Pending">Pending</option>
                <option value="Process">Process</option>
                <option value="On Delivery">Update status</option>
                <option value="Completed">Completed</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
            {/* Close Button */}
            <button onClick={onClose} className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body Content (2 Columns) */}
        <div className="flex flex-1 overflow-hidden flex-col md:flex-row bg-white dark:bg-[#111827]">
          
          {/* LEFT SIDEBAR: History / Timeline */}
          <div className="w-full md:w-[320px] bg-gray-50 dark:bg-gray-800/30 border-r border-gray-200 dark:border-gray-800 overflow-y-auto hidden md:block">
            {statusHistory.map((history) => (
              <div 
                key={history.id} 
                className={`p-5 border-b border-gray-200 dark:border-gray-800 cursor-pointer transition-colors ${history.isActive ? 'bg-white dark:bg-[#1f2937] shadow-sm' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm text-gray-800 dark:text-gray-200 font-medium leading-snug pr-4">
                    {history.title}
                  </p>
                  <span className="text-xs text-gray-500 whitespace-nowrap">{history.date}</span>
                </div>
                <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold mt-2 ${history.bgBadge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${history.color}`}></span>
                  {history.status}
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT CONTENT: Detail View */}
          <div className="flex-1 flex flex-col relative overflow-y-auto">
            {/* Top Colored Indicator Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-500"></div>
            
            <div className="p-8 lg:p-10">
              {/* Toolbar Icons (Top Right inside content) */}
              <div className="flex justify-end gap-4 text-gray-400 mb-6">
                <button className="hover:text-gray-600 dark:hover:text-gray-200"><Maximize2 size={18} /></button>
                <button className="hover:text-gray-600 dark:hover:text-gray-200"><ThumbsUp size={18} /></button>
                <button className="hover:text-gray-600 dark:hover:text-gray-200"><Link2 size={18} /></button>
                <button className="hover:text-gray-600 dark:hover:text-gray-200"><MoreHorizontal size={18} /></button>
              </div>

              {/* Main Title */}
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Pesanan sedang dalam pengiriman!
              </h1>

              {/* Meta Info (Customer & Status) */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                  {orderData.customerName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">{orderData.customerName}</span>
                    <span className="text-sm text-gray-500">Okt 24</span>
                  </div>
                  <div className="flex items-center gap-6 mt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 min-w-[50px]">Status</span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        On Delivery
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Section */}
              <div className="mb-10">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Ringkasan Pengiriman</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Pesanan untuk <span className="font-semibold">{orderData.customerName}</span> telah berhasil diverifikasi dan saat ini sedang dalam proses pengiriman menuju alamat tujuan. Pastikan pelanggan selalu mendapatkan pembaruan terkait resi pengiriman melalui WhatsApp. 🚚
                </p>
                
                {/* Customer Details Box */}
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800 flex flex-col gap-3">
                   <div className="flex items-start gap-3 text-sm">
                      <Phone size={16} className="text-gray-400 mt-0.5" />
                      <div>
                        <span className="text-gray-500 block text-xs">Nomor HP</span>
                        <span className="font-medium text-gray-900 dark:text-gray-200">{orderData.phone}</span>
                      </div>
                   </div>
                   <div className="flex items-start gap-3 text-sm">
                      <MapPin size={16} className="text-gray-400 mt-0.5" />
                      <div>
                        <span className="text-gray-500 block text-xs">Alamat Pengiriman</span>
                        <span className="font-medium text-gray-900 dark:text-gray-200">{orderData.address}</span>
                      </div>
                   </div>
                </div>
              </div>

              {/* Items Section (Replaces Asana's Charts/Tasks) */}
              <div className="grid grid-cols-1 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Package size={20} className="text-blue-500" />
                    Detail Produk ({orderData.items.length})
                  </h3>
                  
                  <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                    {orderData.items.map((item, idx) => (
                      <div key={item.id} className={`flex items-center gap-4 p-4 bg-white dark:bg-[#1f2937] ${idx !== orderData.items.length - 1 ? 'border-b border-gray-200 dark:border-gray-800' : ''}`}>
                        {/* Image Placeholder */}
                        <div className="w-16 h-16 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.nameProduct} className="w-full h-full object-cover rounded-md" />
                          ) : (
                            <ImageIcon size={24} className="text-gray-400" />
                          )}
                        </div>
                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.nameProduct}</h4>
                          <p className="text-xs text-gray-500 mt-1">Harga Satuan: {formatCurrency(item.price)}</p>
                        </div>
                        {/* Quantity & Total */}
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">x{item.quantity}</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Total Price Footer */}
                    <div className="bg-gray-50 dark:bg-gray-800/80 p-4 flex justify-between items-center border-t border-gray-200 dark:border-gray-800">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Total Keseluruhan</span>
                      <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
                        {formatCurrency(orderData.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}