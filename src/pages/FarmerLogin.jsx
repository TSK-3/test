import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldCheck, Globe, HelpCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import axiosInstance from '../api/axiosInstance';

export default function FarmerLogin() {
  const navigate = useNavigate();
  const { t, changeLanguage, currentLang } = useLanguage();
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!otpSent) {
        const response = await axiosInstance.post('/request-otp', { phone });
        if (response.data.success) {
          setOtpSent(true);
        } else {
          alert(response.data.message || "Failed to send OTP");
        }
      } else {
        const response = await axiosInstance.post('/login-phone', { phone, otp });
        if (response.data.success) {
          localStorage.setItem('token', response.data.token);
          navigate('/farmer-dashboard');
        } else {
          alert(response.data.message || "Invalid OTP");
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between font-inter text-carbon-800 overflow-hidden">
      
      {/* Premium Agricultural Terrace Aerial Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center filter brightness-[0.45] saturate-[1.1]"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1920')` }}
      />
      {/* Soft nature theme overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-emerald-950/85 via-emerald-900/60 to-orange-950/40 backdrop-blur-[2px]" />

      <header className="relative z-10 py-4 px-6 bg-white/10 backdrop-blur-md flex justify-between items-center border-b border-white/10">
        <button onClick={() => navigate('/role-selection')} className="p-2.5 hover:bg-white/10 rounded-xl text-white transition-colors">
          <ArrowLeft size={18} />
        </button>
        <span className="font-manrope font-bold text-sm text-white tracking-wide">{t('farmerRole')} - {t('loginBtn')}</span>
        
        {/* Multilingual Selector */}
        <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-2.5 py-1 text-xs text-white">
          <Globe size={13} className="text-emerald-300" />
          <select 
            value={currentLang} 
            onChange={handleLanguageChange}
            className="bg-transparent border-none outline-none text-xs font-bold text-white focus:ring-0 cursor-pointer"
          >
            <option value="en" className="text-carbon-800">English</option>
            <option value="hi" className="text-carbon-800">हिन्दी (Hindi)</option>
            <option value="te" className="text-carbon-800">తెలుగు (Telugu)</option>
          </select>
        </div>
      </header>

      <main className="relative z-10 flex-1 max-w-sm mx-auto w-full px-4 py-8 flex flex-col justify-center">
        <div className="bg-white/95 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-poppins text-carbon-900">{t('loginWelcome')}</h2>
            <p className="text-xs text-carbon-500 leading-normal">{t('loginDesc')}</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {!otpSent ? (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-carbon-500 uppercase tracking-wide">{t('registeredPhone')}</label>
                <div className="flex bg-warm-white border border-forest-100 rounded-2xl p-3 items-center shadow-inner">
                  <span className="text-xs font-bold text-carbon-500 mr-2 border-r border-forest-100 pr-2">+91</span>
                  <input 
                    type="tel" 
                    placeholder="98480 22334" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full text-xs font-semibold bg-transparent border-none outline-none focus:ring-0"
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-carbon-500 uppercase tracking-wide">{t('enterOtp')}</label>
                  <input 
                    type="text" 
                    placeholder="••••" 
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-warm-white border border-forest-100 rounded-2xl p-3 text-center text-sm font-bold tracking-widest focus:ring-0 focus:border-forest-400 shadow-inner"
                    required
                  />
                </div>
                <div className="text-right">
                  <button type="button" className="text-[10px] font-bold text-forest-700 hover:underline" onClick={() => setOtpSent(false)}>
                    {t('changePhone')}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${loading ? 'bg-forest-600' : 'bg-forest-800 hover:bg-forest-900'} text-white text-xs font-bold font-poppins py-4 rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-center gap-1.5`}
            >
              {loading ? 'Processing...' : (otpSent ? t('loginBtn') : t('sendOtp'))} <ArrowRight size={14} />
            </button>
          </form>
        </div>

        <div className="mt-8 text-center space-y-1.5 text-xs bg-black/35 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-white shadow-lg">
          <p className="text-white/80">{t('firstTime')}</p>
          <button onClick={() => navigate('/farmer-register')} className="font-bold text-emerald-300 hover:text-emerald-200 hover:underline">
            {t('registerFarmProfile')}
          </button>
        </div>
      </main>

      <footer className="relative z-10 py-4 flex justify-center items-center gap-4 text-[10px] text-white/80 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <span className="flex items-center gap-1">📞 {t('helpline')}: 1800-420-2026</span>
        <span>•</span>
        <span className="flex items-center gap-1 hover:underline cursor-pointer" onClick={() => navigate('/support')}><HelpCircle size={12} /> {t('liveChat')}</span>
      </footer>
    </div>
  );
}
