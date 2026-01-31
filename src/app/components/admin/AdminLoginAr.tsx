import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card } from '@/app/components/ui/card';
import { LogIn, UserPlus, AlertCircle } from 'lucide-react';

interface AdminLoginArProps {
  onLogin: (token: string, expiresIn: number) => void;
}

export function AdminLoginAr({ onLogin }: AdminLoginArProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!validateEmail(email)) {
        throw new Error('يرجى إدخال عنوان بريد إلكتروني صحيح');
      }

      if (password.length < 6) {
        throw new Error('يجب أن تكون كلمة المرور 6 أحرف على الأقل');
      }

      const mockToken = 'mock-token-' + Date.now();
      localStorage.setItem('adminToken', mockToken);
      localStorage.setItem('adminEmail', email);
      onLogin(mockToken, 3600);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!validateEmail(email)) {
        throw new Error('يرجى إدخال عنوان بريد إلكتروني صحيح');
      }

      if (password.length < 6) {
        throw new Error('يجب أن تكون كلمة المرور 6 أحرف على الأقل');
      }

      if (!name.trim()) {
        throw new Error('الاسم مطلوب');
      }

      const mockToken = 'mock-token-' + Date.now();
      localStorage.setItem('adminToken', mockToken);
      localStorage.setItem('adminEmail', email);
      onLogin(mockToken, 3600);
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'فشل إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 to-amber-50 px-6" dir="rtl">
      <Card className="w-full max-w-md p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">
            {isSignup ? 'إنشاء حساب المسؤول' : 'تسجيل دخول المسؤول'}
          </h1>
          <p className="text-stone-600">
            {isSignup ? 'قم بإعداد حساب المسؤول الخاص بك' : 'الوصول إلى لوحة التحكم الخاصة بك'}
          </p>
        </div>

        <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                الاسم
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isSignup}
                placeholder="اسمك"
                className="w-full"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              البريد الإلكتروني
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

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-800 hover:bg-stone-900 text-white py-3"
          >
            {loading ? (
              'جاري المعالجة...'
            ) : (
              <>
                {isSignup ? (
                  <>
                    <UserPlus className="w-4 h-4 ml-2" />
                    إنشاء حساب
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 ml-2" />
                    تسجيل الدخول
                  </>
                )}
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
            }}
            className="text-stone-600 hover:text-stone-900 text-sm"
          >
            {isSignup ? 'هل لديك حساب بالفعل؟ تسجيل الدخول' : 'هل تحتاج إلى حساب؟ إنشاء حساب'}
          </button>
        </div>
      </Card>
    </div>
  );
}
