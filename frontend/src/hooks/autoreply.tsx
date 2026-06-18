import { useEffect, useState } from "react";
import useAxios from "../lib/axios.service";
import type { CreateAutoreply, Autoreply, FilterState } from "../lib/types";
import { toast } from "sonner";

export default function useAutoreply() {
    const { axiosPrivate } = useAxios();

    const [autoreplies, setAutoreplies] = useState<Autoreply[]>([]);
    const [lastId, setLastId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selected, setSelected] = useState<Autoreply | null>(null);
    const [searchStatus, setSearchStatus] = useState<string | null>(null);
    const [searchType, setSearchType] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState<CreateAutoreply>({
        name: "",
        type: "keyword",
        aiPrompt: null,
        replyContent: null,
        isActive: true,
        file: null,
    });
    const itemsPerPage = 7;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const [totalPages, setTotalPages] = useState(100);
    const items = autoreplies.slice(indexOfFirstItem, indexOfLastItem);

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this autoreply?")) {
            try {
                const res = await axiosPrivate.delete(`/autoreplies/${id}`);
                const data = res.data;
                setAutoreplies(prev => prev.filter(p => p.id !== id));
                toast.success(data.message || `Delete ${id} successfully`);
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || "Gagal hapus data autoreply";
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
        const value = e.target.value;
        if (value === searchTerm || !value.trim()) return;
        setTimeout(() => {
            setAutoreplies([]);
            setLastId(null);
            setCurrentPage(1);
            setSearchTerm(value);
        }, 200);
    }
    const handleFiltered = (dataFiltered: FilterState) => {
        setAutoreplies([]);
        setLastId(null);
        setCurrentPage(1);
        setSearchStatus(dataFiltered.status === "all" ? null : dataFiltered.status);
        setSearchType(dataFiltered.type === "all" ? null : dataFiltered.type);
    }

    const handleUpdate = (autoreply: Autoreply) => {
        setSelected(autoreply);
        setIsOpen(true);
        setFormData({
            name: autoreply.name,
            type: autoreply.type,
            aiPrompt: autoreply.aiPrompt,
            replyContent: autoreply.replyContent,
            isActive: autoreply.isActive,
            file: null,
        })
    };

    const handleClose = () => {
        setSelected(null);
        setIsOpen(false);
        setFormData({
            name: "",
            type: "keyword",
            aiPrompt: null,
            replyContent: null,
            isActive: true,
            file: null,
        })
    }

    const fetchAutoreplies = async () => {
        setLoading(true);
        let query = `${lastId ? `&lastId=${lastId}` : ''}${searchTerm.trim() ? `&search=${searchTerm}` : ''}`;
        if (searchStatus) {
            query += `&status=${searchStatus}`;
        }
        if (searchType) {
            query += `&type=${searchType}`;
        }
        try {
            if (itemsPerPage * currentPage < autoreplies.length) return;
            const res = await axiosPrivate.get(`/autoreplies?limit=${itemsPerPage}${query}`);
            const data = res.data;

            setAutoreplies(prev => [...prev, ...data.autoreplies]);
            setTotalPages(data.totalPage);
            setLastId(data.autoreplies.length > 0 ? data.autoreplies[data.autoreplies.length - 1].id : null);

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Gagal mengambil data autoreply";
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
    const updateAutoreply = async () => {
        if (!selected?.id) return;
        setLoading(true);

        try {
            const dataToSend: Partial<Autoreply> = {};
            const formEntries = Object.entries(formData) as [keyof (Autoreply & { file: File | null}), any][];

            formEntries.forEach(([key, newValue]) => {
                if (key === 'id') return;
                if (key === "file") return;
                const oldValue = (selected as any)[key];
                if (newValue !== undefined && newValue !== oldValue) {
                    (dataToSend as any)[key] = key === "isActive" ? newValue ? "active" : "inactive" : newValue;
                }
            });

            if (Object.keys(dataToSend).length === 0) {
                return;
            }

            const res = await axiosPrivate.patch(`/autoreplies/${selected.id}`, dataToSend);
            const updatedData = res.data;

            setAutoreplies(prev => prev.map(item =>
                item.id === selected.id ? { ...item, ...updatedData } : item
            ));

            toast.success("Autoreply berhasil diperbarui");
            setIsOpen(false);

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Gagal memperbarui data";

            toast.error(errorMessage, {
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
            setLoading(false);
        }
    };
    const handleCurrent = async () => {
        setCurrentPage(currentPage + 1);
        await fetchAutoreplies();
    }
    const handlePrev = () => {
        setCurrentPage(currentPage - 1);
    };



    useEffect(() => {
        fetchAutoreplies();
    }, [searchTerm, searchStatus, searchType]);

    return {
        handleUpdate,
        handleDelete,
        autoreplies,
        items,
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
        updateAutoreply,
        setFormData,
        formData,
        loading,
        handleCurrent,
        handlePrev,
        itemsPerPage,
        handleSearchTerm,
        setSearchStatus,
        setSearchType,
        handleFiltered
    }
}