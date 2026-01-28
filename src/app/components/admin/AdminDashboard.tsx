import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Users, Mail, TrendingUp, LogOut, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { SubscribersList } from './SubscribersList';
import { NewsletterManager } from './NewsletterManager';
import { DashboardStats } from './DashboardStats';
import { apiClient } from '@/utils/api';

interface AdminDashboardProps {
  accessToken: string;
  onLogout: () => void;
}

interface Stats {
  totalSubscribers: number;
  activeSubscribers: number;
  monthlyStats: Array<{ month: string; count: number }>;
}

export function AdminDashboard({ accessToken, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'subscribers' | 'newsletter'>('overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient.setToken(accessToken);
    loadStats();
  }, [accessToken]);

  const loadStats = async () => {
    try {
      setError('');
      const data = await apiClient.getSubscriberStats();
      setStats(data);
    } catch (err: any) {
      console.error('Failed to load stats:', err);
      setError(err.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'subscribers', label: 'Subscribers', icon: Users },
    { id: 'newsletter', label: 'Newsletters', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/30">
      {/* Header */}
      <header className="bg-stone-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-stone-400 text-sm">Writer Website Management</p>
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

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 py-4 mt-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {!loading && stats && (
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-600 mb-1">Total Subscribers</p>
                  <p className="text-3xl font-bold text-stone-900">{stats.totalSubscribers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-600 mb-1">Active Subscribers</p>
                  <p className="text-3xl font-bold text-stone-900">{stats.activeSubscribers}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-600 mb-1">This Month</p>
                  <p className="text-3xl font-bold text-stone-900">
                    {stats.monthlyStats[stats.monthlyStats.length - 1]?.count || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 bg-white shadow-lg animate-pulse">
                <div className="h-20 bg-stone-200 rounded"></div>
              </Card>
            ))}
          </div>
        </div>
      )}

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
          {activeTab === 'overview' && stats && (
            <DashboardStats stats={stats} onRefresh={loadStats} />
          )}
          
          {activeTab === 'subscribers' && (
            <SubscribersList accessToken={accessToken} onUpdate={loadStats} />
          )}
          
          {activeTab === 'email' && (
            <SendEmail accessToken={accessToken} />
          )}
          
          {activeTab === 'newsletter' && (
            <NewsletterManager accessToken={accessToken} />
          )}
        </div>
      </div>
    </div>
  );
}
