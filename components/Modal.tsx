
import React from 'react';
import { motion } from 'framer-motion';

interface ModalProps {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, title, children }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        className="relative bg-[#1a1a1a] border border-amber-500/30 rounded-2xl w-full max-w-2xl shadow-[0_0_50px_rgba(255,179,0,0.1)] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-amber-500/10">
          <h2 className="text-xl font-bold text-[#FFB300]">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
        <div className="p-4 bg-amber-500/5 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-transparent border border-amber-500/30 text-[#FFB300] font-bold rounded-lg hover:bg-amber-500/10 transition-all"
          >
            বন্ধ করুন
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;
