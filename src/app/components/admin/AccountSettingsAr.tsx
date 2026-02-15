import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card } from '@/app/components/ui/card';
import { AlertCircle, CheckCircle, User, Mail, Lock, Save } from 'lucide-react';
import { apiClient } from '@/utils/api';

interface AccountSettingsArProps {
  accessToken: string;
}

interface AdminProfile {
  id: string;
  email: string;
  username: string;
  name: string;
  created_at: string;
}

export function AccountSettingsAr({ accessToken }: AccountSettingsArProps) {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Loading states
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    apiClient.setToken(accessToken);
    loadProfile();
  }, [accessToken]);

  const loadProfile = async () => {
    try {
      setError('');
      const data = await apiClient.getAdminProfile();
      if (data.admin) {
        setProfile(data.admin);
        setUsername(data.admin.username || '');
        setName(data.admin.name || '');
      }
    } catch (err: any) {
      setError(err.message || 'فشل تحميل الملف الشخصي');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    setError('');
    setSuccess('');

    try {
      if (!username.trim()) {
        throw new Error('معرف المستخدم مطلوب');
      }

      if (username.length < 3) {
        throw new Error('يجب أن يكون معرف المستخدم 3 أحرف على الأقل');
      }

      await apiClient.updateAdminProfile({ username, name });
      setSuccess('تم تحديث الملف الشخصي بنجاح!');
      setTimeout(() => setSuccess(''), 3000);
      loadProfile();
    } catch (err: any) {
      setError(err.message || 'فشل تحديث الملف الشخصي');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangingPassword(true);
    setError('');
    setSuccess('');

    try {
      if (!currentPassword) {
        throw new Error('كلمة المرور الحالية مطلوبة');
      }

      if (!newPassword) {
        throw new Error('كلمة المرور الجديدة مطلوبة');
      }

      if (newPassword.length < 6) {
        throw new Error('يجب أن تكون كلمة المرور الجديدة 6 أحرف على الأقل');
      }

      if (newPassword !== confirmPassword) {
        throw new Error('كلمات المرور غير متطابقة');
      }

      if (currentPassword === newPassword) {
        throw new Error('يجب أن تكون كلمة المرور الجديدة مختلفة عن الحالية');
      }

      await apiClient.changePassword(currentPassword, newPassword);
      setSuccess('تم تغيير كلمة المرور بنجاح!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'فشل تغيير كلمة المرور');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="p-6 bg-white shadow-lg animate-pulse">
          <div className="h-40 bg-stone-200 rounded"></div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">خطأ</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-800">نجح</p>
            <p className="text-sm text-green-700">{success}</p>
          </div>
        </div>
      )}

      {/* Profile Information */}
      <Card className="p-6 bg-gradient-to-br from-stone-50 to-white shadow-lg border border-stone-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-stone-900">معلومات الحساب</h2>
            <p className="text-sm text-stone-600">إدارة بيانات حسابك الشخصية</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="p-4 bg-white rounded-lg border border-stone-200">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">البريد الإلكتروني</p>
            <p className="text-lg font-semibold text-stone-900 break-all">{profile?.email || 'لم يتم التعيين'}</p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-stone-200">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">معرف المستخدم</p>
            <p className="text-lg font-semibold text-stone-900">{profile?.username || 'لم يتم التعيين'}</p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-stone-200">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">الاسم الكامل</p>
            <p className="text-lg font-semibold text-stone-900">{profile?.name || 'لم يتم التعيين'}</p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-stone-200">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">عضو منذ</p>
            <p className="text-lg font-semibold text-stone-900">
              {profile?.created_at 
                ? new Date(profile.created_at).toLocaleDateString('ar-SA', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : 'N/A'}
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-stone-100 rounded-lg border border-stone-300">
          <p className="text-sm text-stone-700">
            <span className="font-semibold">معرّف الحساب:</span> {profile?.id || 'غير متاح'}
          </p>
        </div>
      </Card>

      {/* Update Profile */}
      <Card className="p-6 bg-white shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <Mail className="w-6 h-6 text-stone-600" />
          <h2 className="text-xl font-bold text-stone-900">تحديث الملف الشخصي</h2>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              معرف المستخدم
            </label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="أدخل معرف المستخدم الجديد"
              className="w-full"
              minLength={3}
            />
            <p className="text-xs text-stone-500 mt-1">الحد الأدنى 3 أحرف</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              الاسم
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="أدخل اسمك الكامل"
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            disabled={updatingProfile}
            className="w-full bg-stone-800 hover:bg-stone-900 text-white py-3 font-semibold flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {updatingProfile ? 'جاري التحديث...' : 'حفظ التغييرات'}
          </Button>
        </form>
      </Card>

      {/* Change Password */}
      <Card className="p-6 bg-white shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-6 h-6 text-stone-600" />
          <h2 className="text-xl font-bold text-stone-900">تغيير كلمة المرور</h2>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              كلمة المرور الحالية
            </label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full"
            />
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
              minLength={6}
            />
            <p className="text-xs text-stone-500 mt-1">الحد الأدنى 6 أحرف</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              تأكيد كلمة المرور الجديدة
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full"
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            disabled={changingPassword}
            className="w-full bg-stone-800 hover:bg-stone-900 text-white py-3 font-semibold flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            {changingPassword ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
