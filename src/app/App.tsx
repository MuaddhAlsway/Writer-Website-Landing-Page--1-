import { useRef, useState, useEffect } from 'react';
import { HeroSectionAr } from '@/app/components/HeroSectionAr';
import { BookStoryAr } from '@/app/components/BookStoryAr';
import { ReaderExperienceAr } from '@/app/components/ReaderExperienceAr';
import { AuthorSectionAr } from '@/app/components/AuthorSectionAr';
import { BookTeaserAr } from '@/app/components/BookTeaserAr';
import { EmailWaitlistAr } from '@/app/components/EmailWaitlistAr';
import { LaunchCountdownAr } from '@/app/components/LaunchCountdownAr';
import { FooterAr } from '@/app/components/FooterAr';
import { AdminLoginAr } from '@/app/components/admin/AdminLoginAr';
import { AdminDashboardAr } from '@/app/components/admin/AdminDashboardAr';
import { ResetPasswordPageAr } from '@/app/components/admin/ResetPasswordPageAr';
import { apiClient } from '@/utils/api';

type View = 'public' | 'login' | 'dashboard' | 'reset-password';

function getInitialView(): View {
  const path = window.location.pathname;
  if (path === '/reset-password') return 'reset-password';
  if (path === '/admin' || path === '/login') return 'login';
  if (path.startsWith('/admin/dashboard')) return 'dashboard';
  return 'public';
}

function getStoredToken(): { token: string; refreshToken: string } | null {
  const token = localStorage.getItem('admin_access_token');
  const refreshToken = localStorage.getItem('admin_refresh_token');
  const expiry = localStorage.getItem('admin_token_expiry');
  if (!token || !expiry) return null;
  if (parseInt(expiry, 10) <= Date.now()) {
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_refresh_token');
    localStorage.removeItem('admin_token_expiry');
    return null;
  }
  return { token, refreshToken: refreshToken || '' };
}

export default function App() {
  const emailSectionRef = useRef<HTMLDivElement>(null);
  const initialView = getInitialView();
  const stored = getStoredToken();

  // If trying to access dashboard without token, show login instead
  const startView: View = initialView === 'dashboard' && !stored ? 'login' : initialView;

  const [view, setView] = useState<View>(startView);
  const [accessToken, setAccessToken] = useState<string | null>(stored?.token || null);

  useEffect(() => {
    if (stored?.token) {
      apiClient.setTokens(stored.token, stored.refreshToken);
    }
    // Set RTL
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'ar');
  }, []);

  const handleLogin = (token: string, refreshToken: string, expiresIn: number = 3600) => {
    const expiryTime = Date.now() + expiresIn * 1000;
    setAccessToken(token);
    apiClient.setTokens(token, refreshToken);
    localStorage.setItem('admin_access_token', token);
    localStorage.setItem('admin_refresh_token', refreshToken);
    localStorage.setItem('admin_token_expiry', expiryTime.toString());
    window.history.pushState({}, '', '/admin/dashboard');
    setView('dashboard');
  };

  const handleLogout = () => {
    setAccessToken(null);
    apiClient.clearTokens();
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_refresh_token');
    localStorage.removeItem('admin_token_expiry');
    window.history.pushState({}, '', '/');
    setView('public');
  };

  if (view === 'reset-password') {
    return <ResetPasswordPageAr />;
  }

  if (view === 'dashboard') {
    if (!accessToken) {
      setView('login');
      return null;
    }
    return <AdminDashboardAr accessToken={accessToken} onLogout={handleLogout} />;
  }

  if (view === 'login') {
    if (accessToken) {
      window.history.pushState({}, '', '/admin/dashboard');
      setView('dashboard');
      return null;
    }
    return <AdminLoginAr onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <HeroSectionAr onJoinClick={() => emailSectionRef.current?.scrollIntoView({ behavior: 'smooth' })} />
      <ReaderExperienceAr />
      <AuthorSectionAr />
      <BookTeaserAr />
      <div ref={emailSectionRef}>
        <EmailWaitlistAr />
      </div>
      <LaunchCountdownAr />
      <FooterAr />
    </div>
  );
}
