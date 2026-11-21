import React from 'react';
import { LoginForm } from '@/components/forms/LoginForm';

export const metadata = {
  title: 'Sign In — REELO',
  description: 'Sign in to your REELO creator account',
};

export default function LoginPage() {
  return <LoginForm />;
}
