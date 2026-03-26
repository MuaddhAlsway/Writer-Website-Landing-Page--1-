import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Trash2, Download, Search, AlertCircle, AlertTriangle } from 'lucide-react';
import { apiClient } from '@/utils/api';

interface Subscriber {
  email: string;
  name: string;
  language: string;
  subscribedAt: string;
  isActive: boolean;
}

interface SubscribersListArProps {
  accessToken: string;
  onUpdate: () => void;
}

interface DeleteDialogProps {
  email: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

function DeleteConfirmDialog({ email, onConfirm, onCancel, loading }: DeleteDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" dir="rtl">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">تأكيد الحذف</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              هل أنت متأكد من حذف المشترك
            </p>
            <p className="text-stone-900 font-semibold text-sm mt-1 break-all">{email}</p>
            <p className="text-stone-500 text-xs mt-2">لا يمكن التراجع عن هذا الإجراء</p>
          </div>
          <div className="flex gap-3 w-full mt-2">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 border-stone-300 text-stone-700 hover:bg-stone-50"
              disabled={loading}
            >
              إلغاء
            </Button>
            <Button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? 'جاري الحذف...' : 'حذف'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SubscribersListAr({ accessToken, onUpdate }: SubscribersListArProps) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLang, setFilterLang] = useState<'all' | 'en' | 'ar'>('all');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

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
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (email: string) => {
    setDeleteTarget(email);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(deleteTarget);
    try {
      await apiClient.deleteSubscriber(deleteTarget);
      setSubscribers(subscribers.filter(s => s.email !== deleteTarget));
      onUpdate();
    } catch (err: any) {
      console.error('Failed to delete subscriber:', err);
      setError(err.message || 'فشل حذف المشترك');
    } finally {
      setDeleting(null);
      setDeleteTarget(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
  };

  const handleExport = () => {
    const csv = [
      ['البريد الإلكتروني', 'الاسم', 'اللغة', 'تاريخ الاشتراك', 'الحالة'],
      ...filteredSubscribers.map(s => [
        s.email,
        s.name || '',
        s.language === 'ar' ? 'عربي' : 'إنجليزي',
        new Date(s.subscribedAt).toLocaleDateString('ar-SA'),
        s.isActive ? 'نشط' : 'غير نشط'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `المشتركين-${new Date().toISOString().slice(0, 10)}.csv`);
    link.click();
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
        <p className="text-stone-600">جاري تحميل المشتركين...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Delete Confirmation Popup */}
      {deleteTarget && (
        <DeleteConfirmDialog
          email={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          loading={deleting === deleteTarget}
        />
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full md:max-w-md relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <Input
            type="text"
            placeholder="البحث بالبريد الإلكتروني أو الاسم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={filterLang}
            onChange={(e) => setFilterLang(e.target.value as any)}
            className="px-4 py-2 border border-stone-300 rounded-lg bg-white"
          >
            <option value="all">جميع اللغات</option>
            <option value="en">الإنجليزية</option>
            <option value="ar">العربية</option>
          </select>

          <Button onClick={handleExport} variant="outline">
            <Download className="w-4 h-4 ml-2" />
            تصدير CSV
          </Button>
        </div>
      </div>

      <Card className="bg-white shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="text-right py-3 px-4 text-stone-700 font-semibold">البريد الإلكتروني</th>
                <th className="text-right py-3 px-4 text-stone-700 font-semibold">الاسم</th>
                <th className="text-right py-3 px-4 text-stone-700 font-semibold">اللغة</th>
                <th className="text-right py-3 px-4 text-stone-700 font-semibold">تاريخ الاشتراك</th>
                <th className="text-center py-3 px-4 text-stone-700 font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-stone-500">
                    لم يتم العثور على مشتركين
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
                        {subscriber.language === 'ar' ? 'عربي' : 'إنجليزي'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      {new Date(subscriber.subscribedAt).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Button
                        onClick={() => handleDeleteClick(subscriber.email)}
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
            عرض {filteredSubscribers.length} من {subscribers.length} مشترك
          </p>
        </div>
      </Card>
    </div>
  );
}
