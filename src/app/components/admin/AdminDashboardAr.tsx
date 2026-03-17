import { useState, useEffect } from 'react';
import { Users, Mail, LogOut, Settings, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { SubscribersListAr } from './SubscribersListAr';
import { NewsletterManagerAr } from './NewsletterManagerAr';
import { SendEmailAr } from './SendEmailAr';
import { AccountSettingsAr } from './AccountSettingsArNew';
import { apiClient } from '@/utils/api';

interface AdminDashboardArProps {
  accessToken: string;
  onLogout: () => void;
}

export function AdminDashboardAr({ accessToken, onLogout }: AdminDashboardArProps) {
  const [activeTab, setActiveTab] = useState<'subscribers' | 'newsletter' | 'email' | 'account'>('subscribers');
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  useEffect(() => {
    apiClient.setToken(accessToken);
    checkBackendStatus();
  }, [accessToken]);

  const checkBackendStatus = async () => {
    try {
      setBackendStatus('checking');
      const response = await fetch('/api/subscribers', {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      if (response.ok) {
        setBackendStatus('connected');
      } else {
        setBackendStatus('error');
      }
    } catch (err) {
      console.error('Backend status check failed:', err);
      setBackendStatus('error');
    }
  };

  const tabs = [
    { id: 'subscribers', label: 'المشتركون', icon: Users },
    { id: 'email', label: 'إرسال بريد', icon: Mail },
    { id: 'newsletter', label: 'النشرات البريدية', icon: Mail },
    { id: 'account', label: 'الحساب', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/30" dir="rtl">
      {/* Header */}
      <header className="bg-stone-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-right">
            <h1 className="text-2xl font-bold">لوحة التحكم</h1>
            <p className="text-stone-400 text-sm">إدارة موقع الكاتبة</p>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            className="bg-transparent border-stone-700 text-white hover:bg-stone-800"
          >
            <LogOut className="w-4 h-4 ml-2" />
            تسجيل الخروج
          </Button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-md p-2 mb-6">
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="pb-12">
          {activeTab === 'subscribers' && (
            <SubscribersListAr accessToken={accessToken} onUpdate={() => {}} />
          )}
          
          {activeTab === 'email' && (
            <SendEmailAr accessToken={accessToken} />
          )}
          
          {activeTab === 'newsletter' && (
            <NewsletterManagerAr accessToken={accessToken} />
          )}

          {activeTab === 'account' && (
            <AccountSettingsAr accessToken={accessToken} />
          )}
        </div>
      </div>
    </div>
  );
}
