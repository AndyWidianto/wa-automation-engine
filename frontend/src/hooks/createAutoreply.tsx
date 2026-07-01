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
            let dataToSend: Record<string, unknown> = {};
            Object.keys(formData).forEach(key => {
                if (formData[key as keyof CreateAutoreply] !== null && formData[key as keyof CreateAutoreply] !== "") {
                    if (key === "file" && formData.file) {
                        dataToSend[key] = formData.file;
                    } else {
                        dataToSend[key] = formData[key as keyof CreateAutoreply];
                    }
                }
            });
            const res = await axiosPrivate.post(`/autoreplies`, dataToSend);
            const data = res.data;
            if (data.id) {
                const fileToUpload = formData.file;
                if (fileToUpload) {
                    const formDataFile = new FormData();
                    formDataFile.append("file", fileToUpload);
                    await axiosPrivate.post(`/autoreplies/${data.id}/upload`, formDataFile, {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    });
                }
            }
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