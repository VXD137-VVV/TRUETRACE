import fs from 'fs';
import path from 'path';
import { Blockchain } from './blockchain';
import { Product, UserProfile, VerificationRecord, ScanHistoryItem } from '@/lib/types';

export interface DatabaseSchema {
  users: UserProfile[];
  products: Product[];
  verifications: VerificationRecord[];
  scanHistory: ScanHistoryItem[];
  blockchain: any;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'truetrace_db.json');

// In-memory singleton with write-through file sync
let globalBlockchain: Blockchain | null = null;

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getDefaultDatabase(): DatabaseSchema {
  const defaultAdmin: UserProfile = {
    id: 'admin-001',
    username: 'Alex Vance',
    email: 'admin@truetrace.io',
    role: 'admin',
    status: 'active',
    company: 'TrueTrace Security Labs',
    createdAt: '2025-01-01',
    twoFactorEnabled: true,
    themePreference: 'dark',
  };

  const initialBlockchain = new Blockchain();

  // Mint Genesis Demo Product onto the Blockchain
  const initialProduct: Product = {
    id: 'prod-genesis-001',
    sku: 'TT-LUX-9941',
    name: 'Aethel Chrono Grand Tourbillon',
    category: 'Luxury',
    brand: 'Aethel Horology',
    manufacturer: 'Atelier de Haute Horlogerie SA',
    manufacturingDate: '2025-03-12',
    origin: 'Geneva, Switzerland',
    currentLocation: 'Bahnhofstrasse Flagship Vault, Zurich',
    status: 'authentic',
    verificationCount: 1,
    lastVerified: 'Just now',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80',
    description: 'Masterpiece tourbillon timepiece featuring single-crystal sapphire casing and cryptographic micro-tag seal.',
    batchNumber: 'BATCH-CHRONO-2025-Q1',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://truetrace.io/verify/TT-LUX-9941',
    securityScore: 99,
    userId: 'admin-001',
    timeline: [
      {
        id: 'step-1',
        title: 'Manufactured & Cryptographically Sealed',
        status: 'completed',
        timestamp: '2025-03-12 09:30 AM',
        location: 'Geneva Atelier, Switzerland',
        handler: 'Master Horologist Jean-Luc',
        notes: 'RSA-4096 / Ed25519 root micro-seal embedded into bezel.',
        verifiedBy: 'Geneva Quality Directorate',
      },
      {
        id: 'step-2',
        title: 'Tamper-Evident Packaging & Export Cleared',
        status: 'completed',
        timestamp: '2025-03-14 02:15 PM',
        location: 'Geneva International Port',
        handler: 'Alpine Secure Logistics',
        notes: 'Passed x-ray optical seal integrity scan.',
      },
      {
        id: 'step-3',
        title: 'Arrived at Flagship Vault & Verified',
        status: 'completed',
        timestamp: '2025-03-16 11:00 AM',
        location: 'Bahnhofstrasse Flagship, Zurich',
        handler: 'Boutique Curator Elena',
        notes: 'Handshake scan performed via TrueTrace Optical Scanner.',
      },
    ],
    specs: {
      'Movement': 'Manual-Wind Flying Tourbillon (Calibre TT-01)',
      'Case Material': 'Grade 5 Titanium & Anti-Scratch Sapphire',
      'Power Reserve': '72 Hours Chronometer Certified',
      'Digital Passport': 'Decentralized SHA-256 Block Proof #1',
    },
  };

  // Add transaction and mine Block #1
  initialBlockchain.addTransaction({
    type: 'PRODUCT_MINT',
    sku: initialProduct.sku,
    productId: initialProduct.id,
    productName: initialProduct.name,
    actor: 'Atelier de Haute Horlogerie SA',
    location: 'Geneva Atelier, Switzerland',
    details: {
      category: initialProduct.category,
      batch: initialProduct.batchNumber,
      registeredBy: 'admin-001',
    },
  });
  initialBlockchain.minePendingTransactions('Geneva Validator Node #1');

  return {
    users: [defaultAdmin],
    products: [initialProduct],
    verifications: [],
    scanHistory: [],
    blockchain: initialBlockchain,
  };
}

export function readDatabase(): DatabaseSchema {
  ensureDataDir();

  if (!fs.existsSync(DB_FILE)) {
    const defaults = getDefaultDatabase();
    writeDatabase(defaults);
    globalBlockchain = defaults.blockchain;
    return defaults;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed: DatabaseSchema = JSON.parse(raw);

    if (!globalBlockchain) {
      globalBlockchain = Blockchain.fromJSON(parsed.blockchain);
    }

    return {
      ...parsed,
      blockchain: globalBlockchain,
    };
  } catch (error) {
    console.error('Error reading database file, reinitializing:', error);
    const defaults = getDefaultDatabase();
    writeDatabase(defaults);
    globalBlockchain = defaults.blockchain;
    return defaults;
  }
}

export function writeDatabase(data: DatabaseSchema): void {
  ensureDataDir();
  try {
    const payload = {
      ...data,
      blockchain: data.blockchain instanceof Blockchain ? data.blockchain : globalBlockchain,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to write database file:', error);
  }
}

export function getBlockchain(): Blockchain {
  if (!globalBlockchain) {
    const db = readDatabase();
    globalBlockchain = db.blockchain || new Blockchain();
  }
  return globalBlockchain as Blockchain;
}

export function saveBlockchain(blockchain: Blockchain): void {
  globalBlockchain = blockchain;
  const db = readDatabase();
  db.blockchain = blockchain;
  writeDatabase(db);
}
