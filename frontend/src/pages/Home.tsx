import { useState } from 'react';

export default function LandingPage() {
  // State untuk mengontrol visibilitas modal chat
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStartLiveWebChat = () => {
    alert('Fungsi ini akan membuka widget Live Chat Web bawaan Anda!');
    // Integrasikan dengan WebSocket atau state chat internal React kamu di sini
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen text-white bg-gradient-to-135 from-slate-900 via-indigo-950 to-purple-950 font-sans overflow-x-hidden relative">
      
      {/* NAVBAR SECTION */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center relative z-10">
        <div className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          UMKM<span className="text-white">HUB.</span>
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-medium tracking-wide text-slate-300">
          <a href="#produk" className="hover:text-emerald-400 transition-colors">Produk</a>
          <a href="#fitur" className="hover:text-emerald-400 transition-colors">Fitur</a>
          <a href="#testimoni" className="hover:text-emerald-400 transition-colors">Testimoni</a>
        </div>
        <button className="bg-emerald-500 hover:bg-emerald-600 px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5">
          Mulai Sekarang
        </button>
      </nav>

      {/* HERO SECTION */}
      <header className="container mx-auto px-6 pt-12 pb-24 relative flex flex-col md:flex-row items-center justify-between">
        {/* Lingkaran Dekorasi Blur di Background */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10"></div>

        {/* Sisi Kiri: Teks & Aksi */}
        <div className="md:w-1/2 space-y-6 text-center md:text-left">
          <span className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-4 py-1.5 rounded-full font-bold uppercase tracking-widest">
            🚀 IDCamp 2026 Project Showcase
          </span>
          <h1 className="text-4xl md:text-6xl font-black leading-tight">
            Bawa Produk UMKM Anda ke <br />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Level Global</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-lg mx-auto md:mx-0">
            Kelola ratusan produk, otomatisasi layanan pelanggan, dan tingkatkan penjualan UMKM Anda dengan integrasi Omni-channel cerdas.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 pt-4">
            <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 px-8 py-4 rounded-xl font-bold shadow-xl shadow-cyan-500/20 transition-all transform hover:-translate-y-1">
              Jelajahi Produk
            </button>
            
            {/* TOMBOL UTAMA CHAT */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-8 py-4 rounded-xl font-bold border border-white/10 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 shadow-lg"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              Hubungi Admin
            </button>
          </div>
        </div>

        {/* Sisi Kanan: Mockup Mini Dashboard */}
        <div className="md:w-1/2 mt-16 md:mt-0 flex justify-center relative">
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl w-full max-w-md shadow-2xl border border-white/10">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-xs text-emerald-400 font-mono">● Live Server Connected</span>
            </div>
            <div className="space-y-3 text-slate-300">
              <div className="bg-white/5 p-3 rounded-xl flex justify-between items-center border border-white/5">
                <span className="text-sm font-medium">PRD-001 - Gamis Syari Khalisa</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full">Stok: 35</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl flex justify-between items-center border border-white/5">
                <span className="text-sm font-medium">PRD-006 - Kopi Susu Gula Aren</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full">Stok: 100</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl flex justify-between items-center border border-white/5">
                <span className="text-sm font-medium">PRD-013 - Kaos Polos Combed</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full">Stok: 250</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MODAL POPUP SELEKSI CHAT (CONDITIONAL RENDERING) */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300"
          onClick={() => setIsModalOpen(false)} // Menutup modal jika klik di luar kotak
        >
          <div 
            className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl relative transform scale-100 transition-all"
            onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup ketika kotak dalam diklik
          >
            {/* Tombol Close */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>

            {/* Judul Modal */}
            <div className="text-center space-y-2 mb-6">
              <h3 className="text-xl font-bold">Mau Ngobrol Lewat Mana?</h3>
              <p className="text-sm text-slate-400">Pilih opsi kenyamanan saluran komunikasi Anda.</p>
            </div>

            {/* Opsi Pilihan Saluran */}
            <div className="space-y-3">
              {/* OPSI 1: WHATSAPP */}
              <a 
                href="https://wa.me/6281234567890?text=Halo%20Admin%20UMKM%20Hub,%20saya%20tertarik%20dengan%20layanan%20Anda" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between p-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-semibold transition-all shadow-lg shadow-emerald-600/25 group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">💬</span> {/* Ganti icon jika pakai lucide-react / font-awesome */}
                  <div className="text-left">
                    <p className="text-sm font-bold text-white">WhatsApp Chat</p>
                    <p className="text-xs text-emerald-200 font-normal">Respon Cepat & Otomatis Bot</p>
                  </div>
                </div>
                <span className="text-xs transform group-hover:translate-x-1 transition-transform">➔</span>
              </a>

              {/* OPSI 2: WEB CHAT DIRECT */}
              <button 
                onClick={handleStartLiveWebChat}
                className="w-full flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 border border-white/5 rounded-2xl font-semibold transition-all group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">🌐</span>
                  <div className="text-left">
                    <p className="text-sm font-bold text-white">Live Chat Web</p>
                    <p className="text-xs text-slate-400 font-normal">Langsung di Browser Anda</p>
                  </div>
                </div>
                <span className="text-xs transform group-hover:translate-x-1 transition-transform">➔</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}