import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Send, Plus, Trash2, Mail, Calendar, AlertCircle, CheckCircle, Eye } from 'lucide-react';
import { apiClient } from '@/utils/api';
import { newsletterTemplatesAr, moreTemplatesAr } from './NewsletterTemplatesAr';

interface Newsletter {
  id: string;
  subject: string;
  content: string;
  language: string;
  createdAt: string;
  sentAt: string | null;
  recipientCount: number;
}

interface NewsletterManagerArProps {
  accessToken: string;
}

interface Modal {
  type: 'confirm' | 'success' | 'error' | 'preview' | 'templates';
  title: string;
  message: string;
  action?: () => void;
  content?: string;
}

const allTemplates = { ...newsletterTemplatesAr, ...moreTemplatesAr };

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

export function NewsletterManagerAr({ accessToken }: NewsletterManagerArProps) {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState<'en' | 'ar' | 'both'>('both');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState<string | null>(null);
  const [modal, setModal] = useState<Modal | null>(null);

  useEffect(() => {
    apiClient.setToken(accessToken);
    loadNewsletters();
  }, [accessToken]);

  const loadNewsletters = async () => {
    try {
      setError('');
      const data = await apiClient.getNewsletters();
      setNewsletters(data.newsletters || []);
    } catch (err: any) {
      console.error('Failed to load newsletters:', err);
      setError(err.message || 'فشل تحميل النشرات البريدية');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!subject.trim()) throw new Error('الموضوع مطلوب');
      if (!content.trim()) throw new Error('المحتوى مطلوب');

      await apiClient.createNewsletter(subject, content, language === 'both' ? '' : language);
      setSubject('');
      setContent('');
      setLanguage('both');
      setShowCreateForm(false);
      loadNewsletters();
    } catch (err: any) {
      setError(err.message || 'فشل إنشاء النشرة البريدية');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Image upload functionality can be added later if needed
    return;
  };

  const applyTemplate = (templateKey: keyof typeof allTemplates) => {
    const template = allTemplates[templateKey];
    setSubject(template.subject);
    setContent(template.content);
    setShowCreateForm(true);
    setModal(null);
  };

  const handleSend = async (id: string) => {
    setModal({
      type: 'confirm',
      title: 'إرسال النشرة البريدية',
      message: 'هل أنت متأكد من رغبتك في إرسال هذه النشرة البريدية إلى جميع المشتركين؟',
      action: async () => {
        setSending(id);
        try {
          // Send the newsletter - the backend will fetch subscribers and return count
          const result = await apiClient.sendNewsletter(id);
          const count = result.count || result.recipientCount || 0;
          
          setModal({
            type: 'success',
            title: 'تم الإرسال',
            message: `تم إرسال النشرة البريدية بنجاح إلى ${count} مستقبل!`,
          });
          loadNewsletters();
        } catch (err: any) {
          setModal({
            type: 'error',
            title: 'خطأ',
            message: err.message || 'فشل إرسال النشرة البريدية',
          });
        } finally {
          setSending(null);
        }
      },
    });
  };

  const handleDelete = async (id: string) => {
    setModal({
      type: 'confirm',
      title: 'حذف النشرة البريدية',
      message: 'هل أنت متأكد من رغبتك في حذف هذه النشرة البريدية؟',
      action: async () => {
        try {
          await apiClient.deleteNewsletter(id);
          setNewsletters(newsletters.filter(n => n.id !== id));
          setModal({
            type: 'success',
            title: 'تم الحذف',
            message: 'تم حذف النشرة البريدية بنجاح',
          });
        } catch (err: any) {
          setModal({
            type: 'error',
            title: 'خطأ',
            message: err.message || 'فشل حذف النشرة البريدية',
          });
        }
      },
    });
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-stone-900">إدارة النشرات البريدية</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setModal({ type: 'templates', title: 'قوالب النشرات البريدية', message: '' })}
            variant="outline"
            className="text-stone-700"
          >
            📋 القوالب
          </Button>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-stone-800 hover:bg-stone-900 text-white"
          >
            <Plus className="w-4 h-4 ml-2" />
            إنشاء نشرة بريدية
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {showCreateForm && (
        <Card className="p-6 bg-white shadow-lg">
          <h3 className="text-lg font-semibold text-stone-900 mb-4">نشرة بريدية جديدة</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">الموضوع *</label>
              <Input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                placeholder="موضوع النشرة البريدية..."
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">اللغة المستهدفة</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg bg-white"
              >
                <option value="both">جميع المشتركين</option>
                <option value="en">الإنجليزية فقط</option>
                <option value="ar">العربية فقط</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">المحتوى *</label>
              <ReactQuill
                value={content}
                onChange={setContent}
                modules={quillModules}
                theme="snow"
                placeholder="اكتب محتوى النشرة البريدية هنا..."
                className="bg-white rounded-lg"
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading} className="flex-1 bg-stone-800 hover:bg-stone-900 text-white">
                {loading ? 'جاري الإنشاء...' : 'إنشاء نشرة بريدية'}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  if (content.trim()) {
                    setModal({ type: 'preview', title: 'معاينة', message: '', content: content });
                  }
                }}
                variant="outline"
              >
                <Eye className="w-4 h-4 ml-2" />
                معاينة
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setSubject('');
                  setContent('');
                }}
                variant="outline"
              >
                إلغاء
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {newsletters.map((newsletter) => (
            <Card key={newsletter.id} className="p-6 bg-white shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-stone-900 mb-2">{newsletter.subject}</h3>
                  <div className="flex gap-4 text-sm text-stone-600 mb-3 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {newsletter.createdAt ? (() => {
                        try {
                          const date = new Date(newsletter.createdAt);
                          return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('ar-SA');
                        } catch {
                          return 'N/A';
                        }
                      })() : 'N/A'}
                    </span>
                    {newsletter.language && (
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        newsletter.language === 'ar' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {newsletter.language === 'ar' ? 'عربي' : 'إنجليزي'}
                      </span>
                    )}
                  </div>
                  <div className="text-stone-700 line-clamp-3 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: newsletter.content.substring(0, 200) }} />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                <div>
                  {newsletter.sentAt ? (
                    <div className="text-sm">
                      <span className="text-green-600 font-medium">✓ تم الإرسال</span>
                      <span className="text-stone-600 ml-2">
                        إلى {newsletter.recipientCount} مستقبل في {(() => {
                          try {
                            const date = new Date(newsletter.sentAt);
                            return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('ar-SA');
                          } catch {
                            return 'N/A';
                          }
                        })()}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-amber-600 font-medium">مسودة</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleSend(newsletter.id)}
                    disabled={sending === newsletter.id}
                    size="sm"
                    className="bg-stone-800 hover:bg-stone-900 text-white"
                  >
                    <Send className="w-4 h-4 ml-2" />
                    {sending === newsletter.id ? 'جاري الإرسال...' : newsletter.sentAt ? 'إعادة الإرسال' : 'إرسال الآن'}
                  </Button>
                  <Button
                    onClick={() => handleDelete(newsletter.id)}
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6" dir="rtl">
              <h2 className="text-2xl font-bold text-stone-900 mb-4 text-right">{modal.title}</h2>
              
              {modal.type === 'templates' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" dir="rtl">
                  {Object.entries(allTemplates).map(([key, template]: [string, any]) => (
                    <button
                      key={key}
                      onClick={() => applyTemplate(key as keyof typeof allTemplates)}
                      className="p-4 border-2 border-stone-200 rounded-lg hover:border-stone-800 hover:bg-stone-50 transition text-right"
                    >
                      <h3 className="font-semibold text-stone-900 mb-2">{template?.name || key}</h3>
                      <p className="text-sm text-stone-600 line-clamp-2">{template?.subject || 'قالب نشرة بريدية'}</p>
                    </button>
                  ))}
                </div>
              )}

              {modal.type === 'preview' && modal.content && (
                <div className="prose prose-sm max-w-none bg-stone-50 p-4 rounded-lg" dangerouslySetInnerHTML={{ __html: modal.content }} />
              )}

              {(modal.type === 'confirm' || modal.type === 'success' || modal.type === 'error') && (
                <p className="text-stone-700 mb-6">{modal.message}</p>
              )}

              <div className="flex gap-3 justify-end">
                {modal.type === 'confirm' && (
                  <>
                    <Button onClick={() => setModal(null)} variant="outline">إلغاء</Button>
                    <Button
                      onClick={() => {
                        modal.action?.();
                        setModal(null);
                      }}
                      className="bg-stone-800 hover:bg-stone-900 text-white"
                    >
                      تأكيد
                    </Button>
                  </>
                )}

                {(modal.type === 'success' || modal.type === 'error' || modal.type === 'preview' || modal.type === 'templates') && (
                  <Button onClick={() => setModal(null)} className="bg-stone-800 hover:bg-stone-900 text-white">
                    إغلاق
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
