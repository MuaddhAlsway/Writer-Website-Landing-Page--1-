import { useState, useEffect } from 'react';
import { Send, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { apiClient } from '@/utils/api-client';

interface NewsletterManagerProps {
  accessToken: string;
}

export function NewsletterManager({ accessToken }: NewsletterManagerProps) {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [newsletters, setNewsletters] = useState<any[]>([]);

  useEffect(() => {
    apiClient.setToken(accessToken);
    loadNewsletters();
  }, [accessToken]);

  const loadNewsletters = async () => {
    const result = await apiClient.getNewsletters();
    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setNewsletters(result.newsletters || []);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !content.trim()) {
      setMessage({ type: 'error', text: 'Subject and content are required' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Get subscribers first
      const subResp = await fetch('/api/subscribers', {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      if (!subResp.ok) throw new Error('Failed to load subscribers');
      const { subscribers } = await subResp.json();

      if (!subscribers || subscribers.length === 0) {
        setMessage({ type: 'error', text: 'No subscribers to send to' });
        setLoading(false);
        return;
      }

      const recipients = subscribers.map((s: any) => s.email);

      // Send via send-email endpoint (proxies to Vercel → Gmail)
      const result = await apiClient.sendEmail(recipients, subject, content);

      setMessage({
        type: 'success',
        text: `Newsletter sent to ${result.sentCount ?? result.sent ?? recipients.length} subscribers`,
      });
      setSubject('');
      setContent('');
      await loadNewsletters();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to send newsletter' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Send Newsletter Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Send Newsletter</h2>

        {message && (
          <div
            className={`mb-4 p-4 rounded-lg flex items-start gap-3 ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <p
              className={
                message.type === 'success'
                  ? 'text-green-900'
                  : 'text-red-900'
              }
            >
              {message.text}
            </p>
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Newsletter subject"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Newsletter content (supports HTML)"
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Newsletter
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Recent Newsletters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Newsletters</h2>

        {newsletters.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No newsletters sent yet</p>
        ) : (
          <div className="space-y-3">
            {newsletters.map((newsletter) => (
              <div
                key={newsletter.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{newsletter.subject}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Sent to {newsletter.recipientCount} subscribers
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(newsletter.sentAt).toLocaleString()}
                    </p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
