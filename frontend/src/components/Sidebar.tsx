import { LogOut, X, ChevronRight, ShoppingBag } from "lucide-react";
import { NavLink } from "react-router";

interface SidebarProps {
  openSidebar: boolean;
  sidebars: any;
  handleToggleSidebar: () => void;
  handleHeaderContent?: (context: { title: string; description: string }) => void;
  logout: () => void;
}

export default function Sidebar({ sidebars, openSidebar, handleToggleSidebar, handleHeaderContent, logout }: SidebarProps) {
  return (
    <>
      {/* Overlay dengan backdrop blur */}
      {openSidebar && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 block lg:hidden transition-opacity"
          onClick={handleToggleSidebar}
        ></div>
      )}

      <aside className={`w-64 bg-white dark:bg-[#0f172a] flex flex-col border-r border-gray-200 dark:border-slate-800 fixed top-0 h-screen transition-all duration-300 ease-in-out ${openSidebar ? 'left-0' : '-left-full lg:left-0'} z-50`}>

        {/* Close Button Mobile */}
        <button onClick={handleToggleSidebar} className="lg:hidden text-gray-500 hover:text-gray-700 absolute top-5 right-4 p-1">
          <X size={22} />
        </button>

        {/* Logo Section */}
        <div className="flex items-center gap-3 px-6 h-20 mb-4">
          <div className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <span className="bg-white text-slate-900 p-1.5 rounded-lg">
              <ShoppingBag size={24} />
            </span>
            VOGUE<span className="text-slate-500 font-light">HUB</span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {sidebars.map((item: any) => (
            item.type === "single" ? (
              <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                path={item.path}
                description={item.description}
                setHeaderContent={handleHeaderContent}
                // Tambahkan pengecekan badge di sini
                badge={item.id === 129499032 ? item?.totalUnread : undefined}
              />
            ) : (
              <div key={item.id} className="py-2">
                <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                  {item.label}
                </div>
                <div className="space-y-1">
                  {item.subMenu.map((subItem: any) => (
                    <NavItem
                      key={subItem.id}
                      icon={subItem.icon}
                      label={subItem.label}
                      path={subItem.path}
                      description={subItem.description}
                      setHeaderContent={handleHeaderContent}
                      // Tambahkan pengecekan badge di sub-menu juga
                      badge={subItem.id === 129499032 ? item?.totalUnread : undefined}
                    />
                  ))}
                </div>
              </div>
            )
          ))}
        </nav>

        {/* Bottom Section / Logout */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-800">
          <button
            onClick={() => logout()}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-200"
          >
            <LogOut size={18} />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>
    </>
  )
}

const NavItem = ({ icon, label, path, setHeaderContent, description, badge }: any) => (
  <NavLink
    to={path}
    end
    className={({ isActive }) => `
      group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
      ${isActive
        ? 'bg-blue-50/10 text-blue-600 dark:bg-blue-500/10 dark:text-blue-500 dark:shadow-sm'
        : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white'
      }
    `}
    onClick={() => setHeaderContent && setHeaderContent({ title: label, description })}
  >
    <span className="transition-transform duration-200 group-hover:scale-110 shrink-0">
      {icon}
    </span>

    <span className="flex-1">{label}</span>

    {badge !== undefined && badge > 0 && (
      <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold text-white bg-red-500 rounded-full shadow-sm animate-pulse">
        {badge}
      </span>
    )}

    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
  </NavLink>
);