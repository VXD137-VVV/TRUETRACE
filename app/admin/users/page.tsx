'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Shield,
  User,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Mail,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { getAllUsers, saveUser, updateUser, deleteUser, DATA_CHANGED_EVENT } from '@/lib/data/store';
import { UserProfile, UserRole, AccountStatus } from '@/lib/types';
import { useAuth } from '@/lib/auth/auth-context';

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  // Form fields
  const [formUsername, setFormUsername] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('user');
  const [formStatus, setFormStatus] = useState<AccountStatus>('active');
  const [formCompany, setFormCompany] = useState('');

  const loadUsers = () => {
    setUsers(getAllUsers());
  };

  useEffect(() => {
    loadUsers();

    const handleDataChange = () => {
      loadUsers();
    };

    window.addEventListener(DATA_CHANGED_EVENT, handleDataChange);
    return () => window.removeEventListener(DATA_CHANGED_EVENT, handleDataChange);
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch =
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.company && u.company.toLowerCase().includes(search.toLowerCase()));

    return matchesRole && matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUsername.trim() || !formEmail.trim()) return;

    const newUser: UserProfile = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      username: formUsername.trim(),
      email: formEmail.trim().toLowerCase(),
      role: formRole,
      status: formStatus,
      company: formCompany.trim() || 'Enterprise Workspace',
      createdAt: new Date().toISOString().split('T')[0],
      twoFactorEnabled: false,
    };

    saveUser(newUser);
    setIsCreateModalOpen(false);
    resetForm();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    updateUser(selectedUser.id, {
      username: formUsername.trim(),
      email: formEmail.trim().toLowerCase(),
      role: formRole,
      status: formStatus,
      company: formCompany.trim(),
    });

    setIsEditModalOpen(false);
    setSelectedUser(null);
    resetForm();
  };

  const openEditModal = (u: UserProfile) => {
    setSelectedUser(u);
    setFormUsername(u.username);
    setFormEmail(u.email);
    setFormRole(u.role);
    setFormStatus(u.status || 'active');
    setFormCompany(u.company || '');
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormUsername('');
    setFormEmail('');
    setFormRole('user');
    setFormStatus('active');
    setFormCompany('');
  };

  const handleDelete = (id: string, name: string) => {
    if (id === currentUser?.id) {
      alert('You cannot delete your own currently active admin account.');
      return;
    }
    if (confirm(`Are you sure you want to delete user account "${name}"?`)) {
      deleteUser(id);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-0.5 text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">
            <Users className="h-3.5 w-3.5" />
            <span>Master User Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            User Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Create user accounts, change roles (User ↔ Admin), toggle account status, and manage permissions.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => {
            resetForm();
            setIsCreateModalOpen(true);
          }}
          leftIcon={<Plus className="h-4 w-4" />}
          isMagnetic
        >
          Create User
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, company..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {(['all', 'user', 'admin'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold uppercase transition-all ${
                roleFilter === r
                  ? 'bg-purple-600 text-white shadow-glow-purple/20'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Account Created</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredUsers.map((u) => {
                const isCurrent = u.id === currentUser?.id;
                return (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs text-white ${
                          u.role === 'admin' ? 'bg-gradient-to-tr from-purple-600 to-indigo-600' : 'bg-gradient-to-tr from-cyan-500 to-blue-600'
                        }`}>
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{u.username}</span>
                            {isCurrent && (
                              <span className="text-[9px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.2 rounded">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500">{u.company || 'Enterprise Workspace'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-mono">
                      {u.email}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                          u.role === 'admin'
                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30'
                            : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                          u.status === 'active' || !u.status
                            ? 'text-emerald-500'
                            : u.status === 'inactive'
                            ? 'text-amber-500'
                            : 'text-rose-500'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            u.status === 'active' || !u.status
                              ? 'bg-emerald-500'
                              : u.status === 'inactive'
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                        />
                        {u.status || 'active'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{u.createdAt}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs"
                          onClick={() => openEditModal(u)}
                          leftIcon={<Edit2 className="h-3.5 w-3.5" />}
                        >
                          Edit
                        </Button>
                        {!isCurrent && (
                          <button
                            onClick={() => handleDelete(u.id, u.username)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New User Account"
        description="Register a new account in the system directory and assign permissions"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <Input
            label="Username / Name"
            placeholder="e.g. Rahul Sharma"
            value={formUsername}
            onChange={(e) => setFormUsername(e.target.value)}
            required
            autoFocus
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. rahul@example.com"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Assigned Role
              </label>
              <select
                value={formRole}
                onChange={(e) => setFormRole(e.target.value as UserRole)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-xs text-slate-800 dark:text-slate-200 outline-none"
              >
                <option value="user">User (Standard Workspace)</option>
                <option value="admin">Admin (Platform Authority)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Account Status
              </label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as AccountStatus)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-xs text-slate-800 dark:text-slate-200 outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <Input
            label="Company / Department"
            placeholder="e.g. AeroLux Logistics"
            value={formCompany}
            onChange={(e) => setFormCompany(e.target.value)}
          />

          <div className="pt-3 flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isMagnetic>
              Create Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      {selectedUser && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          title={`Edit User: ${selectedUser.username}`}
          description="Modify account role, permissions, and status"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
            <Input
              label="Username"
              value={formUsername}
              onChange={(e) => setFormUsername(e.target.value)}
              required
            />

            <Input
              label="Email Address"
              type="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Change Role
                </label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as UserRole)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-xs text-slate-800 dark:text-slate-200 outline-none"
                >
                  <option value="user">User (Standard)</option>
                  <option value="admin">Admin (Master)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Account Status
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as AccountStatus)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-xs text-slate-800 dark:text-slate-200 outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <Input
              label="Company"
              value={formCompany}
              onChange={(e) => setFormCompany(e.target.value)}
            />

            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[11px] text-purple-700 dark:text-purple-300">
              <strong>Role Switch Effect:</strong> Changing between User and Admin will immediately grant or restrict administrative routes upon next navigation or login.
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedUser(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isMagnetic>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
