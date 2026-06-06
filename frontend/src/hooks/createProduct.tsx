import { useState } from "react";
import type { CreateProduct } from "../lib/types";
import useAxios from "../lib/axios.service";
import { toast } from "sonner";

export default function useCreateProduct() {
    const { axiosPrivate } = useAxios();
    const [formData, setFormData] = useState<CreateProduct>({
        name: '',
        price: 0,
        stock: 0,
        description: '',
        file: null, // Untuk menampung object File temporer saat upload
        imageUrl: '' // Untuk preview
    });
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                file: file,
                imageUrl: URL.createObjectURL(file) // Membuat URL blob sementara untuk preview gambar
            }));
        }
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({ ...prev, file: null, imageUrl: '' }));
    };

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dataToSend = new FormData();
            Object.entries(formData).forEach(([key, val]) => {
                if (key !== "file" && key !== "imageUrl") {
                    dataToSend.append(key, String(val));
                }
            });
            if (formData.file) {
                dataToSend.append("file", formData.file);
            }
            const res = await axiosPrivate.post("products", dataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            const data = res.data;
            console.log(data);
            toast.success("Product berhasil ditambahkan");
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Gagal membuat knowledge";
            toast.error(errorMessage, {
                duration: 4000,
                position: 'top-right',
                style: {
                    borderRadius: '12px',
                    background: '#1e293b',
                    color: '#fff',
                },
            });

            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    }

    return {
        handleFileChange,
        handleRemoveImage,
        formData,
        setFormData,
        loading,
        handleSubmit
    }
}