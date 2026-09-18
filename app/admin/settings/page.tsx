'use client';

import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Shield,
  Palette,
  Users,
  Bell,
  Save,
  Check,
  MousePointer,
  Sparkles,
  Lock,
  UserPlus,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getPlatformSettings, updatePlatformSettings, DATA_CHANGED_EVENT } from '@/lib/data/store';
import { PlatformSettings } from '@/lib/types';
import { useTheme } from '@/lib/theme/theme-context';

export default function AdminSettingsPage() {
  const { setTheme } = useTheme();
  const [settings, setSettings] = useState<PlatformSettings>(getPlatformSettings());
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setSettings(getPlatformSettings());

    const handleDataChange = () => {
      setSettings(getPlatformSettings());
    };

    window.addEventListener(DATA_CHANGED_EVENT, handleDataChange);
    return () => window.removeEventListener(DATA_CHANGED_EVENT, handleDataChange);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updatePlatformSettings(settings);
    setSettings(updated);

    // If default theme was adjusted, sync theme
    if (updated.defaultTheme) {
      setTheme(updated.defaultTheme);
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-0.5 text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">
            <Sliders className="h-3.5 w-3.5" />
            <span>Global System Configuration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Platform Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configure system-wide behavior, user access rules, global theme defaults, and UI interaction physics.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={handleSave}
          isMagnetic
          leftIcon={<Save className="h-4 w-4" />}
        >
          Save Platform Changes
        </Button>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-xs text-emerald-600 dark:text-emerald-400 animate-scaleIn">
          <Check className="h-5 w-5 flex-shrink-0" />
          <span className="font-semibold">
            Platform settings saved successfully! All user interfaces updated dynamically in real-time.
          </span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Section 1: General Platform Branding */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="h-4 w-4 text-cyan-500" />
            General Platform Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Platform Name"
              value={settings.platformName}
              onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
              placeholder="e.g. TrueTrace Security Cloud"
            />

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Default Workspace Theme
              </label>
              <select
                value={settings.defaultTheme}
                onChange={(e) => setSettings({ ...settings, defaultTheme: e.target.value as any })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-xs text-slate-800 dark:text-slate-200 outline-none"
              >
                <option value="dark">Dark Theme (Deep Navy Midnight)</option>
                <option value="light">Light Theme (Clean White Glass)</option>
                <option value="system">System Preference Sync</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: User Access & Registration Controls */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-500" />
            User Access & Registration Controls
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Allow Public User Registration</span>
                  {!settings.allowRegistration && (
                    <span className="text-[9px] bg-rose-500/10 text-rose-500 border border-rose-500/20 px-1.5 py-0.2 rounded font-bold uppercase">
                      Disabled
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500">
                  When disabled, the Signup page will display "Registration is currently unavailable" to all public visitors.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.allowRegistration}
                onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
                className="h-5 w-5 rounded text-purple-600 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                  Allow Self-Serve QR Verification
                </div>
                <div className="text-[11px] text-slate-500">
                  Permit standard users to execute live optical scanning and file uploads against their inventory.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.allowUserVerification}
                onChange={(e) => setSettings({ ...settings, allowUserVerification: e.target.checked })}
                className="h-5 w-5 rounded text-purple-600 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: UI & Interaction Physics Controls */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Palette className="h-4 w-4 text-cyan-400" />
            Global UI, Cursor & Animation Controls
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <MousePointer className="h-5 w-5 text-cyan-500" />
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    Enable Custom Cursor & Canvas Particle Trail
                  </div>
                  <div className="text-[11px] text-slate-500">
                    If toggled OFF by Admin, all users will see standard browser pointer and trails will be disabled.
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.enableCursorEffects}
                onChange={(e) => setSettings({ ...settings, enableCursorEffects: e.target.checked })}
                className="h-5 w-5 rounded text-cyan-500 focus:ring-cyan-500"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    Enable Magnetic Button Physics & Micro-Interactions
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Smooth 5-10px spring attraction toward cursor on CTAs.
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.enableAnimations}
                onChange={(e) => setSettings({ ...settings, enableAnimations: e.target.checked })}
                className="h-5 w-5 rounded text-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Security & Session Rules */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="h-4 w-4 text-emerald-400" />
            Security & Session Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Session Inactivity Timeout (Minutes)"
              type="number"
              value={settings.sessionTimeoutMinutes}
              onChange={(e) => setSettings({ ...settings, sessionTimeoutMinutes: parseInt(e.target.value) || 60 })}
            />
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mt-6">
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                  Email Alert Dispatching
                </div>
                <div className="text-[10px] text-slate-500">Simulate incident webhook alerts</div>
              </div>
              <input
                type="checkbox"
                checked={settings.enableEmailAlerts}
                onChange={(e) => setSettings({ ...settings, enableEmailAlerts: e.target.checked })}
                className="h-4 w-4 rounded text-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit" variant="primary" size="lg" isMagnetic leftIcon={<Save className="h-4 w-4" />}>
            Save All Platform Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
