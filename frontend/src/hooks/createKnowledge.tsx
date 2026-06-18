import { useState } from "react";
import type { CreateKnowledge } from "../lib/types";
import useAxios from "../lib/axios.service";
import { toast } from "sonner";

export default function useCreateKnowledge() {
    const { axiosPrivate } = useAxios();
    const [formData, setFormData] = useState<CreateKnowledge>({
        name: "",
        content: "",
        file: null
    });
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.custom((_t) => (
            <div className="flex items-center gap-3.5 px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 shadow-lg min-w-[280px] animate-in fade-in duration-200">
                <div className="w-5 h-5 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin shrink-0" />
                <div className="flex flex-col min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Memproses Berkas</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">Mengekstrak ke basis pengetahuan...</p>
                </div>
            </div>
        ), {
            duration: Infinity // Agar tidak menutup sendiri selama proses upload berjalan
        });
        try {
            const dataToSend = new FormData();
            dataToSend.append("name", formData.name);
            if (formData.content) {
                dataToSend.append("content", formData.content);
            }
            if (formData.file) {
                dataToSend.append("file", formData.file);
            }
            const res = await axiosPrivate.post("/knowledges", dataToSend);
            const data = res.data;
            console.log(data.messge)
            toast.custom((_t) => (
                <div className="flex items-center gap-3.5 px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-emerald-100 dark:border-emerald-950/30 shadow-lg min-w-[280px]">
                    <div className="w-5 h-5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500 rounded-full flex items-center justify-center text-xs font-bold shrink-0">✓</div>
                    <div className="flex flex-col">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Berhasil!</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Knowledge base siap digunakan.</p>
                    </div>
                </div>
            ), { id: toastId, duration: 4000 });
        } catch (err: any) {
            toast.custom((_t) => (
                <div className="flex items-center gap-3.5 px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-rose-100 dark:border-rose-950/30 shadow-lg min-w-[280px]">
                    <div className="w-5 h-5 bg-rose-50 dark:bg-rose-950/50 text-rose-500 rounded-full flex items-center justify-center text-xs font-bold shrink-0">✕</div>
                    <div className="flex flex-col">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Gagal Memproses</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Terjadi kesalahan sistem.</p>
                    </div>
                </div>
            ), { id: toastId, duration: 4000 });

            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    }
    return {
        handleSubmit,
        formData,
        setFormData,
        loading
    }
}