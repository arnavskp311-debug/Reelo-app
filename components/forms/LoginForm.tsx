'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authService } from '@/services/authService';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authService.signIn(email, password);
      if (res.error) {
        setError(res.error);
      } else {
        router.push('/home');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-reelo-surface border border-reelo-border shadow-card space-y-6">
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl font-black text-reelo-text tracking-tight font-serif">
          Welcome Back to REELO
        </h2>
        <p className="text-xs sm:text-sm text-reelo-muted">
          Enter your Supabase credentials to access your creator dashboard.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="alex@reelo.io"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          leftIcon={<Mail className="w-4 h-4 text-reelo-muted" />}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          leftIcon={<Lock className="w-4 h-4 text-reelo-muted" />}
        />

        <div className="flex items-center justify-between text-xs text-reelo-muted">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded border-reelo-border text-reelo-primary focus:ring-reelo-secondary" />
            <span>Remember me</span>
          </label>
          <a href="#" className="hover:text-reelo-primary font-medium transition-colors">
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full font-bold shadow-subtle"
          isLoading={loading}
        >
          <span>Sign In</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </form>

      <p className="text-center text-xs text-reelo-muted">
        New to REELO?{' '}
        <Link href="/signup" className="text-reelo-accent font-semibold hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
