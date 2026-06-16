import { Check, Filter, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface FilterState {
  status: "all" | "active" | "inactive";
  type: "all" | "Rag" | "keyword";
}

interface TableFilterProps {
  onApplyFilter: (filters: FilterState) => void;
}

export default function TableFilter({ onApplyFilter }: TableFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // State internal untuk menampung pilihan sebelum di-Apply
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    type: "all",
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleReset = () => {
    const resetValues: FilterState = { status: "all", type: "all" };
    setFilters(resetValues);
    onApplyFilter(resetValues); // Kirim reset ke parent component
    setIsOpen(false);
  };

  const handleApply = () => {
    onApplyFilter(filters); // Kirim data filter aktif ke parent component
    setIsOpen(false);
  };

  // Menghitung berapa banyak filter yang sedang aktif (selain 'all')
  const activeFilterCount = 
    (filters.status !== "all" ? 1 : 0) + (filters.type !== "all" ? 1 : 0);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Tombol Trigger Filter */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition font-medium relative
          ${isOpen || activeFilterCount > 0
            ? "bg-indigo-50 border border-indigo-200 text-indigo-600 dark:bg-slate-800 dark:border-indigo-500 dark:text-indigo-400"
            : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200 border border-transparent hover:bg-gray-200 dark:hover:bg-slate-700"
          }`}
      >
        <Filter size={16} className={activeFilterCount > 0 ? "animate-pulse" : ""} />
        <span>Filter</span>
        
        {/* Badge penanda jumlah filter aktif */}
        {activeFilterCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 dark:bg-indigo-500 text-[10px] font-bold text-white">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 focus:outline-none animate-fade-in">
          <div className="p-4 space-y-4">
            
            {/* 1. Filter Berdasarkan Status */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Status Sistem
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-50 dark:bg-slate-950 p-1 rounded-lg border border-slate-100 dark:border-slate-800">
                {(["all", "active", "inactive"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFilters({ ...filters, status: option })}
                    className={`text-xs py-1.5 px-2 rounded-md font-medium capitalize transition-all ${
                      filters.status === option
                        ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    {option === "all" ? "Semua" : option}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Filter Berdasarkan Tipe */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Tipe Sistem
              </label>
              <div className="space-y-1">
                {(["all", "Rag", "keyword"] as const).map((option) => {
                  const isChecked = filters.type === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFilters({ ...filters, type: option })}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isChecked
                          ? "bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      <span className="capitalize">{option === "all" ? "Semua Tipe" : option}</span>
                      {isChecked && <Check size={14} className="text-indigo-600 dark:text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Action Footer (Reset & Apply) */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 rounded-b-xl">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition"
            >
              <RotateCcw size={12} />
              Reset
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-md shadow transition"
            >
              Terapkan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}