import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card } from '@/app/components/ui/card';
import { AlertCircle, CheckCircle, Mail, ArrowLeft } from 'lucide-react';
import { apiClient } from '@/utils/api';

interface ForgotPasswordFlowProps {
  onBack: () => void;
}

export function ForgotPasswordFlow({ onBack }: ForgotPasswordFlowProps) {
  const [step, setStep] = useState<'email' | 'confirmation' | 'reset'>('email');
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

  const validatePassword = (password: string) => {
    const errors: string[] = [];
    if (password.length < 12) errors.push('At least 12 characters');
    if (!/[A-Z]/.test(password)) errors.push('Uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('Lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('Number');
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) errors.push('Special character');
    return errors;
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
      setSuccess('Password reset link has been sent to your email');
      setStep('confirmation');
      setTimeout(() => {
        setStep('reset');
      }, 3000);
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
        throw new Error('Reset token is required');
      }

      if (!newPassword) {
        throw new Error('New password is required');
      }

      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const passwordErrors = validatePassword(newPassword);
      if (passwordErrors.length > 0) {
        throw new Error(`Password must contain: ${passwordErrors.join(', ')}`);
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
        {/* Step 1: Email Input */}
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

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-stone-800 hover:bg-stone-900 text-white py-3 font-semibold"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={onBack}
                className="text-stone-600 hover:text-stone-900 text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
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
              <h1 className="text-3xl font-bold text-stone-900 mb-2">Check Your Email</h1>
              <p className="text-stone-600">We've sent a password reset link to {email}</p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
              <p className="text-sm text-blue-700">
                Click the link in your email to reset your password. The link will expire in 1 hour.
              </p>
            </div>

            <div className="text-center text-stone-600 text-sm">
              <p>Redirecting to reset form...</p>
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
              <h1 className="text-3xl font-bold text-stone-900 mb-2">Create New Password</h1>
              <p className="text-stone-600">Enter your reset token and new password</p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Reset Token
                </label>
                <Input
                  type="text"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  required
                  placeholder="Paste token from email"
                  className="w-full font-mono text-xs"
                />
                <p className="text-xs text-stone-500 mt-1">
                  Copy the token from the reset link in your email
                </p>
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
                  Confirm Password
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
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={onBack}
                className="text-stone-600 hover:text-stone-900 text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
