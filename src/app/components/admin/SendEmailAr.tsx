import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { apiClient } from '@/utils/api';

interface SendEmailArProps {
  accessToken: string;
}

interface Subscriber {
  email: string;
  name: string;
  language: string;
}

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'color': [] }, { 'background': [] }],
    ['link', 'image'],
    ['clean']
  ],
};

export function SendEmailAr({ accessToken }: SendEmailArProps) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [filterLang, setFilterLang] = useState<'all' | 'en' | 'ar'>('all');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successCount, setSuccessCount] = useState(0);
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
      setError(err.message || 'فشل تحميل المشتركين');
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
      setError('يرجى تحديد مستقبل واحد على الأقل');
      return;
    }

    if (!subject.trim()) {
      setError('الموضوع مطلوب');
      return;
    }

    if (!content.trim()) {
      setError('محتوى الرسالة مطلوب');
      return;
    }

    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      const response = await apiClient.sendEmail(selectedEmails, subject, content);

      setSuccess(true);
      setSuccessCount(response.recipientCount || selectedEmails.length);
      setSubject('');
      setContent('');
      setSelectedEmails([]);

      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      console.error('Send email error:', err);
      setError(err.message || 'فشل إرسال البريد الإلكتروني');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6" dir="rtl">
      {/* Email Composer */}
      <Card className="p-6 bg-white shadow-lg">
        <h2 className="text-2xl font-bold text-stone-900 mb-6">كتابة البريد الإلكتروني</h2>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-green-800 font-medium">تم إرسال البريد الإلكتروني بنجاح!</p>
              <p className="text-xs text-green-600">
                تم الإرسال إلى {successCount} مستقبل
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
              المستقبلون المحددون: {selectedEmails.length}
            </label>
            <p className="text-xs text-stone-500">
              حدد المستقبلين من القائمة على اليسار
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              الموضوع *
            </label>
            <Input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              placeholder="موضوع البريد الإلكتروني..."
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              الرسالة *
            </label>
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={quillModules}
              theme="snow"
              placeholder="اكتب رسالة البريد الإلكتروني هنا..."
              className="bg-white rounded-lg"
            />
          </div>

          <Button
            type="submit"
            disabled={loading || selectedEmails.length === 0}
            className="w-full bg-stone-800 hover:bg-stone-900 text-white"
          >
            {loading ? (
              'جاري الإرسال...'
            ) : (
              <>
                <Send className="w-4 h-4 ml-2" />
                إرسال البريد إلى {selectedEmails.length} مستقبل
              </>
            )}
          </Button>
        </form>
      </Card>

      {/* Recipients List */}
      <Card className="p-6 bg-white shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-stone-900">اختر المستقبلين</h3>
          <select
            value={filterLang}
            onChange={(e) => setFilterLang(e.target.value as any)}
            className="px-3 py-1 border border-stone-300 rounded-lg bg-white text-sm"
          >
            <option value="all">جميع اللغات</option>
            <option value="en">الإنجليزية</option>
            <option value="ar">العربية</option>
          </select>
        </div>

        <div className="mb-4">
          <Button
            onClick={handleSelectAll}
            variant="outline"
            size="sm"
            className="w-full"
          >
            {selectedEmails.length === filteredSubscribers.length ? 'إلغاء تحديد الكل' : 'تحديد الكل'}
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
                  {subscriber.language === 'ar' ? 'عربي' : 'إنجليزي'}
                </span>
              </div>
            </div>
          ))}

          {filteredSubscribers.length === 0 && (
            <p className="text-center text-stone-500 py-8">لا توجد مشتركين متاحين</p>
          )}
        </div>
      </Card>
    </div>
  );
}
