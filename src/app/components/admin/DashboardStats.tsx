import { useState, useEffect } from 'react';
import { Users, Mail, CheckCircle, AlertCircle } from 'lucide-react';

const API = 'https://writer-website-landing-page-1.vercel.app/api';

interface DashboardStatsProps {
  accessToken: string;
}

export function DashboardStats({ accessToken }: DashboardStatsProps) {
  const [stats, setStats] = useState({
    subscribers: 0,
    newsletters: 0,
    loading: true,
    error: null as string | null,
  });

  useEffect(() => {
    loadStats();
  }, [accessToken]);

  const loadStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));

      const [subscribersRes, newslettersRes] = await Promise.all([
        fetch('/api/subscribers', {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }),
        fetch('/api/newsletters', {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }),
      ]);

      const subscribersData = await subscribersRes.json();
      const newslettersData = await newslettersRes.json();

      if (!subscribersRes.ok || !newslettersRes.ok) {
        setStats(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load stats',
        }));
        return;
      }

      setStats({
        subscribers: subscribersData.subscribers?.length || 0,
        newsletters: newslettersData.newsletters?.length || 0,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      setStats(prev => ({
        ...prev,
        loading: false,
        error: err.message || 'Failed to load stats',
      }));
    }
  };

  const StatCard = ({ icon: Icon, label, value, error }: any) => (
    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {error ? '—' : value}
          </p>
        </div>
        <Icon className="w-12 h-12 text-blue-500 opacity-20" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {stats.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-900 font-medium">Error loading stats</p>
            <p className="text-red-700 text-sm">{stats.error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          icon={Users}
          label="Total Subscribers"
          value={stats.subscribers}
          error={stats.error}
        />
        <StatCard
          icon={Mail}
          label="Newsletters Sent"
          value={stats.newsletters}
          error={stats.error}
        />
      </div>

      {stats.loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading stats...</span>
        </div>
      )}
    </div>
  );
}
