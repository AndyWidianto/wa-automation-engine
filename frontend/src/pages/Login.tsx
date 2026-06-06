import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
import useLogin from '../hooks/login';


export default function LoginPage() {
  const { loading, setFormData, setShowPassword, showPassword, handleSubmit } = useLogin();

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans relative overflow-hidden flex flex-col">

      {/* ⚠️ TOP ALERT BANNER - PROJECT DISCLAIMER */}
      <div className="bg-gradient-to-r from-rose-500/90 to-orange-500/90 py-2 px-4 text-center text-xs sm:text-sm font-medium text-white backdrop-blur-sm z-50 relative flex items-center justify-center gap-2 shadow-md w-full">
        <Sparkles size={14} className="animate-pulse" />
        <span><strong>Perhatian:</strong> Ini adalah portal admin portofolio AI (Bukan sistem toko resmi).</span>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative z-10">

        {/* Decorative Ambient Lights (Boutique Style) */}
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-rose-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* The Glassmorphism Card */}
        <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-[#1e293b]/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative z-20">

          {/* Left Side: Premium Fashion Imagery & Info */}
          <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden group">

            {/* Dark Fashion Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1471&auto=format&fit=crop"
                alt="Fashion Background"
                className="w-full h-full object-cover opacity-30 transform group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent"></div>
            </div>

            <div className="relative z-10">
              {/* Logo Matching Landing Page */}
              <div className="text-2xl font-black tracking-tighter flex items-center gap-2 mb-12">
                <span className="bg-white text-slate-900 p-1.5 rounded-lg shadow-lg">
                  <ShoppingBag size={24} />
                </span>
                VOGUE<span className="text-slate-400 font-light">HUB</span>
              </div>

              <h1 className="text-4xl font-extrabold leading-[1.1] mb-5 tracking-tight text-white">
                Manajemen Butik <br /> & AI Assistant.
              </h1>
              <p className="text-slate-300 text-base leading-relaxed max-w-sm font-light">
                Kelola katalog pakaian eksklusif, pantau integrasi bot WhatsApp, dan tingkatkan pengalaman pelanggan dalam satu pintu.
              </p>
            </div>

            <div className="relative z-10 mt-12">
              <div className="bg-slate-900/50 backdrop-blur-md p-5 rounded-2xl border border-white/5 inline-block shadow-lg max-w-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]"></span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 tracking-widest">SYSTEM STATUS</span>
                </div>
                <p className="text-sm font-medium text-slate-200">
                  RAG Database & WhatsApp Instance berjalan optimal.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Sleek Dark Form */}
          <div className="p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-[#0f172a]/40 backdrop-blur-sm z-10">
            <div className="mb-10">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Portal Admin</h2>
              <p className="text-slate-400 mt-2 font-light tracking-wide">Silakan masuk ke akun VOGUEHUB Anda.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Email / ID Akses</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors duration-200" size={18} />
                  <input
                    type="email"
                    placeholder="admin@voguehub.com"
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-700/50 focus:border-white focus:bg-slate-800/80 rounded-xl transition-all duration-300 outline-none ring-0 text-white font-medium placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Kata Sandi</label>
                  <a href="#" className="text-xs font-medium text-slate-400 hover:text-white transition-colors">Lupa Akses?</a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors duration-200" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    className="w-full pl-12 pr-12 py-4 bg-slate-900/50 border border-slate-700/50 focus:border-white focus:bg-slate-800/80 rounded-xl transition-all duration-300 outline-none ring-0 text-white font-medium placeholder:text-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button
                  disabled={loading}
                  className="w-full bg-white hover:bg-slate-200 text-slate-900 font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300 flex items-center justify-center gap-2 group transform active:scale-[0.98]"
                >
                  {loading ? (
                    <span className="animate-pulse">Mengautentikasi...</span>
                  ) : (
                    <>
                      Masuk Sistem
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-10 text-center border-t border-white/5 pt-6">
              <p className="text-xs text-slate-500 font-mono">
                Secured by EvolveWA Engine &middot; V 1.0.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}