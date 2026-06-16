import { useEffect, useState } from "react"
import type { CreateProduct, Product } from "../lib/types"
import useAxios from "../lib/axios.service";
import { toast } from "sonner";

export default function useProduct() {
    const { axiosPrivate } = useAxios();
    const [products, setProducts] = useState<Product[]>([]);
    const [totalProducts, setTotalProducts] = useState(100);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [nextId, setNextId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selected, setSelected] = useState<Product | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [formData, setFormData] = useState<CreateProduct>({
        name: '',
        price: 0,
        stock: 0,
        description: '',
        file: null, // Untuk menampung object File temporer saat upload
        imageUrl: '' // Untuk preview
    });
    const itemsPerPage = 10;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const items = products.slice(indexOfFirstItem, indexOfLastItem);

    const fetchProducts = async () => {
        if (products.length > 0 && (currentPage * itemsPerPage) > products.length) return;
        setLoading(true);
        try {
            let query = ``;
            if (nextId) {
                query += `&lastId=${nextId}`;
            }
            if (searchTerm.trim()) {
                query += `&search=${searchTerm}`;
            }
            const res = await axiosPrivate.get(`/products?limit=${itemsPerPage}${query}`);
            const data = res.data;
            setProducts(prev => [...prev, ...data.data]);
            setNextId(data.nextId);
            setTotalPages(data.totalPage);
            setTotalProducts(data.total);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Gagal fetch products";
            toast.error(errorMessage, {
                duration: 4000,
                position: 'top-right',
                style: {
                    borderRadius: '12px',
                    background: '#1e293b',
                    color: '#fff',
                },
            });
        } finally {
            setLoading(false);
        }
    }
    const handleCurrentPage = async () => {
        if (currentPage >= totalPages) return;
        setCurrentPage(prev => prev + 1);
        await fetchProducts();
    }
    const handlePrevPage = () => {
        setCurrentPage(prev => prev - 1);
    }

    const handleUpdate = (product: Product) => {
        setSelected(product);
        setIsOpen(true);
        setFormData({
            name: product.name,
            price: product.price,
            stock: product.stock,
            description: product.description,
            imageUrl: product.imageUrl,
            file: null
        })
    };

    const handleClose = () => {
        setSelected(null);
        setIsOpen(false);
        setFormData({
            name: "",
            price: 0,
            stock: 0,
            description: "",
            imageUrl: "",
            file: null
        })
    }
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTimeout(() => {
            setSearchTerm(value);
            setProducts([]);
        }, 300);
    }
    const handleRemoveImage = () => {
        setFormData(prev => ({ ...prev, file: null, imageUrl: '' }));
    };
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
    const handleDelete = async (product: Product) => {
        if (!confirm("Apakah anda yakin ingin menghapusnya?")) return;
        try {
            setProducts(prev => prev.filter(p => p.id !== product.id));
            toast.info("Proses deleting...");
            await axiosPrivate.delete(`/products/${product.id}`);
            toast.success("Deleting sucessfully");
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Gagal delete product";
            toast.error(errorMessage, {
                duration: 4000,
                position: 'top-right',
                style: {
                    borderRadius: '12px',
                    background: '#1e293b',
                    color: '#fff',
                },
            });
            setProducts(prev => [product, ...prev]);
        }
    }

    const handleUpdateProduct = async (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!selected) return;
        setLoadingUpdate(true);
        try {
            const dataToSend = new FormData();
            if (formData.file) {
                dataToSend.append("file", formData.file);
            }
            dataToSend.append("name", formData.name);
            dataToSend.append("description", formData.description || "");
            dataToSend.append("price", String(formData.price));
            dataToSend.append("stock", String(formData.stock));
            const res = await axiosPrivate.patch(`/products/${selected?.id}`, dataToSend);
            setProducts(prev => prev.map(p => p.id === selected.id ? ({ ...res.data }) : p));
            toast.success("Updated sucessfully");
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Gagal update product";
            toast.error(errorMessage, {
                duration: 4000,
                position: 'top-right',
                style: {
                    borderRadius: '12px',
                    background: '#1e293b',
                    color: '#fff',
                },
            });
        } finally {
            setLoadingUpdate(false);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, [searchTerm]);

    return {
        items,
        loading,
        totalPages,
        handleCurrentPage,
        handlePrevPage,
        setSearchTerm,
        isOpen,
        selected,
        handleClose,
        handleUpdate,
        itemsPerPage,
        handleSearch,
        currentPage,
        indexOfLastItem,
        indexOfFirstItem,
        products,
        totalProducts,
        handleRemoveImage,
        handleFileChange,
        formData,
        setFormData,
        handleDelete,
        loadingUpdate,
        handleUpdateProduct
    }
}