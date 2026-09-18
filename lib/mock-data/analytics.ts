import { AnalyticsDataPoint } from '@/lib/types';

export const MOCK_MONTHLY_ANALYTICS: AnalyticsDataPoint[] = [
  { month: 'Nov', authentic: 820, suspicious: 42, failed: 18, total: 880 },
  { month: 'Dec', authentic: 960, suspicious: 51, failed: 22, total: 1033 },
  { month: 'Jan', authentic: 1040, suspicious: 38, failed: 15, total: 1093 },
  { month: 'Feb', authentic: 1120, suspicious: 45, failed: 19, total: 1184 },
  { month: 'Mar', authentic: 1210, suspicious: 32, failed: 12, total: 1254 },
  { month: 'Apr', authentic: 1350, suspicious: 29, failed: 8, total: 1387 }
];

export const MOCK_CATEGORY_DISTRIBUTION = [
  { category: 'Luxury Timepieces & Fashion', count: 480, percentage: 38.5, color: '#00F0FF' },
  { category: 'Quantum & High-Tech Electronics', count: 350, percentage: 28.1, color: '#6366F1' },
  { category: 'Pharmaceuticals & BioLogics', count: 240, percentage: 19.3, color: '#10B981' },
  { category: 'Automotive & Aerospace Parts', count: 120, percentage: 9.6, color: '#9D00FF' },
  { category: 'Apparel & Collectibles', count: 58, percentage: 4.5, color: '#F59E0B' }
];

export const MOCK_GEO_VERIFICATIONS = [
  { country: 'United States', code: 'US', scans: 4521, trustRate: '98.4%', activeFlags: 14 },
  { country: 'Switzerland', code: 'CH', scans: 2310, trustRate: '99.9%', activeFlags: 1 },
  { country: 'Germany', code: 'DE', scans: 1980, trustRate: '99.2%', activeFlags: 3 },
  { country: 'United Kingdom', code: 'GB', scans: 1650, trustRate: '97.8%', activeFlags: 8 },
  { country: 'Japan', code: 'JP', scans: 1420, trustRate: '99.5%', activeFlags: 2 },
  { country: 'France', code: 'FR', scans: 1280, trustRate: '98.1%', activeFlags: 5 },
  { country: 'Singapore', code: 'SG', scans: 950, trustRate: '99.1%', activeFlags: 2 }
];

export const MOCK_SECURITY_LOGS = [
  { id: 'sec-1', time: '10:42 AM', event: 'Cryptographic Batch Re-Verification', type: 'system', status: 'Passed' },
  { id: 'sec-2', time: '09:15 AM', event: 'Cloned Token Signature Intercepted', type: 'security', status: 'Blocked' },
  { id: 'sec-3', time: '07:30 AM', event: 'Rotational Root-of-Trust Key Synchronization', type: 'system', status: 'Complete' },
  { id: 'sec-4', time: 'Yesterday', event: 'Cold Chain Anomaly Alert Resolved', type: 'telemetry', status: 'Resolved' },
  { id: 'sec-5', time: 'Yesterday', event: 'New Authorized Reseller Node Registered (Zurich)', type: 'auth', status: 'Verified' }
];
