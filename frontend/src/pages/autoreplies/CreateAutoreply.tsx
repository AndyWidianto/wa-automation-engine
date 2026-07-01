// import { useRef } from 'react';
import { Tag, MessageSquare, CheckCheck, BotMessageSquare, Paperclip } from 'lucide-react';
import { Input, Select, Textarea } from '../../components/Inputs';
import useCreateAutoreply from '../../hooks/createAutoreply';

const CreateAutoReply = () => {
  // const refFileInput = useRef<HTMLInputElement | null>(null);
  const { setFormData, formData, handleSubmit, handleFileChange, fileRef } = useCreateAutoreply();

  return (
    <div className="p-6 dark:bg-gray-50 dark:bg-slate-900 min-h-screen transition-colors">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* --- CONTAINER 1: FORM INPUT --- */}
        <form onSubmit={handleSubmit} className="bg-gray-100 dark:bg-surface p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-border">
          <h2 className="text-xl font-bold mb-6 dark:text-white">Buat Auto Reply Baru</h2>

          <div className="space-y-5">
            <Input title='Keyword (Kata Kunci)' value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} icon={Tag} placeholder="Contoh: Halo, Info, Surat" />
            <Select title='Type' value={formData.type} onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}>
              <option value="">Select Type</option>
              <option value="keyword">Keyword</option>
              <option value="ai_rag">AI RAG</option>
            </Select>

            {formData.type === 'keyword' ? (
              <>
                <Textarea title='Content' value='' rows={6} placeholder='Selamat siang....' onChange={(e) => setFormData(prev => ({ ...prev, replyContent: e.target.value }))} icon={MessageSquare} />
                <div>
                  <label className="block text-sm font-medium mb-1.5 dark:text-gray-300">Lampiran (Opsional)</label>
                  <div className="flex items-center justify-center w-full">
                    <label onClick={() => fileRef.current?.click()} className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-slate-800 border-gray-300 dark:border-border hover:bg-gray-100 dark:hover:bg-slate-700">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Paperclip className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">Klik untuk upload file</p>
                      </div>
                      <input type="file" ref={fileRef} onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                </div>
              </>
            ) : <div>
              <Textarea title='Prompt AI' rows={6} value={formData.aiPrompt || ""} onChange={(e) => setFormData(prev => ({ ...prev, aiPrompt: e.target.value }))} icon={BotMessageSquare} />
            </div>}
            <button className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md w-full">
              Simpan Auto Reply
            </button>
          </div>
        </form>

        {/* --- CONTAINER 2: WHATSAPP PREVIEW --- */}
        <div className="sticky top-6 h-fit">
          <h2 className="text-sm font-semibold mb-4 text-gray-500 uppercase tracking-wider dark:text-gray-400">Live Preview</h2>

          {/* Chat Area */}
          {formData.type === "keyword" && <div className="flex-1 p-3 space-y-3 overflow-y-auto pattern-wa w-[80%] lg:w-full mx-auto rounded-lg border border-gray-300 dark:border-gray-800 bg-[#E5DDD5] dark:bg-[#0B141A] shadow-sm">
            {/* User Message */}
            <div className="flex justify-end">
              <div className="bg-[#DCF8C6] dark:bg-[#005C4B] p-2 rounded-lg rounded-tr-none shadow-sm max-w-[80%]">
                <p className="text-[11px] dark:text-gray-100">{formData.name || 'Keyword anda'}</p>
                <span className="text-[9px] text-gray-500 dark:text-gray-300 block text-right">12:00</span>
              </div>
            </div>

            {/* Bot Message (Preview) */}
            <div className="flex justify-start">
              <div className="bg-white dark:bg-[#202C33] p-2 rounded-lg rounded-tl-none shadow-sm max-w-[80%] min-w-[100px]">
                {/* {formData.file && <img src={formData.file ? URL.createObjectURL(formData.file) : 'https://via.placeholder.com/150'} alt="Attachment" className={`w-full h-auto mb-2 rounded ${formData.file ? '' : 'opacity-50'}`} />} */}
                <p className="text-[11px] whitespace-pre-wrap dark:text-gray-100">
                  {formData.replyContent || 'Teks balasan otomatis akan muncul di sini...'}
                </p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-[9px] text-gray-500 dark:text-gray-300">12:00</span>
                  <CheckCheck className="w-3 h-3 text-blue-500" />
                </div>
              </div>
            </div>
          </div>}
        </div>

      </div>
    </div>
  );
};

export default CreateAutoReply;