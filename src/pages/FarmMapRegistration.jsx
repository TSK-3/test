import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BhuvanMap from '../components/BhuvanMap';
import { Compass, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { mockFarmer } from '../data/mockData';

export default function FarmMapRegistration() {
  const navigate = useNavigate();
  const [mapStats, setMapStats] = useState({ area: 4.28, score: 82, ndvi: 0.74 });

  const handleAreaCalculated = (stats) => {
    setMapStats(stats);
  };

  return (
    <div className="min-h-screen bg-warm-white flex flex-col justify-between font-inter text-carbon-800 pb-24">
      
      {/* Top Custom Header for GPS Map view (Matches Screenshot 5) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-forest-100/50 py-3 px-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/onboarding')} className="p-2 hover:bg-forest-50 rounded-xl text-carbon-600 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <span className="font-manrope font-extrabold text-xl text-forest-800 tracking-tight flex items-center gap-1.5">
            🌱 CarbonX
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1 bg-emerald-100 border border-emerald-200/50 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-800">
            <span className="w-1.5 h-1.5 bg-profit rounded-full animate-ping"></span>
            Live GPS
          </span>
          <div className="w-9 h-9 rounded-full overflow-hidden border border-forest-200/80 shadow-sm">
            <img src={mockFarmer.avatar} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* Main Map workspace */}
      <main className="flex-1 p-4 max-w-4xl mx-auto w-full space-y-4">
        
        {/* Screen Instructions banner */}
        <div className="bg-white border border-forest-100/60 p-4 rounded-2xl flex justify-between items-center gap-4 shadow-sm">
          <div>
            <h2 className="text-xs font-bold text-carbon-800">ISRO Bhuvan Farmland Mapping</h2>
            <p className="text-[10px] text-carbon-400 mt-0.5">Please draw or adjust the boundaries. Press 'Save Boundary' to continue.</p>
          </div>
          
          <button 
            onClick={() => navigate('/farm-details')}
            className="bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold font-poppins px-5 py-3 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
          >
            Save Plot <ArrowRight size={14} />
          </button>
        </div>

        {/* Map Workspace Wrapper */}
        <BhuvanMap onAreaCalculated={handleAreaCalculated} />

      </main>

      {/* Bottom Nav matches Screenshot 5 */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-forest-100/50 py-2.5 px-4 flex justify-around items-center shadow-lg">
        <button onClick={() => navigate('/farmer-dashboard')} className="flex flex-col items-center justify-center gap-1 flex-1">
          <div className="px-5 py-1.5 text-carbon-400">🏡</div>
          <span className="text-[10px] font-medium text-carbon-400 font-poppins mt-0.5">Home</span>
        </button>
        
        <button onClick={() => navigate('/farm-map')} className="flex flex-col items-center justify-center gap-1 flex-1">
          <div className="px-5 py-1.5 bg-[#FFEBE7] rounded-full text-forest-800 flex items-center justify-center shadow-sm">
            <Compass size={20} className="text-[#E06651]" />
          </div>
          <span className="text-[10px] font-bold text-carbon-800 font-poppins mt-0.5">Farm</span>
        </button>

        <button onClick={() => navigate('/marketplace')} className="flex flex-col items-center justify-center gap-1 flex-1">
          <div className="px-5 py-1.5 text-carbon-400">🛍️</div>
          <span className="text-[10px] font-medium text-carbon-400 font-poppins mt-0.5">Market</span>
        </button>

        <button onClick={() => navigate('/wallet')} className="flex flex-col items-center justify-center gap-1 flex-1">
          <div className="px-5 py-1.5 text-carbon-400">💰</div>
          <span className="text-[10px] font-medium text-carbon-400 font-poppins mt-0.5">Wallet</span>
        </button>

        <button onClick={() => navigate('/support')} className="flex flex-col items-center justify-center gap-1 flex-1">
          <div className="px-5 py-1.5 text-carbon-400">👤</div>
          <span className="text-[10px] font-medium text-carbon-400 font-poppins mt-0.5">Support</span>
        </button>
      </nav>

    </div>
  );
}
