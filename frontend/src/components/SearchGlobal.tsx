import { useState, useEffect, useRef } from "react";
import { Search, User, FileText, Settings, ArrowRight, X, Command } from "lucide-react";
import useAxios from "../lib/axios.service";
import type { Autoreply, Product } from "../lib/types";
import { useNavigate } from "react-router";

interface SearchResult {
    id: string | number;
    title: string;
    subtitle: string;
    category: "users" | "documents" | "settings";
    url: string;
    items: Product[] | Autoreply[];
}

interface GlobalSearchProps {
    showSearch: boolean;
    setShowSearch: (show: boolean) => void;
}

export default function GlobalSearch({ showSearch, setShowSearch }: GlobalSearchProps) {
    const { axiosPrivate } = useAxios();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleSearchGlobal = async () => {
        try {
            //const res = await axiosPrivate.get("")
            const autoreply = await axiosPrivate.get(`/autoreplies?limit=4&search=${query}`);
            const product = await axiosPrivate.get(`/products?limit=4&search=${query}`);
            const dataAutoreply = autoreply.data;
            const dataProduct = product.data;
            setResults([
                {
                    id: 1,
                    title: "Product",
                    category: "documents",
                    subtitle: "",
                    url: `/dashboard/products`,
                    items: dataProduct.data || [],
                },
                {
                    id: 2,
                    title: "Autoreply",
                    category: "documents",
                    subtitle: "",
                    url: `/dashboard/autoreplies`,
                    items: dataAutoreply.autoreplies || [],
                }
            ])
        } catch (err) {
            console.error("Fetch Error: ", err);
        }
    }

    const handleSelected = (url: string) => {
        navigate(url);
        setShowSearch(false);
    }

    useEffect(() => {
        if (showSearch) {
            inputRef.current?.focus();
            document.body.style.overflow = "hidden"; // Kunci scroll background
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [showSearch]);

    // Efek pencarian sederhana (client-side filtering)
    useEffect(() => {
        if (query.trim() === "") {
            setResults([]);
            return;
        }
        handleSearchGlobal();
        setSelectedIndex(0);
    }, [query]);


    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!showSearch) return;

            if (e.key === "Escape") {
                setShowSearch(false);
            } else if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % Math.max(results.length, 1));
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(results.length, 1));
            } else if (e.key === "Enter" && results[selectedIndex]) {
                e.preventDefault();
                alert(`Navigasi ke: ${results[selectedIndex].url}`); // Ganti dengan router.push() atau useNavigate()
                setShowSearch(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [showSearch, results, selectedIndex, setShowSearch]);

    if (!showSearch) return null;

    // Mengelompokkan hasil berdasarkan kategori
    const categories = {
        users: results.filter(r => r.category === "users"),
        documents: results.filter(r => r.category === "documents"),
        settings: results.filter(r => r.category === "settings"),
    };

    // Helper untuk render Icon berdasarkan kategori
    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "users": return <User className="w-4 h-4 text-emerald-400" />;
            case "documents": return <FileText className="w-4 h-4 text-blue-400" />;
            case "settings": return <Settings className="w-4 h-4 text-amber-400" />;
            default: return <Search className="w-4 h-4 text-gray-400" />;
        }
    };

    // Hitung indeks global untuk hover/keyboard selection saat dikelompokkan
    let globalItemIndex = 0;

    return (
        <div
            className="fixed inset-0 bg-slate-500/40 dark:bg-slate-900/40 backdrop-blur-sm p-4 z-60 flex justify-center items-start pt-[10vh] transition-all duration-200 animate-fade-in"
            onClick={() => setShowSearch(false)} // Klik di luar modal untuk menutup
        >
            <div
                className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden max-h-[70vh]"
                onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat diklik di dalam
            >
                <div className="flex items-center px-4 border-b border-slate-100 dark:border-slate-800 h-14 shrink-0">
                    <Search className="w-5 h-5 text-slate-400 mr-3" />
                    <input
                        ref={inputRef}
                        type="text"
                        className="w-full bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none text-base"
                        placeholder="Ketik sesuatu untuk mencari"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && (
                        <button onClick={() => setQuery("")} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-400 mr-2">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                    <kbd className="hidden sm:inline-flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-400 select-none">
                        <span className="text-xs">ESC</span>
                    </kbd>
                </div>

                {/* Search Results Area */}
                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                    {query.trim() === "" ? (
                        // State: Awal sebelum mengetik
                        <div className="py-12 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-sm text-center px-4">
                            <Command className="w-8 h-8 mb-3 text-slate-300 dark:text-slate-600 stroke-[1.5]" />
                            <p>Mencari pengguna, dokumen, dan pengaturan sistem secara global.</p>
                            <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">Gunakan tombol arah ↑↓ untuk memilih dan Enter untuk membuka.</p>
                        </div>
                    ) : results.length === 0 ? (
                        // State: Data Tidak Ditemukan
                        <div className="py-12 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-sm">
                            <Search className="w-8 h-8 mb-3 text-slate-300 dark:text-slate-600 stroke-[1.5]" />
                            <p>Tidak ada hasil yang cocok untuk "<span className="text-slate-700 dark:text-slate-300 font-medium">{query}</span>"</p>
                        </div>
                    ) : (
                        // State: Hasil Pencarian Terisi
                        <div className="space-y-4 p-2">
                            {Object.entries(categories).map(([categoryName, items]) => {
                                if (items.length === 0) return null;
                                return (
                                    <div key={categoryName} className="space-y-1">
                                        {/* Header Kategori */}
                                        <h3 className="px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider capitalize">
                                            {categoryName === "users" ? "Pengguna" : categoryName === "documents" ? "Dokumen & Berkas" : "Pengaturan"}
                                        </h3>

                                        {/* List Items */}
                                        {items.map(itemList => (
                                            itemList.items.map(item => {
                                                const currentIndex = globalItemIndex;
                                                globalItemIndex++; // Naikkan counter indeks global
                                                const isSelected = currentIndex === selectedIndex;

                                                return (
                                                    <div
                                                        key={item.id}
                                                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${isSelected
                                                            ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                                                            }`}
                                                        onMouseEnter={() => setSelectedIndex(currentIndex)}
                                                        onClick={() => handleSelected(`${itemList.url}?search=${item.name}`)}
                                                    >
                                                        <div className="flex items-center gap-3 overflow-hidden">
                                                            <div className={`p-2 rounded-md ${isSelected ? "bg-white dark:bg-slate-900" : "bg-slate-100 dark:bg-slate-800"}`}>
                                                                {getCategoryIcon(itemList.category)}
                                                            </div>
                                                            <div className="truncate">
                                                                <p className={`text-sm font-medium ${isSelected ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-200"}`}>{itemList.title}</p>
                                                                <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">{item.name}</p>
                                                            </div>
                                                        </div>
                                                        {isSelected && (
                                                            <ArrowRight className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 animate-pulse" />
                                                        )}
                                                    </div>
                                                );
                                            })
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer Area */}
                <div className="h-10 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50 dark:bg-slate-950/50 px-4 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                    <div className="flex gap-4">
                        <span><span className="text-slate-500 dark:text-slate-400 font-bold">↑↓</span> Navigasi</span>
                        <span><span className="text-slate-500 dark:text-slate-400 font-bold">↵</span> Pilih</span>
                    </div>
                    <div>
                        <span>Global Search v1.0</span>
                    </div>
                </div>
            </div>
        </div>
    );
}