import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Wallet, 
  CheckCircle, 
  Clock, 
  ExternalLink, 
  PlusCircle, 
  MapPin, 
  ChevronRight, 
  ArrowUpRight, 
  HelpCircle,
  ShieldCheck,
  Smartphone,
  Activity,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockFarmer, mockWallet, mockFarms } from '../data/mockData';

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [balance, setBalance] = useState(mockWallet.balance);
  const [activities, setActivities] = useState(mockWallet.activities);

  const handleWithdraw = () => {
    if (balance <= 0) return;
    setWithdrawing(true);
    setTimeout(() => {
      setWithdrawing(false);
      setWithdrawSuccess(true);
      setBalance(0);
      
      // Add a payout activity
      const newActivity = {
        id: `act-${Date.now()}`,
        type: 'payout',
        title: 'UPI Payout - Instant Transfer',
        amount: -balance,
        date: 'Today',
        status: 'Completed'
      };
      setActivities([newActivity, ...activities]);

      setTimeout(() => {
        setWithdrawSuccess(false);
      }, 4000);
    }, 2000);
  };

  return (
    <div className="pb-24 px-4 pt-4 max-w-md mx-auto bg-earth-cream min-h-screen text-earth-dark font-sans">
      {/* Farmer Greeting & Quick Switch Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-5 bg-white p-3 rounded-2xl shadow-sm border border-earth-green/10"
      >
        <div className="flex items-center gap-3">
          <img 
            src={mockFarmer.avatar} 
            alt={mockFarmer.name} 
            className="w-12 h-12 rounded-full border-2 border-earth-green object-cover"
          />
          <div>
            <p className="text-xs text-earth-muted">Namaste 🙏</p>
            <h2 className="text-base font-bold text-earth-dark">{mockFarmer.name}</h2>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] bg-earth-green/10 text-earth-green px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
            Active FPO
          </span>
          <span className="text-[11px] text-earth-muted mt-1">{mockFarmer.village}</span>
        </div>
      </motion.div>

      {/* Main UPI Wallet Card - SCREENSHOT 1 MATCHING */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden bg-gradient-to-br from-earth-green to-earth-dark text-white rounded-3xl p-6 shadow-xl mb-6"
      >
        {/* Subtle decorative elements */}
        <div className="absolute right-0 bottom-0 w-36 h-36 bg-earth-accent/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute left-1/2 -top-12 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/10 rounded-xl">
              <Wallet className="w-5 h-5 text-earth-accent" />
            </div>
            <span className="text-sm font-medium tracking-wide text-earth-cream/80">UPI Soil Wallet</span>
          </div>
          <span className="text-[10px] bg-white/20 text-white border border-white/20 px-2 py-0.5 rounded-full font-mono">
            SECURE LEDGER
          </span>
        </div>

        <p className="text-xs text-white/70">Withdrawable Balance</p>
        <div className="flex items-baseline gap-2 mt-1 mb-5">
          <span className="text-3xl font-black tracking-tight text-white">
            ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
          {balance > 0 && (
            <span className="text-xs text-earth-accent font-bold bg-white/10 px-2 py-0.5 rounded-md flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> Ready
            </span>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleWithdraw}
          disabled={withdrawing || balance <= 0}
          className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 shadow-lg ${
            balance <= 0 
              ? 'bg-white/10 text-white/50 cursor-not-allowed shadow-none'
              : withdrawing 
                ? 'bg-earth-accent/80 text-earth-dark cursor-wait'
                : 'bg-earth-accent text-earth-dark hover:bg-white hover:scale-[1.02] active:scale-95'
          } flex items-center justify-center gap-2`}
        >
          {withdrawing ? (
            <>
              <svg className="animate-spin h-5 w-5 text-earth-dark" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Sending Instant UPI Payout...</span>
            </>
          ) : withdrawSuccess ? (
            <>
              <CheckCircle className="w-5 h-5 text-earth-dark" />
              <span>Transferred Successfully!</span>
            </>
          ) : balance <= 0 ? (
            <span>Wallet Empty (Withdrawn)</span>
          ) : (
            <>
              <span>Withdraw to UPI</span>
              <ArrowUpRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* UPI ID display */}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
          <span>Linked UPI ID:</span>
          <span className="font-mono text-white/80">{mockFarmer.upiId}</span>
        </div>
      </motion.div>

      {/* Main Verified Credits Badge Box - SCREENSHOT 1 MATCHING */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-3xl p-5 border border-earth-green/10 shadow-sm flex items-center justify-between relative overflow-hidden"
        >
          {/* Scientific background line */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-earth-green/5 to-transparent pointer-events-none" />
          
          <div>
            <span className="text-xs text-earth-muted font-bold tracking-wider uppercase flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-earth-green" /> Verified Carbon Credits
            </span>
            <h3 className="text-3xl font-black text-earth-dark mt-2 tracking-tight">
              {mockWallet.verifiedCredits.toFixed(1)} <span className="text-sm font-medium text-earth-muted">tCO2e</span>
            </h3>
            <p className="text-[11px] text-earth-green font-medium mt-1">✓ Minted ERC-1155 Standard</p>
          </div>
          
          <div className="h-16 w-16 rounded-2xl bg-earth-green/5 border border-earth-green/15 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-earth-muted uppercase">VALUE</span>
            <span className="text-sm font-bold text-earth-green">₹42.6K</span>
          </div>
        </motion.div>

        {/* Pending & Retired Mini Grid - SCREENSHOT 1 MATCHING */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-4 border border-earth-green/10 shadow-sm"
          >
            <span className="text-[10px] text-earth-muted font-bold tracking-wider uppercase flex items-center gap-1">
              <Clock className="w-3 h-3 text-orange-500 animate-pulse" /> Pending AI
            </span>
            <h4 className="text-lg font-black text-earth-dark mt-2">
              {mockWallet.pendingCredits.toFixed(1)} <span className="text-xs font-normal text-earth-muted">tCO2e</span>
            </h4>
            <p className="text-[10px] text-orange-600 mt-1">Satellite scanning...</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-4 border border-earth-green/10 shadow-sm"
          >
            <span className="text-[10px] text-earth-muted font-bold tracking-wider uppercase flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-blue-500" /> Retired
            </span>
            <h4 className="text-lg font-black text-earth-dark mt-2">
              {mockWallet.retiredCredits.toFixed(1)} <span className="text-xs font-normal text-earth-muted">tCO2e</span>
            </h4>
            <p className="text-[10px] text-blue-600 mt-1">Offset by Corporates</p>
          </motion.div>
        </div>
      </div>

      {/* Dark Blockchain Secured Smart Contract Card - SCREENSHOT 1 MATCHING */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-earth-dark text-earth-cream rounded-3xl p-5 shadow-lg border border-earth-green/20 relative overflow-hidden mb-6"
      >
        {/* Abstract network web decoration */}
        <div className="absolute right-0 top-0 w-24 h-24 bg-earth-accent/5 rounded-full border border-earth-accent/10 flex items-center justify-center opacity-40 pointer-events-none">
          <div className="w-16 h-16 rounded-full border border-earth-accent/10 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border border-earth-accent/20" />
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-white/5 border border-white/10 rounded-xl text-earth-accent">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-earth-accent font-bold uppercase tracking-wider">Blockchain Secured Contract</span>
            <h4 className="text-sm font-bold text-white mt-0.5">ERC-1155 Hybrid Credit Token</h4>
            
            <div className="mt-3 grid grid-cols-2 gap-y-2 gap-x-4 border-t border-white/10 pt-3 text-[11px] font-mono text-earth-cream/70">
              <div>
                <p className="text-[9px] uppercase tracking-wider text-white/40">Token ID</p>
                <p className="text-white font-bold">{mockWallet.tokenId}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-wider text-white/40">Certification</p>
                <p className="text-white font-bold">ISO-14064-3</p>
              </div>
              <div className="col-span-2">
                <p className="text-[9px] uppercase tracking-wider text-white/40">Smart Contract Address</p>
                <p className="text-earth-accent/90 truncate">0x5C26...77D1a45B</p>
              </div>
            </div>

            <a 
              href={mockWallet.blockchainExplorerLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-earth-accent hover:underline font-semibold"
            >
              <span>Verify on Public Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </motion.div>

      {/* Linked UPI Account Banner - SCREENSHOT 1 MATCHING */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between p-3.5 bg-earth-green/5 border border-earth-green/15 rounded-2xl mb-6 text-xs"
      >
        <div className="flex items-center gap-2 text-earth-green">
          <Smartphone className="w-4 h-4" />
          <span className="font-semibold">Linked UPI:</span>
          <span className="font-mono text-earth-dark font-medium">{mockWallet.upiAccount}</span>
        </div>
        <span className="text-[10px] bg-earth-green/10 text-earth-green border border-earth-green/20 px-2 py-0.5 rounded-full font-bold">
          ● ACTIVE
        </span>
      </motion.div>

      {/* Farmer Actions Quick Grid */}
      <h4 className="text-xs font-bold text-earth-muted uppercase tracking-wider mb-3">Quick Actions</h4>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button 
          onClick={() => navigate('/register-farm')}
          className="flex flex-col items-start p-4 bg-white border border-earth-green/10 rounded-2xl text-left shadow-sm hover:border-earth-green hover:shadow-md transition-all duration-300 group"
        >
          <div className="p-2 bg-earth-green/10 text-earth-green rounded-xl mb-3 group-hover:scale-110 transition-transform">
            <PlusCircle className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-earth-dark">Register Farm</span>
          <span className="text-[10px] text-earth-muted mt-1 leading-snug">Draw GIS land boundary map</span>
        </button>

        <button 
          onClick={() => navigate('/farm-analytics')}
          className="flex flex-col items-start p-4 bg-white border border-earth-green/10 rounded-2xl text-left shadow-sm hover:border-earth-green hover:shadow-md transition-all duration-300 group"
        >
          <div className="p-2 bg-sky-500/10 text-sky-600 rounded-xl mb-3 group-hover:scale-110 transition-transform">
            <Activity className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-earth-dark">Sat Analytics</span>
          <span className="text-[10px] text-earth-muted mt-1 leading-snug">NDVI scans & soil records</span>
        </button>

        <button 
          onClick={() => navigate('/marketplace')}
          className="flex flex-col items-start p-4 bg-white border border-earth-green/10 rounded-2xl text-left shadow-sm hover:border-earth-green hover:shadow-md transition-all duration-300 group"
        >
          <div className="p-2 bg-purple-500/10 text-purple-600 rounded-xl mb-3 group-hover:scale-110 transition-transform">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-earth-dark">Market Auctions</span>
          <span className="text-[10px] text-earth-muted mt-1 leading-snug">View/Manage auction bids</span>
        </button>

        <button 
          onClick={() => navigate('/support')}
          className="flex flex-col items-start p-4 bg-white border border-earth-green/10 rounded-2xl text-left shadow-sm hover:border-earth-green hover:shadow-md transition-all duration-300 group"
        >
          <div className="p-2 bg-earth-accent/20 text-earth-dark rounded-xl mb-3 group-hover:scale-110 transition-transform">
            <HelpCircle className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-earth-dark">Village Voice</span>
          <span className="text-[10px] text-earth-muted mt-1 leading-snug">Multilingual voice assistant</span>
        </button>
      </div>

      {/* Recent Activities List - SCREENSHOT 1 MATCHING */}
      <div className="bg-white rounded-3xl p-5 border border-earth-green/10 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-earth-dark flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-earth-green" /> Wallet Activities
          </h4>
          <button 
            onClick={() => navigate('/wallet')} 
            className="text-xs text-earth-green font-bold flex items-center gap-0.5 hover:underline"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-4">
          {activities.map((act) => (
            <div key={act.id} className="flex justify-between items-start text-xs border-b border-earth-green/5 pb-3 last:border-0 last:pb-0">
              <div className="flex gap-3">
                <div className={`p-2 rounded-xl h-9 w-9 flex items-center justify-center shrink-0 ${
                  act.type === 'sale' 
                    ? 'bg-earth-green/10 text-earth-green'
                    : act.type === 'payout' 
                      ? 'bg-earth-accent/20 text-earth-dark' 
                      : 'bg-blue-500/10 text-blue-600'
                }`}>
                  {act.type === 'sale' ? (
                    <ArrowUpRight className="w-4.5 h-4.5" />
                  ) : act.type === 'payout' ? (
                    <Wallet className="w-4.5 h-4.5" />
                  ) : (
                    <ShieldCheck className="w-4.5 h-4.5" />
                  )}
                </div>
                <div>
                  <h5 className="font-bold text-earth-dark">{act.title}</h5>
                  <p className="text-[10px] text-earth-muted mt-0.5">{act.date} {act.meta && `• ${act.meta}`}</p>
                </div>
              </div>
              <div className="text-right">
                {act.amount !== undefined ? (
                  <p className={`font-black ${act.amount > 0 ? 'text-earth-green' : 'text-earth-dark'}`}>
                    {act.amount > 0 ? '+' : ''}₹{Math.abs(act.amount).toLocaleString('en-IN')}
                  </p>
                ) : (
                  <p className="font-black text-blue-600">
                    +{act.credits} tCO2e
                  </p>
                )}
                
                <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full font-semibold mt-1 uppercase ${
                  act.status === 'Completed'
                    ? 'bg-earth-green/10 text-earth-green'
                    : 'bg-orange-500/10 text-orange-600 animate-pulse'
                }`}>
                  {act.statusText || act.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
