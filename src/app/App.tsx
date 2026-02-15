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

export default function App() {
  const emailSectionRef = useRef<HTMLDivElement>(null);
  const [isArabic, setIsArabic] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [tokenExpiry, setTokenExpiry] = useState<number | null>(null);

  // Check if we're on admin route
  const isAdminRoute = window.location.pathname === '/admin';
  const isResetPasswordRoute = window.location.pathname === '/reset-password';

  const scrollToEmailSection = () => {
    emailSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Restore token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('admin_access_token');
    const storedRefreshToken = localStorage.getItem('admin_refresh_token');
    const storedExpiry = localStorage.getItem('admin_token_expiry');
    
    if (storedToken && storedExpiry) {
      const expiryTime = parseInt(storedExpiry, 10);
      if (expiryTime > Date.now()) {
        setAccessToken(storedToken);
        setTokenExpiry(expiryTime);
        if (storedRefreshToken) {
          apiClient.setTokens(storedToken, storedRefreshToken);
        }
      } else {
        // Token expired, clear it
        localStorage.removeItem('admin_access_token');
        localStorage.removeItem('admin_refresh_token');
        localStorage.removeItem('admin_token_expiry');
      }
    }
  }, []);

  useEffect(() => {
    if (isArabic) {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'en');
    }
  }, [isArabic]);

  const handleLogin = (token: string, refreshToken: string, expiresIn: number = 3600) => {
    const expiryTime = Date.now() + expiresIn * 1000;
    setAccessToken(token);
    setTokenExpiry(expiryTime);
    apiClient.setTokens(token, refreshToken);
    localStorage.setItem('admin_access_token', token);
    localStorage.setItem('admin_refresh_token', refreshToken);
    localStorage.setItem('admin_token_expiry', expiryTime.toString());
  };

  const handleLogout = () => {
    setAccessToken(null);
    setTokenExpiry(null);
    apiClient.clearTokens();
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_refresh_token');
    localStorage.removeItem('admin_token_expiry');
    window.location.href = '/';
  };

  // Admin Dashboard View
  if (isAdminRoute && accessToken) {
    return <AdminDashboardAr accessToken={accessToken} onLogout={handleLogout} />;
  }

  // Reset Password View
  if (isResetPasswordRoute) {
    return <ResetPasswordPageAr />;
  }

  // Admin Login View
  if (isAdminRoute && !accessToken) {
    return <AdminLoginAr onLogin={handleLogin} />;
  }

  // Public Website View
  return (
    <div className="min-h-screen bg-stone-50">
      <>
        <HeroSectionAr onJoinClick={scrollToEmailSection} />
        <BookStoryAr />
        <ReaderExperienceAr />
        <AuthorSectionAr />
        <BookTeaserAr />
        <div ref={emailSectionRef}>
          <EmailWaitlistAr />
        </div>
        <LaunchCountdownAr />
        <FooterAr />
      </>
    </div>
  );
}
