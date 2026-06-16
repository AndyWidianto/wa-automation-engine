import React from 'react';

interface NotificationProps {
  title: string;
  message: string;
  onClose?: () => void;
}

const Notification: React.FC<NotificationProps> = ({ title, message, onClose }) => {
  return (
    // Kontainer utama dengan pengaturan warna Light (default) dan Dark (menggunakan prefix dark:)
    <div className="max-w-sm w-full p-4 rounded-xl shadow-lg border transition-colors duration-300
                    bg-white border-gray-100 
                    dark:bg-slate-800 dark:border-slate-700">
      
      <div className="flex items-start justify-between gap-4">
        {/* Ikon Opsional */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full flex items-center justify-center 
                          bg-blue-100 text-blue-600 
                          dark:bg-blue-900/50 dark:text-blue-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Konten Teks */}
        <div className="flex-1 pt-1">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {message}
          </p>
        </div>

        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="flex-shrink-0 inline-flex text-slate-400 hover:text-slate-600 
                     dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
        >
          <span className="sr-only">Tutup notifikasi</span>
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Notification;