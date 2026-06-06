import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import useLogin from '../hooks/login';
import Loading from '../components/Loading';

export default function LoginPage() {
  const { loading, setFormData, setShowPassword, showPassword, handleSubmit } = useLogin();

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#030712] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Decorative Glow Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 rounded-full blur-[140px]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-cyan-500/20 to-violet-500/20 rounded-full blur-[140px]"></div>

      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-white/80 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] border border-slate-200/50 dark:border-slate-800/80 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.08)] overflow-hidden relative z-10">

        {/* Left Side: Premium Illustration & Info */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-700 text-white relative overflow-hidden">

          {/* Decorative inner glow for premium look */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_50%)]"></div>

          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/15 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-10 border border-white/25 shadow-xl shadow-indigo-900/20">
              <img src="/icons/apple-touch-icon.png" alt="logo chatbot" className="w-full h-full bg-white rounded-2xl object-cover p-1" />
            </div>
            <h1 className="text-4xl font-extrabold leading-[1.2] mb-5 tracking-tight bg-gradient-to-r from-white via-white to-blue-100 bg-clip-text text-transparent">
              Automasi layanan <br /> WhatsApp UMKM.
            </h1>
            <p className="text-indigo-100/80 text-base leading-relaxed max-w-sm font-medium">
              Kelola pesan pelanggan, berikan balasan otomatis berbasis AI, dan tingkatkan konversi penjualan dengan platform EvolveWA.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 inline-block shadow-lg max-w-sm">
              <p className="text-sm leading-relaxed font-medium text-slate-50 italic">
                "Sistem RAG chatbot-nya sangat membantu efisiensi operasional dan melayani customer UMKM kami secara 24/7."
              </p>
              <p className="text-xs mt-3 font-bold text-indigo-200 tracking-wide uppercase">— Owner UMKM</p>
            </div>
          </div>

          {/* Abstract pattern decoration */}
          <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
            <svg width="100%" height="100%"><pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="white" /></pattern><rect width="100%" height="100%" fill="url(#pattern)" /></svg>
          </div>
        </div>

        {/* Right Side: Sleek Login Form */}
        <div className="p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-white/40 dark:bg-transparent">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Selamat Datang</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Silakan masuk ke akun manajemen UMKM Anda</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200" size={18} />
                <input
                  type="email"
                  placeholder="nama@bisnis.com"
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 rounded-2xl transition-all duration-200 outline-none ring-0 focus:ring-4 focus:ring-indigo-500/10 text-slate-800 dark:text-white font-medium placeholder:text-slate-400/80"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Password</label>
                <a href="#" className="text-xs font-bold text-indigo-500 hover:text-indigo-600 transition-colors">Lupa Password?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 rounded-2xl transition-all duration-200 outline-none ring-0 focus:ring-4 focus:ring-indigo-500/10 text-slate-800 dark:text-white font-medium placeholder:text-slate-400/80"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-300 flex items-center justify-center gap-2 group transform active:scale-[0.98]">
                <Loading loading={loading}>
                  Masuk Sekarang
                </Loading>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </form>

          {/* Footer text replacement for dead spacing code */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Menggunakan enkripsi end-to-end teramankan oleh EvolveWA Platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}