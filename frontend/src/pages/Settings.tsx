import {
    User, Lock,
    Activity,
    Camera,
    Save,
    Users,
    Mail,
    UserCircle,
    Link2,
    Trash2,
    Tag
} from 'lucide-react';
import MotionModal from '../components/Motion';
import useSetting from '../hooks/settings';
import FormModal from '../components/FormModal';
import { Input } from '../components/Inputs';
import Loading from '../components/Loading';
import QRCodeModal from '../components/QrCode';
import type { TypeNotification } from '../lib/types';

const ProfileSettings = () => {

    const {
        isOpen,
        setFormData,
        handleClose,
        handleSubmit,
        handleDelete,
        formData,
        loading,
        setIsOpen,
        devices,
        user,
        handleUpdateUser,
        loadingUser,
        setFormDataUser,
        formDataUser,
        setFormDataPassword,
        formDataPassword,
        handleUpdatePassword,
        errors,
        isOpenQrCode,
        handleSelectDevice,
        selectDevice,
        refInputImages,
        handleChangeImage,
        handleUpload,
        laodingUpload,
        showImage,
        notifications,
        isLoadingNotifications
    } = useSetting();

    const Role = () => {
        const roleConfig = {
            super_admin: {
                label: "Admin Utama",
                classes: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20"
            },
            admin: {
                label: "Admin",
                classes: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20"
            },
            review: {
                label: "Reviewer",
                classes: "bg-slate-50 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-500/20"
            }
        };

        const config = roleConfig[user?.role as "super_admin" | "admin" | "review"] || roleConfig.review;

        return (
            <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-lg border w-fit mx-auto md:mx-0 ${config.classes}`}>
                {config.label}
            </span>
        );
    }

    const TIMELINE_CONFIG: Record<TypeNotification, { dotClass: string; textClass: string }> = {
        SUCCESS: { dotClass: "bg-emerald-500 ring-emerald-100 dark:ring-emerald-500/20", textClass: "text-emerald-600 dark:text-emerald-400" },
        WARNING: { dotClass: "bg-amber-500 ring-amber-100 dark:ring-amber-500/20", textClass: "text-amber-600 dark:text-amber-400" },
        ERROR: { dotClass: "bg-rose-500 ring-rose-100 dark:ring-rose-500/20", textClass: "text-rose-600 dark:text-rose-400" },
        INFO: { dotClass: "bg-blue-500 ring-blue-100 dark:ring-blue-500/20", textClass: "text-blue-600 dark:text-blue-400" },
    };

    return (
        <div className="p-4 md:p-8 bg-[#F8FAFC] dark:bg-[#0F172A] min-h-screen transition-all duration-500">
            <MotionModal isOpen={isOpen} onClose={handleClose}>
                <FormModal title='Create device' onSave={handleSubmit} onClose={handleClose} loading={loading}>
                    <Input title='Name' value={formData.name} icon={Tag} placeholder='Pelayanan...' onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} />
                    <Input title='Instance Name' value={formData.instanceName} placeholder='pelayanan-1234' onChange={(e) => setFormData(prev => ({ ...prev, instanceName: e.target.value }))} icon={Tag} />
                </FormModal>
            </MotionModal>
            <MotionModal isOpen={isOpenQrCode} onClose={handleClose}>
                <QRCodeModal isOpen={isOpenQrCode} deviceId={selectDevice?.id || ""} onClose={handleClose} />
            </MotionModal>
            <div className="max-w-6xl mx-auto space-y-8">

                {/* --- 1. HERO SECTION (USER INFO) --- */}
                <div className="relative overflow-hidden bg-white dark:bg-[#1E293B] rounded-3xl shadow-xl shadow-indigo-500/5 border border-gray-100 dark:border-slate-800 p-6 md:p-10">
                    {/* Decorative Background Glow */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>

                    <div className="relative flex flex-col md:flex-row items-center gap-10">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-700 shadow-2xl transition-transform duration-300 group-hover:scale-105">
                                <img
                                    src={showImage ? showImage : user?.profileUrl || "/default.png"}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <input
                                type="file"
                                name="image"
                                id="imageInput"
                                accept="image/*"
                                onChange={handleChangeImage}
                                ref={refInputImages}
                                hidden
                            />
                            <button onClick={() => refInputImages.current?.click()} className="absolute bottom-1 right-1 p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-xl transition-all hover:scale-110 active:scale-95">
                                <Camera className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-3">
                            <div className="space-y-1">
                                <div className="flex flex-col md:flex-row md:items-center gap-3">
                                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{user?.name}</h1>
                                    {Role()}
                                </div>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                                    <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {user?.email}</span>
                                    <span className="flex items-center gap-1.5"><UserCircle className="w-4 h-4" /> @{user?.username}</span>
                                </div>
                            </div>
                        </div>

                        <button onClick={handleUpload} className="group flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 active:translate-y-0">
                            <Loading loading={laodingUpload}>
                                <Save className="w-5 h-5 group-hover:animate-pulse" /> Simpan Perubahan
                            </Loading>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* KOLOM KIRI */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* --- 2. PENGATURAN AKUN & INSTANSI --- */}
                        <div className="bg-white dark:bg-[#1E293B] rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-8 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
                                    <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Profil</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-5">
                                    <div className="group">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Nama</label>
                                        <input type="text" defaultValue={formDataUser.name} onChange={(e) => setFormDataUser(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:bg-slate-800/50 dark:border-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" />
                                    </div>
                                    <div className="group">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Email</label>
                                        <input type="text" defaultValue={formDataUser.email} onChange={(e) => setFormDataUser(prev => ({ ...prev, email: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:bg-slate-800/50 dark:border-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" />
                                    </div>
                                    <div className="group">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Username</label>
                                        <input type="text" defaultValue={formDataUser.username} onChange={(e) => setFormDataUser(prev => ({ ...prev, username: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:bg-slate-800/50 dark:border-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" />
                                    </div>
                                </div>
                                {/* <div className="group">
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Alamat Kantor Desa</label>
                                    <textarea rows={5} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:bg-slate-800/50 dark:border-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none">Jl. Balai Desa No. 45, Kec. Adiwerna, Tegal, Jawa Tengah</textarea>
                                </div> */}
                                <button onClick={handleUpdateUser} className="group flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 active:translate-y-0">
                                    <Loading loading={loadingUser}>
                                        <Save className="w-5 h-5 group-hover:animate-pulse" /> Simpan Perubahan
                                    </Loading>
                                </button>
                            </div>
                        </div>

                        {/* --- 3. WHATSAPP INSTANCES --- */}
                        <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-gray-100 dark:border-slate-800 p-8 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
                                        <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">WhatsApp Instances</h3>
                                </div>
                                <button onClick={() => setIsOpen(true)} className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-xl hover:opacity-90 transition-all active:scale-95">
                                    + Tambah Akun
                                </button>
                            </div>

                            <div className="space-y-4">
                                {devices.map((device) => (
                                    <div
                                        key={device.id}
                                        className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#0A0A0A] border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-indigo-500/5"
                                    >
                                        <div className="flex items-start sm:items-center gap-4">
                                            <div className="relative flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 group-hover:border-indigo-500/20 transition-colors">
                                                <span className="text-lg font-bold text-slate-700 dark:text-slate-300">
                                                    {device.name.charAt(0).toUpperCase()}
                                                </span>

                                                {/* Indikator Status di pojok Avatar */}
                                                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                                                    {device.status === 'connected' && (
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                    )}
                                                    <span className={`relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-white dark:border-[#0A0A0A] ${device.status === 'connected' ? 'bg-emerald-500' :
                                                        device.status === 'connecting' ? 'bg-amber-500' : 'bg-rose-500'
                                                        }`}></span>
                                                </span>
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
                                                        {device.name}
                                                    </h4>
                                                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-500 dark:text-slate-400 font-mono">
                                                        {device.instanceName}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                                        {device.number ? `+${device.number}` : 'No number attached'}
                                                    </span>
                                                    {/* {device.integration && (
                                                        <>
                                                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                                            <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-500/20">
                                                                {device.integration}
                                                            </span>
                                                        </>
                                                    )} */}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Sisi Kanan: Actions (Responsive) */}
                                        <div className="flex items-center gap-2 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t border-slate-100 dark:border-slate-800 sm:border-t-0">
                                            <button
                                                onClick={() => handleSelectDevice(device)}
                                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all focus:ring-2 focus:ring-indigo-500/20 active:scale-95"
                                            >
                                                <Link2 className="w-4 h-4" />
                                                <span>Connect</span>
                                            </button>

                                            <button
                                                onClick={() => handleDelete(device.id)}
                                                className="flex items-center justify-center p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all active:scale-95"
                                                title="Delete Device"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* KOLOM KANAN */}
                    <div className="space-y-8">
                        {/* --- SECURITY --- */}
                        <div className="bg-white dark:bg-[#1E293B] rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-8 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-rose-50 dark:bg-rose-500/10 rounded-xl">
                                    <Lock className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Keamanan</h3>
                            </div>
                            <form className="space-y-4">
                                <input
                                    type="password"
                                    placeholder="Password Lama"
                                    defaultValue={formDataPassword.password}
                                    onChange={(e) => setFormDataPassword(prev => ({ ...prev, password: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:bg-slate-800/50 dark:border-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                                />

                                <div className="h-px bg-slate-100 dark:bg-slate-700 my-2"></div>

                                <input
                                    type="password"
                                    placeholder="Password Baru"
                                    defaultValue={formDataPassword.newPassword}
                                    onChange={(e) => setFormDataPassword(prev => ({ ...prev, newPassword: e.target.value }))}
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-rose-500' : 'border-gray-200'} dark:bg-slate-800/50 dark:border-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all`}
                                />

                                <input
                                    type="password"
                                    placeholder="Konfirmasi Password"
                                    defaultValue={formDataPassword.confirmPassword}
                                    onChange={(e) => setFormDataPassword(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-rose-500' : 'border-gray-200'} dark:bg-slate-800/50 dark:border-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all`}
                                />

                                {errors.password && (
                                    <p className="text-rose-500 text-xs mt-1 ml-2 font-medium">
                                        {errors.password}
                                    </p>
                                )}

                                <button
                                    onClick={handleUpdatePassword}
                                    type="button"
                                    className="w-full py-3.5 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 active:scale-95 mt-2"
                                >
                                    Update Password
                                </button>
                            </form>
                        </div>

                        {/* --- ACTIVITY LOG --- */}
                        <div className="bg-white dark:bg-[#1E293B] rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 sm:p-8 transition-all hover:shadow-md">
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex-shrink-0">
                                    <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-none">Aktivitas</h3>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Log riwayat sistem terbaru</p>
                                </div>
                            </div>

                            {/* Content / Timeline Container */}
                            <div className="space-y-6">
                                {isLoadingNotifications ? (
                                    <div className="flex items-center justify-center py-6">
                                        <div className="border-2 w-5 h-5 rounded-full border-slate-200 border-t-emerald-500 animate-spin"></div>
                                        <span className="text-sm text-slate-400 dark:text-slate-500 ml-2">Memuat aktivitas...</span>
                                    </div>
                                ) : !notifications || notifications.length === 0 ? (
                                    <p className="text-sm text-center py-6 text-slate-400 dark:text-slate-500">Tidak ada aktivitas terbaru</p>
                                ) : (
                                    notifications.map((item, idx) => {
                                        const config = TIMELINE_CONFIG[item.type] || TIMELINE_CONFIG.INFO;
                                        const isLastItem = idx === notifications.length - 1;

                                        return (
                                            <div key={item.id || idx} className="flex gap-4 group relative">
                                                <div className="flex flex-col items-center shrink-0">
                                                    <div className={`w-3 h-3 ${config.dotClass} rounded-full ring-4 mt-1.5 z-10 transition-transform group-hover:scale-110`} />
                                                    {!isLastItem && (
                                                        <div className="w-px flex-1 bg-slate-100 dark:bg-slate-800/80 my-2 min-h-[30px]" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0 pb-2">
                                                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                                                        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors truncate pr-2">
                                                            {item.title}
                                                        </h4>
                                                        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 shrink-0 whitespace-nowrap">
                                                            {new Date(item.createdAt).toLocaleString('id-ID', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </span>
                                                    </div>
                                                    {item.content && (
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                                                            {item.content}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;