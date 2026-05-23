import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ArrowRight, ShieldCheck, Landmark, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import axiosInstance from '../api/axiosInstance';

export default function FarmerRegister() {
  const navigate = useNavigate();
  const { t, changeLanguage, currentLang } = useLanguage();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [otp, setOtp] = useState("");
  const [state, setState] = useState("Telangana");
  const [district, setDistrict] = useState("Warangal");
  const [village, setVillage] = useState("Venkateshwara Pally");
  const [upi, setUpi] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone) return alert("Please enter a valid phone number.");
    setLoading(true);
    try {
      const response = await axiosInstance.post('/request-otp', { phone });
      if (response.data.success) {
        setStep(2);
      } else {
        alert(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return alert("Please enter the 4-digit OTP.");
    setLoading(true);
    try {
      const response = await axiosInstance.post('/verify-phone', { phone, otp });
      if (response.data.success) {
        setStep(3);
      } else {
        alert(response.data.message || "Invalid OTP");
      }
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBasicDetails = async (e) => {
    e.preventDefault();
    if (!name || !aadhaar) return alert("Please fill in your Name and Aadhaar.");
    setLoading(true);
    try {
      const response = await axiosInstance.post('/update-profile', {
        phone,
        full_name: name,
        email: "", // Mock email or add an input
        country: "India", // Mock for now or add input
        state,
        city: village,
        farm_type: "General", // Mock for now
        aadhaar
      });
      if (response.data.success) {
        setStep(4);
      } else {
        alert(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBankDetails = async (e) => {
    e.preventDefault();
    if (!upi) return alert("Please enter your UPI ID.");
    setLoading(true);
    try {
      const response = await axiosInstance.post('/update-profile', {
        phone,
        full_name: name,
        email: "",
        country: "India",
        state,
        city: village,
        farm_type: "General",
        aadhaar,
        upi
      });
      if (response.data.success) {
        setStep(5);
      } else {
        alert(response.data.message || "Failed to link bank account");
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
      
      {/* Premium Agricultural Terrace Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center filter brightness-[0.45] saturate-[1.1]"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1920')` }}
      />
      {/* Soft nature theme overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-emerald-950/85 via-emerald-900/60 to-orange-950/40 backdrop-blur-[2px]" />

      {/* Header */}
      <header className="relative z-10 py-4 px-6 bg-white/10 backdrop-blur-md flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-3">
          <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/role-selection')} className="p-2.5 hover:bg-white/10 rounded-xl text-white transition-colors">
            <ArrowLeft size={18} />
          </button>
          <span className="font-manrope font-bold text-sm text-white tracking-wide">{t('registerFarmProfile')}</span>
        </div>

        {/* Dynamic language select dropdown */}
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

      {/* Main Body */}
      <main className="relative z-10 flex-1 max-w-md mx-auto w-full px-4 py-8 flex flex-col justify-center">
        
        {/* Progress indicators */}
        <div className="flex gap-2 justify-center mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <span 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step >= i ? 'bg-emerald-400 w-8 shadow-sm shadow-emerald-400/50' : 'bg-white/25 w-4'
              }`}
            ></span>
          ))}
        </div>

        {/* Step 1: Mobile & Language */}
        {step === 1 && (
          <div className="bg-white/95 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-2xl space-y-6 animate-in fade-in duration-300">
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-poppins text-carbon-900">{t('verifyMobile')}</h2>
              <p className="text-xs text-carbon-500 leading-normal">{t('verifyMobileDesc')}</p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-carbon-500 uppercase tracking-wide">{t('phone')}</label>
                <div className="flex bg-warm-white border border-forest-100 rounded-2xl p-3 items-center shadow-inner">
                  <span className="text-xs font-bold text-carbon-500 mr-2 border-r border-forest-100 pr-2">+91</span>
                  <input 
                    type="tel" 
                    placeholder="Enter 10 digit number" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full text-xs font-semibold bg-transparent border-none outline-none focus:ring-0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-carbon-500 uppercase tracking-wide">{t('preferredLang')}</label>
                <select 
                  value={currentLang}
                  onChange={handleLanguageChange}
                  className="w-full bg-warm-white border border-forest-100 rounded-2xl p-3 text-xs font-semibold focus:ring-0 focus:border-forest-400 shadow-sm cursor-pointer"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="te">Telugu (తెలుగు)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full ${loading ? 'bg-forest-600' : 'bg-forest-800 hover:bg-forest-900'} text-white text-xs font-bold font-poppins py-4 rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-center gap-1.5`}
              >
                {loading ? 'Processing...' : t('sendOtp')} <ArrowRight size={14} />
              </button>
            </form>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <div className="bg-white/95 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-2xl space-y-6 animate-in fade-in duration-300">
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-poppins text-carbon-900">{t('enterOtp')}</h2>
              <p className="text-xs text-carbon-500 leading-normal">Enter the 4-digit code sent to +91 {phone || '98480 22334'}</p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="flex justify-center gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <input 
                    key={i}
                    type="text" 
                    maxLength={1}
                    value={otp[i-1] || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d?$/.test(val)) {
                        setOtp(otp.slice(0, i-1) + val + otp.slice(i));
                        if (val && i < 4) {
                          e.target.nextSibling?.focus();
                        }
                      }
                    }}
                    className="w-12 h-14 bg-warm-white border border-forest-100 rounded-xl text-center text-lg font-bold text-carbon-800 focus:border-forest-400 focus:ring-0 shadow-inner"
                    required
                  />
                ))}
              </div>

              <div className="text-center">
                <button type="button" className="text-xs font-semibold text-forest-700 hover:underline" onClick={() => setOtp("")}>
                  Resend OTP in 24s
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full ${loading ? 'bg-forest-600' : 'bg-forest-800 hover:bg-forest-900'} text-white text-xs font-bold font-poppins py-4 rounded-2xl shadow-lg transition-all duration-200`}
              >
                {loading ? 'Processing...' : t('continue')}
              </button>
            </form>
          </div>
        )}

        {/* Step 3: Basic Profile */}
        {step === 3 && (
          <div className="bg-white/95 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-2xl space-y-6 animate-in fade-in duration-300">
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-poppins text-carbon-900">{t('farmlandProfile')}</h2>
              <p className="text-xs text-carbon-500 leading-normal">{t('aadhaarDesc')}</p>
            </div>

            <form onSubmit={handleBasicDetails} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-carbon-500 uppercase tracking-wide">{t('fullName')}</label>
                <input 
                  type="text" 
                  placeholder="Ramesh Kumar" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-warm-white border border-forest-100 rounded-2xl p-3 text-xs font-semibold focus:ring-0 shadow-inner"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-carbon-500 uppercase tracking-wide">{t('aadhaarNumber')}</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="XXXX-XXXX-XXXX" 
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, '').slice(0, 12))}
                    className="w-full bg-warm-white border border-forest-100 rounded-2xl p-3 text-xs font-semibold pr-10 focus:ring-0 shadow-inner"
                    required
                  />
                  <ShieldCheck size={18} className="absolute right-3 top-3.5 text-forest-600" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-carbon-500 uppercase tracking-wide">{t('state')}</label>
                  <input 
                    type="text" 
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-warm-white border border-forest-100 rounded-2xl p-3 text-xs font-semibold focus:ring-0 shadow-inner"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-carbon-500 uppercase tracking-wide">{t('district')}</label>
                  <input 
                    type="text" 
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-warm-white border border-forest-100 rounded-2xl p-3 text-xs font-semibold focus:ring-0 shadow-inner"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-carbon-500 uppercase tracking-wide">{t('village')}</label>
                <input 
                  type="text" 
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full bg-warm-white border border-forest-100 rounded-2xl p-3 text-xs font-semibold focus:ring-0 shadow-inner"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full ${loading ? 'bg-forest-600' : 'bg-forest-800 hover:bg-forest-900'} text-white text-xs font-bold font-poppins py-4 rounded-2xl shadow-lg transition-all duration-200`}
              >
                {loading ? 'Processing...' : t('verifyAadhaar')}
              </button>
            </form>
          </div>
        )}

        {/* Step 4: Bank Details */}
        {step === 4 && (
          <div className="bg-white/95 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-2xl space-y-6 animate-in fade-in duration-300">
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-poppins text-carbon-900">{t('directBank')}</h2>
              <p className="text-xs text-carbon-500 leading-normal">{t('bankDesc')}</p>
            </div>

            <form onSubmit={handleBankDetails} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-carbon-500 uppercase tracking-wide">{t('upiId')}</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="example@oksbi" 
                    value={upi}
                    onChange={(e) => setUpi(e.target.value)}
                    className="w-full bg-warm-white border border-forest-100 rounded-2xl p-3 text-xs font-semibold pr-10 focus:ring-0 shadow-inner"
                    required
                  />
                  <Landmark size={18} className="absolute right-3 top-3.5 text-forest-600" />
                </div>
                <p className="text-[10px] text-carbon-400 mt-1">{t('bankInfo')}</p>
              </div>

              <div className="p-4 bg-forest-50 border border-forest-100/50 rounded-2xl text-[10px] text-forest-800 leading-normal">
                {t('upiSecured')}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full ${loading ? 'bg-forest-600' : 'bg-forest-800 hover:bg-forest-900'} text-white text-xs font-bold font-poppins py-4 rounded-2xl shadow-lg transition-all duration-200`}
              >
                {loading ? 'Processing...' : t('linkAccount')}
              </button>
            </form>
          </div>
        )}

        {/* Step 5: Success screen */}
        {step === 5 && (
          <div className="bg-white/95 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-500">
            <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center text-forest-800 mx-auto">
              <CheckCircle2 size={36} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold font-poppins text-carbon-900">{t('profileVerified')}</h2>
              <p className="text-xs text-carbon-500 leading-relaxed px-4">
                {t('profileVerifiedDesc')}
              </p>
            </div>
            <button 
              onClick={() => navigate('/onboarding')}
              className="w-full bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold font-poppins py-4 rounded-2xl shadow-lg hover:shadow-premium transition-all duration-200"
            >
              {t('startTutorial')}
            </button>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-[9px] text-white/80 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        🔒 SSL Secured Encrypted Aadhaar & UPI Verification Public Infrastructure
      </footer>

    </div>
  );
}
