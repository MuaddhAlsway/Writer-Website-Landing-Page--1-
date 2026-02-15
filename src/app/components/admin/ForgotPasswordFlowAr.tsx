import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card } from '@/app/components/ui/card';
import { AlertCircle, CheckCircle, Mail, ArrowLeft } from 'lucide-react';
import { apiClient } from '@/utils/api';

interface ForgotPasswordFlowArProps {
  onBack: () => void;
}

export function ForgotPasswordFlowAr({ onBack }: ForgotPasswordFlowArProps) {
  const [step, setStep] = useState<'email' | 'confirmation' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Extract token from URL on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');
    if (tokenFromUrl) {
      setResetToken(tokenFromUrl);
      setStep('reset');
    }
  }, []);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    const errors: string[] = [];
    if (password.length < 12) errors.push('12 حرف على الأقل');
    if (!/[A-Z]/.test(password)) errors.push('حرف كبير');
    if (!/[a-z]/.test(password)) errors.push('حرف صغير');
    if (!/[0-9]/.test(password)) errors.push('رقم');
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) errors.push('رمز خاص');
    return errors;
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!validateEmail(email)) {
        throw new Error('يرجى إدخال عنوان بريد إلكتروني صحيح');
      }

      await apiClient.requestPasswordReset(email);
      setSuccess('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
      setStep('confirmation');
      setTimeout(() => {
        setStep('reset');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'فشل إرسال رابط إعادة التعيين');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!resetToken) {
        throw new Error('رمز إعادة التعيين مطلوب');
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

      await apiClient.resetPassword(resetToken, newPassword);
      setSuccess('تم إعادة تعيين كلمة المرور بنجاح! جاري إعادة التوجيه إلى تسجيل الدخول...');
      setTimeout(() => {
        onBack();
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
        {/* Step 1: Email Input */}
        {step === 'email' && (
          <>
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Mail className="w-12 h-12 text-stone-800" />
              </div>
              <h1 className="text-3xl font-bold text-stone-900 mb-2">إعادة تعيين كلمة المرور</h1>
              <p className="text-stone-600">أدخل بريدك الإلكتروني لتلقي رابط إعادة التعيين</p>
            </div>

            <form onSubmit={handleRequestReset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  عنوان البريد الإلكتروني
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@example.com"
                  className="w-full"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-stone-800 hover:bg-stone-900 text-white py-3 font-semibold"
              >
                {loading ? 'جاري الإرسال...' : 'إرسال رابط إعادة التعيين'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={onBack}
                className="text-stone-600 hover:text-stone-900 text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                العودة إلى تسجيل الدخول
              </button>
            </div>
          </>
        )}

        {/* Step 2: Confirmation */}
        {step === 'confirmation' && (
          <>
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-stone-900 mb-2">تحقق من بريدك الإلكتروني</h1>
              <p className="text-stone-600">لقد أرسلنا رابط إعادة تعيين كلمة المرور إلى {email}</p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
              <p className="text-sm text-blue-700">
                انقر على الرابط في بريدك الإلكتروني لإعادة تعيين كلمة المرور. سينتهي الرابط بعد ساعة واحدة.
              </p>
            </div>

            <div className="text-center text-stone-600 text-sm">
              <p>جاري إعادة التوجيه إلى نموذج إعادة التعيين...</p>
            </div>
          </>
        )}

        {/* Step 3: Reset Password */}
        {step === 'reset' && (
          <>
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Mail className="w-12 h-12 text-stone-800" />
              </div>
              <h1 className="text-3xl font-bold text-stone-900 mb-2">إنشاء كلمة مرور جديدة</h1>
              <p className="text-stone-600">أدخل رمز إعادة التعيين وكلمة المرور الجديدة</p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  رمز إعادة التعيين
                </label>
                <Input
                  type="text"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  required
                  placeholder="الصق الرمز من البريد الإلكتروني"
                  className="w-full font-mono text-xs"
                />
                <p className="text-xs text-stone-500 mt-1">
                  انسخ الرمز من رابط إعادة التعيين في بريدك الإلكتروني
                </p>
              </div>

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
                disabled={loading}
                className="w-full bg-stone-800 hover:bg-stone-900 text-white py-3 font-semibold"
              >
                {loading ? 'جاري إعادة التعيين...' : 'إعادة تعيين كلمة المرور'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={onBack}
                className="text-stone-600 hover:text-stone-900 text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                العودة إلى تسجيل الدخول
              </button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
