'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/lib/auth/auth-context';
import { UserRole } from '@/lib/types';

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const validateEmail = (val: string) => {
    if (!val.trim()) {
      return 'Email address is required.';
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(val.trim())) {
      return 'Please enter a valid email address.';
    }
    return '';
  };

  const validatePassword = (val: string) => {
    if (!val) {
      return 'Password is required.';
    }
    if (val.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    setEmailError(emailErr);
    setPasswordError(passErr);

    if (emailErr || passErr) {
      return;
    }

    setIsLoading(true);
    const result = await login(email, password, selectedRole);
    setIsLoading(false);

    if (result.success) {
      if (result.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } else {
      setFormError(result.error || 'Invalid credentials. Please try again.');
    }
  };

  const handleRoleSwitch = (role: UserRole) => {
    setSelectedRole(role);
    setFormError('');
    setEmailError('');
    setPasswordError('');
    if (role === 'admin') {
      setEmail('admin@truetrace.io');
      setPassword('admin123');
    } else {
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Glass Login Card */}
      <div className="glass-card rounded-3xl p-8 border border-slate-200/80 dark:border-cyan-500/20 shadow-2xl">
        
        {/* Role Selector Header */}
        <div className="mb-6 space-y-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              Choose Account Type
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
              Welcome Back
            </h2>
          </div>

          {/* User vs Admin Segmented Selector */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => handleRoleSwitch('user')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                selectedRole === 'user'
                  ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>User</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch('admin')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                selectedRole === 'admin'
                  ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Admin</span>
            </button>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {selectedRole === 'user'
              ? 'Access your personal product verification dashboard.'
              : 'Manage users, platform settings and system security.'}
          </p>
        </div>

        {/* Global error banner */}
        {formError && (
          <div className="mb-5 flex items-center gap-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-600 dark:text-rose-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <Input
            label={selectedRole === 'admin' ? 'Admin Email' : 'Email Address'}
            type="email"
            placeholder={selectedRole === 'admin' ? 'admin@example.com' : 'example@gmail.com'}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError(validateEmail(e.target.value));
            }}
            error={emailError}
            leftIcon={<Mail className="h-4 w-4" />}
            required
            autoComplete="email"
          />

          {/* Password */}
          <div className="space-y-1.5">
            <Input
              label={selectedRole === 'admin' ? 'Admin Password' : 'Password'}
              type={showPassword ? 'text' : 'password'}
              placeholder={selectedRole === 'admin' ? 'Enter admin password' : 'Enter your password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError(validatePassword(e.target.value));
              }}
              error={passwordError}
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="rounded p-1 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              required
              autoComplete="current-password"
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 dark:border-slate-700 dark:bg-slate-800"
              />
              <span>Remember me</span>
            </label>

            {selectedRole === 'user' && (
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="font-medium text-cyan-600 dark:text-cyan-400 hover:underline"
              >
                Forgot password?
              </button>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              isMagnetic
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              {selectedRole === 'admin' ? 'Login as Admin' : 'Login to Dashboard'}
            </Button>
          </div>
        </form>

        {/* Signup Redirect for Users */}
        {selectedRole === 'user' && (
          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link href="/signup" className="font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">
              Create Account
            </Link>
          </div>
        )}

        {/* Admin Demo Hint */}
        {selectedRole === 'admin' && (
          <div className="mt-6 text-center text-[11px] text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <strong>Admin Demo:</strong> Use <code>admin@truetrace.io</code> / <code>admin123</code>
          </div>
        )}
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title="Password Recovery"
        description="TrueTrace Zero-Knowledge Recovery Protocol"
      >
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <p>
            In this frontend-only implementation, you can log in with any email and 6+ character password.
          </p>
          <div className="pt-2 flex justify-end">
            <Button variant="primary" size="sm" onClick={() => setIsForgotModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
