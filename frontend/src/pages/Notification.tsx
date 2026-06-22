import { useState } from "react";
import type { TypeNotification } from "../lib/types";
import useNotification from "../hooks/useNotification";
import { ArrowLeft, Mail, MailOpen, Trash2 } from "lucide-react";

const TYPE_CONFIG = {
  INFO: { label: "Info", bgClass: "bg-blue-50 dark:bg-blue-950", textClass: "text-blue-700 dark:text-blue-300", borderClass: "border-blue-200 dark:border-blue-800", dotClass: "bg-blue-500", icon: "ti-info-circle" },
  SUCCESS: { label: "Success", bgClass: "bg-emerald-50 dark:bg-emerald-950", textClass: "text-emerald-700 dark:text-emerald-300", borderClass: "border-emerald-200 dark:border-emerald-800", dotClass: "bg-emerald-500", icon: "ti-circle-check" },
  WARNING: { label: "Warning", bgClass: "bg-amber-50 dark:bg-amber-950", textClass: "text-amber-700 dark:text-amber-300", borderClass: "border-amber-200 dark:border-amber-800", dotClass: "bg-amber-500", icon: "ti-alert-triangle" },
  ERROR: { label: "Error", bgClass: "bg-red-50 dark:bg-red-950", textClass: "text-red-700 dark:text-red-300", borderClass: "border-red-200 dark:border-red-800", dotClass: "bg-red-500", icon: "ti-alert-circle" },
};

export default function NotificationCenter() {
  const {
    notifications,
    markRead,
    markUnread,
    selected,
    deleteNotif,
    setMobileView,
    setReadFilter,
    readFilter,
    unreadCount,
    handleSelect,
    selectedNotif,
    parsedMeta,
    Type,
    searchTerm,
    handleChange,
    notificationRef,
    containerRef,
    hasMore
  } = useNotification();

  const Sidebar = (
    <div className="flex flex-col h-full min-h-0 bg-white bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-slate-900 dark:text-slate-100">Notifikasi</h1>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-semibold">{unreadCount}</span>
            )}
          </div>
        </div>
        {/* Search */}
        <div className="relative mb-3">
          <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" style={{ fontSize: 14 }} aria-hidden="true" />
          <input
            type="text"
            placeholder="Cari notifikasi..."
            value={searchTerm || ""}
            onChange={e => handleChange("search", e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        {/* Read filter */}
        <div className="flex gap-1 mb-2">
          {["ALL", "UNREAD", "READ"].map(f => (
            <button
              key={f}
              onClick={() => setReadFilter(f)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${readFilter === f ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900" : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
            >
              {f === "ALL" ? "Semua" : f === "UNREAD" ? "Belum dibaca" : "Dibaca"}
            </button>
          ))}
        </div>
        {/* Type filter */}
        <div className="flex gap-1 flex-wrap">
          {["ALL", "INFO", "SUCCESS", "WARNING", "ERROR"].map(t => (
            <button
              key={t}
              onClick={() => handleChange("type", t)}
              className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-all ${Type === t
                ? t === "ALL" ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 border-transparent" : `${TYPE_CONFIG[t as TypeNotification]?.bgClass} ${TYPE_CONFIG[t as TypeNotification]?.textClass} ${TYPE_CONFIG[t as TypeNotification]?.borderClass}`
                : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
            >
              {t === "ALL" ? "Semua" : t}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 min-h-0 overflow-y-auto" ref={containerRef}>
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <i className="ti ti-inbox text-slate-300 dark:text-slate-600 mb-3" style={{ fontSize: 36 }} aria-hidden="true" />
            <p className="text-sm text-slate-400 dark:text-slate-500">Tidak ada notifikasi ditemukan</p>
          </div>
        ) : (
          notifications.map(n => {
            const isActive = selected?.id === n.id;
            return (
              <button
                onClick={() => handleSelect(n)}
                className={`w-full text-left px-4 py-3.5 transition-all duration-150 border-b border-slate-100 dark:border-slate-800 group relative
                ${isActive ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"}
                ${!n.isRead ? "" : "opacity-70"}
              `}
                key={n.id}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 pt-0.5 flex flex-col items-center gap-1.5">
                    {!n.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" aria-label="Belum dibaca" />}
                    {n.isRead && <span className="w-2 h-2 rounded-full bg-transparent flex-shrink-0" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className={`font-medium text-sm leading-snug ${n.isRead ? "text-slate-500 dark:text-slate-400" : "text-slate-900 dark:text-slate-100"}`}>
                        {n.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-2">{n.content}</p>
                    <div className="flex items-center justify-between">
                      <TypeBadge type={n.type} />
                      <span className="text-xs text-slate-400 dark:text-slate-500">{formatDate(n.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </button>
            )
          })
        )}
        <div className="p-2 w-full" ref={notificationRef}>
          {hasMore ? <div className="w-full flex flex-col items-center">
            <div className="border-4 w-8 h-8 rounded-full border-gray-100 border-t-blue-300 animate-spin"></div>
            <div className="text-sm text-slate-400 dark:text-slate-500">Memuat lebih banyak</div>
          </div> : <></>}
        </div>
      </div>
    </div>
  );

  const Detail = (
    <div className="flex flex-col h-full min-h-0 bg-slate-50 dark:bg-slate-900">
      {selectedNotif ? (
        <>
          {/* Detail header */}
          <div className="px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {/* Mobile back */}
              <button
                onClick={() => setMobileView("list")}
                className="md:hidden flex-shrink-0 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                aria-label="Kembali"
              >
               <ArrowLeft size={18} />
              </button>
              <div className="min-w-0">
                <h2 className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-snug truncate">{selectedNotif.title}</h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{formatDate(selectedNotif.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {selectedNotif.isRead ? (
                <button
                  onClick={() => markUnread(selectedNotif.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-all"
                >
                  <Mail size={18} className="text-xs" />
                  <span className="hidden sm:inline">Tandai belum dibaca</span>
                </button>
              ) : (
                <button
                  onClick={() => markRead(selectedNotif.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-all"
                >
                  <MailOpen size={18} className="text-xs" />
                  <span className="hidden sm:inline">Tandai dibaca</span>
                </button>
              )}
              <button
                onClick={() => deleteNotif(selectedNotif)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-all border border-red-100 dark:border-red-900"
              >
                <Trash2 size={18} className="text-xs" />
                <span className="hidden sm:inline">Hapus</span>
              </button>
            </div>
          </div>

          {/* Detail body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {/* Main card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-center gap-2 mb-4">
                <TypeBadge type={selectedNotif.type} size="md" />
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${selectedNotif.isRead ? "bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600" : "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"}`}>
                  <i className={`ti ${selectedNotif.isRead ? "ti-mail-opened" : "ti-mail"} text-xs`} aria-hidden="true" />
                  {selectedNotif.isRead ? "Sudah dibaca" : "Belum dibaca"}
                </span>
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">{selectedNotif.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{selectedNotif.content}</p>
            </div>

            {/* Timestamps */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-3">Waktu</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <i className="ti ti-clock text-xs" aria-hidden="true" />
                    Dibuat
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{formatFullDate(selectedNotif.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <i className="ti ti-refresh text-xs" aria-hidden="true" />
                    Diperbarui
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{formatFullDate(selectedNotif.updatedAt)}</span>
                </div>
              </div>
            </div>

            {/* MetaJSON */}
            {parsedMeta && (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <i className="ti ti-code text-slate-400" style={{ fontSize: 14 }} aria-hidden="true" />
                    <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">MetaJSON Inspector</h4>
                  </div>
                  <CopyButton text={JSON.stringify(parsedMeta, null, 2)} />
                </div>
                <div className="p-4">
                  <JsonNode data={parsedMeta} />
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );

  return (
    <div className="flex flex-col bg-slate-100 dark:bg-slate-950" style={{ height: "100vh" }}>
      <h2 className="sr-only">Notification Center — pusat notifikasi dengan daftar dan detail inspeksi JSON</h2>

      {/* Top bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-slate-100 flex items-center justify-center">
          <i className="ti ti-bell text-white dark:text-slate-900" style={{ fontSize: 14 }} aria-hidden="true" />
        </div>
        <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Notification Center</span>
        <span className="text-slate-300 dark:text-slate-600 text-sm">·</span>
        <span className="text-xs text-slate-400 dark:text-slate-500">{notifications.length} total · {unreadCount} belum dibaca</span>
      </div>

      {/* Main */}
      <div className="flex-1 min-h-0">
        {/* Desktop: split */}
        <div className="grid h-full grid-cols-1 md:grid-cols-[40%_60%]">
          <div className={`h-full ${selected ? 'hidden' : 'block'} md:block`}>
            {Sidebar}
          </div>
          <div className={`${selected ? 'block' : 'hidden'} md:block h-full`}>
            {Detail}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000;
  if (diff < 60) return "baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function formatFullDate(iso: string) {
  return new Date(iso).toLocaleString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function TypeBadge({ type, size = "sm" }: { type: TypeNotification, size?: string }) {
  const cfg = TYPE_CONFIG[type];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium border ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass} ${size === "sm" ? "text-xs" : "text-sm"}`}>
      <i className={`ti ${cfg.icon}`} aria-hidden="true" style={{ fontSize: size === "sm" ? 11 : 13 }} />
      {cfg.label}
    </span>
  );
}

function JsonNode({ data, depth = 0 }: { data: any, depth?: number }) {
  const [expanded, setExpanded] = useState<Record<string, any>>({});
  if (data === null || data === undefined) return <span className="text-slate-400 dark:text-slate-500 italic text-sm">null</span>;
  if (typeof data !== "object") {
    if (typeof data === "boolean") return <span className="text-purple-600 dark:text-purple-400 text-sm font-mono">{String(data)}</span>;
    if (typeof data === "number") return <span className="text-blue-600 dark:text-blue-400 text-sm font-mono">{data}</span>;
    return <span className="text-emerald-700 dark:text-emerald-400 text-sm font-mono">"{data}"</span>;
  }
  const isArray = Array.isArray(data);
  const entries = Object.entries(data);
  return (
    <div className="w-full">
      {entries.map(([k, v], i) => {
        const isObj = v !== null && typeof v === "object";
        const isExpanded = expanded[k] !== false;
        return (
          <div key={k} className={`flex items-start gap-2 py-1.5 ${i < entries.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : ""}`}>
            <span className="text-slate-500 dark:text-slate-400 text-sm font-mono min-w-0 flex-shrink-0" style={{ minWidth: 120 }}>
              {isArray ? <span className="text-slate-400">[{k}]</span> : k}
            </span>
            <div className="flex-1 min-w-0">
              {isObj ? (
                <div>
                  <button
                    onClick={() => setExpanded(e => ({ ...e, [k]: !isExpanded }))}
                    className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  >
                    <i className={`ti ${isExpanded ? "ti-chevron-down" : "ti-chevron-right"} text-xs`} aria-hidden="true" />
                    <span className="font-mono">{isArray ? `Array[${(v as any).length}]` : `Object{${Object.keys(v).length}}`}</span>
                  </button>
                  {isExpanded && (
                    <div className="mt-1 pl-3 border-l-2 border-slate-200 dark:border-slate-700">
                      <JsonNode data={v} depth={depth + 1} />
                    </div>
                  )}
                </div>
              ) : (
                <JsonNode data={v} depth={depth + 1} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-96 text-center px-8">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <i className="ti ti-bell text-slate-400 dark:text-slate-500" style={{ fontSize: 28 }} aria-hidden="true" />
      </div>
      <p className="text-slate-700 dark:text-slate-300 font-medium text-base mb-1">Pilih notifikasi</p>
      <p className="text-slate-400 dark:text-slate-500 text-sm">Klik salah satu notifikasi di sebelah kiri untuk melihat detail</p>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-all duration-150"
    >
      <i className={`ti ${copied ? "ti-check" : "ti-copy"} text-xs`} aria-hidden="true" />
      {copied ? "Tersalin!" : "Salin JSON"}
    </button>
  );
}