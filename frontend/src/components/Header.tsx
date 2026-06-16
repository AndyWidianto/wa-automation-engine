import {
    Search, Bell,
    Menu, Sun, Moon,
    Settings,
    LogOut
} from "lucide-react";
import { useContext } from "react";
import { ThemeContext } from "../ThemeProvider";
import { Link, NavLink } from "react-router";
import useHeaderHook from "../hooks/HeaderHook";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import GlobalSearch from "./SearchGlobal";



interface HeaderContent {
    title: string;
    description: string;
}
interface HeaderProps {
    handleToggleSidebar: () => void;
    headerContent: HeaderContent;
    logout: () => void;
}
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
        refProfile } = useHeaderHook();

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
                                <div className="absolute right-0 mt-2 w-90 bg-white dark:bg-[#202C33] rounded-lg shadow-lg overflow-hidden">
                                    {notifications.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`group relative px-5 py-4 transition-all duration-300 hover:bg-slate-50 dark:hover:bg-zinc-800/50 cursor-pointer border-b border-slate-100 dark:border-zinc-800 last:border-none ${!item.isRead ? 'bg-blue-50/30 dark:bg-blue-500/5' : 'bg-white dark:bg-zinc-900'
                                                }`}
                                        >
                                            {/* Unread Indicator Dot */}
                                            {!item.isRead && (
                                                <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
                                            )}

                                            <div className="flex gap-4">
                                                {/* Profile Picture with Ring */}
                                                <div className="relative shrink-0">
                                                    <img
                                                        src={item.user.profileUrl || "/default-avatar.png"}
                                                        alt={item.user.name}
                                                        className="w-11 h-11 rounded-full ring-2 ring-white dark:ring-zinc-800 shadow-sm object-cover"
                                                    />
                                                    {/* Small Action Icon Overlay (Optional) */}
                                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-sm border border-slate-100 dark:border-zinc-700">
                                                        <span className="text-[10px]">💬</span>
                                                    </div>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col gap-0.5">
                                                        <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                                                            <span className="font-semibold text-slate-900 dark:text-zinc-100 mr-1">
                                                                {item.user.name}
                                                            </span>
                                                            {item.title}
                                                        </p>

                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                                                                {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: id })}
                                                            </span>

                                                            {/* Interactive Action (Show on Hover) */}
                                                            <button className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                                                Tandai dibaca
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <NavLink to="/dashboard/notifications" className="block text-center text-sm  hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 py-2 transition">Lihat Semua</NavLink>
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