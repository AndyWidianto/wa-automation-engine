import { Check, Filter, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { FilterStateProduct } from '../lib/types';



interface TableFilterProps {
  onApplyFilter: (filters: FilterStateProduct) => void;
}

export default function TableFilterProduct({ onApplyFilter }: TableFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [filters, setFilters] = useState<FilterStateProduct>({
    stockStatus: "all",
    priceRange: "all",
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
    const resetValues: FilterStateProduct = { stockStatus: "all", priceRange: "all" };
    setFilters(resetValues);
    onApplyFilter(resetValues); 
    setIsOpen(false);
  };

  const handleApply = () => {
    onApplyFilter(filters);
    setIsOpen(false);
  };

  // Menghitung filter aktif untuk badge indikator angka
  const activeFilterCount = 
    (filters.stockStatus !== "all" ? 1 : 0) + (filters.priceRange !== "all" ? 1 : 0);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition font-medium relative border
          ${isOpen || activeFilterCount > 0
            ? "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-slate-800 dark:border-indigo-500 dark:text-indigo-400"
            : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60"
          }`}
      >
        <Filter size={15} className={activeFilterCount > 0 ? "animate-pulse" : ""} />
        <span>Filter</span>
        {activeFilterCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 dark:bg-indigo-500 text-[10px] font-bold text-white shadow-sm">
            {activeFilterCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 focus:outline-none animate-in fade-in zoom-in-95 duration-150">
          <div className="p-4 space-y-4">
            
            {/* 1. Filter Berdasarkan Ketersediaan Stok */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Status Ketersediaan
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-50 dark:bg-slate-950 p-1 rounded-lg border border-slate-100 dark:border-slate-800/60">
                {[
                  { value: "all", label: "Semua" },
                  { value: "in_stock", label: "Ready" },
                  { value: "out_of_stock", label: "Habis" }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFilters({ ...filters, stockStatus: option.value as any })}
                    className={`text-[11px] py-1.5 px-1.5 rounded-md font-medium transition-all ${
                      filters.stockStatus === option.value
                        ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Filter Berdasarkan Rentang Harga */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Rentang Harga
              </label>
              <div className="space-y-1">
                {[
                  { value: "all", label: "Semua Harga" },
                  { value: "low", label: "< Rp 150.000" },
                  { value: "medium", label: "Rp 150rb - Rp 500rb" },
                  { value: "high", label: "> Rp 500.000" }
                ].map((option) => {
                  const isChecked = filters.priceRange === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFilters({ ...filters, priceRange: option.value as any })}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isChecked
                          ? "bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      <span>{option.label}</span>
                      {isChecked && <Check size={14} className="text-indigo-600 dark:text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/60 rounded-b-xl">
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
              className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-sm transition"
            >
              Terapkan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}