import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ClipboardCheck, TreePine } from 'lucide-react';

export default function FarmDetailsForm() {
  const navigate = useNavigate();
  const [crop, setCrop] = useState("Andhra Paddy");
  const [irrigation, setIrrigation] = useState("Drip Irrigation");
  const [soil, setSoil] = useState("Red Sandy Loam");
  const [organic, setOrganic] = useState("Yes - Zero Chemical");
  const [treeCount, setTreeCount] = useState(1240);
  const [waterSource, setWaterSource] = useState("Borewell + Rainwater harvesting");

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/satellite-preview');
  };

  return (
    <div className="min-h-screen bg-warm-white flex flex-col justify-between font-inter text-carbon-800">
      <header className="py-4 px-6 bg-white/50 backdrop-blur flex items-center gap-3 border-b border-forest-100/50">
        <button onClick={() => navigate('/farm-map')} className="p-2 hover:bg-forest-50 rounded-xl text-carbon-600 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <span className="font-manrope font-bold text-sm text-carbon-800">Farmland Details Form</span>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-4 py-8 flex flex-col justify-center">
        <div className="bg-white border border-forest-100 rounded-[32px] p-6 shadow-card space-y-6">
          <div className="flex gap-3 items-center">
            <div className="p-3 bg-forest-50 text-forest-800 rounded-2xl">
              <ClipboardCheck size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold font-poppins text-carbon-900 leading-tight">Practice Details</h2>
              <p className="text-[10px] text-carbon-400">Please answer truthfully. All indices are cross-verified by satellite scans.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-carbon-500 uppercase tracking-wide">Crop Type</label>
              <select 
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full bg-warm-white border border-forest-100 rounded-2xl p-3 text-xs font-semibold focus:ring-0 focus:border-forest-400"
              >
                <option>Andhra Paddy</option>
                <option>Cotton & Legumes</option>
                <option>Teak & Mixed Forestry</option>
                <option>Millets (Organic)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-carbon-500 uppercase tracking-wide">Irrigation Type</label>
                <select 
                  value={irrigation}
                  onChange={(e) => setIrrigation(e.target.value)}
                  className="w-full bg-warm-white border border-forest-100 rounded-2xl p-3 text-xs font-semibold focus:ring-0 focus:border-forest-400"
                >
                  <option>Drip Irrigation</option>
                  <option>Sprinkler</option>
                  <option>Rainfed / Natural</option>
                  <option>Flood Canal</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-carbon-500 uppercase tracking-wide">Soil Type</label>
                <input 
                  type="text" 
                  value={soil}
                  onChange={(e) => setSoil(e.target.value)}
                  className="w-full bg-warm-white border border-forest-100 rounded-2xl p-3 text-xs font-semibold focus:ring-0 focus:border-forest-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-carbon-500 uppercase tracking-wide">Organic Agriculture Practices?</label>
              <select 
                value={organic}
                onChange={(e) => setOrganic(e.target.value)}
                className="w-full bg-warm-white border border-forest-100 rounded-2xl p-3 text-xs font-semibold focus:ring-0 focus:border-forest-400"
              >
                <option>Yes - Zero Chemical</option>
                <option>Partial - Low Chemical</option>
                <option>No - Standard Cultivation</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-carbon-500 uppercase tracking-wide">Estimated Trees Count on Plot</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={treeCount}
                  onChange={(e) => setTreeCount(parseInt(e.target.value) || 0)}
                  className="w-full bg-warm-white border border-forest-100 rounded-2xl p-3 text-xs font-semibold pr-10 focus:ring-0 focus:border-forest-400"
                  required
                />
                <TreePine size={18} className="absolute right-3 top-3 text-forest-600" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-carbon-500 uppercase tracking-wide">Water Sources</label>
              <input 
                type="text" 
                value={waterSource}
                onChange={(e) => setWaterSource(e.target.value)}
                className="w-full bg-warm-white border border-forest-100 rounded-2xl p-3 text-xs font-semibold focus:ring-0 focus:border-forest-400"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold font-poppins py-4 rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              Submit for Satellite Audit <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </main>

      <footer className="py-4 text-center text-[9px] text-carbon-400 border-t border-forest-50 bg-white/30">
        🚜 Direct public integration with PM-Kisan and Land Revenue databases.
      </footer>
    </div>
  );
}
