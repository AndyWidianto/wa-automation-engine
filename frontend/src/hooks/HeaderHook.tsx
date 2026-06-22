import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../ThemeProvider";
import { useAuthStore } from "../lib/store/authStore";
import useAxios from "../lib/axios.service";
import { useQuery } from "@tanstack/react-query";
import type { Notification } from "../lib/types";

export default function useHeaderHook() {
    const { axiosPrivate } = useAxios();
    const { user } = useAuthStore();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [isOpenProfile, setIsOpenProfile] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const refNotification = useRef<HTMLDivElement | null>(null);
    const themeContext = useContext(ThemeContext);
    if (themeContext === undefined) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    const refProfile = useRef<HTMLDivElement | null>(null);

    const getGreeting = () => {
        const hour = new Date().getHours(); // Mengambil jam saat ini (0-23)

        if (hour >= 5 && hour < 10) {
            return "Selamat Pagi ☀️";
        } else if (hour >= 10 && hour < 15) {
            return "Selamat Siang 🌤️";
        } else if (hour >= 15 && hour < 18) {
            return "Selamat Sore 🌅";
        } else {
            return "Selamat Malam 🌙";
        }
    }
    const handleSearch = () => {
        if (!showSearch) {
            setShowSearch(true);
            const inputSearch = document.getElementById("input-search") as HTMLInputElement | null;
            if (inputSearch) {
                inputSearch.focus();
            }
        }
        // Logic untuk fokus ke input search
        alert("Fokus ke input search! (Implementasi logika pencarian di sini)");
    }

    const fetchNotifications = async () => {
        try {
            const res = await axiosPrivate.get(`/notifications`);
            const data: Notification[] = res.data.data;
            return data;
        } catch (err: any) {
            console.error("Fetch Error:", err);
        }
    }

    const { data: DataNotifications, isLoading } = useQuery({
        queryKey: ["notifications"],
        queryFn: fetchNotifications,
    })

    const markRead = async (id: string) => {
        if (!DataNotifications) return;
        try {
            setNotifications(prev => prev.map(n => n.id === id ? ({...n, isRead: true }) : n));
            const res = await axiosPrivate.post("/notifications/markread", {
                ids: [id],
            });
            const data = res.data;
            console.log(data);
        } catch (err) {
            console.error("Fetch Error: ", err);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (refNotification.current && !refNotification.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
            if (refProfile.current && !refProfile.current.contains(event.target as Node)) {
                setIsOpenProfile(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    useEffect(() => {
        if (DataNotifications) {
            setNotifications(DataNotifications);
        }
    }, [DataNotifications]);

    return {
        notifications,
        showNotifications,
        setShowNotifications,
        showSearch,
        setShowSearch,
        isOpenProfile,
        setIsOpenProfile,
        searchTerm,
        setSearchTerm,
        refNotification,
        refProfile,
        getGreeting,
        handleSearch,
        user,
        isLoading,
        markRead
    }
}