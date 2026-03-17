import { useState, useEffect } from 'react';
import { Users, Mail, LogOut, Settings, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { SubscribersList } from './SubscribersList';
import { NewsletterManager } from './NewsletterManager';
import { AccountSettings } from './AccountSettings';
import { apiClient } from '@/utils/api';

interface AdminDashboardProps {
  accessToken: string;
  onLogout: () => void;
}

export function AdminDashboard({ accessToken, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'subscribers' | 'newsletter' | 'account'>('subscribers');
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
    { id: 'subscribers', label: 'Subscribers', icon: Users },
    { id: 'newsletter', label: 'Newsletters', icon: Mail },
    { id: 'account', label: 'Account', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/30">
      {/* Header with Status */}
      <header className="bg-stone-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-stone-400 text-sm">Manage your author website</p>
          </div>
          
          {/* Status Indicator */}
          <div className="flex items-center gap-3">
            {backendStatus === 'connected' && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-900/30 rounded-full border border-green-500/50">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-300">Connected</span>
              </div>
            )}
            {backendStatus === 'error' && (
              <div className="flex items-center gap-2 px-3 py-1 bg-red-900/30 rounded-full border border-red-500/50">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-sm text-red-300">Connection Error</span>
              </div>
            )}
            {backendStatus === 'checking' && (
              <div className="flex items-center gap-2 px-3 py-1 bg-yellow-900/30 rounded-full border border-yellow-500/50">
                <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-yellow-300">Checking</span>
              </div>
            )}
          </div>
          
          <Button
            onClick={onLogout}
            variant="outline"
            className="bg-transparent border-stone-700 text-white hover:bg-stone-800"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
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
            <SubscribersList accessToken={accessToken} onUpdate={() => {}} />
          )}
          
          {activeTab === 'newsletter' && (
            <NewsletterManager accessToken={accessToken} />
          )}

          {activeTab === 'account' && (
            <AccountSettings accessToken={accessToken} />
          )}
        </div>
      </div>
    </div>
  );
}
