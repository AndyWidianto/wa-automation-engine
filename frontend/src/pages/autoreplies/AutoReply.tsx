import { Search, Trash2, Edit3, ChevronLeft, ChevronRight, Tag, MessageSquare, Loader2, Bot, MessageSquareOff } from 'lucide-react';
import useAutoreply from '../../hooks/autoreply';
import MotionModal from '../../components/Motion';
import FormModal from '../../components/FormModal';
import { Input, Select, Textarea } from '../../components/Inputs';
import { TdActionSkeleton, TdContentSkeleton, TdNameSkeleton, TdNoSkeleton, TdStatusSkeleton, TdTypeSkeleton, TrSkeleton } from '../../components/Skeletons';
import TableFilter from '../../components/FilteredAutoreply';

export default function AutoReply() {
  const {
    autoreplies,
    handleDelete,
    handleUpdate,
    indexOfFirstItem,
    currentPage,
    totalPages,
    indexOfLastItem,
    handleClose,
    isOpen,
    selected,
    updateAutoreply,
    setFormData,
    formData,
    loading,
    handleCurrent,
    handlePrev,
    itemsPerPage,
    items,
    handleSearchTerm,
    handleFiltered
  } = useAutoreply();

  return (
    <div className="md:p-8 min-h-screen dark:bg-background dark:text-white">
      <MotionModal onClose={handleClose} isOpen={isOpen}>
        <FormModal title='Update Autoreply' onClose={handleClose} onSave={updateAutoreply} loading={loading}>
          <div className="grid grid-cols-2 gap-4">
            <Input icon={Tag} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} title='Keyword' value={selected?.name || ""} />
            <Select title='Type' onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))} value={selected?.type || "keyword"}>
              <option value="">Select type</option>
              <option value="keyword">Keyword</option>
              <option value="ai_rag">AI RAG</option>
            </Select>
          </div>
          {formData.type === "keyword" ? <Textarea icon={MessageSquare} title='Response Content' onChange={(e) => setFormData(prev => ({ ...prev, replyContent: e.target.value }))} value={selected?.replyContent || ""} /> :
            <Textarea icon={MessageSquare} title='Prompt AI' onChange={(e) => setFormData(prev => ({ ...prev, aiPrompt: e.target.value }))} value={selected?.aiPrompt || ""} />}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl border transition-all duration-300 ${formData.isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-700/40 text-slate-400 dark:text-slate-500'
                }`}>
                {formData.isActive ? <Bot size={22} /> : <MessageSquareOff size={22} />}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">
                  Status Auto-Reply AI
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  Respons otomatis pesan WhatsApp via LLM
                </p>
              </div>
            </div>

            {/* PREMIUM TOGGLE SWITCH */}
            <button
              onClick={() => setFormData(prev => ({...prev, isActive: !prev.isActive }))}
              disabled={loading}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.isActive
                  ? 'bg-indigo-600 dark:bg-indigo-500'
                  : 'bg-slate-200 dark:bg-slate-800'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out flex items-center justify-center ${formData.isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
              >
                {loading && (
                  <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
                )}
              </span>
            </button>
          </div>
        </FormModal>
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
              onChange={handleSearchTerm}
            />
          </div>
          <TableFilter onApplyFilter={handleFiltered} />
        </div>

        {/* Table Container */}
        <div className="overflow-hidden rounded-xl shadow-2xl border border-gray-300 dark:border-gray-800">
          <div className="overflow-x-auto block w-full">
            <table className="w-full min-w-[1000px] text-left dark:border-collapse dark:bg-[#111827]">
              <thead>
                <tr className="bg-[#6366f1]">
                  <th className="px-6 py-4 font-semibold text-sm">No.</th>
                  <th className="px-6 py-4 font-semibold text-sm">Keyword</th>
                  <th className="px-6 py-4 font-semibold text-sm">Type</th>
                  <th className="px-6 py-4 font-semibold text-sm">Content</th>
                  <th className="px-6 py-4 font-semibold text-sm">Active</th>
                  <th className="px-6 py-4 font-semibold text-sm text-center">Actions</th>
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
                    items.map((autoreply, idx) => (
                      <tr key={autoreply.id} className="hover:bg-gray-300/40 hover:dark:bg-gray-800/40 transition-colors">
                        <td className="px-6 py-4 text-sm truncate max-w-100 font-medium text-gray-800 dark:text-gray-200">{(idx + 1 * itemsPerPage * currentPage) - itemsPerPage + 1}</td>
                        <td className="px-6 py-4 text-sm truncate max-w-100 font-medium text-gray-800 dark:text-gray-200">{autoreply.name}</td>
                        <td className="px-6 py-4 text-sm truncate max-w-100 text-gray-900 dark:text-gray-400">{autoreply.type}</td>
                        <td className="px-6 py-4 text-sm truncate max-w-100 text-gray-900 dark:text-gray-400">{autoreply.type === "keyword" ? autoreply.replyContent : autoreply.aiPrompt}</td>
                        <td className="px-6 py-4 text-sm truncate max-w-100 text-gray-900 dark:text-gray-400">
                          {autoreply.isActive ? (
                            <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold">Active</span>
                          ) : (
                            <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-bold">Inactive</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-center">
                          <div className="flex justify-center gap-3">
                            {/* <div className="relative group">
                              <button
                                onClick={() => handleDelete(autoreply.id)}
                                className="p-1.5 bg-green-600/10 text-green-400 rounded-md hover:bg-green-500 hover:text-white transition"
                              >
                                <Info size={16} />
                              </button>
                              <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                View Details
                              </div>
                            </div> */}
                            <div className="relative group">
                              <button
                                onClick={() => handleUpdate(autoreply)}
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
                                onClick={() => handleDelete(autoreply.id)}
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
                      <td colSpan={5} className="px-6 py-10 text-center text-gray-500">No data found</td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Control */}
        <div className="flex justify-between items-center dark:bg-[#111827] p-4 rounded-xl border border-gray-300 dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="text-gray-900 dark:text-white font-medium">{indexOfFirstItem + 1}</span> to <span className="text-gray-900 dark:text-white font-medium">{Math.min(indexOfLastItem, autoreplies.length)}</span> of <span className="text-gray-900 dark:text-white font-medium">{autoreplies.length}</span> entries
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
              onClick={handleCurrent}
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