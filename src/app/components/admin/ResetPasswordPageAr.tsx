import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card } from '@/app/components/ui/card';
import { AlertCircle, CheckCircle, Lock } from 'lucide-react';
import { apiClient } from '@/utils/api';

export function ResetPasswordPageAr() {
  const [token, setToken] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Extract token from URL query params
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');
    setToken(tokenFromUrl);
    
    if (!tokenFromUrl) {
      setError('رابط إعادة التعيين غير صحيح. الرمز مفقود.');
    }
  }, []);

  const validatePassword = (password: string) => {
    const errors: string[] = [];
    if (password.length < 12) errors.push('12 حرف على الأقل');
    if (!/[A-Z]/.test(password)) errors.push('حرف كبير');
    if (!/[a-z]/.test(password)) errors.push('حرف صغير');
    if (!/[0-9]/.test(password)) errors.push('رقم');
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) errors.push('رمز خاص');
    return errors;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!token) {
        throw new Error('رابط إعادة التعيين غير صحيح');
      }

      if (!newPassword) {
        throw new Error('كلمة المرور الجديدة مطلوبة');
      }

      if (newPassword !== confirmPassword) {
        throw new Error('كلمات المرور غير متطابقة');
      }

      const passwordErrors = validatePassword(newPassword);
      if (passwordErrors.length > 0) {
        throw new Error(`يجب أن تحتوي كلمة المرور على: ${passwordErrors.join(', ')}`);
      }

      await apiClient.resetPassword(token, newPassword);
      setSuccess('تم إعادة تعيين كلمة المرور بنجاح! جاري إعادة التوجيه إلى تسجيل الدخول...');
      setTimeout(() => {
        window.location.href = '/admin';
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'فشل إعادة تعيين كلمة المرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 to-amber-50 px-6" dir="rtl">
      <Card className="w-full max-w-md p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Lock className="w-12 h-12 text-stone-800" />
          </div>
          <h1 className="text-3xl font-bold text-stone-900 mb-2">إنشاء كلمة مرور جديدة</h1>
          <p className="text-stone-600">أدخل كلمة المرور الجديدة أدناه</p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              كلمة المرور الجديدة
            </label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full"
            />
            <p className="text-xs text-stone-500 mt-1">
              يجب أن تحتوي على: 12 حرف، حرف كبير، حرف صغير، رقم، رمز خاص
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              تأكيد كلمة المرور
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || !token}
            className="w-full bg-stone-800 hover:bg-stone-900 text-white py-3 font-semibold"
          >
            {loading ? 'جاري إعادة التعيين...' : 'إعادة تعيين كلمة المرور'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
