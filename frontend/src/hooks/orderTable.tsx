import { useEffect, useState } from "react";
import type { Order } from "../lib/types";
import useAxios from "../lib/axios.service";
import { toast } from "sonner";



export default function useOrderTable() {
    const { axiosPrivate } = useAxios();
    const [loading, setLoading] = useState(false);
    const [loadingForDelete, setLoadingForDelete] = useState(false);
    const [totalPages, setTotalPages] = useState(100);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [orderSelected, setOrderSelected] = useState<Order | null>(null);
    const indexOfLastItem = 10;
    const indexOfFirstItem = 0;
    const items: Order[] = orders;
    const itemsPerPage = 10;
    const currentPage = 1;

    const handleFetchOrders = async () => {
        try {
            const res = await axiosPrivate.get("/orders");
            const data = res.data;
            console.log(data);
            setOrders(data.orders);
        } catch (err) {
            console.error("Fetch Error: ", err);
        }
    }
    const handleDelete = async (order: Order) => {
        if (!confirm(`Apakah anda yakin ingin menghapus orderan ${order.id}?`)) return;
        setOrderSelected(order);
        setLoadingForDelete(true);
        try {
            await axiosPrivate.delete(`orders/${order.id}`);
            setOrders(prev => prev.filter(p => p.id !== order.id));
            toast.success(`Order ${order.id} berhasil di hapus!`);
        } catch (err: any) {
            console.error("Fetch Error: ", err);
        } finally {
            setLoadingForDelete(false);
            setOrderSelected(null);
        }
    }
    const handleUpdate = (order: Order) => {
        setOrderSelected(order);
        setIsOpen(true);
    }
    const handleClose = () => {
        setIsOpen(false);
        setOrderSelected(null);
    }
    const handlePrev = () => { }
    const handleNext = () => { }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'COMPLETED':
            case 'SUCCESS':
                return <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold">Completed</span>;
            case 'PENDING':
                return <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-xs font-bold">Pending</span>;
            case 'CANCELLED':
            case 'FAILED':
                return <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-bold">Cancelled</span>;
            default:
                return <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs font-bold">{status}</span>;
        }
    };

    useEffect(() => {
        handleFetchOrders();
    }, [])

    return {
        loading,
        setLoading,
        totalPages,
        setTotalPages,
        isOpen,
        setIsOpen,
        orderSelected,
        setOrderSelected,
        indexOfFirstItem,
        indexOfLastItem,
        itemsPerPage,
        items,
        currentPage,
        handleClose,
        handleUpdate,
        formatCurrency,
        handlePrev,
        handleNext,
        getStatusBadge,
        handleDelete,
        loadingForDelete,
        orders
    }
}