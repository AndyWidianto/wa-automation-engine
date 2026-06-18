import { useEffect, useState } from "react";
import useAxios from "../lib/axios.service";
import { toast } from "sonner";
import type { CreateKnowledge, Knowledge } from "../lib/types";

export default function useKnowledge() {
    const { axiosPrivate } = useAxios();
    const [formData, setFormData] = useState<CreateKnowledge>({
        name: "",
        content: "",
        file: null
    });
    const [knowledges, setKnowledges] = useState<Knowledge[]>([]);
    const [lastId, setLastId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selected, setSelected] = useState<Knowledge | null>(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const itemsPerPage = 6;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const [totalPages, setTotalPages] = useState(100);
    const items = knowledges.slice(indexOfFirstItem, indexOfLastItem);

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this knowledge?")) {
            try {
                const res = await axiosPrivate.delete(`/knowledges/${id}`);
                const data = res.data;
                setKnowledges(prev => prev.filter(p => p.id !== id));
                toast.success(data.message || `Delete ${id} successfully`);
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || "Gagal hapus data Knowledge";
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
            }
        }
    };

    const handleSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTimeout(() => {
            setCurrentPage(1);
            setKnowledges([]);
            setLastId(null);
            setSearchTerm(e.target.value);
        }, 200);
    }

    const handleUpdate = (knowledge: Knowledge) => {
        setSelected(knowledge);
        setIsOpen(true);
        setFormData({
            name: knowledge.name,
            content: knowledge.content
        })
    };

    const handleClose = () => {
        setSelected(null);
        setIsOpen(false);
        setFormData({
            name: "",
            content: "",
        })
    }

    const fetchKnowledges = async () => {
        let query = "";
        if (lastId) {
            query += `&lastId=${lastId}`;
        }
        if (searchTerm.trim()) {
            query += `&search=${searchTerm}`;
        }
        setLoading(true);

        try {
            if (itemsPerPage * currentPage < knowledges.length) return;
            const res = await axiosPrivate.get(`/knowledges?limit=${itemsPerPage}${query}`);
            const data = res.data;

            setKnowledges(prev => [...prev, ...data.knowledges]);
            setTotalPages(data.totalPage);
            setLastId(data.knowledges.length > 0 ? data.knowledges[data.knowledges.length - 1].id : null);

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Gagal mengambil data knowledges";
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
            setLoading(false)
        }
    }
    const updateKnowledge = async () => {
        if (!selected?.id) return;
        setLoadingUpdate(true);

        try {
            const dataToSend: Partial<Knowledge> = {};
            const formEntries = Object.entries(formData) as [keyof Knowledge, any][];

            formEntries.forEach(([key, newValue]) => {
                if (key === 'id') return;

                const oldValue = (selected as any)[key];
                if (newValue !== undefined && newValue !== oldValue) {
                    (dataToSend as any)[key] = newValue;
                }
            });

            if (Object.keys(dataToSend).length === 0) {
                return;
            }

            const res = await axiosPrivate.patch(`/knowledges/${selected.id}`, dataToSend);
            const updatedData = res.data;

            setKnowledges(prev => prev.map(item =>
                item.id === selected.id ? { ...item, ...updatedData } : item
            ));

            toast.success("Knowledge berhasil diperbarui");
            setIsOpen(false);

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Gagal memperbarui data";

            toast.error(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage, {
                duration: 4000,
                position: 'top-right',
                style: {
                    borderRadius: '12px',
                    background: '#1e293b',
                    color: '#fff',
                },
            });

            console.error("Update Error:", err);
        } finally {
            setLoadingUpdate(false);
        }
    };

    const handleCurrent = async () => {
        setCurrentPage(prev => prev + 1);
        await fetchKnowledges();
    }
    const handlePrev = () => {
        setCurrentPage(currentPage - 1);
    };



    useEffect(() => {
        fetchKnowledges();
    }, [searchTerm]);

    return {
        handleUpdate,
        handleDelete,
        knowledges,
        totalPages,
        setSearchTerm,
        setCurrentPage,
        indexOfFirstItem,
        currentPage,
        indexOfLastItem,
        handleClose,
        selected,
        setSelected,
        isOpen,
        setIsOpen,
        updateKnowledge,
        setFormData,
        formData,
        loading,
        handleCurrent,
        handlePrev,
        loadingUpdate,
        items,
        handleSearchTerm
    }

}