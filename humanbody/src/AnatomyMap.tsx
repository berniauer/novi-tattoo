import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair, Activity, Fingerprint, Cpu } from 'lucide-react';

const zones = [
  { id: "head", label: "KOPF", path: "M180,30 L220,30 L230,65 L215,100 L185,100 L170,65 Z" },
  { id: "neck", label: "HALS", path: "M187,102 L213,102 L220,125 L180,125 Z" },
  { id: "chest", label: "BRUST", path: "M180,127 L220,127 L260,150 L245,230 L155,230 L140,150 Z" },
  { id: "abdomen", label: "BAUCH", path: "M157,232 L243,232 L230,320 L170,320 Z" },
  { id: "pelvis", label: "BECKEN", path: "M170,322 L230,322 L250,370 L200,400 L150,370 Z" },
  
  // Right Arm (Screen Left)
  { id: "right-shoulder", label: "SCHULTER RECHTS", path: "M138,150 L100,165 L90,210 L130,205 Z" },
  { id: "right-upper-arm", label: "OBERARM RECHTS", path: "M130,207 L90,212 L80,300 L115,295 Z" },
  { id: "right-forearm", label: "UNTERARM RECHTS", path: "M115,297 L80,302 L65,400 L95,395 Z" },
  { id: "right-hand", label: "HAND RECHTS", path: "M95,397 L65,402 L55,445 L75,455 L90,430 Z" },

  // Left Arm (Screen Right)
  { id: "left-shoulder", label: "SCHULTER LINKS", path: "M262,150 L300,165 L310,210 L270,205 Z" },
  { id: "left-upper-arm", label: "OBERARM LINKS", path: "M270,207 L310,212 L320,300 L285,295 Z" },
  { id: "left-forearm", label: "UNTERARM LINKS", path: "M285,297 L320,302 L335,400 L305,395 Z" },
  { id: "left-hand", label: "HAND LINKS", path: "M305,397 L335,402 L345,445 L325,455 L310,430 Z" },

  // Right Leg (Screen Left)
  { id: "right-thigh", label: "OBERSCHENKEL RECHTS", path: "M150,372 L198,398 L185,530 L135,520 Z" },
  { id: "right-calf", label: "WADE RECHTS", path: "M135,522 L185,532 L170,690 L130,680 Z" },
  { id: "right-foot", label: "FUSS RECHTS", path: "M130,682 L170,692 L180,740 L110,740 Z" },

  // Left Leg (Screen Right)
  { id: "left-thigh", label: "OBERSCHENKEL LINKS", path: "M250,372 L202,398 L215,530 L265,520 Z" },
  { id: "left-calf", label: "WADE LINKS", path: "M265,522 L215,532 L230,690 L270,680 Z" },
  { id: "left-foot", label: "FUSS LINKS", path: "M270,682 L230,692 L220,740 L290,740 Z" }
];

export default function AnatomyMap() {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  const activeZone = zones.find(z => z.id === selectedZone);

  return (
    <div className="relative flex flex-col lg:flex-row items-center justify-center gap-16 p-8 min-h-screen bg-zinc-950 text-zinc-300 font-mono overflow-hidden">
      
      {/* Background Cyberpunk grid & scanlines */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#deff9a 1px, transparent 1px), linear-gradient(90deg, #deff9a 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)' }}>
      </div>

      {/* HUD Panel */}
      <div className="z-10 w-full max-w-md">
        <div className="border border-zinc-800 bg-zinc-900/60 backdrop-blur-md p-8 relative overflow-hidden group shadow-2xl">
           
           {/* Sci-fi accents */}
           <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-neon-accent opacity-70"></div>
           <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-neon-accent opacity-70"></div>
           <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-neon-accent opacity-70"></div>
           <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-neon-accent opacity-70"></div>
           
           <div className="flex items-center gap-3 mb-4">
             <Crosshair className="w-5 h-5 text-neon-accent animate-pulse" />
             <h2 className="text-sm tracking-[0.3em] text-zinc-400 font-semibold">TGT_LOCK // BODY_MAP</h2>
           </div>
           
           <div className="h-px w-full bg-gradient-to-r from-neon-accent/50 via-zinc-800 to-transparent mb-8"></div>
           
           <div className="h-32 flex flex-col justify-center">
             <AnimatePresence mode="wait">
               <motion.div
                 key={selectedZone || "none"}
                 initial={{ opacity: 0, x: -20, filter: 'blur(8px)' }}
                 animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                 exit={{ opacity: 0, x: 20, filter: 'blur(8px)' }}
                 transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
               >
                  {selectedZone ? (
                    <div>
                      <div className="text-xs text-neon-accent mb-2 tracking-widest flex items-center gap-2">
                        <Fingerprint className="w-4 h-4" /> ZONE IDENTIFIED
                      </div>
                      <div className="text-neon-accent text-3xl sm:text-4xl font-bold tracking-widest mb-2 drop-shadow-[0_0_12px_rgba(222,255,154,0.6)]">
                        {activeZone?.label}
                      </div>
                      <div className="text-xs text-zinc-300 tracking-widest bg-neon-accent/10 inline-block px-3 py-1 border border-neon-accent/30 rounded-sm">
                        STATUS: <span className="text-neon-accent font-bold">SELECTED</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-xs text-zinc-600 mb-2 tracking-widest flex items-center gap-2">
                        <Activity className="w-4 h-4" /> SCANNING...
                      </div>
                      <div className="text-zinc-600 text-3xl sm:text-4xl font-bold tracking-widest mb-2">
                        AWAITING INPUT
                      </div>
                      <div className="text-xs text-zinc-700 tracking-widest inline-block px-3 py-1 border border-zinc-800 rounded-sm">
                        STATUS: NO SELECTION
                      </div>
                    </div>
                  )}
               </motion.div>
             </AnimatePresence>
           </div>

           <div className="mt-10 pt-6 border-t border-zinc-800/50 space-y-4">
             <div className="flex justify-between items-center text-xs tracking-wider">
               <span className="text-zinc-500 flex items-center gap-2"><Cpu className="w-4 h-4"/> NEURAL LINK</span>
               <span className="text-neon-accent animate-pulse">ACTIVE</span>
             </div>
             <div className="flex justify-between items-center text-xs tracking-wider">
               <span className="text-zinc-500">INTERFACE VERSION</span>
               <span className="text-zinc-400">v3.9.4_CYBER</span>
             </div>
             <div className="w-full bg-zinc-900 h-1 mt-2 rounded-full overflow-hidden">
               <div className="bg-neon-accent h-full w-[87%] opacity-80"></div>
             </div>
           </div>
        </div>
      </div>

      {/* Interactive SVG Map */}
      <div className="z-10 relative mt-8 lg:mt-0 perspective-1000">
        {/* Decorative background elements behind the map */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] border border-neon-accent/10 rounded-full animate-[spin_60s_linear_infinite] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] sm:w-[600px] sm:h-[600px] border border-dashed border-zinc-800/50 rounded-full animate-[spin_120s_linear_infinite_reverse] pointer-events-none"></div>

        <motion.svg 
          viewBox="0 0 400 800" 
          className="w-[280px] sm:w-[350px] lg:w-[450px] h-auto relative z-10 filter drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {zones.map((zone) => {
            const isSelected = selectedZone === zone.id;
            const isHovered = hoveredZone === zone.id;
            const isDimmed = selectedZone && !isSelected;

            return (
              <motion.path
                key={zone.id}
                d={zone.path}
                onMouseEnter={() => setHoveredZone(zone.id)}
                onMouseLeave={() => setHoveredZone(null)}
                onClick={() => setSelectedZone(isSelected ? null : zone.id)}
                className="cursor-crosshair"
                initial={false}
                animate={{
                  fill: isSelected 
                    ? "#deff9a" 
                    : isHovered 
                      ? "rgba(222, 255, 154, 0.15)" 
                      : "#121214", // dark graphite
                  stroke: isSelected
                    ? "#ffffff"
                    : isHovered
                      ? "#deff9a"
                      : "#27272a", // zinc-800
                  strokeWidth: isSelected ? 3 : (isHovered ? 2 : 1),
                  opacity: isDimmed ? 0.3 : 1,
                  filter: isSelected 
                    ? "drop-shadow(0px 0px 12px rgba(222, 255, 154, 0.9))" 
                    : isHovered 
                      ? "drop-shadow(0px 0px 6px rgba(222, 255, 154, 0.4))"
                      : "none"
                }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02, zIndex: 10 }}
                whileTap={{ scale: 0.97 }}
                style={{ originX: '200px', originY: '400px' }} // Approximate center for scaling
              />
            );
          })}
        </motion.svg>
      </div>
    </div>
  );
}
