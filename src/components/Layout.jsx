import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Compass, ShoppingCart, Wallet, UserCheck, Menu, Bell, Globe } from 'lucide-react';
import { mockFarmer } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, changeLanguage, currentLang } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);

  // Check if current path is a public page (where we don't want the bottom nav)
  const isPublicPage = 
    location.pathname === '/' || 
    location.pathname === '/role-selection' || 
    location.pathname === '/farmer-register' || 
    location.pathname === '/farmer-login' || 
    location.pathname === '/onboarding' || 
    location.pathname === '/satellite-preview' || 
    location.pathname === '/submission-success';
  
  const navItems = [
    { name: "Home", key: "home", path: "/farmer-dashboard", icon: Home },
    { name: "Farm", key: "farm", path: "/farm-analytics", icon: Compass }, // Maps/analytics
    { name: "Market", key: "market", path: "/marketplace", icon: ShoppingCart },
    { name: "Wallet", key: "wallet", path: "/wallet", icon: Wallet },
    { name: "Support", key: "support", path: "/support", icon: UserCheck }
  ];

  // Active styles match the screenshots
  const getActiveTabClass = (path) => {
    const isActive = location.pathname === path || 
      (path === '/farmer-dashboard' && location.pathname === '/farmer-dashboard') ||
      (path === '/farm-analytics' && (location.pathname === '/farm-analytics' || location.pathname === '/farm-map' || location.pathname === '/farm-details' || location.pathname === '/satellite-preview' || location.pathname === '/submission-success'));
    
    return isActive;
  };

  const [notificationsList, setNotificationsList] = useState(() => {
    const local = localStorage.getItem('carbonx_notifications');
    if (local) return JSON.parse(local);

    const initial = [
      { id: 1, text: "Verification Successful: North Grove Plot is 100% verified.", time: "1 hr ago", type: "success" },
      { id: 2, text: "New Buyer Bid: TATA ESG offered ₹530/credit for Andhra Paddy.", time: "3 hrs ago", type: "info" },
      { id: 3, text: "Escrow Locked: ₹12,480 compliance funds secured.", time: "4 hrs ago", type: "info" },
      { id: 4, text: "UPI Payout Initiated: ₹8,000 sent to ramesh.kumar@oksbi.", time: "1 day ago", type: "payment" },
      { id: 5, text: "⚠️ Outbid Alert: Anila Devi's Sugarcane lot received a higher bid.", time: "2 days ago", type: "warning" }
    ];
    localStorage.setItem('carbonx_notifications', JSON.stringify(initial));
    return initial;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const local = localStorage.getItem('carbonx_notifications');
      if (local) {
        setNotificationsList(JSON.parse(local));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);
  };

  if (isPublicPage) {
    return <div className="min-h-screen flex flex-col">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-warm-white flex flex-col pb-24 md:pb-0 md:pl-64">
      {/* Mobile Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-warm-white/95 backdrop-blur-md border-b border-forest-100/50 py-3 px-4 flex justify-between items-center md:hidden">
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-forest-50 rounded-xl text-carbon-800 transition-colors">
            <Menu size={22} />
          </button>
          <span className="font-manrope font-extrabold text-xl text-forest-800 tracking-tight flex items-center gap-1.5">
            🌱 CarbonX
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Elegant header language switcher */}
          <div className="flex items-center gap-1 bg-forest-50 border border-forest-100 rounded-xl px-2 py-1 text-xs text-forest-900">
            <Globe size={12} className="text-forest-700" />
            <select 
              value={currentLang} 
              onChange={handleLanguageChange}
              className="bg-transparent border-none outline-none text-[10px] font-bold focus:ring-0 cursor-pointer text-forest-900"
            >
              <option value="en">EN</option>
              <option value="hi">HI</option>
              <option value="te">TE</option>
            </select>
          </div>

          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 hover:bg-forest-50 rounded-xl text-carbon-800 transition-colors relative"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
          </button>
          <button 
            onClick={() => navigate('/farmer-dashboard')}
            className="w-9 h-9 rounded-full overflow-hidden border border-forest-200/80 shadow-sm"
          >
            <img src={mockFarmer.avatar} alt="Profile" className="w-full h-full object-cover" />
          </button>
        </div>
      </header>

      {/* Desktop Navigation Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-forest-100 shadow-sm hidden md:flex flex-col p-6 justify-between">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 bg-forest-700 rounded-xl flex items-center justify-center text-white font-bold text-lg">🌱</span>
              <span className="font-manrope font-extrabold text-2xl text-forest-800 tracking-tight">CarbonX</span>
            </div>
          </div>

          {/* Desktop Language Selector */}
          <div className="bg-forest-50/50 border border-forest-100/50 rounded-2xl p-3 flex items-center justify-between text-xs text-carbon-600">
            <span className="flex items-center gap-1.5 font-semibold text-carbon-700">
              <Globe size={14} className="text-forest-700" /> Language
            </span>
            <select 
              value={currentLang} 
              onChange={handleLanguageChange}
              className="bg-transparent border-none outline-none font-bold text-forest-800 focus:ring-0 cursor-pointer text-xs"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="te">తెలుగు</option>
            </select>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item, idx) => {
              const active = getActiveTabClass(item.path);
              return (
                <button
                  key={idx}
                  onClick={() => navigate(item.path)}
                  className={`w-full py-3 px-4 rounded-2xl flex items-center gap-3.5 text-sm font-semibold transition-all duration-200 ${
                    active 
                      ? 'bg-forest-100 text-forest-900 border border-forest-200/30' 
                      : 'hover:bg-forest-50/50 text-carbon-500 hover:text-forest-800'
                  }`}
                >
                  <item.icon size={19} className={active ? "text-forest-700" : "text-carbon-400"} />
                  <span>{t(item.key)}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Desktop Profile Card */}
        <div className="border-t border-forest-100/60 pt-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-forest-200 shadow-sm">
            <img src={mockFarmer.avatar} alt="Ramesh" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-carbon-800 truncate leading-tight">{mockFarmer.name}</p>
            <p className="text-xs text-forest-600 truncate">{mockFarmer.village}</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-4 md:py-8">
        {children}
      </main>

      {/* Notifications Drawer */}
      {showNotifications && (
        <div className="fixed top-14 right-4 z-50 w-80 bg-white/95 backdrop-blur-xl border border-forest-100 rounded-3xl p-4 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex justify-between items-center pb-2 border-b border-forest-100 mb-2">
            <span className="text-xs font-bold text-carbon-800 uppercase tracking-wide">Notifications</span>
            <button onClick={() => setShowNotifications(false)} className="text-[10px] font-semibold text-forest-700 hover:underline">Mark read</button>
          </div>
          <div className="space-y-2">
            {notificationsList.map(n => (
              <div key={n.id} className="p-2.5 rounded-xl hover:bg-forest-50/60 text-xs transition-colors flex gap-2 border border-forest-50">
                <span className="text-base mt-0.5">
                  {n.type === 'success' ? '✅' : n.type === 'payment' ? '💰' : '🔔'}
                </span>
                <div>
                  <p className="text-carbon-700 leading-snug">{n.text}</p>
                  <span className="text-[9px] text-carbon-400 mt-1 block">{n.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Matched to Screenshots!) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-forest-100/50 py-2.5 px-4 flex justify-around items-center md:hidden shadow-lg">
        {navItems.map((item, idx) => {
          const active = getActiveTabClass(item.path);
          return (
            <button
              key={idx}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center gap-1 transition-all duration-200 flex-1 relative"
            >
              {active ? (
                /* Light pinkish-peach pill background style from the screenshots */
                <div className="flex flex-col items-center justify-center">
                  <div className="px-5 py-1.5 bg-[#FFEBE7] rounded-full text-forest-800 flex items-center justify-center shadow-sm">
                    <item.icon size={20} className="text-[#E06651]" />
                  </div>
                  <span className="text-[10px] font-bold text-carbon-800 font-poppins mt-0.5">{t(item.key)}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="px-5 py-1.5 text-carbon-400">
                    <item.icon size={20} />
                  </div>
                  <span className="text-[10px] font-medium text-carbon-400 font-poppins mt-0.5">{t(item.key)}</span>
                </div>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
