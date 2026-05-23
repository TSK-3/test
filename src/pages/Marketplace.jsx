import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, TrendingUp, Compass, ShoppingCart, ShieldCheck, 
  MapPin, Clock, ArrowRight, Gavel, Cpu, Info, Check, RefreshCw, X
} from 'lucide-react';
import { mockMarketplace, mockWallet } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Marketplace() {
  const navigate = useNavigate();
  const { currentLang } = useLanguage();

  // Load custom-created listings from localStorage
  const [localListings, setLocalListings] = useState(() => {
    return JSON.parse(localStorage.getItem('carbonx_local_listings') || '[]');
  });

  // Combine default active mock auctions + local additions
  const [auctions, setAuctions] = useState(() => {
    const defaultAuc = [...mockMarketplace.activeAuctions];
    return [...localListings, ...defaultAuc];
  });

  // Bid variables
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);
  const [bidSuccess, setBidSuccess] = useState(false);
  
  // Real-time bidding outbid notifications
  const [outbidToast, setOutbidToast] = useState(null);

  // Search & advanced filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterCrop, setFilterCrop] = useState('');
  const [filterMinBio, setFilterMinBio] = useState(0);
  const [filterAuctionType, setFilterAuctionType] = useState('all'); // all, live, fixed

  // Dual Panel role toggle (Simulating dual interfaces inside the marketplace)
  const [activeMarketRole, setActiveMarketRole] = useState(() => {
    return localStorage.getItem('carbonx_user_role') === 'corporate' ? 'corporate' : 'farmer';
  });

  // Price trends chart mock data
  const historicalMarketTrend = [
    { day: 'Mon', price: 495 },
    { day: 'Tue', price: 510 },
    { day: 'Wed', price: 505 },
    { day: 'Thu', price: 520 },
    { day: 'Fri', price: 525 },
    { day: 'Sat', price: 520 },
    { day: 'Sun', price: 535 },
  ];

  // Anti-sniping logic simulator: countdown timers state
  const [timers, setTimers] = useState({
    "auc-01": { time: 5200, snipingAlert: false },
    "auc-02": { time: 9400, snipingAlert: false },
    "auc-03": { time: 110, snipingAlert: false }, // 1 minute 50 seconds (Will trigger sniping extension!)
  });

  // Update dynamic timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(key => {
          if (next[key].time > 0) {
            next[key].time -= 1;
            // Sniping warning: under 2 minutes (120 seconds)
            if (next[key].time < 120) {
              next[key].snipingAlert = true;
            }
          }
        });
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (totalSeconds) => {
    if (!totalSeconds) return "Sold";
    if (totalSeconds <= 0) return "Auction Ended";
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  // Bid submission & Anti-Sniping Trigger
  const submitCorporateBid = (e) => {
    e.preventDefault();
    if (!bidAmount) return;

    setIsSubmittingBid(true);

    setTimeout(() => {
      setIsSubmittingBid(false);
      setBidSuccess(true);

      const targetId = selectedAuction.id;
      
      // Update auction data
      setAuctions(prev => prev.map(auc => {
        if (auc.id === targetId) {
          // ANTI-SNIPING CHECK: If countdown timer is under 2 minutes (120 seconds), extend it by 2 minutes (120s)
          const currentTimer = timers[targetId]?.time || 500;
          if (currentTimer < 120) {
            setTimers(prevT => ({
              ...prevT,
              [targetId]: { time: currentTimer + 120, snipingAlert: false }
            }));
            
            // Dispatch dynamic outbid toast
            setOutbidToast({
              id: Date.now(),
              text: `⚠️ Anti-Sniping Activated! Bid placed in last 2 minutes. Auction for ${auc.crop} extended by 2 minutes.`
            });
            setTimeout(() => setOutbidToast(null), 5000);
          }

          // Return updated auction
          return {
            ...auc,
            currentBid: `₹${parseInt(bidAmount).toLocaleString('en-IN')}`,
            bidsCount: auc.bidsCount + 1
          };
        }
        return auc;
      }));

      // Push a real-time outbid/bid notification to global notification center
      const currentNotifs = JSON.parse(localStorage.getItem('carbonx_notifications') || '[]');
      const newNotif = {
        id: Date.now(),
        text: `New bid of ₹${parseInt(bidAmount).toLocaleString()} placed on ${selectedAuction.crop}.`,
        time: "Just now",
        type: "info"
      };
      localStorage.setItem('carbonx_notifications', JSON.stringify([newNotif, ...currentNotifs]));

      setTimeout(() => {
        setBidSuccess(false);
        setSelectedAuction(null);
        setBidAmount('');
      }, 1500);

    }, 1500);
  };

  // Farmer accepts current highest bid and triggers payout
  const handleFarmerAcceptBid = (auc) => {
    const confirmation = window.confirm(`Accept payout of ${auc.currentBid} for your ${auc.crop} lot? This will secure immediate UPI settlement.`);
    if (confirmation) {
      alert(`Sale secured! ₹${auc.currentBid} has been wired to ramesh.kumar@oksbi. Check your Carbon Wallet for blockchain transfer details.`);
      
      // Remove auction from lists
      setAuctions(prev => prev.filter(a => a.id !== auc.id));

      // Push success payout to wallet activity
      const currentWalletStr = localStorage.getItem('carbonx_wallet_activity') || '[]';
      const parsedWallet = JSON.parse(currentWalletStr);
      parsedWallet.unshift({
        id: `act-${Date.now()}`,
        type: 'sale',
        title: `Auction Cleared - ${auc.crop}`,
        amount: parseFloat(auc.currentBid.replace(/[^0-9]/g, '')) || 12400.0,
        credits: parseFloat(auc.credits) || 24,
        date: "Today",
        status: "Completed"
      });
      localStorage.setItem('carbonx_wallet_activity', JSON.stringify(parsedWallet));

      navigate('/wallet');
    }
  };

  // Filtering auctions
  const filteredAuctions = auctions.filter(auc => {
    const matchSearch = 
      auc.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auc.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auc.crop.toLowerCase().includes(searchTerm.toLowerCase());

    const matchState = filterState === '' || auc.location.toLowerCase().includes(filterState.toLowerCase());
    const matchCrop = filterCrop === '' || auc.crop.toLowerCase().includes(filterCrop.toLowerCase());
    
    const bioScore = parseInt(auc.biodiversity.split('/')[0]) || 0;
    const matchBio = bioScore >= filterMinBio;

    return matchSearch && matchState && matchCrop && matchBio;
  });

  return (
    <div className="pb-24 px-4 pt-4 max-w-lg mx-auto bg-warm-white min-h-screen text-carbon-800 font-inter">
      
      {/* Top Floating Notification Toast */}
      {outbidToast && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-amber-900 text-amber-100 border border-amber-800/80 px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between text-xs font-bold leading-normal animate-bounce">
          <span>{outbidToast.text}</span>
          <button onClick={() => setOutbidToast(null)} className="p-1 text-amber-400 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Role Switching Panel Header (Dual Interface Simulation) */}
      <div className="bg-white border border-forest-100 rounded-3xl p-2.5 mb-6 flex gap-2">
        <button
          onClick={() => {
            setActiveMarketRole('farmer');
            localStorage.setItem('carbonx_user_role', 'farmer');
          }}
          className={`flex-1 py-3 text-xs font-extrabold font-poppins rounded-2xl transition-all ${
            activeMarketRole === 'farmer' 
              ? 'bg-forest-800 text-white shadow-md'
              : 'text-carbon-500 hover:bg-forest-50'
          }`}
        >
          🧑‍🌾 Farmer Exchange Suite
        </button>

        <button
          onClick={() => {
            setActiveMarketRole('corporate');
            localStorage.setItem('carbonx_user_role', 'corporate');
          }}
          className={`flex-1 py-3 text-xs font-extrabold font-poppins rounded-2xl transition-all ${
            activeMarketRole === 'corporate' 
              ? 'bg-carbon-900 text-white shadow-md'
              : 'text-carbon-500 hover:bg-forest-50'
          }`}
        >
          🏢 Corporate Orderbook
        </button>
      </div>

      {/* Spot Price Ticker Header */}
      <div className="bg-gradient-to-r from-forest-800 to-emerald-800 text-white p-4 rounded-3xl mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border border-forest-600/30 shadow-md">
        <div>
          <span className="text-[9px] uppercase font-mono tracking-widest text-emerald-400 font-extrabold">Active Exchange spot price</span>
          <h3 className="text-base font-black font-manrope">{mockMarketplace.currentPrice} <span className="text-[10px] font-mono text-emerald-300 ml-1.5">{mockMarketplace.priceTrend}</span></h3>
        </div>
        
        {activeMarketRole === 'farmer' && (
          <button 
            onClick={() => navigate('/create-listing')}
            className="w-full sm:w-auto bg-emerald-400 hover:bg-emerald-500 text-black font-extrabold text-xs font-poppins px-5 py-2.5 rounded-xl transition-all shadow-lg"
          >
            + Create Marketplace Listing
          </button>
        )}
      </div>

      {/* Price Trend Analytics Graph */}
      <div className="bg-white border border-forest-100 rounded-[32px] p-5 shadow-sm mb-6 space-y-4">
        <div className="flex justify-between items-center border-b border-forest-50 pb-3">
          <div>
            <h4 className="text-xs font-bold text-carbon-800">CarbonX Historical Pricing Chart</h4>
            <p className="text-[9px] text-carbon-400">Weekly index average (INR/tCO2e)</p>
          </div>
          <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
            +4.8% Index
          </span>
        </div>

        <div className="h-[120px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historicalMarketTrend} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#2E7D32" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#9CA3AF" fontSize={9} fontClassName="font-mono" />
              <YAxis stroke="#9CA3AF" fontSize={9} domain={[450, 560]} />
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="price" stroke="#2E7D32" strokeWidth={2.5} fillOpacity={1} fill="url(#priceGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Corporate Filter Suite */}
      {activeMarketRole === 'corporate' && (
        <div className="bg-white border border-forest-100 rounded-[32px] p-5 shadow-sm mb-6 space-y-4">
          <h4 className="text-xs font-bold text-carbon-800 flex items-center gap-1.5 border-b border-forest-50 pb-2">
            <Filter size={14} className="text-forest-700" /> Advanced Exchange Filters
          </h4>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-carbon-400 uppercase">State</label>
              <select
                value={filterState}
                onChange={e => setFilterState(e.target.value)}
                className="w-full bg-forest-50/50 border border-forest-100 p-2.5 rounded-xl text-xs font-semibold focus:ring-0"
              >
                <option value="">All States</option>
                <option value="TS">Telangana</option>
                <option value="AP">Andhra Pradesh</option>
                <option value="KA">Karnataka</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-carbon-400 uppercase">Crop Practice</label>
              <select
                value={filterCrop}
                onChange={e => setFilterCrop(e.target.value)}
                className="w-full bg-forest-50/50 border border-forest-100 p-2.5 rounded-xl text-xs font-semibold focus:ring-0"
              >
                <option value="">All Crops</option>
                <option value="Paddy">Paddy Rice</option>
                <option value="Agroforestry">Agroforestry</option>
                <option value="Cotton">Cotton</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-carbon-400 uppercase">Min Biodiversity Score</label>
              <select
                value={filterMinBio}
                onChange={e => setFilterMinBio(parseInt(e.target.value))}
                className="w-full bg-forest-50/50 border border-forest-100 p-2.5 rounded-xl text-xs font-semibold focus:ring-0"
              >
                <option value={0}>Any Biodiversity</option>
                <option value={80}>80+ (Premium)</option>
                <option value={85}>85+ (Elite)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-carbon-400 uppercase">Search Keywords</label>
              <input
                type="text"
                placeholder="Farmer, crop..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-forest-50/50 border border-forest-100 p-2.5 rounded-xl text-xs font-semibold focus:ring-0 focus:border-forest-300"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Listing Grid header */}
      <div className="flex justify-between items-center mb-4 px-1">
        <h4 className="text-xs font-bold text-carbon-500 uppercase tracking-wider">
          {activeMarketRole === 'farmer' ? "Your Active Listed Lots" : `Active Marketplace Lots (${filteredAuctions.length})`}
        </h4>
        <span className="text-[9px] bg-rose-100 border border-rose-200 text-rose-700 px-2 py-0.5 rounded-full font-bold uppercase flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-ping"></span>
          Live Exchange
        </span>
      </div>

      {/* Lists */}
      <div className="space-y-4 mb-8">
        
        {/* Empty lists fallback */}
        {activeMarketRole === 'farmer' && filteredAuctions.filter(a => a.farmer === 'Ramesh Kumar').length === 0 && (
          <div className="p-8 bg-white border border-forest-100 rounded-[28px] text-center text-xs text-carbon-400 space-y-3">
            <Gavel size={32} className="text-forest-400 mx-auto" />
            <p className="font-bold text-carbon-800">You haven't listed any credits yet!</p>
            <p className="text-[10px] px-2 leading-relaxed">Once your documents are verified and credits are issued, list them here to sell to premium corporate buyers.</p>
            <button 
              onClick={() => navigate('/create-listing')}
              className="bg-forest-800 hover:bg-forest-900 text-white px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors"
            >
              List Credits Now
            </button>
          </div>
        )}

        {filteredAuctions
          .filter(auc => activeMarketRole === 'corporate' || auc.farmer === 'Ramesh Kumar')
          .map(auc => {
            const timeRemaining = timers[auc.id]?.time;
            const sniping = timers[auc.id]?.snipingAlert;

            return (
              <motion.div
                key={auc.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-forest-100 rounded-[32px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
              >
                {/* Header Card Photo overlay */}
                <div className="h-36 w-full relative bg-carbon-900">
                  <img src={auc.image} alt={auc.farmer} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {/* Trust indicator */}
                  <div className="absolute top-3 left-3 bg-black/50 border border-white/20 px-2.5 py-0.5 rounded-lg text-[9px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1 font-mono">
                    <ShieldCheck size={11} /> AI Checked
                  </div>

                  <div className="absolute top-3 right-3 bg-forest-800 text-white font-extrabold text-[10px] px-3 py-1 rounded-lg">
                    {auc.credits}
                  </div>

                  {/* Details Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white">
                    <div>
                      <h5 className="text-xs font-bold leading-tight">{auc.farmer}</h5>
                      <span className="text-[9px] text-emerald-300 font-mono mt-0.5 block">📍 {auc.location}</span>
                    </div>
                    <span className="bg-white/10 text-[9px] font-bold uppercase border border-white/10 px-2 py-0.5 rounded-md font-mono">
                      {auc.crop}
                    </span>
                  </div>
                </div>

                {/* Body Cards Details */}
                <div className="p-4 flex flex-col gap-3">
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="bg-forest-50 border border-forest-100/50 p-2 rounded-xl">
                      <p className="text-[8px] uppercase tracking-wider text-carbon-400 font-bold">Land size</p>
                      <p className="font-extrabold text-carbon-800 mt-0.5">{auc.size}</p>
                    </div>
                    <div className="bg-forest-50 border border-forest-100/50 p-2 rounded-xl">
                      <p className="text-[8px] uppercase tracking-wider text-carbon-400 font-bold">Biodiversity</p>
                      <p className="font-extrabold text-carbon-800 mt-0.5">{auc.biodiversity}</p>
                    </div>
                    <div className="bg-forest-50 border border-forest-100/50 p-2 rounded-xl">
                      <p className="text-[8px] uppercase tracking-wider text-carbon-400 font-bold">Offers Log</p>
                      <p className="font-extrabold text-forest-800 mt-0.5">{auc.bidsCount} bids</p>
                    </div>
                  </div>

                  {/* Actions & pricing details */}
                  <div className="flex justify-between items-center pt-3 border-t border-forest-50">
                    <div>
                      <p className="text-[8px] text-carbon-400 uppercase font-bold tracking-wider">Current Top Bid</p>
                      <p className="text-sm font-extrabold text-forest-800 font-manrope">{auc.currentBid}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Anti-Sniping timer alert */}
                      <span className={`text-[9px] font-mono font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg ${
                        sniping 
                          ? 'bg-rose-100 border border-rose-200 text-rose-600 animate-pulse' 
                          : 'bg-forest-50 border border-forest-100 text-carbon-500'
                      }`}>
                        <Clock size={11} className={sniping ? "animate-spin" : ""} />
                        <span>{timeRemaining !== undefined ? formatTimer(timeRemaining) : "Live Countdown"}</span>
                      </span>

                      {activeMarketRole === 'farmer' ? (
                        <button
                          onClick={() => handleFarmerAcceptBid(auc)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-black text-[10px] font-black uppercase px-4 py-2.5 rounded-xl transition-all shadow-md"
                        >
                          Accept Payout
                        </button>
                      ) : (
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => navigate(`/credit-analysis/${auc.id}`)}
                            className="bg-carbon-900 hover:bg-black text-white text-[10px] font-bold uppercase px-3 py-2.5 rounded-xl transition-all"
                          >
                            Inspect NDVI
                          </button>
                          <button
                            onClick={() => setSelectedAuction(auc)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-black text-[10px] font-black uppercase px-3 py-2.5 rounded-xl transition-all shadow-md"
                          >
                            Bid
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

      </div>

      {/* Slide out Bid Drawer */}
      <AnimatePresence>
        {selectedAuction && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAuction(null)}
              className="fixed inset-0 bg-black z-40"
            />
            
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white rounded-t-[32px] p-6 pb-8 border-t border-forest-100 shadow-2xl z-50 text-carbon-800"
            >
              <div className="w-12 h-1 bg-forest-200 rounded-full mx-auto mb-6" />

              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[9px] text-emerald-700 font-bold uppercase tracking-wider font-mono">Secure Carbon Bid entry</span>
                  <h3 className="text-base font-black font-poppins mt-0.5">Bid on {selectedAuction.farmer}'s Lot</h3>
                  <p className="text-[10px] text-carbon-400 mt-0.5">{selectedAuction.location} • {selectedAuction.crop}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold text-white bg-forest-800 px-2 py-0.5 rounded-lg">
                    {selectedAuction.credits}
                  </span>
                </div>
              </div>

              <form onSubmit={submitCorporateBid} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-carbon-400">Your Bid Offer Amount (₹ per Credit)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-sm text-carbon-500">₹</span>
                    <input
                      type="number"
                      required
                      min={parseInt(selectedAuction.currentBid.replace(/[^0-9]/g, '')) / parseFloat(selectedAuction.credits) + 5 || 530}
                      placeholder="Enter bid"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="w-full pl-8 pr-16 py-3.5 bg-forest-50/50 border border-forest-100 rounded-2xl font-black text-sm focus:outline-none focus:border-forest-400 focus:bg-white transition-all"
                    />
                  </div>
                  <p className="text-[10px] text-carbon-400 flex justify-between px-1 font-mono">
                    <span>Reserve price met: ✓</span>
                    <span className="text-rose-600 font-bold">Countdown: {timers[selectedAuction.id]?.time ? formatTimer(timers[selectedAuction.id].time) : "Live"}</span>
                  </p>
                </div>

                <div className="bg-forest-50 border border-forest-100 rounded-2xl p-3.5 flex gap-2.5 text-[10px] leading-relaxed text-carbon-500">
                  <Info size={16} className="text-forest-700 shrink-0 mt-0.5" />
                  <p>
                    <strong>Escrow Protection Locked</strong>: When placing a competitive bid, carbon clearinghouses require immediate lock-in of compliance funds. In the event of an outbid alert, funds return instantly.
                  </p>
                </div>

                {bidSuccess ? (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-4 bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-2xl text-center font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5 text-emerald-800 animate-bounce" />
                    <span>Bid Secured in Escrow!</span>
                  </motion.div>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmittingBid || !bidAmount}
                    className="w-full py-4 rounded-2xl bg-forest-800 hover:bg-forest-900 text-white font-extrabold tracking-wider shadow-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmittingBid ? (
                      <>
                        <RefreshCw className="animate-spin h-4 w-4" />
                        <span>Pre-Authorizing Clearing...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Corporate Bid</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
