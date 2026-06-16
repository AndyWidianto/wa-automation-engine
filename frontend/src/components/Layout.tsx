import Sidebar from './Sidebar';
import Header from './Header';
import { useEffect, useState, type ReactNode } from 'react';
import { Outlet, useNavigate } from 'react-router';
import {
  LayoutDashboard,
  CheckSquare, Settings,
  CalendarCheck,
  CirclePlus,
  Box,
  ShoppingBag,
} from "lucide-react";
//import MotionModal from './Motion';
//import ChatModal from './ChatModal';
import NotificationModal from './NotificationModal';
import { useAuthStore } from '../lib/store/authStore';
//import useChatbot from '../hooks/chatbot';
import { toast } from 'sonner';
import useAxios from '../lib/axios.service';
import type { OrderStats } from '../lib/types';
import useSocket from '../lib/socket';


interface IncomeMessage {
  name: string;
  message: string;
  number: string;
}
interface SubMenuItem {
  id: number;
  label: string;
  description: string;
  icon: ReactNode; // atau JSX.Element
  path: string;
}

interface SidebarItem {
  id: number;
  type: "single" | "group";
  label: string;
  description: string;
  icon?: ReactNode;      
  path?: string;          
  totalUnread?: number;  
  active?: boolean;       
  subMenu?: SubMenuItem[];
}
export default function Layout() {
  const { accessToken: _, logout } = useAuthStore();
  const { axiosPrivate } = useAxios();
  const { socket } = useSocket();
  const [openSidebar, setOpenSidebar] = useState(true);
  const [headerContent, setHeaderContent] = useState({
    title: "Dashboard",
    description: ""
  });
  //const [isOpenChat, setIsOpenChat] = useState(false);
  //const [sessionId, setSessionId] = useState<string | null>(null);
  const [incomeMessage, setIncomeMessage] = useState<IncomeMessage | null>(null);
  const [sidebars, setSidebars] = useState<SidebarItem[]>([
    {
      id: 1,
      type: "single",
      label: 'Dashboard',
      description: 'Overview statistik dan aktivitas sistem',
      icon: <LayoutDashboard size={20} />,
      path: '/dashboard'
    },
    {
      id: 129499032,
      type: "single",
      label: 'Confirm Orders',
      totalUnread: 0,
      description: 'Overview statistik dan aktivitas sistem',
      icon: <ShoppingBag size={20} />,
      path: '/dashboard/confirm/orders'
    },
    {
      id: 325232,
      type: "single",
      label: 'Order',
      description: 'Kelola pemesanan',
      icon: <Box size={20} />,
      path: '/dashboard/orders'
    },
    {
      id: 2,
      type: "group",
      active: false,
      label: 'Auto Replies',
      description: 'Kelola balasan otomatis berdasarkan pesan masuk',
      subMenu: [
        {
          id: 21,
          label: 'AutoReply',
          description: 'Daftar aturan balasan otomatis',
          icon: <CheckSquare size={20} />,
          path: '/dashboard/autoreply'
        },
        {
          id: 22,
          label: 'Create AutoReply',
          description: 'Buat aturan balasan otomatis baru',
          icon: <CirclePlus size={20} />,
          path: '/dashboard/autoreply/create'
        },
      ]
    },
    {
      id: 321,
      type: "group",
      active: false,
      label: 'Products',
      description: 'Kelola products',
      subMenu: [
        {
          id: 21,
          label: 'Products',
          description: 'Daftar Products',
          icon: <Box size={20} />,
          path: '/dashboard/products'
        },
        {
          id: 22,
          label: 'Create Product',
          description: 'Buat product baru',
          icon: <CirclePlus size={20} />,
          path: '/dashboard/products/create'
        },
      ]
    },

    // {
    //   id: 3,
    //   type: "group",
    //   active: false,
    //   label: 'Broadcasts',
    //   description: 'Kirim pesan massal ke banyak pengguna',
    //   subMenu: [
    //     {
    //       id: 31,
    //       label: 'Broadcasts',
    //       description: 'Daftar pesan broadcast',
    //       icon: <ClipboardList size={20} />,
    //       path: '/dashboard/broadcasts'
    //     },
    //     {
    //       id: 32,
    //       label: 'Create Broadcast',
    //       description: 'Buat dan kirim pesan broadcast baru',
    //       icon: <CirclePlus size={20} />,
    //       path: '/dashboard/broadcasts/create'
    //     },
    //   ]
    // },

    {
      id: 4,
      type: "group",
      active: false,
      label: 'Knowledge Base',
      description: 'Kelola data pengetahuan untuk chatbot AI',
      subMenu: [
        {
          id: 41,
          label: 'Knowledge Base',
          description: 'Daftar artikel pengetahuan',
          icon: <CalendarCheck size={20} />,
          path: '/dashboard/knowledge-base'
        },
        {
          id: 42,
          label: 'Create Knowledge Article',
          description: 'Tambah artikel pengetahuan baru',
          icon: <CirclePlus size={20} />,
          path: '/dashboard/knowledge-base/create'
        },
      ]
    },
    {
      id: 8,
      type: "single",
      label: 'Settings',
      description: 'Pengaturan sistem dan preferensi pengguna',
      icon: <Settings size={20} />,
      path: '/dashboard/settings'
    }
  ]);
  //const { messages, setMessage, message, handleChatbot, loading } = useChatbot({ sessionId: sessionId || "" });
  const navigate = useNavigate();
  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  }
  const handleClose = () => {
    //setIsOpenChat(false);
    setIncomeMessage(null);
  }

  // const setRandomId = () => {
  //   const id = crypto.randomUUID();
  //   setSessionId(id);
  // };
  const handleLogout = async () => {
    if (!confirm("Apakah anda yakin ingin logout?")) return;
    try {
      await axiosPrivate.post("/logout");
      localStorage.removeItem("accessToken");
      navigate("/login");
      toast.success("Berhasil logout", {
        style: {
          borderRadius: '12px',
          background: '#1e293b',
          color: '#fff',
        },
      });
      logout();
    } catch (err: any) {
      console.error("Logout Error:", err);
      navigate("/login");
    }
  };

  const handleFetchStatOrder = async () => {
    try {
      const res = await axiosPrivate.get("/orders/stats");
      const data: OrderStats = res.data;
      setSidebars(prev => prev.map(p => p.id === 129499032 ? ({...p, totalUnread: data.totalPending || 0 }) : p));
      return data;
    } catch (err) {
      console.log("Fetch Error: ", err);
    }
  }
  useEffect(() => {
    //setRandomId();
    handleFetchStatOrder();
    socket.on("connect", () => {
      console.log("connect successfully");
    });
    socket.on("incoming_order", (data) => {
      let totalPending = 0;
      for (const item of data) {
        if (item.status === "pending") {
          totalPending += 1;
        }
      }
      setSidebars(prev => prev.map(p => p.id === 129499032 ? ({...p, totalUnread: p.totalUnread ? p.totalUnread + totalPending : 0 }) : p));
    })
    return () => {
      socket.off("connect");
    }
  }, []);

  return (
    <div className="flex min-h-screen p-1 md:p-6 bg-gray-100 dark:bg-background dark:text-white w-full h-full">
      {/* Sidebar */}
      <Sidebar
        openSidebar={openSidebar}
        sidebars={sidebars}
        handleToggleSidebar={toggleSidebar}
        handleHeaderContent={setHeaderContent}
        logout={handleLogout}
      />

      {/* Main Content */}
      <main className={`flex-1 min-w-0 md:pl-2 pb-20 ${openSidebar ? 'lg:ml-55' : 'ml-0 lg:ml-55'} transition-all duration-300`}>
        <Header
          handleToggleSidebar={toggleSidebar}
          headerContent={headerContent}
          logout={handleLogout}
        />
        <div className="mt-15"></div>
        <div className="p-1 md:pl-4">
          <Outlet />
        </div>
        {/* <button
          onClick={() => setIsOpenChat(true)}
          className="fixed right-6 bottom-6 group flex items-center gap-3 transition-all duration-300"
        >
          <span className="opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 bg-white dark:bg-slate-800 shadow-xl border dark:border-slate-700 px-4 py-2 rounded-2xl text-sm font-bold text-indigo-600 dark:text-indigo-400 pointer-events-none">
            Tanya AI
          </span>
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-20"></div>
            <div className="relative w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl shadow-lg shadow-indigo-500/40 flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 group-active:scale-95">
              <Bot className="w-7 h-7" />
              <div className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 p-1 rounded-lg shadow-sm">
                <Sparkles className="w-3 h-3 fill-current" />
              </div>
            </div>
          </div>
        </button> */}
        {/* <MotionModal onClose={handleClose} isOpen={isOpenChat}>
          <ChatModal sessionId={sessionId || ""} onClose={handleClose} isOpen={isOpenChat} messages={messages} setMessage={setMessage} message={message} handleChatbot={handleChatbot} loading={loading} />
        </MotionModal> */}
        <NotificationModal isVisible={incomeMessage !== null} message={incomeMessage?.message || ""} senderName={incomeMessage?.name || ""} onClose={handleClose} />
      </main>
    </div>
  );
};
