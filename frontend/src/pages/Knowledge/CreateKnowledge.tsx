import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Edit3, Upload, Save, X, FileSearch } from 'lucide-react';
import Loading from '../../components/Loading';
import useCreateKnowledge from '../../hooks/createKnowledge';

type KnowledgeMode = 'manual' | 'file';

export default function CreateKnowledgePage() {
    const [mode, setMode] = useState<KnowledgeMode>('manual');
    const {
        handleSubmit,
        loading,
        setFormData,
        formData
    } = useCreateKnowledge();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="mb-10">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
                        Tambah Pengetahuan
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Berikan basis data agar AI dapat menjawab pertanyaan client dengan akurat.
                    </p>
                </header>

                {/* Mode Selector */}
                <div className="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full max-w-md mb-8">
                    <button
                        onClick={() => setMode('manual')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'manual'
                            ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                            : 'text-slate-500'
                            }`}
                    >
                        <Edit3 size={18} /> Input Manual
                    </button>
                    <button
                        onClick={() => setMode('file')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'file'
                            ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                            : 'text-slate-500'
                            }`}
                    >
                        <FileSearch size={18} /> Dari Dokumen
                    </button>
                </div>

                {/* Content Area */}
                <motion.div
                    key={mode}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none p-8"
                >
                    {mode === 'manual' ?
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Judul Pengetahuan</label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Prosedur Perusahaan"
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    defaultValue={formData.name}
                                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 dark:text-slate-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Isi Konten</label>
                                <textarea
                                    rows={8}
                                    placeholder="Tuliskan detail informasi di sini..."
                                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                    defaultValue={formData.content}
                                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 dark:text-slate-200"
                                />
                            </div>
                            <button disabled={loading} className="w-full md:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/30 transition-transform active:scale-95 flex items-center justify-center gap-2">
                                <Loading loading={loading}>
                                    <Save size={20} /> Simpan Pengetahuan
                                </Loading>
                            </button>
                        </form> :
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Judul Pengetahuan</label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Prosedur Perusahaan"
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    defaultValue={formData.name}
                                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 dark:text-slate-200"
                                />
                            </div>
                            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2rem] p-10 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-800/30">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/10 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                    <Upload size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Upload Dokumen</h3>
                                <p className="text-sm text-slate-500 mb-6 text-center max-w-xs">
                                    Pilih file PDF, DOCX, atau TXT untuk diekstrak isinya oleh AI.
                                </p>

                                <input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    onChange={(e) => setFormData(prev => ({...prev, file: e.target.files?.[0] || null }))}
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="px-6 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-50 transition-colors shadow-sm"
                                >
                                    Pilih File
                                </label>

                                {formData.file && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="mt-6 flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 rounded-xl"
                                    >
                                        <FileText className="text-blue-600" size={20} />
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{formData.file.name}</span>
                                        <button type='button' onClick={() => setFormData(prev => ({...prev, file: null }))} className="p-1 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-full text-blue-600">
                                            <X size={16} />
                                        </button>
                                    </motion.div>
                                )}
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 rounded-2xl p-4 flex gap-3">
                                <div className="text-blue-500 shrink-0"><Upload size={20} /></div>
                                <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                                    Sistem akan membagi dokumen Anda menjadi beberapa bagian (chunks) dan menyimpannya ke dalam <b>Vector Database (pgvector)</b> untuk pencarian berbasis RAG.
                                </p>
                            </div>

                            <button
                                disabled={!formData.file || loading}
                                className={`w-full md:w-auto px-10 py-4 font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 ${formData.file
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30 active:scale-95'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                    }`}
                            >
                                <Loading loading={loading}>
                                    <Save size={20} /> Proses Dokumen
                                </Loading>
                            </button>
                        </form>
                    }
                </motion.div>
            </div>
        </div>
    );
}
