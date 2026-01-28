import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Trash2, Download, Search, AlertCircle } from 'lucide-react';
import { apiClient } from '@/utils/api';

interface Subscriber {
  email: string;
  name: string;
  language: string;
  subscribedAt: string;
  isActive: boolean;
}

interface SubscribersListProps {
  accessToken: string;
  onUpdate: () => void;
}

export function SubscribersList({ accessToken, onUpdate }: SubscribersListProps) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLang, setFilterLang] = useState<'all' | 'en' | 'ar'>('all');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    apiClient.setToken(accessToken);
    loadSubscribers();
  }, [accessToken]);

  const loadSubscribers = async () => {
    try {
      setError('');
      const data = await apiClient.getSubscribers();
      setSubscribers(data.subscribers || []);
    } catch (err: any) {
      console.error('Failed to load subscribers:', err);
      setError(err.message || 'Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (email: string) => {
    if (!confirm(`Are you sure you want to delete ${email}?`)) return;

    setDeleting(email);
    try {
      await apiClient.deleteSubscriber(email);
      setSubscribers(subscribers.filter(s => s.email !== email));
      onUpdate();
    } catch (err: any) {
      console.error('Failed to delete subscriber:', err);
      alert(err.message || 'Failed to delete subscriber');
    } finally {
      setDeleting(null);
    }
  };

  const handleExport = () => {
    const csv = [
      ['Email', 'Name', 'Language', 'Subscribed Date', 'Status'],
      ...filteredSubscribers.map(s => [
        s.email,
        s.name || '',
        s.language,
        new Date(s.subscribedAt).toLocaleDateString(),
        s.isActive ? 'Active' : 'Inactive'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const filteredSubscribers = subscribers
    .filter(s => {
      const matchesSearch = s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesLang = filterLang === 'all' || s.language === filterLang;
      return matchesSearch && matchesLang;
    })
    .sort((a, b) => new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime());

  if (loading) {
    return (
      <Card className="p-8 bg-white shadow-lg text-center">
        <p className="text-stone-600">Loading subscribers...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full md:max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <Input
            type="text"
            placeholder="Search by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={filterLang}
            onChange={(e) => setFilterLang(e.target.value as any)}
            className="px-4 py-2 border border-stone-300 rounded-lg bg-white"
          >
            <option value="all">All Languages</option>
            <option value="en">English</option>
            <option value="ar">Arabic</option>
          </select>

          <Button onClick={handleExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card className="bg-white shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="text-left py-3 px-4 text-stone-700 font-semibold">Email</th>
                <th className="text-left py-3 px-4 text-stone-700 font-semibold">Name</th>
                <th className="text-left py-3 px-4 text-stone-700 font-semibold">Language</th>
                <th className="text-left py-3 px-4 text-stone-700 font-semibold">Subscribed</th>
                <th className="text-center py-3 px-4 text-stone-700 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-stone-500">
                    No subscribers found
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.email} className="border-b border-stone-100 hover:bg-stone-50">
                    <td className="py-3 px-4 text-stone-900">{subscriber.email}</td>
                    <td className="py-3 px-4 text-stone-600">{subscriber.name || '-'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        subscriber.language === 'ar' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {subscriber.language === 'ar' ? 'Arabic' : 'English'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      {new Date(subscriber.subscribedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Button
                        onClick={() => handleDelete(subscriber.email)}
                        disabled={deleting === subscriber.email}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-stone-50 border-t border-stone-200">
          <p className="text-sm text-stone-600">
            Showing {filteredSubscribers.length} of {subscribers.length} subscribers
          </p>
        </div>
      </Card>
    </div>
  );
}
