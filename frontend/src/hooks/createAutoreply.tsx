import { useRef, useState } from "react";
import useAxios from "../lib/axios.service";
import type { CreateAutoreply } from "../lib/types";
import { toast } from "sonner";

export default function useCreateAutoreply() {
    const { axiosPrivate } = useAxios();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreateAutoreply>({
        name: "",
        type: "keyword",
        aiPrompt: null,
        replyContent: null,
        isActive: true,
        file: null,
    })
    const fileRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>)  => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({...prev, file: file }));
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axiosPrivate.post(`/autoreplies`, formData);
            toast.success(`Autoreply baru berhasil ditambahkan`, {
                duration: 3000,
                position: 'top-right',
                style: {
                    borderRadius: '12px',
                    background: '#10b981',
                    color: '#fff',
                },
            });
        } catch (err: any) {
            const rawMessage = err.response?.data?.message || "Gagal menyimpan data";
            const errorMessage = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;

            toast.error(errorMessage, {
                duration: 5000,
                position: 'top-right',
                style: {
                    borderRadius: '12px',
                    background: '#1e293b',
                    color: '#fff',
                },
            });

            console.error("Submission Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return {
        handleSubmit,
        loading,
        formData,
        setFormData,
        handleFileChange,
        fileRef
    }
}