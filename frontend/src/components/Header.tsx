import {
    Search, Bell,
    Menu, Sun, Moon,
    Settings,
    LogOut,
    InfoIcon,
    Check,
    AlertTriangle,
    AlertCircle
} from "lucide-react";
import { useContext } from "react";
import { ThemeContext } from "../ThemeProvider";
import { Link, NavLink, useNavigate } from "react-router";
import useHeaderHook from "../hooks/HeaderHook";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import GlobalSearch from "./SearchGlobal";
import type { Notification, TypeNotification } from "../lib/types";



interface HeaderContent {
    title: string;
    description: string;
}
interface HeaderProps {
    handleToggleSidebar: () => void;
    headerContent: HeaderContent;
    logout: () => void;
}
const TYPE_CONFIG: Record<TypeNotification, { bg: string; text: string; icon: React.ReactElement; border: string }> = {
    INFO: { bg: "bg-blue-50 dark:bg-blue-950/50", text: "text-blue-500", icon: <InfoIcon /> , border: "border-blue-100 dark:border-blue-900/50" },
    SUCCESS: { bg: "bg-emerald-50 dark:bg-emerald-950/50", text: "text-emerald-500", icon: <Check />, border: "border-emerald-100 dark:border-emerald-900/50" },
    WARNING: { bg: "bg-amber-50 dark:bg-amber-950/50", text: "text-amber-500", icon: <AlertTriangle />, border: "border-amber-100 dark:border-amber-900/50" },
    ERROR: { bg: "bg-rose-50 dark:bg-rose-950/50", text: "text-rose-500", icon: <AlertCircle />, border: "border-rose-100 dark:border-rose-900/50" },
};

export default function Header({ handleToggleSidebar, headerContent, logout }: HeaderProps) {
    const themeContext = useContext(ThemeContext);
    if (themeContext === undefined) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    const { theme, toggleTheme } = themeContext;
    const {
        showNotifications,
        setShowNotifications,
        notifications,
        showSearch,
        setShowSearch,
        isOpenProfile,
        setIsOpenProfile,
        refNotification,
        getGreeting,
        user,
        markRead,
        refProfile
    } = useHeaderHook();
    const navigate = useNavigate();

    return (
        <>
            <GlobalSearch showSearch={showSearch} setShowSearch={setShowSearch} />
            <header className={`flex items-center mb-8 h-17 fixed top-0 right-0 bg-gray-100 dark:bg-background z-10 p-2 w-full lg:w-[calc(100%-16rem)]`}>
                <button onClick={() => handleToggleSidebar()} className="text-gray-400 lg:hidden">
                    <Menu size={20} />
                </button>
                <div className="flex md:justify-between justify-end items-center w-full ml-5 lg:ml-0">
                    <div className="hidden md:block">
                        {headerContent.title.toLowerCase() !== "dashboard" ? <div>
                            <h2 className="text-2xl font-semibold">{headerContent.title}</h2>
                            <p className="text-gray-400 text-sm">{headerContent.description}</p>
                        </div> : <div>
                            <h2 className="text-2xl font-semibold">{getGreeting()}</h2>
                            <p className="text-gray-400 text-sm">Semoga harimu menyenangkan</p>
                        </div>}
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative flex bg-gray-200 dark:bg-gray-800 p-1 rounded-xl w-32 md:w-64 shadow-inner">

                            {/* Slider Background (Bola/Kotak yang bergeser) */}
                            <div
                                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-[#6366f1] rounded-lg shadow-md transition-all duration-300 ease-in-out ${theme === 'dark' ? 'translate-x-full' : 'translate-x-0'
                                    }`}
                            />

                            {/* Tombol Light */}
                            <button
                                onClick={() => toggleTheme()}
                                className={`relative z-10 flex flex-1 items-center justify-center gap-2 py-2 text-sm font-medium transition-colors duration-300 ${theme === 'light' ? 'text-indigo-600' : 'text-gray-500'
                                    }`}
                            >
                                <Sun size={18} />
                                <span className="hidden md:inline">Light</span>
                            </button>

                            {/* Tombol Dark */}
                            <button
                                onClick={() => toggleTheme()}
                                className={`relative z-10 flex flex-1 items-center justify-center gap-2 py-2 text-sm font-medium transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-500'
                                    }`}
                            >
                                <Moon size={18} />
                                <span className="hidden md:inline">Dark</span>
                            </button>
                        </div>
                        <button onClick={() => setShowSearch(!showSearch)} className="block text-gray-400 cursor-pointer">
                            <Search size={20} />
                        </button>
                        <div className="relative" ref={refNotification}>
                            <button className="block" onClick={() => setShowNotifications(!showNotifications)}>
                                <Bell className="text-gray-400 cursor-pointer" size={20} />
                            </button>
                            {notifications && notifications.some(n => !n.isRead) && (
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                            )}
                            {showNotifications && notifications && notifications.length > 0 && (
                                <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-[#202C33] rounded-xl shadow-xl border border-slate-100 dark:border-zinc-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-800">
                                        {notifications.map((item: Notification) => {
                                            const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.INFO;

                                            return (
                                                <button
                                                    onClick={() => navigate(`/dashboard/notifications?id=${item.id}`)}
                                                    key={item.id}
                                                    className={`group relative text-start px-4 py-3.5 w-full transition-all duration-200 hover:bg-slate-50 dark:hover:bg-zinc-800/40 cursor-pointer flex gap-3 ${!item.isRead ? 'bg-blue-50/20 dark:bg-blue-500/5' : 'bg-white dark:bg-transparent'
                                                        }`}
                                                >
                                                    {!item.isRead && (
                                                        <span className="absolute left-2 top-4 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-pulse" />
                                                    )}
                                                    <div className="relative shrink-0 pl-2 text-left">
                                                        {item.user ? (
                                                            <>
                                                                <img
                                                                    src={item.user.profileUrl || "/default-avatar.png"}
                                                                    alt={item.user.name}
                                                                    className="w-10 h-10 rounded-full ring-2 ring-white dark:ring-zinc-800 shadow-sm object-cover"
                                                                />
                                                                <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${config.bg} ${config.text} rounded-full flex items-center justify-center shadow-sm border border-white dark:border-zinc-800`}>
                                                                    {config.icon}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className={`w-10 h-10 rounded-full ${config.bg} ${config.text} flex items-center justify-center border ${config.border}`}>
                                                                {config.icon}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-col gap-0.5">
                                                            <h4 className={`text-sm font-semibold leading-tight truncate ${!item.isRead ? 'text-slate-900 dark:text-zinc-100' : 'text-slate-700 dark:text-zinc-300'}`}>
                                                                {item.title}
                                                            </h4>
                                                            <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed mt-0.5">
                                                                {item.user && <span className="font-medium text-slate-700 dark:text-zinc-300 mr-1">{item.user.name}</span>}
                                                                {item.content}
                                                            </p>

                                                            {/* Waktu & Aksi */}
                                                            <div className="flex items-center justify-between mt-2">
                                                                <span className="text-[10px] font-medium text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                                                                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: id })}
                                                                </span>
                                                                {!item.isRead && (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            markRead(item.id);
                                                                        }}
                                                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                                                                    >
                                                                        Tandai dibaca
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Footer Dropdown */}
                                    <NavLink
                                        to="/dashboard/notifications"
                                        className="block text-center text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/20 py-2.5 transition"
                                    >
                                        Lihat Semua Notifikasi
                                    </NavLink>
                                </div>
                            )}
                        </div>
                        <div className="relative" ref={refProfile}>
                            <button
                                onClick={() => setIsOpenProfile(!isOpenProfile)}
                                className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-700"
                            >
                                <img src={user?.profileUrl || "/default.png"} alt="avatar" className="w-full h-full object-cover" />
                            </button>
                            {isOpenProfile && (
                                <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-xl z-[99] overflow-hidden animate-in fade-in zoom-in duration-150">

                                    {/* User Info Header */}
                                    <div className="px-4 py-4 bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Akun Saya</p>
                                        <p className="text-sm font-medium dark:text-white mt-1 truncate">{user?.email}</p>
                                    </div>

                                    <div className="p-1.5">
                                        {/* Menu Items */}
                                        <Link to="/dashboard/settings" className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors group">
                                            <Settings size={18} className="group-hover:text-primary transition-colors" />
                                            <span>Pengaturan Profil</span>
                                        </Link>
                                    </div>

                                    {/* Logout Section */}
                                    <div className="p-1.5 border-t border-gray-100 dark:border-slate-800">
                                        <button
                                            onClick={() => logout()}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors group"
                                        >
                                            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                                            <span className="font-semibold">Keluar Aplikasi</span>
                                        </button>
                                    </div>

                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}