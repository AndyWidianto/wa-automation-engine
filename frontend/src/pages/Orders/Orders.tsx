import { Eye, Edit3, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { TdActionSkeleton, TdDateSkeleton, TdIdSkeleton, TdNoSkeleton, TdPriceSkeleton, TdStatusSkeleton, TrSkeleton } from '../../components/Skeletons';
import useOrderTable from '../../hooks/orderTable';
import EditOrderModal from '../../components/EditOrderModal';
import type { Order } from '../../lib/types';
import { useNavigate } from 'react-router';



const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function OrderTable() {
  const {
    orderSelected,
    isOpen,
    handleClose,
    handleNext,
    handlePrev,
    handleUpdate,
    items,
    loading,
    itemsPerPage,
    formatCurrency,
    getStatusBadge,
    currentPage,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem,
    handleDelete,
    loadingForDelete,
    orders,
    updateOrder,
  } = useOrderTable();
  const navigate = useNavigate();

  return (
    <>
      <EditOrderModal order={orderSelected} isOpen={isOpen} onClose={handleClose} onSave={(order: Order) => updateOrder(order)} />
      {/* Table Container */}
      <div className="overflow-hidden rounded-xl shadow-2xl border border-gray-300 dark:border-gray-800">
        <div className="overflow-x-auto block w-full">
          <table className="w-full min-w-[1000px] text-left dark:border-collapse dark:bg-[#111827]">
            <thead>
              <tr className="bg-[#6366f1] text-white">
                <th className="px-6 py-4 font-semibold text-sm">No.</th>
                <th className="px-6 py-4 font-semibold text-sm">Order ID</th>
                <th className="px-6 py-4 font-semibold text-sm">Date</th>
                <th className="px-6 py-4 font-semibold text-sm">Total Price</th>
                <th className="px-6 py-4 font-semibold text-sm">Status</th>
                <th className="px-6 py-4 font-semibold text-sm text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-400 dark:divide-gray-800">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TrSkeleton key={i}>
                    <TdNoSkeleton />
                    <TdIdSkeleton />
                    <TdDateSkeleton />
                    <TdPriceSkeleton />
                    <TdStatusSkeleton />
                    <TdActionSkeleton />
                  </TrSkeleton>
                ))
              ) : items.length > 0 ? (
                items.map((order, idx) => (
                  <tr key={order.id} className={`hover:bg-gray-300/40 hover:dark:bg-gray-800/40 transition-colors ${loadingForDelete && (orderSelected?.id === order.id) ? 'opacity-50' : ''}`}>
                    {/* Nomor */}
                    <td className="px-6 py-4 text-sm truncate max-w-100 font-medium text-gray-800 dark:text-gray-200">
                      {(idx + 1 * itemsPerPage * currentPage) - itemsPerPage + 1}
                    </td>
                    <td className="px-6 py-4 text-sm truncate max-w-100 font-mono font-medium text-gray-800 dark:text-gray-200">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 text-sm truncate max-w-100 text-gray-900 dark:text-gray-400">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm truncate max-w-100 font-semibold text-gray-900 dark:text-gray-200">
                      {formatCurrency(order.totalPrice)}
                    </td>
                    <td className="px-6 py-4 text-sm truncate max-w-100 text-gray-900 dark:text-gray-400">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <div className="flex justify-center gap-3">
                        {/* View Details */}
                        <div className="relative group">
                          <button
                            onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                            className="p-1.5 bg-green-600/10 text-green-500 dark:text-green-400 rounded-md hover:bg-green-500 hover:text-white transition"
                          >
                            <Eye size={16} />
                          </button>
                          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            View Details
                          </div>
                        </div>

                        {/* Update */}
                        <div className="relative group">
                          <button
                            onClick={() => handleUpdate(order)}
                            disabled={(orderSelected?.id === order.id) && loadingForDelete}
                            className="p-1.5 bg-blue-500/10 text-blue-400 rounded-md hover:bg-blue-500 hover:text-white transition"
                          >
                            <Edit3 size={16} />
                          </button>
                          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            Update
                          </div>
                        </div>

                        {/* Delete */}
                        <div className="relative group">
                          <button
                            onClick={() => handleDelete(order)}
                            disabled={(orderSelected?.id === order.id) && loadingForDelete}
                            className="p-1.5 bg-red-500/10 text-red-400 rounded-md hover:bg-red-500 hover:text-white transition"
                          >
                            <Trash2 size={16} />
                          </button>
                          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            Delete
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Control */}
      <div className="flex justify-between items-center dark:bg-[#111827] p-4 rounded-xl border border-gray-300 dark:border-gray-800 mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="text-gray-900 dark:text-white font-medium">{indexOfFirstItem + 1}</span> to <span className="text-gray-900 dark:text-white font-medium">{Math.min(indexOfLastItem, orders.length)}</span> of <span className="text-gray-900 dark:text-white font-medium">{orders.length}</span> entries
        </p>

        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center px-4 text-sm font-medium">
            Page {currentPage} of {totalPages || 1}
          </div>
          <button
            onClick={handleNext} // diubah ke handleNext agar lebih semantik dari handleCurrent sebelumnya
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </>
  );
}