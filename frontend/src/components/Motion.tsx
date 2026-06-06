import { motion, AnimatePresence } from 'framer-motion';


interface MotionProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}
export default function MotionModal({ isOpen, onClose, children }: MotionProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[70]"
          >
            <div className="h-screen w-full scrollbar-hidden overflow-y-scroll">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}