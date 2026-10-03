import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';
import { Loader } from 'lucide-react';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div data-theme={theme} className="flex items-center justify-center h-screen neu-bg">
        <div className="p-6 rounded-3xl neu-raised flex flex-col items-center gap-3">
          <Loader className="size-8 animate-spin text-indigo-600" />
          <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Loading Syncrona...</span>
        </div>
      </div>
    );

  return (
    <NotificationProvider>
      <div data-theme={theme} className="neu-bg min-h-screen text-slate-800">
        <Navbar />
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </NotificationProvider>
  );
}

export default App;