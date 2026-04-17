import React from 'react';
import { motion } from 'framer-motion';

const GenericButton = ({ 
  label, 
  onClick, 
  color = "#2563eb", 
  type = "button", 
  className = "", 
  disabled = false,
  loading = false 
}) => {
  return (
    <motion.button
      disabled={disabled || loading}
      type={type}
      onClick={onClick}
      whileHover={!disabled && !loading ? "hover" : ""}
      whileTap={!disabled && !loading ? "tap" : ""}
      className={`relative px-8 py-3 rounded-2xl font-black text-xs tracking-widest uppercase overflow-hidden group transition-all duration-500 ${className}`}
      style={{
        // FIXED: Agar disabled hai toh solid color dikhega, warna dark base
        background: disabled ? color : 'rgba(15, 23, 42, 0.9)', 
        border: `1px solid ${disabled ? 'transparent' : color + '44'}`,
        color: 'white',
        outline: 'none',
        boxShadow: disabled ? `0 0 20px ${color}66` : 'none'
      }}
    >
      {/* --- Liquid Background (Sirf tab dikhega jab active ho) --- */}
      {!disabled && !loading && (
        <motion.div
          variants={{
            hover: { y: 0, scale: 1.5, opacity: 1 },
            tap: { scale: 1.2 }
          }}
          initial={{ y: 60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15, mass: 0.6 }}
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: `linear-gradient(180deg, ${color}, ${color}cc)`,
            boxShadow: `0 0 25px ${color}88, inset 0 2px 2px rgba(255,255,255,0.4)`,
            borderRadius: '40%',
          }}
        />
      )}

      {/* --- Button Content --- */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            {disabled ? <span className="text-lg">✓</span> : <span className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white] opacity-80" />}
            {label}
          </>
        )}
      </span>

      {/* Glass Shine (Only on hover) */}
      {!disabled && (
        <div className="absolute inset-0 z-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </motion.button>
  );
};

export default GenericButton;