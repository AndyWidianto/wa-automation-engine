import { Edit3, DollarSign, Layers, X, MapPin, ShoppingBag, Calendar, Save, User, Phone } from 'lucide-react';
import { useState } from 'react';
import type { Order, OrderType } from '../lib/types';
import useAxios from '../lib/axios.service';
import Loading from './Loading';


interface EditProps {
    order: Order | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (order: Order) => void;
}
export default function EditOrderModal({ order, isOpen, onClose, onSave }: EditProps) {
    if (!isOpen || !order) return null;

    const { axiosPrivate } = useAxios();
    const [status, setStatus] = useState<OrderType>(order.status);
    const [loading, setLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState(order.totalPrice);
    const [customerName, setCustomerName] = useState(order.details?.customerName || '');
    const [customerPhone, setCustomerPhone] = useState(order.details?.phone || '');
    const [address, setAddress] = useState(order.details?.address || '');

    const handleSubmit = async () => {
        setLoading(true);
        const updatedOrder: Order = {
            ...order,
            status,
            totalPrice: Number(totalPrice),
            ...order.details ? {
                details: {
                    ...order.details,
                    customerName,
                    phone: customerPhone,
                    address
                }
            } : {},
            updatedAt: new Date().toISOString()
        };
        try {
            let dataToUpdate: Partial<Omit<Order, "details"> & { details?: string }> = {};
            Object.entries(order).forEach(([key, val]) => {
                if ((key === "totalPrice") && val !== totalPrice) {
                    dataToUpdate[key] = totalPrice;
                }
                if ((key === "status") && val !== status) {
                    dataToUpdate[key] = status;
                }
                if (key === "details") {
                    if (!val) {
                        dataToUpdate.details = JSON.stringify({
                            customerName: customerName,
                            phone: customerPhone,
                            isOrderValid: true,
                            address: address,
                            items: [],
                            totalPrice: totalPrice
                        })
                    } else {
                        dataToUpdate.details = JSON.stringify({
                            ...val,
                            customerName: customerName,
                            phone: customerPhone,
                            address: address,
                            totalPrice: totalPrice
                        })
                    }
                }
            })
            await axiosPrivate.patch(`/orders/${order.id}`, dataToUpdate);
            onSave(updatedOrder);
        } catch (err) {
            console.error("Fetch Error: ", err);
        } finally {
            setLoading(false);
        }
    };
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">

            {/* Modal Container */}
            <div className="bg-white dark:bg-[#111827] w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh] overflow-hidden transform transition-all scale-100">

                {/* Header Modal */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300 dark:border-gray-800 bg-[#6366f1] text-white">
                    <div className="flex items-center gap-2">
                        <Edit3 size={20} />
                        <h3 className="text-lg font-semibold">Edit Order: #{order.id}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-white/20 transition-colors text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Section: Status & Price */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                                <Layers size={16} className="text-[#6366f1]" />
                                Status Pembayaran
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as OrderType)}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1f2937] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#6366f1] focus:outline-none transition-all"
                            >
                                <option value="PENDING">PENDING</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="CANCELLED">CANCELLED</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                                <DollarSign size={16} className="text-[#6366f1]" />
                                Total Price (IDR)
                            </label>
                            <input
                                type="number"
                                value={totalPrice}
                                onChange={(e) => setTotalPrice(Number(e.target.value))}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1f2937] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#6366f1] focus:outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Section: Customer Information */}
                    <div className="space-y-4 border-t border-gray-200 dark:border-gray-800 pt-4">
                        <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 tracking-wider uppercase mb-2">Informasi Penerima</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                                    <User size={16} className="text-[#6366f1]" />
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1f2937] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#6366f1] focus:outline-none transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                                    <Phone size={16} className="text-[#6366f1]" />
                                    WhatsApp / Telepon
                                </label>
                                <input
                                    type="text"
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1f2937] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#6366f1] focus:outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                                <MapPin size={16} className="text-[#6366f1]" />
                                Alamat Lengkap Pengiriman
                            </label>
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1f2937] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#6366f1] focus:outline-none transition-all resize-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Section: Non-editable info (Items Bought) */}
                    {order.details?.items && (
                        <div className="space-y-3 border-t border-gray-200 dark:border-gray-800 pt-4">
                            <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 tracking-wider uppercase mb-2 flex items-center gap-1.5">
                                <ShoppingBag size={16} className="text-[#6366f1]" />
                                Item yang Dipesan
                            </h4>
                            <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl p-4 space-y-2 border border-gray-200 dark:border-gray-800">
                                {/* {order.details?.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-gray-800 dark:text-gray-300 font-medium">
                      {item.name} <span className="text-gray-500">x{item.qty}</span>
                    </span>
                    <span className="text-gray-900 dark:text-white font-semibold">
                      {formatCurrency(item.price * item.qty)}
                    </span>
                  </div>
                ))} */}
                            </div>
                        </div>
                    )}

                    {/* Info Log */}
                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                        <p className="flex items-center gap-1">
                            <Calendar size={12} />
                            Dibuat pada: {formatDate(order.createdAt)}
                        </p>
                    </div>

                </div>

                {/* Footer Modal */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3 bg-gray-50 dark:bg-[#111827]/70">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium text-sm transition-all"
                    >
                        Batal
                    </button>
                    <button
                        onClick={() => handleSubmit()}
                        className="px-5 py-2 rounded-lg bg-[#6366f1] text-white hover:bg-[#5254df] font-medium text-sm flex items-center gap-1.5 shadow-md shadow-[#6366f1]/20 hover:shadow-lg transition-all"
                    >
                        <Loading loading={loading}>
                            <Save size={16} />
                            Simpan Perubahan
                        </Loading>
                    </button>
                </div>

            </div>
        </div>
    );
}