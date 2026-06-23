import { useTheme } from '../ThemeProvider';
import useAxios from '../lib/axios.service';
import { useState } from 'react';
import { toast } from 'sonner';
import type { ChartIncome, Notification, Product, StatDashboard, StatMessage, StatUser } from '../lib/types';
import type { ApexOptions } from 'apexcharts';
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from '../lib/store/authStore';


const formatRupiah = (angka: number): string => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0, // Mengeliminasi ,00 di ekor angka
        maximumFractionDigits: 0,
    }).format(angka);
};

export default function useDashboard() {
    const { theme } = useTheme();
    const { user } = useAuthStore();
    const { axiosPrivate } = useAxios();
    const [userStat, setUserStat] = useState({
        activeUser: 0,
        inactiveUser: 0,
        totalUser: 0
    });
    const fetchStatMessages = async () => {
        try {
            const res = await axiosPrivate.get(`/messages/stats`);
            const data: StatMessage = res.data;
            return data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Gagal mengambil data Messages";
            toast.error(errorMessage, {
                duration: 4000,
                position: 'top-right',
                style: {
                    borderRadius: '12px',
                    background: '#1e293b',
                    color: '#fff',
                },
            });

            console.error("Fetch Error:", err);
        }
    }

    const fetchChartIncome = async () => {
        try {
            const res = await axiosPrivate.get(`/orders/stats/chart/income`);
            const data: ChartIncome = res.data;
            console.log("Chart: ", data);
            return data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Gagal mengambil data Messages";
            toast.error(errorMessage, {
                duration: 4000,
                position: 'top-right',
                style: {
                    borderRadius: '12px',
                    background: '#1e293b',
                    color: '#fff',
                },
            });

            console.error("Fetch Error:", err);
        }
    }

    const fetchStatDashboard = async () => {
        try {
            const res = await axiosPrivate.get(`/dashboard/stats`);
            const data: StatDashboard = res.data;
            return data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Gagal mengambil data Stat";
            toast.error(errorMessage, {
                duration: 4000,
                position: 'top-right',
                style: {
                    borderRadius: '12px',
                    background: '#1e293b',
                    color: '#fff',
                },
            });

            console.error("Fetch Error:", err);
        }
    }

    const fetchNotifications = async () => {
        try {
            const res = await axiosPrivate.get(`/notifications?limit=3`);
            const data: Notification[] = res.data;
            console.log("Fetched Notifications:", data);
            return data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Gagal mengambil data notification";
            toast.error(errorMessage, {
                duration: 4000,
                position: 'top-right',
                style: {
                    borderRadius: '12px',
                    background: '#1e293b',
                    color: '#fff',
                },
            });

            console.error("Fetch Error:", err);
        }
    }

    const fetchStatUser = async () => {
        try {
            const res = await axiosPrivate.get(`/users/stats`);
            const data: StatUser = res.data;
            return data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Gagal mengambil data autoreply";
            toast.error(errorMessage, {
                duration: 4000,
                position: 'top-right',
                style: {
                    borderRadius: '12px',
                    background: '#1e293b',
                    color: '#fff',
                },
            });

            console.error("Fetch Error:", err);
        }
    }

    const fetchProducts = async () => {
        try {
            const res = await axiosPrivate.get(`/products?limit=6&stockStatus=low`);
            const data: Product[] = res.data.data;
            return data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Gagal fetch products";
            toast.error(errorMessage, {
                duration: 4000,
                position: 'top-right',
                style: {
                    borderRadius: '12px',
                    background: '#1e293b',
                    color: '#fff',
                },
            });
        }
    }

    const { data: stats, isLoading: isLoadingStats } = useQuery({
        queryKey: ["stats"],
        queryFn: fetchStatDashboard,
        staleTime: 5 * 60 * 1000,
    });

    const { data: statMessage, isLoading: isLoadingStatMessage } = useQuery({
        queryKey: ["statMessage"],
        queryFn: fetchStatMessages,
        staleTime: 5 * 60 * 1000,
    });

    const { data: statUser, isLoading: isLoadingStatUser } = useQuery({
        queryKey: ["statUser"],
        queryFn: fetchStatUser,
        staleTime: 5 * 60 * 1000,
    });
    const { data: notifications, isLoading: isLoadingNotifications } = useQuery({
        queryKey: ["notifications"],
        queryFn: fetchNotifications,
        staleTime: 5 * 60 * 1000,
    });

    const { data: chartIncome, isLoading: isLoadingChartIncome } = useQuery({
        queryKey: ["chart_income"],
        queryFn: fetchChartIncome,
        staleTime: 5 * 60 * 1000,
    });

    const { data: products, isLoading: isLoadingProduct } = useQuery({
        queryKey: ["stock_low"],
        queryFn: fetchProducts,
        staleTime: 5 * 60 * 1000,
    });

    const lineChartSeries = [
        { name: "Messages", data: statMessage?.data || [] }
    ]

    const matricStat = [
        {
            id: 1,
            title: lineChartSeries[0].data.reduce((acc, curr) => acc + curr, 0),
            des: "Total Messages",
            sub: "",
        },
        {
            id: 2,
            title: stats?.autoreply.total,
            des: "Total Autoreply",
            sub: `${(stats?.autoreply.growth || 0) > 0 ? "+" : "-"}${stats?.autoreply.growth}% last month`,
        },
        {
            id: 3,
            title: stats?.knowledge.total,
            des: "Total Knowledge",
            sub: `${(stats?.knowledge.growth || 0) > 0 ? "+" : "-"}${stats?.knowledge.growth}% last month`,
        }
    ];

    const matricStat2 = [
        {
            id: 1,
            title: `${formatRupiah(stats?.order.income || 0)}`,
            des: "Pendapatan Bulan Ini",
            sub: "",
        },
        {
            id: 2,
            title: `${stats?.order.total}`,
            des: "Total Orderan",
            sub: "",
        },
        {
            id: 3,
            title: stats?.product.total,
            des: "Total Products",
            sub: "",
        },
        // {
        //     id: 4,
        //     title: stats?.knowledge.total,
        //     des: "Total Knowledge",
        //     sub: `${(stats?.knowledge.growth || 0) > 0 ? "+" : "-"}${stats?.knowledge.growth}% last month`,
        // }
    ]

    const lineChartOptions: ApexOptions = {
        chart: { type: 'line', toolbar: { show: false }, background: 'transparent' },
        stroke: { curve: 'smooth', width: 3 },
        colors: ['#22D3EE'],
        grid: { borderColor: '#334155', strokeDashArray: 4 },
        xaxis: {
            categories: statMessage?.labels || [],
            labels: { style: { colors: theme === 'dark' ? '#94A3B8' : '#64748B' } }
        },
        yaxis: { labels: { style: { colors: theme === 'dark' ? '#94A3B8' : '#64748B' } } },
        theme: { mode: 'dark' },
        legend: { show: false }
    }
    const getLineChartOptions = (): ApexOptions => {
        return {
            chart: {
                type: 'line',
                toolbar: { show: false },
                background: 'transparent',
                fontFamily: 'inherit',
            },
            stroke: {
                curve: 'smooth',
                width: [3, 2],
                dashArray: [0, 5]
            },
            colors: ['#0EA5E9', '#94A3B8'],
            grid: {
                borderColor: theme === 'dark' ? '#334155' : '#E2E8F0',
                strokeDashArray: 4,
                xaxis: { lines: { show: false } },
                yaxis: { lines: { show: true } },
                padding: { top: 0, right: 0, bottom: 0, left: 10 }
            },
            xaxis: {
                categories: chartIncome?.categories || [],
                labels: {
                    style: { colors: theme === 'dark' ? '#94A3B8' : '#64748B' },
                },
                axisBorder: { show: false },
                axisTicks: { show: false },
                tooltip: { enabled: false } // Matikan tooltip bawaan sumbu x agar lebih bersih
            },
            yaxis: {
                labels: {
                    style: { colors: theme === 'dark' ? '#94A3B8' : '#64748B' },
                    formatter: (value: number) => {
                        if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(1)} Jt`;
                        if (value >= 1000) return `Rp ${(value / 1000).toFixed(0)} Rb`;
                        return `Rp ${value}`;
                    }
                }
            },
            theme: { mode: theme as 'light' | 'dark' },
            legend: {
                show: true,
                position: 'top',
                horizontalAlign: 'right',
                offsetY: -20,
                labels: { colors: theme === 'dark' ? '#F8FAFC' : '#1E293B' }
            },
            tooltip: {
                theme: theme,
                y: {
                    formatter: (value: number) => `Rp ${value.toLocaleString('id-ID')}`
                }
            },
            dataLabels: { enabled: false }
        };
    };
    return {
        notifications,
        userStat,
        setUserStat,
        lineChartOptions,
        lineChartSeries,
        matricStat,
        stats,
        isLoadingStats,
        statMessage,
        isLoadingStatMessage,
        statUser,
        isLoadingStatUser,
        isLoadingNotifications,
        user,
        matricStat2,
        chartIncome,
        isLoadingChartIncome,
        getLineChartOptions,
        products,
        isLoadingProduct
    }
}