'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, ShieldOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/auth/auth-context';
import { getPlatformSettings } from '@/lib/data/store';

export function SignupForm() {
  const router = useRouter();
  const { signup } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistrationAllowed, setIsRegistrationAllowed] = useState(true);

  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const settings = getPlatformSettings();
    setIsRegistrationAllowed(settings.allowRegistration);
  }, []);

  const validateUsername = (val: string) => {
    if (!val.trim()) {
      return 'Username is required.';
    }
    if (val.trim().length < 2) {
      return 'Username must be at least 2 characters.';
    }
    return '';
  };

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

  const validateConfirmPassword = (val: string, pass: string) => {
    if (!val) {
      return 'Please confirm your password.';
    }
    if (val !== pass) {
      return 'Passwords do not match.';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!isRegistrationAllowed) {
      setFormError('Registration is currently disabled by platform administrator.');
      return;
    }

    const userErr = validateUsername(username);
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    const confErr = validateConfirmPassword(confirmPassword, password);

    setUsernameError(userErr);
    setEmailError(emailErr);
    setPasswordError(passErr);
    setConfirmPasswordError(confErr);

    if (userErr || emailErr || passErr || confErr) {
      return;
    }

    setIsLoading(true);
    const result = await signup(username, email, password);
    setIsLoading(false);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setFormError(result.error || 'Failed to create account. Please try again.');
    }
  };

  if (!isRegistrationAllowed) {
    return (
      <div className="w-full max-w-md">
        <div className="glass-card rounded-3xl p-8 border border-slate-200/80 dark:border-cyan-500/20 shadow-2xl text-center space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mx-auto">
            <ShieldOff className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Registration Unavailable</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Public user registration is currently disabled by the platform administrator.
          </p>
          <div className="pt-4">
            <Link href="/login">
              <Button variant="primary" size="md" className="w-full">
                Return to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="glass-card rounded-3xl p-8 border border-slate-200/80 dark:border-cyan-500/20 shadow-2xl">
        <div className="mb-6 space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            New Account Setup
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Create Account
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Join TrueTrace with a personal product verification workspace
          </p>
        </div>

        {formError && (
          <div className="mb-5 flex items-center gap-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-600 dark:text-rose-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username"
            type="text"
            placeholder="Enter your username (e.g. Alex)"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (usernameError) setUsernameError(validateUsername(e.target.value));
            }}
            error={usernameError}
            leftIcon={<User className="h-4 w-4" />}
            required
            autoComplete="name"
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="example@gmail.com"
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

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a password (min 6 characters)"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError(validatePassword(e.target.value));
              if (confirmPassword && confirmPasswordError) {
                setConfirmPasswordError(validateConfirmPassword(confirmPassword, e.target.value));
              }
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
            autoComplete="new-password"
          />

          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (confirmPasswordError) {
                setConfirmPasswordError(validateConfirmPassword(e.target.value, password));
              }
            }}
            error={confirmPasswordError}
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="rounded p-1 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            required
            autoComplete="new-password"
          />

          <div className="flex items-center gap-2 pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 dark:border-slate-700 dark:bg-slate-800"
              />
              <span>I accept the TrueTrace Security Protocols</span>
            </label>
          </div>

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
              Create Account
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
