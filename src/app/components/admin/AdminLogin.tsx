import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card } from '@/app/components/ui/card';
import { LogIn, AlertCircle, CheckCircle, Mail, Lock } from 'lucide-react';
import { apiClient } from '@/utils/api';
import { ForgotPasswordFlow } from './ForgotPasswordFlow';

interface AdminLoginProps {
  onLogin: (token: string, expiresIn: number) => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
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
        throw new Error('Please enter a valid email address');
      }

      if (password.length < 12) {
        throw new Error('Password must be at least 12 characters');
      }

      // Call backend login endpoint
      const response = await apiClient.adminLogin(email, password);
      
      if (response.accessToken) {
        onLogin(response.accessToken, response.expiresIn || 900);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
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
        throw new Error('Please enter a valid email address');
      }

      // Call backend forgot password endpoint
      await apiClient.requestPasswordReset(email);
      
      setSuccess('Password reset link has been sent to your email. Please check your inbox.');
      setEmail('');
      setTimeout(() => {
        setMode('forgot');
        setSuccess('');
      }, 2000);
    } catch (err: any) {
      console.error('Forgot password error:', err);
      setError(err.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'forgot') {
    return (
      <ForgotPasswordFlow 
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 to-amber-50 px-6">
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
            {mode === 'login' ? 'Admin Login' : 'Reset Password'}
          </h1>
          <p className="text-stone-600">
            {mode === 'login' ? 'Access your dashboard' : 'Enter your email to receive a reset link'}
          </p>
        </div>

        <form onSubmit={mode === 'login' ? handleLogin : handleForgotPassword} className="space-y-4">
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

          {mode === 'login' && (
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Password
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
              <p className="text-xs text-stone-500 mt-1">Minimum 6 characters</p>
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
              'Processing...'
            ) : (
              <>
                {mode === 'login' ? (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Reset Link
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
            {mode === 'login' ? 'Forgot your password?' : 'Back to login'}
          </button>
        </div>
