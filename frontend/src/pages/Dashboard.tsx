import Chart from 'react-apexcharts';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import useDashboard from '../hooks/dashboard';
import { ChartSkeleton, MatricSkeleton, NotificationSkeleton, OverviewSkeleton } from '../components/DashboardSkeleton';
import { Link } from 'react-router';
import type { Product } from '../lib/types';


export default function Dashboard() {
    const {
        matricStat,
        lineChartOptions,
        lineChartSeries,
        notifications,
        statUser,
        isLoadingStatMessage,
        isLoadingStatUser,
        isLoadingStats,
        isLoadingNotifications,
        user,
        matricStat2,
        chartIncome,
        isLoadingChartIncome,
        getLineChartOptions,
        products,
        isLoadingProduct
    } = useDashboard();
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-2">
            {/* Row 1: Device Activity */}
            {/* <div className="md:col-span-12 lg:col-span-4 group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-[2rem] p-6">
                <div className="flex flex-col gap-1 mb-6">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 tracking-tight">Device Activity</h3>
                    <p className="text-xs text-slate-500">Monitoring real-time sessions</p>
                </div>
                <div id="chart" className="flex justify-center items-center">
                    <Chart options={pieChartOptions} series={pieChartSeries} type="pie" height={200} />
                </div>
            </div> */}

            {/* Row 1: Employee Overview */}
            {isLoadingStatUser ?
                <OverviewSkeleton /> :
                <div className="md:col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-[2rem] p-6 flex flex-col">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="font-semibold text-slate-800 dark:text-slate-100 tracking-tight">Employees</h3>
                            <p className="text-xs text-slate-500">Headcount distribution</p>
                        </div>
                        {/* <select className="bg-slate-50 dark:bg-slate-800 text-[10px] font-medium py-1 px-2 rounded-lg border-none ring-1 ring-slate-200 dark:ring-slate-700 outline-none">
                        <option>Aug 25 - Sept 25</option>
                    </select> */}
                    </div>
                    <div className="flex items-center justify-between flex-1 gap-4">
                        <div className="md:block lg:flex gap-4 space-y-5">
                            <StatItem label="Inactive" value={statUser?.inactive} color="bg-orange-400" />
                            <StatItem label="Active" value={statUser?.active} color="bg-emerald-400" />
                            <StatItem label="Total" value={statUser?.total} color="bg-slate-800 dark:bg-white" />
                        </div>

                        {/* Enhanced Progress Circle */}
                        <div className="relative flex items-center justify-center">
                            <div className="w-36 h-36 border-[10px] border-slate-100 dark:border-slate-800 rounded-full"></div>
                            <div className="absolute w-36 h-36 border-[10px] border-orange-500 border-t-transparent border-l-transparent rounded-full rotate-45"></div>
                            <div className="absolute w-30 h-30 rounded-full ring-4 ring-white dark:ring-slate-900 overflow-hidden shadow-xl">
                                <img src={user?.profileUrl || "/default.png"} alt="emp" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </div>}

            {/* Row 1: Mini Metrics */}
            {isLoadingStats ?
                <MatricSkeleton /> :
                <div className="md:col-span-12 lg:col-span-4 flex flex-col gap-4">
                    {matricStat.map(s => (
                        <MetricCard
                            title={s.title}
                            desc={s.des}
                            sub={s.sub}
                            color={s.id === 1 ? '' : s.id === 2 ? 'text-orange-500' : 'text-cyan-500'}
                            icon="🎯"
                            key={s.id}
                        />
                    ))}
                </div>}

            {/* 
            {isLoadingStatUser ?
                <OverviewSkeleton /> :
                <div className="md:col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-[2rem] p-6 flex flex-col">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="font-semibold text-slate-800 dark:text-slate-100 tracking-tight">Employees</h3>
                            <p className="text-xs text-slate-500">Headcount distribution</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between flex-1 gap-4">
                        <div className="md:block lg:flex gap-4 space-y-5">
                            <StatItem label="Inactive" value={statUser?.inactive} color="bg-orange-400" />
                            <StatItem label="Active" value={statUser?.active} color="bg-emerald-400" />
                            <StatItem label="Total" value={statUser?.total} color="bg-slate-800 dark:bg-white" />
                        </div>

                        <div className="relative flex items-center justify-center">
                            <div className="w-36 h-36 border-[10px] border-slate-100 dark:border-slate-800 rounded-full"></div>
                            <div className="absolute w-36 h-36 border-[10px] border-orange-500 border-t-transparent border-l-transparent rounded-full rotate-45"></div>
                            <div className="absolute w-30 h-30 rounded-full ring-4 ring-white dark:ring-slate-900 overflow-hidden shadow-xl">
                                <img src={user?.profileUrl || "/default.png"} alt="emp" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </div>} */}


            {isLoadingStats ?
                <MatricSkeleton /> :
                <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-4">
                    {matricStat2.map(s => (
                        <MetricCard
                            title={s.title}
                            desc={s.des}
                            sub={s.sub}
                            color={s.id === 1 ? '' : s.id === 2 ? 'text-orange-500' : 'text-cyan-500'}
                            icon="🎯"
                            key={s.id}
                        />
                    ))}
                </div>}

            {isLoadingChartIncome ? (
                <ChartSkeleton />
            ) : (
                <div className="md:col-span-12 lg:col-span-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-[2rem] p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-lg">Income Analytics</h3>
                            <p className="text-sm text-slate-500">Monthly revenue comparison performance</p>
                        </div>
                        <div className="flex items-center gap-5 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                            <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                <span className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.6)]"></span>
                                Bulan Ini
                            </span>
                            <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                <span className="w-2.5 h-0.5 bg-slate-400 dark:bg-slate-500 block"></span>
                                Bulan Lalu
                            </span>
                        </div>
                    </div>
                    <div className="w-full">
                        <Chart
                            options={getLineChartOptions()}
                            series={chartIncome?.series || []}
                            type="line"
                            height={280}
                        />
                    </div>
                </div>
            )}

            {/* Bottom Row: Messages Chart */}
            {isLoadingStatMessage ?
                <ChartSkeleton /> :
                <div className="md:col-span-12 lg:col-span-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-[2rem] p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-lg">Incoming Messages</h3>
                            <p className="text-sm text-slate-500">Weekly engagement analytics</p>
                        </div>
                        <div className="flex items-center gap-4 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                            <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"></span> Messages
                            </span>
                        </div>
                    </div>
                    <div className="w-full">
                        <Chart options={lineChartOptions} series={lineChartSeries} type="line" height={280} />
                    </div>
                </div>}

            <div className="md:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-[2rem] p-6 lg:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-lg">Inventory Status</h3>
                </div>

                {/* Wrapper overflow untuk responsivitas tabel di layar kecil */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                                <th className="pb-3 font-medium px-4">Produk</th>
                                <th className="pb-3 font-medium px-4">Harga</th>
                                <th className="pb-3 font-medium px-4">Status Stok</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products && Array.isArray(products) && products.map(product => (
                                <ProductTableRow key={product.id} product={product} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Right Column: Notifications */}
            {isLoadingNotifications ? (
                <NotificationSkeleton />
            ) : (
                <div className="md:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-[2rem] p-6 lg:p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-lg">Notifications</h3>
                        <Link to="/dashboard/notifications" className="px-3 py-1.5 text-xs font-bold text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition-colors">
                            View All
                        </Link>
                    </div>
                    <div className="relative space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 dark:before:bg-slate-800">
                        {notifications?.map(notif => (
                            <div key={notif.id} className="relative z-10">
                                <NotificationItem
                                    profileUrl={notif.user?.profileUrl}
                                    name={notif.user?.name || notif.user?.email}
                                    action={notif.title}
                                    time={notif.createdAt}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
};


const StatItem = ({ label, value, color }: any) => (
    <div>
        <p className="text-[10px] text-gray-500 flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${color.replace('text', 'bg')}`}></span> {label}
        </p>
        <p className={`text-xl font-bold`}>{value}</p>
    </div>
);

const MetricCard = ({ title, desc, sub, color = "text-gray-800 dark:text-white" }: any) => (
    <div className="bg-white/80 w-full backdrop-blur border border-gray-200 dark:border-gray-600 shadow-md rounded-2xl p-1 md:p-4 dark:bg-[#1E1E1E] p-1 md:p-4 rounded-2xl text-center border border-transparent hover:border-gray-700 transition">
        <h4 className={`text-2xl font-bold ${color}`}>{title}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">{desc}</p>
        <p className="text-[10px] text-gray-500 mt-1">{sub}</p>
    </div>
);

const NotificationItem = ({ profileUrl, name, action, time }: any) => (
    <div className="flex gap-3 items-start shadow-md border-1 border-gray-200 dark:border-none dark:shadow-none dark:bg-black/20 p-3 rounded-xl">
        <img src={profileUrl || "/default.png"} alt="profile" className="w-8 h-8 bg-gray-600 rounded-full flex-shrink-0 object-cover" />
        <div>
            <p className="text-xs"><strong>{name}</strong> {action}</p>
            <p className="text-[10px] text-gray-800 dark:text-gray-300 mt-1">{formatDistanceToNow(new Date(time), { addSuffix: true, locale: id })}</p>
        </div>
    </div>
);

const ProductTableRow = ({ product }: { product: Product }) => {
    const isLowStock = product.stock <= 5 && product.stock > 0;
    const isOutOfStock = product.stock === 0;

    // Menentukan warna background baris tabel dinamis (mendukung dark mode)
    const rowStyle = isOutOfStock
        ? 'bg-red-50/40 dark:bg-red-900/10 hover:bg-red-50 dark:hover:bg-red-900/20'
        : isLowStock
            ? 'bg-orange-50/40 dark:bg-orange-900/10 hover:bg-orange-50 dark:hover:bg-orange-900/20'
            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50';

    return (
        <tr className={`border-b border-slate-100 dark:border-slate-800/60 transition-colors last:border-0 ${rowStyle}`}>

            {/* Kolom 1: Informasi Produk dengan Thumbnail */}
            <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                        {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                            <span className="text-slate-400 text-lg">📦</span>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm line-clamp-1">
                            {product.name}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                            ID: {product.id.split('-')[1] || product.id} {/* Menampilkan ID singkat */}
                        </span>
                    </div>
                </div>
            </td>

            {/* Kolom 2: Harga */}
            <td className="px-4 py-4 font-medium text-slate-700 dark:text-slate-300 text-sm">
                Rp {product.price.toLocaleString('id-ID')}
            </td>

            {/* Kolom 3: Status Stok Modern */}
            <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                    {/* Badge Angka Stok */}
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${isOutOfStock ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'
                        : isLowStock ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400'
                            : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                        }`}>
                        <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${isOutOfStock ? 'bg-red-500' : isLowStock ? 'bg-orange-500' : 'bg-emerald-500'
                            }`}></span>
                        {product.stock} pcs
                    </div>

                    {/* Label Peringatan Ekstra */}
                    {isLowStock && (
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-orange-500 border border-orange-200 dark:border-orange-500/30 px-1.5 py-0.5 rounded">
                            Hampir Habis
                        </span>
                    )}
                    {isOutOfStock && (
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-red-500 border border-red-200 dark:border-red-500/30 px-1.5 py-0.5 rounded">
                            Kosong
                        </span>
                    )}
                </div>
            </td>

        </tr>
    );
};