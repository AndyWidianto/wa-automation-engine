import Chart from 'react-apexcharts';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import useDashboard from '../hooks/dashboard';
import { ChartSkeleton, MatricSkeleton, NotificationSkeleton, OverviewSkeleton } from '../components/DashboardSkeleton';
import { Link } from 'react-router';



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

            {/* Bottom Row: Messages Chart */}
            {isLoadingStatMessage ?
                <ChartSkeleton /> :
                <div className="md:col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-[2rem] p-8">
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

            {/* Bottom Row: Notifications */}
            {isLoadingNotifications ?
                <NotificationSkeleton /> :
                <div className="md:col-span-12 lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-[2rem] p-8 lg:p-5">
                    <div className="flex justify-between items-center mb-8 lg:px-3">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100">Notifications</h3>
                        <Link to="/dashboard/notifications" className="px-3 py-1 text-xs font-bold text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition-colors">
                            View All
                        </Link>
                    </div>
                    <div className="relative space-y-6 before:absolute before:left-[-10px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100 dark:before:bg-slate-800">
                        {notifications && notifications.map(notif => (
                            <div key={notif.id}>
                                <NotificationItem profileUrl={notif.user?.profileUrl} name={notif.user?.name || notif.user?.email} action={notif.title} time={notif.createdAt} />
                            </div>
                        ))}
                    </div>
                </div>}
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