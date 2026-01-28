import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card } from '@/app/components/ui/card';
import { LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface AdminLoginProps {
  onLogin: (token: string, expiresIn: number) => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
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
        throw new Error('Please enter a valid email address');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // For testing, accept any valid email/password
      // In production, this would verify against a real backend
      const mockToken = 'mock-token-' + Date.now();
      localStorage.setItem('adminToken', mockToken);
      localStorage.setItem('adminEmail', email);
      onLogin(mockToken, 3600);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
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
        throw new Error('Please enter a valid email address');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      if (!name.trim()) {
        throw new Error('Name is required');
      }

      // For testing, accept any valid email/password
      // In production, this would call the backend signup endpoint
      const mockToken = 'mock-token-' + Date.now();
      localStorage.setItem('adminToken', mockToken);
      localStorage.setItem('adminEmail', email);
      onLogin(mockToken, 3600);
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 to-amber-50 px-6">
      <Card className="w-full max-w-md p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">
            {isSignup ? 'Create Admin Account' : 'Admin Login'}
          </h1>
          <p className="text-stone-600">
            {isSignup ? 'Set up your admin account' : 'Access your dashboard'}
          </p>
        </div>

        <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isSignup}
                placeholder="Your name"
                className="w-full"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Email
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
              'Processing...'
            ) : (
              <>
                {isSignup ? (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Account
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
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
            {isSignup ? 'Already have an account? Login' : 'Need an account? Sign up'}
          </button>
        </div>
      </Card>
    </div>
  );
}
