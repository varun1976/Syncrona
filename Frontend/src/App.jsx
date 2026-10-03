import React, { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import AcceptableUsePage from './pages/AcceptableUsePage';
import ContentRemovalPage from './pages/ContentRemovalPage';
import ContactPage from './pages/ContactPage';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';
import { Loader } from 'lucide-react';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div data-theme={theme} className="flex items-center justify-center h-screen neu-bg">
        <div className="p-6 rounded-3xl neu-raised flex flex-col items-center gap-3">
          <Loader className="size-8 animate-spin text-[var(--accent-color,#6366f1)]" />
          <span className="text-xs font-semibold text-[var(--text-secondary,#64748b)] tracking-wider uppercase">Loading Syncrona...</span>
        </div>
      </div>
    );

  const isChatHomePage = location.pathname === "/";

  return (
    <NotificationProvider>
      <div data-theme={theme} className="neu-bg min-h-screen flex flex-col text-[var(--text-primary,#1e293b)]">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
            <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
            <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/cookie-policy" element={<CookiePolicyPage />} />
            <Route path="/acceptable-use" element={<AcceptableUsePage />} />
            <Route path="/content-removal" element={<ContentRemovalPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        {!isChatHomePage && <Footer />}
      </div>
    </NotificationProvider>
  );
}

export default App;