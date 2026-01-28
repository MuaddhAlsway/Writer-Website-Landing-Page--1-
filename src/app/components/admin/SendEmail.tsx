import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { apiClient } from '@/utils/api';

interface SendEmailProps {
  accessToken: string;
}

interface Subscriber {
  email: string;
  name: string;
  language: string;
}

export function SendEmail({ accessToken }: SendEmailProps) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [filterLang, setFilterLang] = useState<'all' | 'en' | 'ar'>('all');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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
    }
  };

  const filteredSubscribers = subscribers.filter(s => 
    filterLang === 'all' || s.language === filterLang
  );

  const handleSelectAll = () => {
    if (selectedEmails.length === filteredSubscribers.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(filteredSubscribers.map(s => s.email));
    }
  };

  const handleToggleEmail = (email: string) => {
    if (selectedEmails.includes(email)) {
      setSelectedEmails(selectedEmails.filter(e => e !== email));
    } else {
      setSelectedEmails([...selectedEmails, email]);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedEmails.length === 0) {
      setError('Please select at least one recipient');
      return;
    }

    if (!subject.trim()) {
      setError('Subject is required');
      return;
    }

    if (!content.trim()) {
      setError('Message content is required');
      return;
    }

    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      // Send email via backend API
      const data = await apiClient.sendEmail(selectedEmails, subject, content);

      setSuccess(true);
      setSubject('');
      setContent('');
      setSelectedEmails([]);

      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      console.error('Send email error:', err);
      setError(err.message || 'Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Email Composer */}
      <Card className="p-6 bg-white shadow-lg">
        <h2 className="text-2xl font-bold text-stone-900 mb-6">Compose Email</h2>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-green-800 font-medium">Email sent successfully!</p>
              <p className="text-xs text-green-600">
                Sent to {selectedEmails.length} recipients
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Recipients Selected: {selectedEmails.length}
            </label>
            <p className="text-xs text-stone-500">
              Select recipients from the list on the right
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Subject *
            </label>
            <Input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              placeholder="Email subject..."
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Message *
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Write your email message here..."
              className="w-full min-h-[300px]"
            />
          </div>

          <Button
            type="submit"
            disabled={loading || selectedEmails.length === 0}
            className="w-full bg-stone-800 hover:bg-stone-900 text-white"
          >
            {loading ? (
              'Sending...'
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Email to {selectedEmails.length} Recipients
              </>
            )}
          </Button>
        </form>
      </Card>

      {/* Recipients List */}
      <Card className="p-6 bg-white shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-stone-900">Select Recipients</h3>
          <select
            value={filterLang}
            onChange={(e) => setFilterLang(e.target.value as any)}
            className="px-3 py-1 border border-stone-300 rounded-lg bg-white text-sm"
          >
            <option value="all">All Languages</option>
            <option value="en">English</option>
            <option value="ar">Arabic</option>
          </select>
        </div>

        <div className="mb-4">
          <Button
            onClick={handleSelectAll}
            variant="outline"
            size="sm"
            className="w-full"
          >
            {selectedEmails.length === filteredSubscribers.length ? 'Deselect All' : 'Select All'}
          </Button>
        </div>

        <div className="max-h-[500px] overflow-y-auto space-y-2">
          {filteredSubscribers.map((subscriber) => (
            <div
              key={subscriber.email}
              onClick={() => handleToggleEmail(subscriber.email)}
              className={`p-3 border rounded-lg cursor-pointer transition-all ${
                selectedEmails.includes(subscriber.email)
                  ? 'border-stone-800 bg-stone-50'
                  : 'border-stone-200 hover:border-stone-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedEmails.includes(subscriber.email)}
                  onChange={() => handleToggleEmail(subscriber.email)}
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-stone-900">{subscriber.email}</p>
                  {subscriber.name && (
                    <p className="text-xs text-stone-600">{subscriber.name}</p>
                  )}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  subscriber.language === 'ar' 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {subscriber.language === 'ar' ? 'AR' : 'EN'}
                </span>
              </div>
            </div>
          ))}

          {filteredSubscribers.length === 0 && (
            <p className="text-center text-stone-500 py-8">No subscribers available</p>
          )}
        </div>
      </Card>
    </div>
  );
}
