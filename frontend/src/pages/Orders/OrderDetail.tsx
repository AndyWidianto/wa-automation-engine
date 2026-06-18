import { useState, useEffect } from 'react';
import { 
    Package, 
    User, 
    MapPin, 
    Phone, 
    Calendar, 
    Smartphone, 
    AlertCircle,
    X,
    Copy,
    Check,
    ArrowLeft
} from 'lucide-react';
import type { Order } from '../../lib/types';
import useAxios from '../../lib/axios.service';
import { useNavigate, useParams } from 'react-router';


const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(angka);
};

const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(dateString));
};


export default function OrderShow() {
    const { axiosPrivate } = useAxios();
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!id) return;
            setLoading(true);
            setError(null);
            try {
                const res = await axiosPrivate.get(`orders/${id}`);
                setOrder(res.data);
            } catch (err: any) {
                console.error("Fetch Error: ", err);
                setError("Gagal memuat data pesanan. Silakan coba lagi.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const handleCopyId = () => {
        if (!order?.id) return;
        navigator.clipboard.writeText(order.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto p-4 md:p-6 font-sans space-y-8 animate-pulse">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-2">
                        <div className="h-7 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                        <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
                    </div>
                    <div className="flex gap-2">
                        <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
                        <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="h-64 bg-slate-100 dark:bg-slate-800/40 rounded-2xl border border-slate-200/50 dark:border-slate-800/50" />
                        <div className="h-40 bg-slate-100 dark:bg-slate-800/40 rounded-2xl border border-slate-200/50 dark:border-slate-800/50" />
                    </div>
                    <div className="lg:col-span-2 h-[420px] bg-slate-100 dark:bg-slate-800/40 rounded-2xl border border-slate-200/50 dark:border-slate-800/50" />
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="max-w-md mx-auto my-20 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl dark:shadow-2xl/30 flex flex-col items-center text-center relative animate-in fade-in zoom-in-95 duration-300">
                <button 
                    onClick={() => navigate(-1)} 
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
                >
                    <X size={18} />
                </button>
                <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-2xl text-red-500 mb-4">
                    <AlertCircle size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Terjadi Kesalahan</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                    {error || "Pesanan tidak ditemukan atau telah dihapus dari sistem."}
                </p>
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-medium text-sm hover:opacity-90 active:scale-98 transition-all shadow-sm"
                >
                    <ArrowLeft size={16} /> Kembali
                </button>
            </div>
        );
    }

    const { details } = order;

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-6 text-slate-600 dark:text-slate-400 font-sans animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            
            {/* BACK & CLOSE NAVIGATION FLOATER */}
            <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-2 z-20">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2.5 bg-white dark:bg-slate-900 text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow transition-all duration-200"
                    aria-label="Tutup detail pesanan"
                >
                    <X size={20} />
                </button>
            </div>

            {/* HEADER SECTION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 pr-16">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                        <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                            <Package size={20} />
                        </div>
                        Detail Pesanan
                    </h1>
                    <div className="flex items-center gap-2 mt-2 group text-xs font-mono bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-md w-fit border border-slate-200/40 dark:border-slate-700/30">
                        <span>ID: {order.id}</span>
                        <button 
                            onClick={handleCopyId}
                            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                            title="Salin ID"
                        >
                            {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                        </button>
                    </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Status Badge */}
                    <span className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400 uppercase tracking-wider border border-indigo-100 dark:border-indigo-900/20 shadow-sm">
                        {order.status}
                    </span>
                    {/* Validation Badge */}
                    {details?.isOrderValid ? (
                        <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 uppercase tracking-wider border border-emerald-100 dark:border-emerald-900/20 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Valid
                        </span>
                    ) : (
                        <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 uppercase tracking-wider border border-rose-100 dark:border-rose-900/20 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Invalid
                        </span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT COLUMN: CUSTOMER & INFO */}
                <div className="lg:col-span-1 flex flex-col gap-6">

                    {/* Card Informasi Pelanggan */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800/70 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)]">
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-5 border-b border-slate-100 dark:border-slate-800 pb-3">
                            Informasi Pelanggan
                        </h2>
                        {details ? (
                            <div className="space-y-4 text-sm">
                                <div className="flex gap-3.5">
                                    <User className="text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" size={18} />
                                    <div>
                                        <p className="text-slate-400 dark:text-slate-500 text-xs font-medium mb-0.5">Nama Lengkap</p>
                                        <p className="font-medium text-slate-900 dark:text-slate-200">{details.customerName}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3.5">
                                    <Phone className="text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" size={18} />
                                    <div>
                                        <p className="text-slate-400 dark:text-slate-500 text-xs font-medium mb-0.5">No. WhatsApp</p>
                                        <p className="font-medium text-slate-900 dark:text-slate-200 font-mono text-xs">{details.phone}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3.5">
                                    <MapPin className="text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" size={18} />
                                    <div>
                                        <p className="text-slate-400 dark:text-slate-500 text-xs font-medium mb-0.5">Alamat Pengiriman</p>
                                        <p className="font-medium text-slate-900 dark:text-slate-200 leading-relaxed text-xs">{details.address}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400 dark:text-slate-500 italic py-2">Detail pelanggan tidak terekstrak.</p>
                        )}
                    </div>

                    {/* Card Meta Sistem */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800/70 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] text-sm">
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-5 border-b border-slate-100 dark:border-slate-800 pb-3">
                            Meta Sistem
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3.5">
                                <Smartphone className="text-slate-400 dark:text-slate-500 shrink-0" size={18} />
                                <div>
                                    <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">Instance WA</p>
                                    <p className="font-medium text-slate-800 dark:text-slate-200 text-xs">{order.instanceName || '-'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3.5">
                                <Calendar className="text-slate-400 dark:text-slate-500 shrink-0" size={18} />
                                <div>
                                    <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">Dibuat Pada</p>
                                    <p className="font-medium text-slate-800 dark:text-slate-200 text-xs">{formatDate(order.createdAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN: ORDER ITEMS */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/70 dark:border-slate-800/70 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col h-full">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-900/40">
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Rincian Barang</h2>
                        </div>

                        <div className="p-6 flex-grow overflow-y-auto max-h-[380px] space-y-3 custom-scrollbar">
                            {details?.items && details.items.length > 0 ? (
                                details.items.map((item: any, index: number) => (
                                    <div 
                                        key={index} 
                                        className="flex justify-between items-center p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-800/10 hover:border-indigo-100 dark:hover:border-indigo-950 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all duration-200"
                                    >
                                        <div className="flex flex-col min-w-0 pr-4">
                                            <span className="font-medium text-slate-900 dark:text-slate-100 truncate text-sm">
                                                {item.nameProduct}
                                            </span>
                                            <span className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                                {item.quantity} × <span className="font-mono">{formatRupiah(item.price)}</span>
                                            </span>
                                        </div>
                                        <div className="font-semibold text-slate-900 dark:text-white text-sm font-mono shrink-0">
                                            {formatRupiah(item.quantity * item.price)}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full py-12 text-slate-400 dark:text-slate-500">
                                    <Package size={32} className="stroke-1 mb-2 text-slate-300 dark:text-slate-700" />
                                    <p className="text-xs">Belum ada item yang divalidasi pada pesanan ini.</p>
                                </div>
                            )}
                        </div>

                        {/* Total Footer */}
                        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Pembayaran</span>
                                <span className="text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400 font-mono">
                                    {formatRupiah(order.totalPrice)}
                                </span>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}