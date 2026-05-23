import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldCheck, Tag, Info, Gavel, Award } from 'lucide-react';
import { mockWallet } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

export default function CreateListing() {
  const navigate = useNavigate();
  const { currentLang } = useLanguage();

  const pgTrans = {
    en: {
      title: "Create Carbon Credit Listing",
      subtitle: "List your satellite-verified carbon credits on the national CarbonX clearinghouse floor.",
      availCredits: "Available Verified Credits",
      creditsToSell: "Number of Credits to List",
      creditsToSellDesc: "Each credit equals 1 tCO2e (ton of carbon sequestered).",
      model: "Listing Model",
      fixed: "Fixed Price Sell",
      auction: "Live Bid Auction",
      reserve: "Reserve Price (per Credit)",
      reserveDesc: "Minimum price you are willing to accept.",
      duration: "Auction Duration",
      durationDesc: "Countdown duration for the live bidding floor.",
      increment: "Minimum Bid Increment",
      incrementDesc: "Minimum additional amount next bidder must offer.",
      summary: "Listing Summary & Security",
      expectedPayout: "Maximum Projected Payout",
      blockchainTokens: "Tokenized Credit IDs",
      cctsAudit: "CCTS Compliance Certification",
      submit: "Activate Listing Live",
      escrowLocked: "Funds are locked in CarbonX secure escrow during auctions."
    },
    hi: {
      title: "कार्बन क्रेडिट लिस्टिंग बनाएं",
      subtitle: "राष्ट्रीय कार्बनएक्स बाज़ार में अपने उपग्रह-सत्यापित कार्बन क्रेडिट को सूचीबद्ध करें।",
      availCredits: "उपलब्ध सत्यापित क्रेडिट",
      creditsToSell: "सूचीबद्ध करने के लिए क्रेडिट की संख्या",
      creditsToSellDesc: "प्रत्येक क्रेडिट 1 tCO2e (कार्बन संचय मात्रा) के बराबर है।",
      model: "लिस्टिंग मॉडल",
      fixed: "निश्चित मूल्य बिक्री",
      auction: "लाइव बोली नीलामी",
      reserve: "आरक्षित मूल्य (प्रति क्रेडिट)",
      reserveDesc: "न्यूनतम मूल्य जो आप स्वीकार करने को तैयार हैं।",
      duration: "नीलामी की अवधि",
      durationDesc: "लाइव बोली बाज़ार के लिए उल्टी गिनती की अवधि।",
      increment: "न्यूनतम बोली वृद्धि",
      incrementDesc: "न्यूनतम अतिरिक्त राशि जो अगले बोलीदाता को देनी होगी।",
      summary: "लिस्टिंग सारांश और सुरक्षा",
      expectedPayout: "अधिकतम अनुमानित भुगतान",
      blockchainTokens: "टोकनयुक्त क्रेडिट आईडी",
      cctsAudit: "CCTS अनुपालन प्रमाणन",
      submit: "लिस्टिंग को लाइव सक्रिय करें",
      escrowLocked: "नीलामी के दौरान फंड कार्बनएक्स सुरक्षित एस्क्रो में लॉक किए जाते हैं।"
    },
    te: {
      title: "కార్బన్ క్రెడిట్ లిస్టింగ్ సృష్టించండి",
      subtitle: "జాతీయ కార్బన్ఎక్స్ క్లియరింగ్‌హౌస్‌లో మీ శాటిలైట్-ధృవీకరించబడిన కార్బన్ క్రెడిట్‌లను జాబితా చేయండి.",
      availCredits: "అందుబాటులో ఉన్న ధృవీకరించబడిన క్రెడిట్లు",
      creditsToSell: "జాబితా చేయాల్సిన క్రెడిట్ల సంఖ్య",
      creditsToSellDesc: "ప్రతి క్రెడిట్ 1 tCO2e (టన్ను కార్బన్ నిల్వ) కి సమానం.",
      model: "లిస్టింగ్ మోడల్",
      fixed: "స్థిర ధర విక్రయం",
      auction: "లైవ్ బిడ్ వేలం",
      reserve: "రిజర్వ్ ధర (ప్రతి క్రెడిట్‌కు)",
      reserveDesc: "మీరు అంగీకరించడానికి సిద్ధంగా ఉన్న కనీస ధర.",
      duration: "వేలం వ్యవధి",
      durationDesc: "లైవ్ బిడ్డింగ్ ఫ్లోర్ కోసం కౌంట్ డౌన్ వ్యవధి.",
      increment: "కనీస బిడ్ పెరుగుదల",
      incrementDesc: "తదుపరి బిడ్డర్ ఆఫర్ చేయవలసిన కనీస అదనపు మొత్తం.",
      summary: "లిస్టింగ్ సారాంశం & భద్రత",
      expectedPayout: "గరిష్ట అంచనా చెల్లింపు",
      blockchainTokens: "టోకనైజ్డ్ క్రెడిట్ ఐడీలు",
      cctsAudit: "CCTS సమ్మతి ధృవీకరణ",
      submit: "లిస్టింగ్‌ను ప్రత్యక్షంగా యాక్టివేట్ చేయి",
      escrowLocked: "వేలం సమయంలో నిధులు కార్బన్ఎక్స్ సురక్షిత ఎస్క్రోలో లాక్ చేయబడతాయి."
    }
  };

  const localT = pgTrans[currentLang] || pgTrans['en'];

  // Input states
  const [credits, setCredits] = useState(24.0);
  const [listingModel, setListingModel] = useState("auction"); // fixed, auction
  const [reservePrice, setReservePrice] = useState(520);
  const [duration, setDuration] = useState(3); // days
  const [bidIncrement, setBidIncrement] = useState(10); // ₹

  const handleSubmit = (e) => {
    e.preventDefault();

    // Generate listing object and save in local storage to simulate new listing appearing in marketplace
    const newListing = {
      id: `auc-new-${Date.now()}`,
      farmer: "Ramesh Kumar",
      location: "Warangal, TS",
      crop: "Andhra Paddy Cluster",
      size: "4.28 Hectares",
      credits: `${credits.toFixed(1)} tCO2e`,
      currentBid: `₹${(reservePrice * credits).toLocaleString()}`,
      bidsCount: 0,
      biodiversity: "82/100",
      status: "Active",
      image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=300",
      reservePrice: reservePrice,
      duration: duration,
      increment: bidIncrement,
      createdTime: Date.now()
    };

    const currentLocal = JSON.parse(localStorage.getItem('carbonx_local_listings') || '[]');
    localStorage.setItem('carbonx_local_listings', JSON.stringify([newListing, ...currentLocal]));

    alert("Listing successfully activated on exchange floor!");
    navigate('/marketplace');
  };

  const calculatedPayout = credits * reservePrice;

  return (
    <div className="min-h-screen bg-warm-white font-inter text-carbon-800 pb-24">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-forest-100/50 py-4 px-6 flex items-center gap-3 shadow-sm">
        <button onClick={() => navigate('/farmer-dashboard')} className="p-2 hover:bg-forest-50 rounded-xl text-carbon-600 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="font-manrope font-bold text-sm text-carbon-900">{localT.title}</h1>
          <p className="text-[10px] text-carbon-400">{localT.subtitle}</p>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 mt-6">
        <form onSubmit={handleSubmit} className="bg-white border border-forest-100 rounded-[32px] p-6 shadow-card space-y-5">
          
          {/* Available Credits Ticker */}
          <div className="bg-forest-50/60 border border-forest-100 p-4 rounded-2xl flex justify-between items-center text-xs">
            <span className="font-semibold text-carbon-600">{localT.availCredits}</span>
            <span className="font-extrabold text-forest-800 text-sm">
              {mockWallet.verifiedCredits} tCO2e
            </span>
          </div>

          {/* Input 1: Credits */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-carbon-500 uppercase tracking-wide">{localT.creditsToSell}</label>
            <div className="relative">
              <input 
                type="number"
                max={mockWallet.verifiedCredits}
                min={1}
                value={credits}
                onChange={e => setCredits(Math.min(mockWallet.verifiedCredits, parseFloat(e.target.value) || 0))}
                className="w-full bg-warm-white border border-forest-100 rounded-2xl p-3.5 text-xs font-semibold pr-16 focus:ring-0 focus:border-forest-400"
                required
              />
              <span className="absolute right-4 top-3.5 text-xs font-bold text-carbon-400">tCO2e</span>
            </div>
            <p className="text-[9px] text-carbon-400 leading-normal">{localT.creditsToSellDesc}</p>
          </div>

          {/* Model selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-carbon-500 uppercase tracking-wide">{localT.model}</label>
            <div className="grid grid-cols-2 gap-3 text-xs font-bold">
              <button
                type="button"
                onClick={() => setListingModel("fixed")}
                className={`py-3 rounded-2xl border transition-all flex items-center justify-center gap-1.5 ${
                  listingModel === 'fixed' 
                    ? 'bg-forest-100 border-forest-300 text-forest-900 shadow-sm'
                    : 'bg-warm-white border-forest-100 text-carbon-500 hover:bg-forest-50/50'
                }`}
              >
                <Tag size={14} />
                <span>{localT.fixed}</span>
              </button>

              <button
                type="button"
                onClick={() => setListingModel("auction")}
                className={`py-3 rounded-2xl border transition-all flex items-center justify-center gap-1.5 ${
                  listingModel === 'auction' 
                    ? 'bg-forest-100 border-forest-300 text-forest-900 shadow-sm'
                    : 'bg-warm-white border-forest-100 text-carbon-500 hover:bg-forest-50/50'
                }`}
              >
                <Gavel size={14} />
                <span>{localT.auction}</span>
              </button>
            </div>
          </div>

          {/* Reserve Price */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-carbon-500 uppercase tracking-wide">{localT.reserve}</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-xs font-bold text-carbon-500">₹</span>
              <input 
                type="number"
                min={200}
                value={reservePrice}
                onChange={e => setReservePrice(parseInt(e.target.value) || 0)}
                className="w-full bg-warm-white border border-forest-100 rounded-2xl p-3.5 text-xs font-semibold pl-8 focus:ring-0 focus:border-forest-400"
                required
              />
            </div>
            <p className="text-[9px] text-carbon-400 leading-normal">{localT.reserveDesc}</p>
          </div>

          {listingModel === 'auction' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-carbon-500 uppercase tracking-wide">{localT.duration}</label>
                <select
                  value={duration}
                  onChange={e => setDuration(parseInt(e.target.value))}
                  className="w-full bg-warm-white border border-forest-100 rounded-2xl p-3 text-xs font-semibold focus:ring-0 focus:border-forest-400"
                >
                  <option value={3}>3 Days</option>
                  <option value={5}>5 Days</option>
                  <option value={7}>7 Days</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-carbon-500 uppercase tracking-wide">{localT.increment}</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-xs font-bold text-carbon-500">₹</span>
                  <input 
                    type="number"
                    min={1}
                    value={bidIncrement}
                    onChange={e => setBidIncrement(parseInt(e.target.value) || 0)}
                    className="w-full bg-warm-white border border-forest-100 rounded-2xl p-3 text-xs font-semibold pl-6 focus:ring-0 focus:border-forest-400"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Listing Summary Panel */}
          <div className="bg-carbon-900 border border-carbon-800 text-white rounded-2xl p-4 space-y-3">
            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wide font-mono flex items-center gap-1">
              <Info size={11} /> {localT.summary}
            </span>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-carbon-800 pb-1.5 font-mono">
                <span className="text-carbon-400">{localT.expectedPayout}</span>
                <span className="font-extrabold text-emerald-400">₹{calculatedPayout.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-carbon-800 pb-1.5 font-mono">
                <span className="text-carbon-400">{localT.blockchainTokens}</span>
                <span className="font-extrabold text-white truncate max-w-[120px]">{mockWallet.tokenId}</span>
              </div>
              <div className="flex justify-between text-mono">
                <span className="text-carbon-400">{localT.cctsAudit}</span>
                <span className="font-extrabold text-emerald-300">Level 2 Secured</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 text-[9px] leading-relaxed text-amber-700 bg-[#FFF8E1] border border-[#FFE082] rounded-xl p-3">
            <span className="text-base shrink-0 mt-0.5">🔒</span>
            <p>{localT.escrowLocked}</p>
          </div>

          <button
            type="submit"
            className="w-full bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold font-poppins py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-1.5"
          >
            <span>{localT.submit}</span>
            <ArrowRight size={14} />
          </button>

        </form>
      </main>
    </div>
  );
}
