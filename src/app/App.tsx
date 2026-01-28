import { useRef, useState, useEffect } from 'react';
import { HeroSection } from '@/app/components/HeroSection';
import { BookStory } from '@/app/components/BookStory';
import { ReaderExperience } from '@/app/components/ReaderExperience';
import { AuthorSection } from '@/app/components/AuthorSection';
import { BookTeaser } from '@/app/components/BookTeaser';
import { EmailWaitlist } from '@/app/components/EmailWaitlist';
import { LaunchCountdown } from '@/app/components/LaunchCountdown';
import { Footer } from '@/app/components/Footer';
import { HeroSectionAr } from '@/app/components/HeroSectionAr';
import { BookStoryAr } from '@/app/components/BookStoryAr';
import { ReaderExperienceAr } from '@/app/components/ReaderExperienceAr';
import { AuthorSectionAr } from '@/app/components/AuthorSectionAr';
import { BookTeaserAr } from '@/app/components/BookTeaserAr';
import { EmailWaitlistAr } from '@/app/components/EmailWaitlistAr';
import { LaunchCountdownAr } from '@/app/components/LaunchCountdownAr';
import { FooterAr } from '@/app/components/FooterAr';
import { AdminLogin } from '@/app/components/admin/AdminLogin';
import { AdminDashboard } from '@/app/components/admin/AdminDashboard';
import { Languages } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { apiClient } from '@/utils/api';

export default function App() {
  const emailSectionRef = useRef<HTMLDivElement>(null);
  const [isArabic, setIsArabic] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [tokenExpiry, setTokenExpiry] = useState<number | null>(null);

  // Check if we're on admin route
  const isAdminRoute = window.location.pathname === '/admin';

  const scrollToEmailSection = () => {
    emailSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Restore token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('admin_token');
    const storedExpiry = localStorage.getItem('admin_token_expiry');
    
    if (storedToken && storedExpiry) {
      const expiryTime = parseInt(storedExpiry, 10);
      if (expiryTime > Date.now()) {
        setAccessToken(storedToken);
        setTokenExpiry(expiryTime);
        apiClient.setToken(storedToken);
      } else {
        // Token expired, clear it
        localStorage.removeItem('admin_token');
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

  const handleLogin = (token: string, expiresIn: number = 3600) => {
    const expiryTime = Date.now() + expiresIn * 1000;
    setAccessToken(token);
    setTokenExpiry(expiryTime);
    apiClient.setToken(token);
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_token_expiry', expiryTime.toString());
  };

  const handleLogout = () => {
    setAccessToken(null);
    setTokenExpiry(null);
    apiClient.setToken(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_token_expiry');
    window.location.href = '/';
  };

  // Admin Dashboard View
  if (isAdminRoute && accessToken) {
    return <AdminDashboard accessToken={accessToken} onLogout={handleLogout} />;
  }

  // Admin Login View
  if (isAdminRoute && !accessToken) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  // Public Website View
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Language Toggle Button */}
      <div className="fixed top-6 right-6 z-50 rtl:right-auto rtl:left-6 flex gap-3">
        <Button
          onClick={() => setIsArabic(!isArabic)}
          size="lg"
          className="bg-stone-800/90 hover:bg-stone-900 text-white px-6 py-3 rounded-full shadow-lg backdrop-blur-sm flex items-center gap-2"
        >
          <Languages className="w-5 h-5" />
          <span>{isArabic ? 'EN' : 'عربي'}</span>
        </Button>
      </div>

      {isArabic ? (
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
      ) : (
        <>
          <HeroSection onJoinClick={scrollToEmailSection} />
          <BookStory />
          <ReaderExperience />
          <AuthorSection />
          <BookTeaser />
          <div ref={emailSectionRef}>
            <EmailWaitlist />
          </div>
          <LaunchCountdown />
          <Footer />
        </>
      )}
    </div>
  );
}
