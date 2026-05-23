import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShieldCheck, Landmark } from 'lucide-react';
import { mockFarmer } from '../data/mockData';

export default function SuccessScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-warm-white flex flex-col justify-between font-inter text-carbon-800">
      
      {/* Top Header */}
      <header className="py-4 px-6 bg-white/50 backdrop-blur border-b border-forest-100/50 flex justify-between items-center">
        <span className="font-manrope font-bold text-sm text-carbon-800">Submission Successful</span>
        <span className="text-[10px] font-bold text-forest-700">KYC Status: PENDING_SCAN</span>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-sm mx-auto w-full px-4 py-8 flex flex-col justify-center space-y-6">
        
        {/* Animated Check rosette */}
        <div className="bg-white border border-forest-100 rounded-[32px] p-6 shadow-card text-center space-y-6 animate-in zoom-in-95 duration-500">
          <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center text-forest-800 mx-auto">
            <CheckCircle2 size={36} />
          </div>
          
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-poppins text-carbon-900">Satellite Scan Queued</h2>
            <p className="text-xs text-carbon-500 leading-relaxed px-4">
              Your farmland boundary and parameters have been securely registered under PM-Kisan verification protocols.
            </p>
          </div>

          {/* Farm estimates board */}
          <div className="bg-forest-50/70 border border-forest-100 rounded-2xl p-4 text-left space-y-3">
            <span className="text-[9px] font-bold text-forest-700 uppercase tracking-wide">Expected Harvest Parameters</span>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-carbon-400 font-bold uppercase">Estimated Area</p>
                <p className="text-sm font-extrabold text-carbon-800 font-manrope">4.28 Hectares</p>
              </div>
              <div>
                <p className="text-[10px] text-carbon-400 font-bold uppercase">Estimated Harvest</p>
                <p className="text-sm font-extrabold text-forest-800 font-manrope">12.4 tCO2e/yr</p>
              </div>
            </div>

            <div className="border-t border-forest-100 pt-3 flex justify-between items-center text-xs">
              <span className="font-semibold text-carbon-600">Expected Value</span>
              <span className="font-extrabold text-profit">₹18,200 / year</span>
            </div>
          </div>

          {/* Educational tips */}
          <div className="bg-[#FFF8E1] border border-[#FFE082] text-amber-900 rounded-2xl p-4 text-left text-[10px] leading-relaxed space-y-1">
            <p className="font-bold text-amber-900">💡 Agroforestry Practice Tip</p>
            <p className="text-amber-800">
              Planting teak or neem trees along your field boundaries will increase your dry biomass sequestration coefficient, expanding your potential credit yield by up to 2.5x next season.
            </p>
          </div>

          <button 
            onClick={() => navigate('/farm-verification')}
            className="w-full bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold font-poppins py-4 rounded-2xl shadow-lg hover:shadow-premium transition-all duration-200 flex items-center justify-center gap-1"
          >
            Proceed to Compliance Uploads <ArrowRight size={14} />
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-[9px] text-carbon-400 border-t border-forest-50 bg-white/30 uppercase tracking-widest font-bold">
        🛰️ CarbonX Climate Public Infrastructure
      </footer>

    </div>
  );
}
