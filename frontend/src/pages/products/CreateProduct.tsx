import { ShoppingBag, Coins, Boxes, FileText, Upload, Trash2, ArrowRight } from 'lucide-react';
import { Input, Textarea } from '../../components/Inputs';
import type { CreateProduct } from '../../lib/types';
import useCreateProduct from '../../hooks/createProduct';


export default function CreateProduct() {
  const {
    formData,
    handleFileChange,
    handleRemoveImage,
    setFormData,
    handleSubmit,
    loading
  } = useCreateProduct();
  return (
    <div className="p-6 bg-[#f8fafc] dark:bg-slate-950 min-h-screen transition-colors font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-1 gap-8 items-start">

        {/* --- CONTAINER 1: FORM INPUT PRODUK --- */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/60 dark:border-slate-800/80 space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold dark:text-white tracking-tight">Tambah Produk Baru</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Masukkan detail produk UMKM untuk diintegrasikan ke sistem AI Chatbot.</p>
          </div>

          <div className="space-y-5">
            {/* Nama Produk */}
            <Input 
              title="Nama Produk" 
              value={formData.name} 
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} 
              icon={ShoppingBag} 
              placeholder="Contoh: Keripik Tempe Pedas 150g"  
            />

            {/* Grid untuk Harga & Stok */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input 
                title="Harga (Rp)" 
                value={formData.price.toString() || ''} 
                onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))} 
                icon={Coins} 
                placeholder="Contoh: 15000"  
              />
              <Input 
                title="Stok Produk" 
                value={formData.stock.toString() || ''} 
                onChange={(e) => setFormData(prev => ({ ...prev, stock: Number(e.target.value) }))} 
                icon={Boxes} 
                placeholder="Contoh: 50"  
              />
            </div>

            {/* Deskripsi Produk */}
            <Textarea
              title="Deskripsi Produk" 
              rows={5} 
              value={formData.description || ""} 
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} 
              icon={FileText} 
              placeholder="Jelaskan detail produk, variasi rasa, atau komposisi di sini..." 
            />

            {/* Upload Gambar Produk */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 ml-1">Foto Produk</label>
              
              {!formData.imageUrl ? (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-2xl cursor-pointer bg-slate-50 dark:bg-slate-900/40 border-slate-300 dark:border-slate-800 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 transition-all duration-200 group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                      <Upload className="w-8 h-8 mb-2 text-slate-400 group-hover:text-indigo-500 group-hover:scale-110 transition-all" />
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Klik atau seret foto ke sini</p>
                      <p className="text-xs text-slate-400 mt-1">PNG, JPG, atau JPEG (Maks. 2MB)</p>
                    </div>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              ) : (
                <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden h-36 bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
                  <img src={formData.imageUrl} alt="Upload preview" className="h-full w-auto object-cover" />
                  <button 
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg transition transform active:scale-95"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Tombol Submit */}
            <div className="pt-2">
              <button disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all duration-300 flex items-center justify-center gap-2 group transform active:scale-[0.98]">
                {!loading ? <>
                <span>Simpan Produk</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </> : <div className='flex items-center justify-center gap-2'>
                  <div className="w-6 h-6 rounded-full border-3 border-gray-300 border-t-transparent animate-spin"></div>
                  Proses Menyimpan
                  </div>}
              </button>
            </div>
          </div>
        </form>

        {/* --- CONTAINER 2: LIVE CATALOG PREVIEW --- */}
        {/* <div className="sticky top-6 h-fit bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/60 dark:border-slate-800/80">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Live Preview Katalog</h2>
          <div className="w-full max-w-[340px] mx-auto bg-white dark:bg-slate-950 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden group/card transition-all duration-300">
            <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center border-b border-slate-100 dark:border-slate-900 overflow-hidden">
              {formData.imageUrl ? (
                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <Package size={48} className="stroke-[1.2] opacity-60 animate-pulse" />
                  <span className="text-xs font-medium opacity-50">Belum ada foto produk</span>
                </div>
              )}
              
              <div className="absolute top-4 left-4">
                {formData.stock > 0 ? (
                  <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-extrabold rounded-full shadow-md shadow-indigo-600/20">
                    Stok: {formData.stock}
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-red-500 text-white text-xs font-extrabold rounded-full shadow-md shadow-red-500/20">
                    Stok Habis
                  </span>
                )}
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white truncate">
                  {formData.name || 'Nama Produk Anda'}
                </h3>
                <p className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500">
                  Rp {formData.price ? formData.price.toLocaleString('id-ID') : '0'}
                </p>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 min-h-[48px] leading-relaxed font-medium">
                {formData.description || 'Deskripsi lengkap mengenai produk UMKM kamu akan tampil secara detail di bagian ini...'}
              </p>

              <div className="pt-2">
                <div className="w-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold py-2.5 rounded-xl text-xs text-center border border-slate-200/50 dark:border-slate-800/30">
                  Lihat Detail Produk
                </div>
              </div>
            </div>

          </div>
        </div> */}

      </div>
    </div>
  );
}