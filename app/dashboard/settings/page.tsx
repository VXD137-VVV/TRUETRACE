'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Bell,
  Palette,
  Check,
  Save,
  Moon,
  Sun,
  Laptop,
  Sparkles,
  MousePointer,
  Lock,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { useTheme } from '@/lib/theme/theme-context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'appearance'>('profile');

  // Profile Form States
  const [username, setUsername] = useState(user?.username || 'Alex Vance');
  const [email, setEmail] = useState(user?.email || 'alex.vance@truetrace.io');
  const [company, setCompany] = useState(user?.company || 'AeroLux Security');
  const [role, setRole] = useState(user?.role || 'Chief Security Officer');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Security States
  const [twoFactor, setTwoFactor] = useState(user?.twoFactorEnabled ?? true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [securitySuccess, setSecuritySuccess] = useState(false);

  // Notification States
  const [notifyCounterfeits, setNotifyCounterfeits] = useState(true);
  const [notifyDailyDigest, setNotifyDailyDigest] = useState(true);
  const [notifySupplyChainAnomalies, setNotifySupplyChainAnomalies] = useState(true);

  // Appearance States
  const [reducedMotion, setReducedMotion] = useState(false);
  const [customCursor, setCustomCursor] = useState(true);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      if (user.company) setCompany(user.company);
      if (user.role) setRole(user.role);
    }
  }, [user]);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      username: username.trim(),
      email: email.trim(),
      company: company.trim(),
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSecuritySave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ twoFactorEnabled: twoFactor });
    setSecuritySuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setSecuritySuccess(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your enterprise profile, security protocols, and interface appearance.
        </p>
      </div>

      {/* Tabs Row */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'appearance', label: 'Appearance & Theme', icon: Palette },
          { id: 'security', label: 'Security & 2FA', icon: Shield },
          { id: 'notifications', label: 'Notifications', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-cyan-500 text-white shadow-glow-cyan/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Profile */}
      {activeTab === 'profile' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Profile Information</h3>
            <p className="text-xs text-slate-500">
              Updating your username will dynamically update your dashboard welcome greeting.
            </p>
          </div>

          {saveSuccess && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-600 dark:text-emerald-400">
              <Check className="h-4 w-4" />
              <span>Profile updated successfully in local storage!</span>
            </div>
          )}

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Username / Display Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. Alex Vance"
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. alex@truetrace.io"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company / Organization"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. AeroLux Security"
              />
              <Input
                label="Role Title"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Chief Security Officer"
              />
            </div>

            <div className="pt-3 flex justify-end">
              <Button type="submit" variant="primary" size="md" isMagnetic leftIcon={<Save className="h-4 w-4" />}>
                Save Profile Changes
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Appearance & Theme */}
      {activeTab === 'appearance' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Interface & Theme Settings</h3>
            <p className="text-xs text-slate-500">
              Choose your theme preference and manage cursor interactions.
            </p>
          </div>

          {/* Theme selector cards */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Theme Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  theme === 'light'
                    ? 'border-cyan-500 bg-cyan-500/10 shadow-glow-cyan/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sun className="h-5 w-5 text-amber-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Light Mode</div>
                    <div className="text-[10px] text-slate-500">Clean white glass</div>
                  </div>
                </div>
                {theme === 'light' && <Check className="h-4 w-4 text-cyan-500" />}
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  theme === 'dark'
                    ? 'border-cyan-500 bg-cyan-500/10 shadow-glow-cyan/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Moon className="h-5 w-5 text-cyan-400" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Dark Mode</div>
                    <div className="text-[10px] text-slate-500">Futuristic cyber glass</div>
                  </div>
                </div>
                {theme === 'dark' && <Check className="h-4 w-4 text-cyan-500" />}
              </button>

              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  theme === 'system'
                    ? 'border-cyan-500 bg-cyan-500/10 shadow-glow-cyan/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Laptop className="h-5 w-5 text-indigo-400" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">System Sync</div>
                    <div className="text-[10px] text-slate-500">Match OS preferences</div>
                  </div>
                </div>
                {theme === 'system' && <Check className="h-4 w-4 text-cyan-500" />}
              </button>
            </div>
          </div>

          {/* Interactive Effects Toggles */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Interactive Micro-Effects
            </label>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <MousePointer className="h-4 w-4 text-cyan-500" />
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    Custom Cursor & Canvas Particle Trail
                  </div>
                  <div className="text-[11px] text-slate-500">
                    High performance GPU 60fps cursor follower with context reactions
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={customCursor}
                onChange={(e) => setCustomCursor(e.target.checked)}
                className="h-4 w-4 rounded text-cyan-500"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    Subtle Magnetic Button Physics
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Attracts primary buttons toward mouse cursor by 5-10px
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={!reducedMotion}
                onChange={(e) => setReducedMotion(!e.target.checked)}
                className="h-4 w-4 rounded text-cyan-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Security & 2FA */}
      {activeTab === 'security' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Security & Authentication Protocols</h3>
            <p className="text-xs text-slate-500">Configure multi-factor security and password policies.</p>
          </div>

          {securitySuccess && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-600 dark:text-emerald-400">
              <Check className="h-4 w-4" />
              <span>Security settings successfully updated!</span>
            </div>
          )}

          <form onSubmit={handleSecuritySave} className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Two-Factor Authentication (2FA)
                </div>
                <div className="text-[11px] text-slate-500">
                  Require hardware authenticator or biometric security token
                </div>
              </div>
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}
                className="h-5 w-5 rounded text-cyan-500"
              />
            </div>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Current Password"
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <Input
                label="New Password"
                type="password"
                placeholder="Enter new password (min 6 chars)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="pt-3 flex justify-end">
              <Button type="submit" variant="primary" size="md" isMagnetic>
                Update Security Settings
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 4: Notifications */}
      {activeTab === 'notifications' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Notification Preferences</h3>
            <p className="text-xs text-slate-500">Choose which supply chain and counterfeit alerts you receive.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                  Instant Counterfeit Alerts
                </div>
                <div className="text-[11px] text-slate-500">
                  Immediate high-priority notification when a fake or cloned token is scanned
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifyCounterfeits}
                onChange={(e) => setNotifyCounterfeits(e.target.checked)}
                className="h-4 w-4 rounded text-cyan-500"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                  Supply Chain Anomaly Flags
                </div>
                <div className="text-[11px] text-slate-500">
                  Alert when impossible travel velocity or unauthorized boutique scans occur
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifySupplyChainAnomalies}
                onChange={(e) => setNotifySupplyChainAnomalies(e.target.checked)}
                className="h-4 w-4 rounded text-cyan-500"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                  Daily Provenance Summary
                </div>
                <div className="text-[11px] text-slate-500">
                  Digest of verification volume and overall brand security score
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifyDailyDigest}
                onChange={(e) => setNotifyDailyDigest(e.target.checked)}
                className="h-4 w-4 rounded text-cyan-500"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
