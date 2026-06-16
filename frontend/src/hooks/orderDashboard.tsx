import { useEffect, useRef, useState } from 'react';
import useAxios from '../lib/axios.service';
import type { Order, OrderType, ResponseOrder } from '../lib/types';
import { toast } from 'sonner';

export default function useOrder() {
    const { axiosPrivate } = useAxios();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [nextId, setNextId]  = useState<string | null>(null);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(orders.length > 0 ? orders[0].id : null);
    const [trackingInput, setTrackingInput] = useState<string>("");
    const [hasMore, setHasMore] = useState(true);
    const activeOrder = orders.find(o => o.id === selectedOrderId) || orders[0];

    const orderRef = useRef<HTMLDivElement | null>(null);
    const containerOrderRef = useRef<HTMLDivElement | null>(null);

    const handleInstantShip = async (orderId: string) => {
        try {
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId
                        ? { ...order, status: "on_delivery", updatedAt: 'Baru saja' }
                        : order
                )
            );
            const res = await axiosPrivate.patch(`/orders/${orderId}`, {
                status: "on_delivery"
            });
            const data = res.data;
            return data;
        } catch (err) {
            console.error("Fetch Error: ", err);
        }
    };

    const fetchOrders = async () => {
        if (!hasMore) return;
        setLoading(true);
        try {
            const res = await axiosPrivate.get(`/orders?limit=20&except=completed${ nextId ? `&lastId=${nextId}` : ''}`);
            const data = res.data;
            if (data.orders.length < 20) {
                setHasMore(false);
            }
            setNextId(data.orders.length > 0 ? data.orders[data.orders.length - 1].id : null);
            const newOrders = data.orders.map((ord: ResponseOrder) => ({...ord, details: ord.details ? JSON.parse(ord.details) : null }));
            console.log(newOrders);
            setOrders(prev => [...prev, ...newOrders]);
        } catch (err) {
            console.error("Fetch Error: ", err);
        } finally {
            setLoading(false);
        }
    }

    const handleNotifToWA = async () => {
        if (!activeOrder || !activeOrder.details || !activeOrder.details.phone) return;
        try {
            const message = `Halo Kak ${activeOrder.details.customerName || ""}! 👋 \n Mau menginfokan kalau pesanannya sudah diserahkan ke kurir yaa. Ini untuk nomor resinya:
            ${trackingInput} (Qin Shi Huan)
            Silakan dicek berkala ya, Kak. Kalau paketnya sudah sampai, jangan lupa video unboxing-nya dan tag kami di #voguehub. Terima kasih banyak sudah order! ❤️`
            const dataToSend = {
                number: activeOrder.details.phone,
                message: message,
                instanceName: activeOrder.instanceName
            }
            const res = await axiosPrivate.post("/messages/send", dataToSend);
            const data = res.data;
            console.log(data);
            toast.success("Nomer Resi Berhasil di kirim");
        } catch (err) {
            console.error("Fetch Error: ", err);
        }
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]) => {
                if (entries[0].isIntersecting) {
                    fetchOrders();
                }
            }, {
                threshold: 0.1,
                root: containerOrderRef.current
            }
        );
        if (orderRef.current && hasMore) {
            observer.observe(orderRef.current);
        }
        return () => {
            if (orderRef.current) observer.unobserve(orderRef.current);
        }
    }, [hasMore]);

    // Konfigurasi visual badge status di list kiri & detail kanan
    const getStatusBadge = (status: OrderType) => {
        switch (status) {
            case 'on_delivery': return 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400';
            case 'completed': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400';
            case 'process': return 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400';
            default: return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };
    return {
        getStatusBadge,
        handleInstantShip,
        orders,
        setOrders,
        loading,
        trackingInput,
        setTrackingInput,
        selectedOrderId,
        setSelectedOrderId,
        activeOrder,
        formatCurrency,
        orderRef,
        containerOrderRef,
        handleNotifToWA
    }
}