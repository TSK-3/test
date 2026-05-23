import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PrototypeNav from './components/PrototypeNav';
import { LanguageProvider } from './context/LanguageContext';

// Importing pages
import LandingPage from './pages/LandingPage';
import RoleSelection from './pages/RoleSelection';
import FarmerRegister from './pages/FarmerRegister';
import FarmerLogin from './pages/FarmerLogin';
import WelcomeTutorial from './pages/WelcomeTutorial';
import FarmMapRegistration from './pages/FarmMapRegistration';
import FarmDetailsForm from './pages/FarmDetailsForm';
import SatellitePreview from './pages/SatellitePreview';
import SuccessScreen from './pages/SuccessScreen';
import FarmOwnershipVerification from './pages/FarmOwnershipVerification';
import VerificationSuccess from './pages/VerificationSuccess';
import FarmerDashboard from './pages/FarmerDashboard';
import DetailedFarmAnalytics from './pages/DetailedFarmAnalytics';
import CarbonWallet from './pages/CarbonWallet';
import Marketplace from './pages/Marketplace';
import CorporateWelcome from './pages/CorporateWelcome';
import CreateListing from './pages/CreateListing';
import CorporateCreditAnalysis from './pages/CorporateCreditAnalysis';
import CorporateDashboard from './pages/CorporateDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SupportCenter from './pages/SupportCenter';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/farmer-login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public & Authentication */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/role-selection" element={<RoleSelection />} />
            <Route path="/farmer-register" element={<FarmerRegister />} />
            <Route path="/farmer-login" element={<FarmerLogin />} />
            <Route path="/onboarding" element={<WelcomeTutorial />} />

            {/* Farm Land Mapping & Verification */}
            <Route path="/farm-map" element={<ProtectedRoute><FarmMapRegistration /></ProtectedRoute>} />
            <Route path="/farm-details" element={<ProtectedRoute><FarmDetailsForm /></ProtectedRoute>} />
            <Route path="/satellite-preview" element={<ProtectedRoute><SatellitePreview /></ProtectedRoute>} />
            <Route path="/submission-success" element={<ProtectedRoute><SuccessScreen /></ProtectedRoute>} />
            <Route path="/farm-verification" element={<ProtectedRoute><FarmOwnershipVerification /></ProtectedRoute>} />
            <Route path="/verification-success" element={<ProtectedRoute><VerificationSuccess /></ProtectedRoute>} />

            {/* Core Dashboards */}
            <Route path="/farmer-dashboard" element={<ProtectedRoute><FarmerDashboard /></ProtectedRoute>} />
            <Route path="/farm-analytics" element={<ProtectedRoute><DetailedFarmAnalytics /></ProtectedRoute>} />
            <Route path="/wallet" element={<ProtectedRoute><CarbonWallet /></ProtectedRoute>} />
            <Route path="/support" element={<ProtectedRoute><SupportCenter /></ProtectedRoute>} />

            {/* Marketplace & Portals */}
            <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
            <Route path="/corporate-welcome" element={<ProtectedRoute><CorporateWelcome /></ProtectedRoute>} />
            <Route path="/create-listing" element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
            <Route path="/credit-analysis/:id" element={<ProtectedRoute><CorporateCreditAnalysis /></ProtectedRoute>} />
            <Route path="/corporate-dashboard" element={<ProtectedRoute><CorporateDashboard /></ProtectedRoute>} />
            <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          </Routes>

          {/* Floating Interactive Demo Navigator */}
          <PrototypeNav />
        </Layout>
      </Router>
    </LanguageProvider>
  );
}
