import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, ShieldCheck, Compass } from 'lucide-react';

export default function SatellitePreview() {
  const navigate = useNavigate();
  const [logIndex, setLogIndex] = useState(0);

  const logs = [
    "Locking Sentinel-2 & Landsat-8 orbits...",
    "Pulling multi-spectral raster bands...",
    "Computing historic NDVI index since 2023...",
    "Verifying tree-canopy volume density...",
    "Calculating net dry biomass weight...",
    "Generating blockchain ledger hash for verification..."
  ];

  useEffect(() => {
    // Scroll logs sequentially
    const interval = setInterval(() => {
      setLogIndex((prev) => {
        if (prev < logs.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          // Redirect to success screen
          setTimeout(() => {
            navigate('/submission-success');
          }, 1000);
          return prev;
        }
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-carbon-900 text-white font-inter flex flex-col justify-between p-6 overflow-hidden relative">
      
      {/* Dynamic Earth grid underlay */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#0f3810_1px,transparent_1px),linear-gradient(to_bottom,#0f3810_1px,transparent_1px)] [background-size:24px_24px]"></div>

      {/* Top Header */}
      <div className="relative z-10 flex justify-between items-center pb-4 border-b border-forest-900">
        <span className="font-manrope font-extrabold text-sm text-emerald-400">🛰️ Sentinel MRV System</span>
        <span className="text-[10px] text-sky-light font-mono">STATUS: SCANNING_ORBIT_4</span>
      </div>

      {/* Main Map Scan Container */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center space-y-8 my-6">
        
        {/* Animated Scanning Box */}
        <div className="relative w-72 h-72 rounded-[40px] overflow-hidden border-2 border-emerald-500 shadow-2xl">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=400')` }}></div>
          {/* Green tint */}
          <div className="absolute inset-0 bg-emerald-950/20"></div>

          {/* Polygon Overlay */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <polygon 
              points="80,50 200,60 220,180 120,200 60,140" 
              fill="rgba(16, 185, 129, 0.25)" 
              stroke="#10B981" 
              strokeWidth="3" 
              className="animate-pulse-soft"
            />
          </svg>

          {/* Glowing Green Scanning Bar */}
          <div className="absolute inset-x-0 w-full h-1 bg-emerald-400 shadow-lg animate-scan-line"></div>
        </div>

        {/* Console Log Outputs */}
        <div className="w-full max-w-sm bg-black/40 border border-forest-900/60 p-5 rounded-2xl space-y-2.5 font-mono text-[10px] leading-relaxed">
          <div className="flex justify-between items-center text-emerald-500 border-b border-forest-900/40 pb-2 mb-2 font-poppins font-bold">
            <span>💻 ISRO Bhuvan Analytics Console</span>
            <span className="animate-pulse text-xs">● Live</span>
          </div>
          
          <div className="space-y-1.5 min-h-[80px]">
            {logs.slice(0, logIndex + 1).map((log, idx) => (
              <p key={idx} className={idx === logIndex ? "text-emerald-300 font-bold" : "text-emerald-500/70"}>
                &gt; {log}
              </p>
            ))}
          </div>
        </div>

      </div>

      {/* Footer message */}
      <div className="relative z-10 text-center text-[10px] text-emerald-400 font-bold tracking-wider uppercase">
        ⚡ Net Dry Carbon Sequestration Verification System
      </div>

    </div>
  );
}
