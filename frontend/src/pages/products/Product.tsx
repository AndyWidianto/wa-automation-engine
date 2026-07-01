import { Search, Trash2, Edit3, ChevronLeft, ChevronRight, Package, ArrowRight, ShoppingBag, Coins, FileText, Upload, Boxes } from 'lucide-react';
import MotionModal from '../../components/Motion';
import { Input, Textarea } from '../../components/Inputs';
import { TdActionSkeleton, TdContentSkeleton, TdNameSkeleton, TdNoSkeleton, TdStatusSkeleton, TdTypeSkeleton, TrSkeleton } from '../../components/Skeletons';
import useProduct from '../../hooks/product';
import TableFilterProduct from '../../components/FilteredProduct';

export default function Products() {
  const {
    loading,
    items,
    handleUpdate,
    handleClose,
    itemsPerPage,
    handleCurrentPage,
    handlePrevPage,
    currentPage,
    totalPages,
    isOpen,
    indexOfFirstItem,
    totalProducts,
    handleRemoveImage,
    handleFileChange,
    formData,
    setFormData,
    handleDelete,
    handleSearch,
    handleUpdateProduct,
    handleFiltered,
    loadingUpdate
  } = useProduct();

  return (
    <div className="md:p-8 min-h-screen dark:bg-background dark:text-white">
      <MotionModal onClose={handleClose} isOpen={isOpen}>
        <form onSubmit={handleUpdateProduct} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/60 dark:border-slate-800/80 space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold dark:text-white tracking-tight">Update Produk</h2>
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
              <button className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all duration-300 group transform active:scale-[0.98]">
                {!loadingUpdate ? <div className='w-full flex items-center justify-center gap-2'>
                  <span>Simpan Produk</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div> : "Sedang memproses.."}
              </button>
            </div>
          </div>
        </form>
      </MotionModal>
      <div className="w-full mx-1 md:mx-auto space-y-4">

        {/* Toolbar: Search & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 dark:bg-[#111827] p-4 rounded-xl border border-gray-300 dark:border-gray-800">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-200 dark:text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search name or job..."
              className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              onChange={handleSearch}
            />
          </div>

          <TableFilterProduct onApplyFilter={handleFiltered} />
        </div>

        {/* Table Container */}
        <div className="overflow-hidden rounded-xl shadow-2xl border border-gray-300 dark:border-gray-800">
          <div className="overflow-x-auto block w-full">
            <table className="w-full min-w-[1000px] text-left dark:border-collapse dark:bg-[#111827]">
              <thead>
                <tr className="bg-[#6366f1] text-white">
                  <th className="px-6 py-4 font-semibold text-sm">No.</th>
                  <th className="px-6 py-4 font-semibold text-sm">Produk</th>
                  <th className="px-6 py-4 font-semibold text-sm">Harga</th>
                  <th className="px-6 py-4 font-semibold text-sm">Stok</th>
                  <th className="px-6 py-4 font-semibold text-sm">Deskripsi</th>
                  <th className="px-6 py-4 font-semibold text-sm text-center">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-400 dark:divide-gray-800">
                {loading ?
                  Array.from({ length: 6 }).map((_, i) => (
                    <TrSkeleton key={i}>
                      <TdNoSkeleton />
                      <TdNameSkeleton />
                      <TdTypeSkeleton />
                      <TdContentSkeleton />
                      <TdStatusSkeleton />
                      <TdActionSkeleton />
                    </TrSkeleton>
                  ))
                  :
                  items.length > 0 ? (
                    items.map((product, idx) => (
                      <tr key={product.id} className="hover:bg-gray-300/40 hover:dark:bg-gray-800/40 transition-colors">
                        {/* No. */}
                        <td className="px-6 py-4 text-sm truncate max-w-100 font-medium text-gray-800 dark:text-gray-200">
                          {(idx + 1 * itemsPerPage * currentPage) - itemsPerPage + 1}
                        </td>

                        {/* Gambar & Nama Produk */}
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-150 dark:bg-slate-800 border border-gray-300 dark:border-gray-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
                              {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <Package className="text-gray-400 dark:text-gray-500" size={18} />
                              )}
                            </div>
                            <span className="truncate max-w-[200px]">{product.name}</span>
                          </div>
                        </td>

                        {/* Harga (Format Rupiah otomatis) */}
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-300">
                          Rp {product.price?.toLocaleString('id-ID')}
                        </td>

                        {/* Stok dengan Badge dinamis */}
                        <td className="px-6 py-4 text-sm">
                          {product.stock > 0 ? (
                            <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold">
                              {product.stock} Pcs
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-bold">
                              Habis
                            </span>
                          )}
                        </td>

                        {/* Deskripsi Produk */}
                        <td className="px-6 py-4 text-sm truncate max-w-[250px] text-gray-500 dark:text-gray-400">
                          {product.description || <span className="italic opacity-50">Tidak ada deskripsi</span>}
                        </td>

                        {/* Aksi (Update & Delete) */}
                        <td className="px-6 py-4 text-sm text-center">
                          <div className="flex justify-center gap-3">
                            <div className="relative group">
                              <button
                                onClick={() => handleUpdate(product)}
                                className="p-1.5 bg-blue-500/10 text-blue-400 rounded-md hover:bg-blue-500 hover:text-white transition"
                              >
                                <Edit3 size={16} />
                              </button>
                              <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                Update
                              </div>
                            </div>
                            <div className="relative group">
                              <button
                                onClick={() => handleDelete(product)}
                                className="p-1.5 bg-red-500/10 text-red-400 rounded-md hover:bg-red-500 hover:text-white transition"
                              >
                                <Trash2 size={16} />
                              </button>
                              <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                Delete
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-gray-500">No data found</td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Control */}
        <div className="flex justify-between items-center dark:bg-[#111827] p-4 rounded-xl border border-gray-300 dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="text-gray-900 dark:text-white font-medium">{indexOfFirstItem + 1}</span> to <span className="text-gray-900 dark:text-white font-medium">{totalPages}</span> of <span className="text-gray-900 dark:text-white font-medium">{totalProducts}</span> entries
          </p>

          <div className="flex gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-700 transition"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center px-4 text-sm font-medium">
              Page {currentPage} of {totalPages || 1}
            </div>
            <button
              onClick={handleCurrentPage}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-700 transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}