import { VerificationRecord } from '@/lib/types';

export const MOCK_VERIFICATIONS: VerificationRecord[] = [
  {
    id: 'scan-1099',
    productId: 'prod-001',
    productName: 'Aethel Chrono Grand Tourbillon',
    brand: 'Aethel Horology',
    category: 'Luxury',
    verificationId: 'TT-LUX-9941',
    status: 'authentic',
    scannedAt: 'Just now (2 mins ago)',
    location: 'Zurich, Switzerland',
    scannedBy: 'Boutique POS Terminal #04',
    deviceType: 'TrueTrace Optical Pro Scanner v2',
    ipAddress: '194.230.14.88',
    anomalyScore: 2,
    riskFactors: ['Valid cryptographic signature', 'Single physical tag read', 'Authorized dealer location']
  },
  {
    id: 'scan-1098',
    productId: 'prod-002',
    productName: 'NeuralPulse Quantum Audio Pro Headset',
    brand: 'NeuralPulse Tech',
    category: 'Electronics',
    verificationId: 'TT-ELEC-4420',
    status: 'authentic',
    scannedAt: '14 mins ago',
    location: 'San Jose, CA, USA',
    scannedBy: 'Retailer Intake Terminal 09',
    deviceType: 'Apple iPhone 15 Pro (App v3.2)',
    ipAddress: '172.56.21.90',
    anomalyScore: 4,
    riskFactors: ['Hardware RoT Key validated', 'Chain of custody continuous']
  },
  {
    id: 'scan-1097',
    productId: 'prod-005',
    productName: 'HyperKicks Velocity Alpha Limited Sneakers',
    brand: 'HyperKicks Studio',
    category: 'Apparel',
    verificationId: 'TT-SNEAK-3190',
    status: 'failed',
    scannedAt: '42 mins ago',
    location: 'Los Angeles, CA, USA',
    scannedBy: 'Customer Mobile App',
    deviceType: 'Samsung Galaxy S24 Ultra',
    ipAddress: '198.51.100.45',
    anomalyScore: 94,
    riskFactors: [
      'Cloned QR payload detected (already registered to different owner)',
      'Security micro-tag HMAC check failed',
      'Non-certified origin factory serial number'
    ]
  },
  {
    id: 'scan-1096',
    productId: 'prod-004',
    productName: 'Maison Éternelle Noir Cuir Handbag',
    brand: 'Maison Éternelle',
    category: 'Luxury',
    verificationId: 'TT-BAG-7718',
    status: 'suspicious',
    scannedAt: '1 hour ago',
    location: 'Miami, FL, USA',
    scannedBy: 'Secondary Market Appraiser',
    deviceType: 'iPad Pro TrueTrace Field Edition',
    ipAddress: '104.28.19.12',
    anomalyScore: 56,
    riskFactors: [
      'Geographical transit velocity anomaly (impossible travel speed from Paris)',
      'Scanned outside authorized boutique zone'
    ]
  },
  {
    id: 'scan-1095',
    productId: 'prod-003',
    productName: 'Visiocure Neo Biologics 50mg/mL',
    brand: 'Novagen BioPharma',
    category: 'Pharmaceuticals',
    verificationId: 'TT-PHARM-8819',
    status: 'authentic',
    scannedAt: '2 hours ago',
    location: 'New York, NY, USA',
    scannedBy: 'Hospital Pharmacy Scanner',
    deviceType: 'Zebra Enterprise TC52x Healthcare',
    ipAddress: '64.104.44.18',
    anomalyScore: 1,
    riskFactors: ['Temperature history verified continuous 2.4°C', 'Hospital EHR token matched']
  },
  {
    id: 'scan-1094',
    productId: 'prod-006',
    productName: 'Apex Carbon Ceramic Brake Caliper Assembly',
    brand: 'Apex Performance',
    category: 'Automotive',
    verificationId: 'TT-AUTO-5581',
    status: 'authentic',
    scannedAt: '3 hours ago',
    location: 'Austin, TX, USA',
    scannedBy: 'Apex Certified Tech Station',
    deviceType: 'Windows Tablet Scanner',
    ipAddress: '12.188.92.5',
    anomalyScore: 3,
    riskFactors: ['Laser DPM matrix serial confirmed authentic']
  },
  {
    id: 'scan-1093',
    productId: 'prod-001',
    productName: 'Aethel Chrono Grand Tourbillon',
    brand: 'Aethel Horology',
    category: 'Luxury',
    verificationId: 'TT-LUX-9941',
    status: 'authentic',
    scannedAt: '5 hours ago',
    location: 'Geneva, Switzerland',
    scannedBy: 'Geneva Export Inspector',
    deviceType: 'TrueTrace Optical Pro Scanner v2',
    ipAddress: '194.230.14.10',
    anomalyScore: 0,
    riskFactors: ['Factory digital seal confirmed']
  },
  {
    id: 'scan-1092',
    productId: 'prod-005',
    productName: 'Counterfeit Ultra Pro Earbuds',
    brand: 'SonicAudio (Fake)',
    category: 'Electronics',
    verificationId: 'TT-FAKE-0000',
    status: 'failed',
    scannedAt: '7 hours ago',
    location: 'Chicago, IL, USA',
    scannedBy: 'Consumer Web Portal',
    deviceType: 'Chrome on macOS',
    ipAddress: '24.12.89.102',
    anomalyScore: 99,
    riskFactors: [
      'Unregistered Serial ID',
      'No cryptographic certificate exists on the ledger',
      'Blacklisted counterfeit distributor tag'
    ]
  }
];

export const PRESET_TEST_VERIFICATIONS = {
  authentic: {
    id: 'TT-LUX-9941',
    title: 'Aethel Chrono Grand Tourbillon',
    category: 'Luxury Timepiece',
    brand: 'Aethel Horology (Geneva, Switzerland)',
    status: 'authentic' as const,
    manufacturer: 'Atelier de Haute Horlogerie SA',
    batch: 'BATCH-CHRONO-2025-Q1',
    manufacturedDate: 'March 12, 2025',
    originLocation: 'Geneva Atelier, Switzerland',
    currentLocation: 'Bahnhofstrasse Flagship, Zurich',
    securityScore: 99,
    signature: '0x8f2a991b34c7...4e819b7d82f1',
    confidence: '99.9% High Trust',
    summary: 'The cryptographic micro-seal and decentralized provenance signatures match the manufacturer root certificate with zero anomalies.',
    details: [
      { label: 'Origin Cryptographic Seal', value: 'VERIFIED (RSA-4096 / Ed25519)', status: 'success' },
      { label: 'Supply Chain Chain-of-Custody', value: '100% UNBROKEN (6 Milestones)', status: 'success' },
      { label: 'Location Anomaly Score', value: '0.02 (Optimal)', status: 'success' },
      { label: 'Anti-Cloning Token Counter', value: '1 of 1 Unique Active Token', status: 'success' }
    ]
  },
  suspicious: {
    id: 'TT-BAG-7718',
    title: 'Maison Éternelle Noir Cuir Handbag',
    category: 'Luxury Fashion',
    brand: 'Maison Éternelle (Paris, France)',
    status: 'suspicious' as const,
    manufacturer: 'Atelier de Maroquinerie Parisienne',
    batch: 'BATCH-ME-2025-P2',
    manufacturedDate: 'February 20, 2025',
    originLocation: 'Paris Atelier, France',
    currentLocation: 'Secondary Resale Warehouse, Miami, FL',
    securityScore: 48,
    signature: '0x3c19e887aa21...912a78bf112a',
    confidence: '48.0% Moderate Risk',
    summary: 'While the physical RFID thread contains a valid manufacturer identifier, recent scans indicate impossible geographic travel and unauthorized retailer distribution.',
    details: [
      { label: 'Origin Cryptographic Seal', value: 'PARTIAL MATCH', status: 'warning' },
      { label: 'Supply Chain Chain-of-Custody', value: 'FLAGGED (Missing US Boutique Intake)', status: 'warning' },
      { label: 'Location Anomaly Score', value: '56.4 (Transit Speed Anomaly)', status: 'warning' },
      { label: 'Anti-Cloning Token Counter', value: 'Duplicate concurrent scans detected', status: 'warning' }
    ]
  },
  failed: {
    id: 'TT-0000-XX',
    title: 'Unverified / Counterfeit Item Alert',
    category: 'Unknown / Counterfeit',
    brand: 'Forged Signature Entity',
    status: 'failed' as const,
    manufacturer: 'Unregistered Entity',
    batch: 'UNKNOWN-FORGERY',
    manufacturedDate: 'N/A',
    originLocation: 'Unregistered Location',
    currentLocation: 'Public Scan Point',
    securityScore: 8,
    signature: 'INVALID_OR_MISSING_SIGNATURE',
    confidence: '0.0% High Risk Counterfeit',
    summary: 'CRITICAL WARNING: This item failed all cryptographic verification checks. The security certificate is counterfeit or does not exist in the authorized TrueTrace registry.',
    details: [
      { label: 'Origin Cryptographic Seal', value: 'FAILED (Invalid Root Certificate)', status: 'danger' },
      { label: 'Supply Chain Chain-of-Custody', value: 'NON-EXISTENT RECORD', status: 'danger' },
      { label: 'Location Anomaly Score', value: '99.8 (Critical Risk)', status: 'danger' },
      { label: 'Anti-Cloning Token Counter', value: 'Blacklisted Serial Pattern', status: 'danger' }
    ]
  }
};
