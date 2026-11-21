'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, AtSign, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authService } from '@/services/authService';

export function SignupForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authService.signUp(email, password, username, fullName);
      if (res.error) {
        setError(res.error);
      } else {
        router.push('/home');
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-reelo-surface border border-reelo-border shadow-card space-y-6">
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl font-black text-reelo-text tracking-tight font-serif">
          Join REELO
        </h2>
        <p className="text-xs sm:text-sm text-reelo-muted">
          Create an account to join the network.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="Jordan Miller"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          leftIcon={<User className="w-4 h-4 text-reelo-muted" />}
        />

        <Input
          label="Username / Handle"
          type="text"
          placeholder="jordan_m"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          leftIcon={<AtSign className="w-4 h-4 text-reelo-muted" />}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="jordan@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          leftIcon={<Mail className="w-4 h-4 text-reelo-muted" />}
        />

        <Input
          label="Password (min 6 characters)"
          type="password"
          placeholder="••••••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          leftIcon={<Lock className="w-4 h-4 text-reelo-muted" />}
        />

        <div className="text-[11px] text-reelo-muted leading-normal">
          By signing up, you agree to REELO Community Guidelines, Terms of Service, and Privacy Policy.
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full font-bold shadow-subtle"
          isLoading={loading}
        >
          <span>Create Account</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </form>

      <p className="text-center text-xs text-reelo-muted">
        Already have a REELO account?{' '}
        <Link href="/login" className="text-reelo-accent font-semibold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
