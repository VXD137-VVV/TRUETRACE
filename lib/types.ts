export type VerificationStatus = 'authentic' | 'suspicious' | 'failed' | 'not_found';
export type UserRole = 'user' | 'admin';
export type AccountStatus = 'active' | 'inactive' | 'suspended';

export interface ProductTimelineStep {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'pending';
  timestamp: string;
  location: string;
  handler: string;
  notes?: string;
  verifiedBy?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: 'Luxury' | 'Electronics' | 'Pharmaceuticals' | 'Apparel' | 'Cosmetics' | 'Automotive';
  brand: string;
  manufacturer: string;
  manufacturingDate: string;
  origin: string;
  currentLocation: string;
  status: VerificationStatus;
  verificationCount: number;
  lastVerified: string;
  image: string;
  description: string;
  batchNumber: string;
  qrCodeUrl: string;
  securityScore: number; // 0-100
  timeline: ProductTimelineStep[];
  specs: Record<string, string>;
  createdAt?: string;
  userId?: string;
  // Web3 / Supply Chain Provenance Fields
  onChainStatus?: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'IN_TRANSIT' | 'DELIVERED';
  vendorWallet?: string;
  adminApproverWallet?: string;
  creationTxHash?: string;
  approvalTxHash?: string;
  approvedAt?: string;
  contractAddress?: string;
  blockNumber?: number;
}

export interface VerificationRecord {
  id: string;
  productId?: string;
  productName: string;
  brand: string;
  category: string;
  verificationId: string;
  status: VerificationStatus;
  scannedAt: string;
  location: string;
  scannedBy: string;
  deviceType: string;
  ipAddress: string;
  anomalyScore: number;
  method?: 'camera' | 'upload' | 'manual';
  riskFactors?: string[];
  userId?: string;
}

export interface ScanHistoryItem {
  id: string;
  scanCode: string;
  result: VerificationStatus;
  date: string;
  time: string;
  method: 'camera' | 'upload' | 'manual';
  productId?: string;
  productName?: string;
  userId: string;
  username: string;
  details?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  avatarUrl?: string;
  company?: string;
  createdAt: string;
  twoFactorEnabled?: boolean;
  themePreference?: 'dark' | 'light' | 'system';
  notificationPreferences?: {
    counterfeitAlerts: boolean;
    supplyChainAnomalies: boolean;
    dailyDigest: boolean;
  };
}

export interface PlatformSettings {
  platformName: string;
  allowRegistration: boolean;
  allowUserVerification: boolean;
  defaultTheme: 'dark' | 'light' | 'system';
  enableCursorEffects: boolean;
  enableAnimations: boolean;
  enableEmailAlerts: boolean;
  sessionTimeoutMinutes: number;
}

export interface UserDataStore {
  products: Product[];
  verifications: VerificationRecord[];
  scanHistory: ScanHistoryItem[];
}

export interface AnalyticsDataPoint {
  month: string;
  authentic: number;
  suspicious: number;
  failed: number;
  total: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalProductsChange?: string;
  verifiedProducts: number;
  verifiedProductsChange?: string;
  flaggedProducts: number;
  flaggedProductsChange?: string;
  verificationRate: number;
  verificationRateChange?: string;
  totalAttempts?: number;
}

export interface SupplyChainNode {
  id: string;
  name: string;
  type: string;
  location: string;
  coordinates: { x: number; y: number };
  status: 'healthy' | 'warning' | 'alert';
  activeShipments: number;
  avgDwellTime: string;
}
