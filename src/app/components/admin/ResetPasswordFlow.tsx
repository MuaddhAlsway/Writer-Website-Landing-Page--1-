import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card } from '@/app/components/ui/card';
import { AlertCircle, CheckCircle, Mail, Lock, ArrowLeft } from 'lucide-react';
import { apiClient } from '@/utils/api';

interface ResetPasswordFlowProps {
  onBack: () => void;
}

export function ResetPasswordFlow({ onBack }: ResetPasswordFlowProps) {
  const [step, setStep] = useState<'email' | 'reset-link' | 'new-password'>('email');
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!validateEmail(email)) {
        throw new Error('Please enter a valid email address');
      }

      await apiClient.requestPasswordReset(email);
      setSuccess('Reset link sent to your email. Check your inbox for the link.');
      setTimeout(() => {
        setStep('reset-link');
        setSuccess('');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link');
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
        throw new Error('Please enter the reset token from your email');
      }

      if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      await apiClient.resetPassword(resetToken, newPassword);
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 to-amber-50 px-6">
      <Card className="w-full max-w-md p-8 shadow-2xl">
        {/* Step 1: Email */}
        {step === 'email' && (
          <>
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Mail className="w-12 h-12 text-stone-800" />
              </div>
              <h1 className="text-3xl font-bold text-stone-900 mb-2">Reset Password</h1>
              <p className="text-stone-600">Enter your email to receive a reset link</p>
            </div>

            <form onSubmit={handleRequestReset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Email Address
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
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          </>
        )}

        {/* Step 2: Reset Link */}
        {step === 'reset-link' && (
          <>
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Mail className="w-12 h-12 text-stone-800" />
              </div>
              <h1 className="text-3xl font-bold text-stone-900 mb-2">Check Your Email</h1>
              <p className="text-stone-600">We sent a reset link to your email</p>
            </div>

            <form onSubmit={() => setStep('new-password')} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Reset Token
                </label>
                <Input
                  type="text"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  required
                  placeholder="Paste the token from the email link"
                  className="w-full"
                />
                <p className="text-xs text-stone-500 mt-1">
                  Copy the token from the reset link in your email
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={!resetToken}
                className="w-full bg-stone-800 hover:bg-stone-900 text-white py-3 font-semibold"
              >
                Continue
              </Button>
            </form>
          </>
        )}

        {/* Step 3: New Password */}
        {step === 'new-password' && (
          <>
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Lock className="w-12 h-12 text-stone-800" />
              </div>
              <h1 className="text-3xl font-bold text-stone-900 mb-2">Create New Password</h1>
              <p className="text-stone-600">Enter your new password</p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
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
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Confirm Password
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
                <p className="text-xs text-stone-500 mt-1">Minimum 6 characters</p>
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
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          </>
        )}

        {/* Back Button */}
        <button
          onClick={onBack}
          className="mt-6 w-full flex items-center justify-center gap-2 text-stone-600 hover:text-stone-900 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>
      </Card>
    </div>
  );
}
