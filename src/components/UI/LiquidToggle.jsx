import React from 'react';
import { motion } from 'framer-motion';

const LiquidToggle = ({ currentRole, setRole }) => {
  const modes = [
    { id: 'admin', label: 'ADMIN', color: '#2563eb' }, // Neon Blue
    { id: 'student', label: 'STUDENT', color: '#10b981' } // Neon Green
  ];

  return (
    <div style={{ 
      display: 'flex', 
      background: 'rgba(15, 23, 42, 0.8)', // Extra dark, extra glass
      padding: '5px', 
      borderRadius: '40px', 
      position: 'relative',
      border: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(20px)', // Baki bache sab kuch halke blur
      boxShadow: 'inset 0 4px 6px rgba(0,0,0,0.4)',
      gap: '5px'
    }}>
      {modes.map((mode) => {
        const isActive = currentRole === mode.id;
        return (
          <button
            key={mode.id}
            onClick={() => setRole(mode.id)}
            style={{
              position: 'relative',
              padding: '12px 30px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              // NEON TEXT GLOW logic
              color: isActive ? 'white' : 'rgba(255,255,255,0.4)',
              textShadow: isActive ? `0 0 8px ${mode.color}, 0 0 15px ${mode.color}CC` : 'none',
              fontWeight: '900',
              fontSize: '11px',
              letterSpacing: '1.5px',
              zIndex: 1,
              outline: 'none',
              transition: '0.3s all ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {isActive && (
              <motion.div
                layoutId="liquid-pill"
                transition={{ 
                  type: 'spring', 
                  stiffness: 450, 
                  damping: 14, // Wobble + Snappy balance
                  mass: 0.6
                }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '35px',
                  zIndex: -1,
                  background: `linear-gradient(180deg, ${mode.color} 0%, rgba(255,255,255,0.15) 0%, ${mode.color} 100%)`,
                  // THE POWERFUL DUAL GLOW SHADOW (Neon effect)
                  boxShadow: `
                    0 10px 30px ${mode.color}77, /* Bahar ka soft glow */
                    0 0 15px ${mode.color}, /* Pass ka sharp glow */
                    inset 0 2px 2px rgba(255,255,255,0.5) /* Upar ki chamak */
                  `,
                  overflow: 'hidden'
                }}
              >
                 {/* Refraction effect overlay */}
                 <div style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%)',
                    transform: 'rotate(-45deg)',
                }} />
              </motion.div>
            )}
            
            {/* Small glowing dot logic */}
            <span style={{ 
              width: '5px', 
              height: '5px', 
              borderRadius: '50%', 
              background: isActive ? 'white' : 'transparent',
              boxShadow: isActive ? `0 0 8px white, 0 0 12px ${mode.color}` : 'none',
              transition: '0.3s all ease' 
            }} />
            
            {mode.label}
          </button>
        );
      })}
    </div>
  );
};

export default LiquidToggle;