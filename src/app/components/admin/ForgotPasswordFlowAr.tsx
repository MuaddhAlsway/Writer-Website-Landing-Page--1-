import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card } from '@/app/components/ui/card';
import { AlertCircle, CheckCircle, Mail, ArrowLeft } from 'lucide-react';
import { apiClient } from '@/utils/api';

const ALLOWED_EMAILS = ['muaddhalsway@gmail.com', 'authorfsk@gmail.com'];

interface ForgotPasswordFlowArProps {
  onBack: () => void;
}

export function ForgotPasswordFlowAr({ onBack }: ForgotPasswordFlowArProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const normalized = email.trim().toLowerCase();

    // Whitelist check on frontend
    if (!ALLOWED_EMAILS.includes(normalized)) {
      setError('هذا البريد الإلكتروني غير مصرح له بإعادة تعيين كلمة المرور');
      return;
    }

    setLoading(true);
    try {
      await apiClient.requestPasswordReset(normalized);
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'فشل إرسال رابط إعادة التعيين');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 to-amber-50 px-6" dir="rtl">
        <Card className="w-full max-w-md p-8 shadow-2xl text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-stone-900 mb-2">تم الإرسال</h1>
          <p className="text-stone-600 mb-2">تم إرسال رابط إعادة تعيين كلمة المرور إلى:</p>
          <p className="font-semibold text-stone-800 mb-6">{email}</p>
          <p className="text-sm text-stone-500 mb-6">
            افتح بريدك الإلكتروني وانقر على الرابط. صالح لمدة 24 ساعة.
          </p>
          <button onClick={onBack} className="text-stone-600 hover:text-stone-900 text-sm font-medium flex items-center justify-center gap-2 mx-auto">
            <ArrowLeft className="w-4 h-4" />
            العودة إلى تسجيل الدخول
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 to-amber-50 px-6" dir="rtl">
      <Card className="w-full max-w-md p-8 shadow-2xl">
        <div className="text-center mb-8">
          <Mail className="w-12 h-12 text-stone-800 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-stone-900 mb-2">نسيت كلمة المرور؟</h1>
          <p className="text-stone-600">أدخل بريدك الإلكتروني لإرسال رابط إعادة التعيين</p>
        </div>

        <form onSubmit={handleRequestReset} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              البريد الإلكتروني
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="w-full"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full bg-stone-800 hover:bg-stone-900 text-white py-3 font-semibold">
            {loading ? 'جاري الإرسال...' : 'إرسال رابط إعادة التعيين'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={onBack} className="text-stone-600 hover:text-stone-900 text-sm font-medium flex items-center justify-center gap-2 mx-auto">
            <ArrowLeft className="w-4 h-4" />
            العودة إلى تسجيل الدخول
          </button>
        </div>
      </Card>
    </div>
  );
}
