import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { AlertCircle, CheckCircle, Mail, User, Lock, Loader, Save } from 'lucide-react';
import { apiClient } from '@/utils/api';

interface AccountSettingsProps {
  accessToken: string;
  onLogout?: () => void;
}

interface AdminProfile {
  id: string;
  email: string;
  username: string;
  name: string;
  created_at: string;
}

export function AccountSettings({ accessToken, onLogout }: AccountSettingsProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Profile state
  const [profile, setProfile] = useState<AdminProfile | null>(null);

  // Email state
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);

  // Username state
  const [currentUsername, setCurrentUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [usernameLoading, setUsernameLoading] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    apiClient.setToken(accessToken);
    loadProfile();
  }, [accessToken]);

  const loadProfile = async () => {
    try {
      setProfileLoading(true);
      const response = await apiClient.getAdminProfile();
      if (response.admin) {
        setProfile(response.admin);
        setCurrentEmail(response.admin.email);
        setCurrentUsername(response.admin.username || '');
      }
    } catch (err: any) {
      console.error('Failed to load profile:', err);
      setError('Failed to load profile');
    } finally {
      setProfileLoading(false);
      setLoading(false);
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    const errors: string[] = [];
    if (password.length < 12) errors.push('At least 12 characters');
    if (!/[A-Z]/.test(password)) errors.push('Uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('Lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('Number');
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) errors.push('Special character');
    return errors;
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!newEmail) {
        throw new Error('New email is required');
      }

      if (!validateEmail(newEmail)) {
        throw new Error('Please enter a valid email address');
      }

      if (newEmail === currentEmail) {
        throw new Error('New email must be different from current email');
      }

      await apiClient.updateAdminProfile({ email: newEmail });
      setSuccess('Email updated successfully!');
      setCurrentEmail(newEmail);
      setNewEmail('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update email');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!newUsername) {
        throw new Error('New username is required');
      }

      if (newUsername.length < 3) {
        throw new Error('Username must be at least 3 characters');
      }

      if (!/^[a-zA-Z0-9_-]+$/.test(newUsername)) {
        throw new Error('Username can only contain letters, numbers, underscores, and hyphens');
      }

      if (newUsername === currentUsername) {
        throw new Error('New username must be different from current username');
      }

      await apiClient.updateAdminProfile({ username: newUsername });
      setSuccess('Username updated successfully!');
      setCurrentUsername(newUsername);
      setNewUsername('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update username');
    } finally {
      setUsernameLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!currentPassword) {
        throw new Error('Current password is required');
      }

      if (!newPassword) {
        throw new Error('New password is required');
      }

      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (newPassword === currentPassword) {
        throw new Error('New password must be different from current password');
      }

      const passwordErrors = validatePassword(newPassword);
      if (passwordErrors.length > 0) {
        throw new Error(`Password must contain: ${passwordErrors.join(', ')}`);
      }

      await apiClient.changePassword(currentPassword, newPassword);
      setSuccess('Password changed successfully! You will be logged out.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setTimeout(() => {
        if (onLogout) {
          onLogout();
        }
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader className="w-6 h-6 animate-spin text-stone-600" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-800">Success</p>
            <p className="text-sm text-green-700">{success}</p>
          </div>
        </div>
      )}

      {/* Profile Information Card */}
      <Card className="p-6 bg-white shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-stone-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900">Account Information</h2>
            <p className="text-sm text-stone-600">Email: {profile?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-stone-700">
          <div>
            <p className="text-sm font-medium text-stone-600">Username</p>
            <p className="text-lg text-stone-900">{profile?.username || 'Not set'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-stone-600">Name</p>
            <p className="text-lg text-stone-900">{profile?.name || 'Not set'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-stone-600">Member Since</p>
            <p className="text-lg text-stone-900">
              {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </Card>

      {/* Settings Tabs */}
      <Card className="p-6 bg-white shadow-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Email</span>
            </TabsTrigger>
            <TabsTrigger value="username" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Username</span>
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Password</span>
            </TabsTrigger>
          </TabsList>

          {/* Email Tab */}
          <TabsContent value="email">
            <form onSubmit={handleUpdateEmail} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Current Email
                </label>
                <Input
                  type="email"
                  value={currentEmail}
                  disabled
                  className="w-full bg-stone-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  New Email Address
                </label>
                <Input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  placeholder="newemail@example.com"
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                disabled={emailLoading || !newEmail}
                className="w-full bg-stone-800 hover:bg-stone-900 text-white flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {emailLoading ? 'Updating...' : 'Update Email'}
              </Button>
            </form>
          </TabsContent>

          {/* Username Tab */}
          <TabsContent value="username">
            <form onSubmit={handleUpdateUsername} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Current Username
                </label>
                <Input
                  type="text"
                  value={currentUsername}
                  disabled
                  className="w-full bg-stone-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  New Username
                </label>
                <Input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                  placeholder="newusername"
                  className="w-full"
                />
                <p className="text-xs text-stone-500 mt-1">
                  3+ characters, letters, numbers, underscores, and hyphens only
                </p>
              </div>

              <Button
                type="submit"
                disabled={usernameLoading || !newUsername}
                className="w-full bg-stone-800 hover:bg-stone-900 text-white flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {usernameLoading ? 'Updating...' : 'Update Username'}
              </Button>
            </form>
          </TabsContent>

          {/* Password Tab */}
          <TabsContent value="password">
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Current Password
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
                  New Password
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
                  Must contain: 12+ chars, uppercase, lowercase, number, special character
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Confirm New Password
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

              <Button
                type="submit"
                disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
                className="w-full bg-stone-800 hover:bg-stone-900 text-white flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                {passwordLoading ? 'Changing...' : 'Change Password'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
