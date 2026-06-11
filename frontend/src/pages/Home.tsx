import { useEffect, useState } from 'react';
import { ShoppingBag, ChevronRight, MessageCircle, Sparkles, LogIn } from 'lucide-react';
import useAxios from '../lib/axios.service';
import { Link } from 'react-router';
import { useAuthStore } from '../lib/store/authStore';

export default function FashionLandingPage() {
  const { axiosPrivate } = useAxios();
  const { accessToken } = useAuthStore();
  const [waBotLink, setWaBotLink] = useState<string | null>(null);

  const fetchDevices = async () => {
    try {
      const res = await axiosPrivate.get("/devices?status=connected");
      const data = res.data;
      console.log(data);
      if (data.length > 0) {
        const contact = data[data.length - 1].number;
        setWaBotLink(`https://wa.me/${contact}?text=Halo%20Vogue%20Hub,%20saya%20ingin%20tanya%20seputar%20koleksi%20pakaian.`)
      }
    } catch (err) {
      console.error("Fetch Error: ", err);
    }
  }

  useEffect(() => {
    fetchDevices();
  }, [])


  return (
    <div className="min-h-screen text-slate-100 bg-[#0f172a] font-sans overflow-x-hidden relative">

      {/* ⚠️ TOP ALERT BANNER - PROJECT DISCLAIMER */}
      <div className="bg-gradient-to-r from-rose-500/90 to-orange-500/90 py-2 px-4 text-center text-xs sm:text-sm font-medium text-white backdrop-blur-sm z-50 relative flex items-center justify-center gap-2 shadow-md">
        <Sparkles size={14} className="animate-pulse" />
        <span><strong>Perhatian:</strong> Ini adalah project portofolio AI (Bukan toko resmi). Pemesanan dialihkan ke bot simulasi.</span>
      </div>

      {/* NAVBAR SECTION */}
      <nav className="container mx-auto px-6 py-5 flex justify-between items-center relative z-20 border-b border-white/5">
        <div className="text-2xl font-black tracking-tighter flex items-center gap-2">
          <span className="bg-white text-slate-900 p-1.5 rounded-lg">
            <ShoppingBag size={24} />
          </span>
          VOGUE<span className="text-slate-500 font-light">HUB</span>
        </div>
        <div className="hidden md:flex space-x-10 text-sm font-medium tracking-widest uppercase text-slate-400">
          <a href="#koleksi" className="hover:text-white transition-colors duration-300">Koleksi Produk</a>
          <a href="#cerita" className="hover:text-white transition-colors duration-300">Tentang Kami</a>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={waBotLink || ""}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-slate-200 text-slate-900 px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-white/10 transition-all transform hover:-translate-y-0.5 uppercase tracking-wide flex items-center gap-2"
          >
            <MessageCircle size={16} className="text-emerald-500" />
            Chat AI Bot
          </a>
          {!accessToken ? <Link
            to="/login"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-full text-sm font-bold transition-all transform hover:-translate-y-0.5 uppercase tracking-wide flex items-center gap-2"
          >
            <LogIn size={16} className="text-emerald-500" />
            Log In
          </Link> : <Link
            to="/dashboard"
            className="px-6 py-2.5 rounded-full text-sm font-bold transition-all transform hover:-translate-y-0.5 uppercase tracking-wide flex items-center gap-2"
          >
            Dashboard
          </Link>}
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="container mx-auto px-6 pt-16 pb-28 relative flex flex-col lg:flex-row items-center justify-between min-h-[85vh]">

        {/* Dekorasi Cahaya Premium */}
        <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-rose-600/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        {/* Sisi Kiri: Teks & Aksi */}
        <div className="lg:w-1/2 space-y-8 text-center lg:text-left z-10 relative">

          <div className="inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur-md border border-slate-700/50 text-slate-300 text-xs px-4 py-2 rounded-full font-medium tracking-widest uppercase shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
            WhatsApp AI Agent Aktif
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight">
            Elevasi Gaya <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-300 to-slate-500">
              Tanpa Batas.
            </span>
          </h1>

          <p className="text-slate-400 text-lg lg:text-xl max-w-lg mx-auto lg:mx-0 font-light leading-relaxed">
            Temukan pakaian eksklusif dengan kualitas butik premium. Punya pertanyaan seputar produk? Tanyakan langsung pada asisten AI kami.
          </p>

          <div className="flex justify-center lg:justify-start pt-4">
            {/* TOMBOL UTAMA DIRECT WHATSAPP */}
            <a
              href={waBotLink || ""}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-slate-200 text-slate-900 px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.15)] flex items-center justify-center gap-3 group w-full sm:w-auto"
            >
              <MessageCircle size={22} className="text-[#25D366]" />
              Mulai Chat di WhatsApp
              <ChevronRight size={18} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Sisi Kanan: Modern Fashion Showcase Mockup */}
        <div className="lg:w-1/2 mt-20 lg:mt-0 flex justify-center relative z-10 w-full">
          <div className="relative w-full max-w-md aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 group">

            {/* Gambar Placeholder Fashion */}
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1470&auto=format&fit=crop"
              alt="Fashion Model"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Overlay Gradien Bawah */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent"></div>

            {/* Float Product Info Card (Hanya Info, Tanpa Tombol Beli) */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-slate-900/80 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-emerald-400 font-mono tracking-widest mb-1">NEW ARRIVAL</p>
                  <h3 className="text-white font-bold text-lg">Silk Noir Dress</h3>
                  <p className="text-slate-400 text-sm mt-0.5">Rp 1.450.000</p>
                </div>
                {/* Indikator Status Database */}
                <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-white/5">
                  <span className="text-[10px] text-slate-400 font-mono block text-center">ID Produk</span>
                  <span className="text-xs text-white font-bold block text-center">PRD-001</span>
                </div>
              </div>
            </div>

            {/* Float System Indicator */}
            <div className="absolute top-6 right-6 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2 shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]"></span>
              </span>
              <span className="text-[10px] font-mono text-slate-300">RAG Knowledge Synced</span>
            </div>
          </div>
        </div>
      </header>

    </div>
  );
}