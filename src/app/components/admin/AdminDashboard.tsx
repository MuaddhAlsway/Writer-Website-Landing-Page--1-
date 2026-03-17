import { useState, useEffect } from 'react';
import { Users, Mail, LogOut, Settings } from 'lucide-react';
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

  useEffect(() => {
    apiClient.setToken(accessToken);
  }, [accessToken]);

  const tabs = [
    { id: 'subscribers', label: 'Subscribers', icon: Users },
    { id: 'newsletter', label: 'Newsletters', icon: Mail },
    { id: 'account', label: 'Account', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/30">
      {/* Header */}
      <header className="bg-stone-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-stone-400 text-sm">Manage your author website</p>
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
