import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card } from '@/app/components/ui/card';
import { LogIn, AlertCircle, CheckCircle, Mail, Lock } from 'lucide-react';
import { apiClient } from '@/utils/api';
import { ForgotPasswordFlowAr } from './ForgotPasswordFlowAr';

interface AdminLoginArProps {
  onLogin: (token: string, refreshToken: string, expiresIn: number) => void;
}

export function AdminLoginAr({ onLogin }: AdminLoginArProps) {
  const [mode, setMode] = useState<'login' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!validateEmail(email)) {
        throw new Error('يرجى إدخال عنوان بريد إلكتروني صحيح');
      }

      if (password.length < 12) {
        throw new Error('يجب أن تكون كلمة المرور 12 حرف على الأقل');
      }

      // Call backend login endpoint
      const response = await apiClient.adminLogin(email, password);
      
      if (response.accessToken && response.refreshToken) {
        onLogin(response.accessToken, response.refreshToken, response.expiresIn || 900);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!validateEmail(email)) {
        throw new Error('يرجى إدخال عنوان بريد إلكتروني صحيح');
      }

      // Call backend forgot password endpoint
      await apiClient.requestPasswordReset(email);
      
      setSuccess('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد الخاص بك.');
      setEmail('');
      setTimeout(() => {
        setMode('forgot');
        setSuccess('');
      }, 2000);
    } catch (err: any) {
      console.error('Forgot password error:', err);
      setError(err.message || 'فشل إرسال رابط إعادة التعيين');
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'forgot') {
    return (
      <ForgotPasswordFlowAr 
        onBack={() => {
          setMode('login');
          setEmail('');
          setPassword('');
          setError('');
          setSuccess('');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 to-amber-50 px-6" dir="rtl">
      <Card className="w-full max-w-md p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {mode === 'login' ? (
              <Lock className="w-12 h-12 text-stone-800" />
            ) : (
              <Mail className="w-12 h-12 text-stone-800" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-stone-900 mb-2">
            {mode === 'login' ? 'تسجيل دخول المسؤول' : 'إعادة تعيين كلمة المرور'}
          </h1>
          <p className="text-stone-600">
            {mode === 'login' ? 'الوصول إلى لوحة التحكم الخاصة بك' : 'أدخل بريدك الإلكتروني لتلقي رابط إعادة التعيين'}
          </p>
        </div>

        <form onSubmit={mode === 'login' ? handleLogin : handleForgotPassword} className="space-y-4">
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

          {mode === 'login' && (
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                كلمة المرور
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full"
                minLength={6}
              />
              <p className="text-xs text-stone-500 mt-1">6 أحرف على الأقل</p>
            </div>
          )}

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
            {loading ? (
              'جاري المعالجة...'
            ) : (
              <>
                {mode === 'login' ? (
                  <>
                    <LogIn className="w-4 h-4 ml-2" />
                    تسجيل الدخول
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 ml-2" />
                    إرسال رابط إعادة التعيين
                  </>
                )}
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'forgot' : 'login');
              setError('');
              setSuccess('');
              setPassword('');
              setEmail('');
            }}
            className="text-stone-600 hover:text-stone-900 text-sm font-medium transition-colors"
          >
            {mode === 'login' ? 'هل نسيت كلمة المرور؟' : 'العودة إلى تسجيل الدخول'}
          </button>
        </div>
      </Card>
    </div>
  );
}
