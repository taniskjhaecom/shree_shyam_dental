import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ message = 'Loading Shree Shyam Dental Hospital...', fullScreen = false }) => {
  // SVG Path for an anatomically stylized modern dental molar tooth
  const toothPath =
    'M 50 20 C 40 14, 24 14, 18 28 C 14 38, 17 54, 21 68 C 24 78, 28 86, 36 86 C 43 86, 45 72, 50 56 C 55 72, 57 86, 64 86 C 72 86, 76 78, 79 68 C 83 54, 86 38, 82 28 C 76 14, 60 14, 50 20 Z';

  return (
    <div
      className={`${
        fullScreen
          ? 'fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center p-6 text-white'
          : 'min-h-[55vh] flex flex-col items-center justify-center p-8 select-none'
      }`}
    >
      {/* Central Creative Animation Box */}
      <div className="relative flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 mb-6">
        {/* Soft Ambient Radial Glow Backdrop */}
        <motion.div
          animate={{
            scale: [0.85, 1.35, 0.85],
            opacity: [0.35, 0.7, 0.35],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-teal-500/50 via-cyan-400/40 to-emerald-400/30 blur-2xl pointer-events-none"
        />

        {/* Circular Radar Sweep / Orbiting Energy Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-0 rounded-full border border-dashed border-teal-400/40 pointer-events-none"
        />

        {/* Scanning Laser Beam that moves across the Tooth */}
        <motion.div
          animate={{
            y: [-35, 35, -35],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute w-24 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_14px_#06b6d4] z-20 pointer-events-none"
        />

        {/* Floating Animated 3D Stylized Molar Tooth */}
        <motion.div
          animate={{
            y: [-4, 4, -4],
            scale: [0.98, 1.02, 0.98],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-lg">
            <defs>
              {/* Primary Vibrant Dental Gradient */}
              <linearGradient id="dentalLaserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0d9488" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>

              {/* Inner Translucent Tooth Shimmer */}
              <linearGradient id="toothInnerGrad" x1="30%" y1="0%" x2="70%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#0d9488" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#0f766e" stopOpacity="0.3" />
              </linearGradient>

              {/* Glow Filter for High-End Luminescence */}
              <filter id="dentalGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Translucent Tooth Body Fill with Pulse */}
            <motion.path
              d={toothPath}
              fill="url(#toothInnerGrad)"
              animate={{
                opacity: [0.65, 0.95, 0.65],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Base Tooth Outline */}
            <path
              d={toothPath}
              fill="none"
              stroke="#14b8a6"
              strokeOpacity="0.3"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Glowing Laser-Drawn Path Animation */}
            <motion.path
              d={toothPath}
              fill="none"
              stroke="url(#dentalLaserGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#dentalGlow)"
              initial={{ pathLength: 0, pathOffset: 0 }}
              animate={{
                pathLength: [0.2, 0.9, 0.2],
                pathOffset: [0, 1, 2],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            {/* Center Healthcare Spark / Smile Dot */}
            <motion.circle
              cx="50"
              cy="40"
              r="3.5"
              fill="#22d3ee"
              animate={{
                scale: [0.8, 1.4, 0.8],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </svg>
        </motion.div>
      </div>

      {/* Modern Wave Equalizer Bars */}
      <div className="flex items-center gap-1.5 mb-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            animate={{
              height: ['6px', '22px', '6px'],
              backgroundColor: ['#0d9488', '#06b6d4', '#10b981', '#0d9488'],
            }}
            transition={{
              duration: 1.1,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
            className="w-1.5 rounded-full"
          />
        ))}
      </div>

      {/* Message & Subtext */}
      <div className="flex flex-col items-center gap-1.5 text-center max-w-sm">
        <h3
          className={`font-heading font-bold text-sm sm:text-base tracking-tight ${
            fullScreen ? 'text-white' : 'text-slate-800'
          }`}
        >
          {message}
        </h3>
        <p className="text-[10.5px] font-semibold tracking-widest uppercase text-teal-400">
          Shree Shyam Dental Hospital & Implant Center
        </p>
      </div>
    </div>
  );
};

export default Loader;
