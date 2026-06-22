import { useEffect, useRef, useState } from "react";
import useAxios from "../lib/axios.service";
import type { Notification, TypeNotification } from "../lib/types";
import { toast } from "sonner";
import { useSearchParams } from "react-router";


export default function useNotification() {
    const { axiosPrivate } = useAxios();
    const [searchParams, _setSearchParams] = useSearchParams();
    const id = searchParams.get("id");
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [selected, setSelected] = useState<Notification | null>(null);
    const [Type, setType] = useState<TypeNotification | "ALL">("ALL");
    const [nextId, setNextId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [readFilter, setReadFilter] = useState("ALL");
    const [mobileView, setMobileView] = useState("list");
    const [hasMore, setHasMore] = useState(true);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const selectedNotif = selected ? notifications.find(n => n.id === selected.id) : null;

    const containerRef = useRef<HTMLDivElement | null>(null);
    const notificationRef = useRef<HTMLDivElement | null>(null);

    let parsedMeta = null;
    if (selectedNotif?.metaJson) {
        parsedMeta = selectedNotif.metaJson;
    }

    const handleSelect = async (notif: Notification) => {
        try {
            setSelected(notif);
            setMobileView("detail");
            await markRead(notif.id);
        } catch (err) {
            console.error("Fetch Error: ", err);
        }
    };

    const handleChange = (name: "type" | "search", value: string) => {
        setNextId(null);
        setCurrentPage(1);
        setTotalPages(10);
        setNotifications([]);
        if (name === "type") {
            setType(value as TypeNotification);
        }
        if (name === "search") {
            setSearchTerm(value);
        }
    }

    const markRead = async (id: string) => {
        try {
            setNotifications(ns => ns.map(n => n.id === id ? { ...n, isRead: true } : n));
            const res = await axiosPrivate.post("/notifications/markread", {
                ids: [id],
            });
            const data = res.data;
            console.log(data);
        } catch (err) {
            console.error("Fetch Error: ", err);
        }
    };
    const markUnread = (id: string) => setNotifications(ns => ns.map(n => n.id === id ? { ...n, isRead: false } : n));
    const deleteNotif = async (data: Notification) => {
        setNotifications(ns => ns.filter(n => n.id !== data.id));
        if (selected?.id === data.id) setSelected(null);
        try {
            const res = await axiosPrivate.delete(`/notifications/${data.id}`);
            const dataResponse = res.data;
            console.log(dataResponse);
        } catch (err) {
            setNotifications(prev => [...prev, data]);
            toast.error(`Gagal hapus id ${data.id}`);
            console.error("Fetch Error: ", err);
        }
    };

    const fetchNotifications = async () => {
        if (!hasMore) return;
        setLoading(true);
        try {
            let query = `${nextId ? `&lastId=${nextId}` : ''}${searchTerm ? `&search=${searchTerm}` : ''}${Type !== "ALL" ? `&type=${Type}` : ''}`;
            const res = await axiosPrivate.get(`/notifications?limit=${itemsPerPage}${query}`);
            const data = res.data;
            if (data.data.length < itemsPerPage) {
                setHasMore(false);
            }
            console.log(data);
            setTotalPages(data.totalPage);
            setNextId(data.nextId);
            const dataNotifications: Notification[] = data.data;
            setNotifications(prev => [...prev, ...dataNotifications.filter(n => n.id !== id )]);
        } catch (err) {
            console.error("Fetch Error: ", err);
        } finally {
            setLoading(false);
        }
    }
    const fetchNotification = async () => {
        if (!id) return;
        const findNotif = notifications.find(n => n.id === id);
        if (findNotif) {
            setSelected(findNotif);
            return;
        }
        try {
            const res = await axiosPrivate.get(`/notifications/${id}`);
            const data = res.data;
            console.log(data);
            if (data.data) {
                setNotifications(prev => [data.data, ...prev.filter(p => p.id !== id)]);
                setSelected(data.data);
            }
        } catch (err) {
            console.error("Fetch Error: ", err);
        }
    }
    const handlePrev = async () => {
        if (currentPage >= totalPages) return;
        setCurrentPage(prev => prev + 1);
        await fetchNotifications();
    }
    useEffect(() => {
        const currentTarget = notificationRef.current;
        if (!currentTarget || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]) => {
                if (entries[0].isIntersecting && hasMore) {
                    fetchNotifications();
                }
            },
            {
                root: containerRef.current,
                rootMargin: "50px",
                threshold: 0.1
            }
        );

        observer.observe(currentTarget);

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [searchTerm, Type, nextId, searchTerm, hasMore]);

    useEffect(() => {
        fetchNotification();
    }, [id]);

    return {
        loading,
        itemsPerPage,
        notifications,
        handlePrev,
        markRead,
        markUnread,
        deleteNotif,
        selected,
        setSelected,
        readFilter,
        setReadFilter,
        mobileView,
        setMobileView,
        unreadCount,
        parsedMeta,
        handleSelect,
        selectedNotif,
        searchTerm,
        setSearchTerm,
        nextId,
        setNextId,
        setType,
        Type,
        handleChange,
        containerRef,
        notificationRef,
        hasMore
    }
}