import { Product, DashboardStats } from '@/lib/types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    sku: 'TT-LUX-9941',
    name: 'Aethel Chrono Grand Tourbillon',
    category: 'Luxury',
    brand: 'Aethel Horology',
    manufacturer: 'Atelier de Haute Horlogerie SA',
    manufacturingDate: '2025-03-12',
    origin: 'Geneva, Switzerland',
    currentLocation: 'Boutique Flagship, Zurich',
    status: 'authentic',
    verificationCount: 28,
    lastVerified: '12 mins ago',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80',
    description: 'Precision mechanical tourbillon crafted from aerospace-grade titanium and hand-finished sapphire crystal. Features dual-frequency cryptographic NFC micro-seal embedded inside the balance bridge.',
    batchNumber: 'BATCH-CHRONO-2025-Q1',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://truetrace.io/verify/TT-LUX-9941',
    securityScore: 99,
    timeline: [
      {
        id: 'step-1',
        title: 'Caliber Manufacture & Micro-Seal Imprint',
        status: 'completed',
        timestamp: '2025-03-12 09:30 GMT',
        location: 'Geneva Atelier, Switzerland',
        handler: 'Master Watchmaker Jean-Luc V.',
        notes: 'Cryptographic tag TT-LUX-9941 bound with zero-tolerance laser verification.',
        verifiedBy: 'Swiss Horology Authority'
      },
      {
        id: 'step-2',
        title: 'Chronometer Certification & Casing',
        status: 'completed',
        timestamp: '2025-03-18 14:15 GMT',
        location: 'COSC Testing Facility, Biel/Bienne',
        handler: 'Quality Assurance Team Alpha',
        notes: 'Passed 360-hour thermal and gravitational oscillation stress tests.',
        verifiedBy: 'COSC Official Registry'
      },
      {
        id: 'step-3',
        title: 'Secure Armored Transit Outbound',
        status: 'completed',
        timestamp: '2025-03-22 08:00 GMT',
        location: 'Geneva International Cargo Hub',
        handler: 'Brink’s Global Logistics Security',
        notes: 'Tamper-evident climate-controlled security container #CH-8812 sealed.',
        verifiedBy: 'Swiss Customs Export Port'
      },
      {
        id: 'step-4',
        title: 'Central Vault Intake Inspection',
        status: 'completed',
        timestamp: '2025-03-24 16:45 GMT',
        location: 'Zurich Vault Logistics Center',
        handler: 'Vault Logistics Specialist Marc E.',
        notes: 'Seal integrity verified 100%. Digital signatures matched origin record.',
        verifiedBy: 'Zurich Bonded Warehouse'
      },
      {
        id: 'step-5',
        title: 'Flagship Boutique Delivery',
        status: 'completed',
        timestamp: '2025-03-28 11:20 GMT',
        location: 'Bahnhofstrasse Flagship, Zurich',
        handler: 'Store Director Elena Rossi',
        notes: 'Physical custody handover completed and biometric scan logged.',
        verifiedBy: 'Boutique Security Desk'
      },
      {
        id: 'step-6',
        title: 'Point of Sale / Client Authentication',
        status: 'completed',
        timestamp: '2025-03-30 15:10 GMT',
        location: 'Bahnhofstrasse Flagship, Zurich',
        handler: 'Client Relationship Executive',
        notes: 'Customer TrueTrace app scan verified ownership transfer certificate.',
        verifiedBy: 'TrueTrace Decentralized Node'
      }
    ],
    specs: {
      'Movement': 'Automatic Caliber TT-9021',
      'Case Material': 'Grade 5 Titanium & Carbon Composite',
      'Water Resistance': '100m / 10 ATM',
      'Glass': 'Double Anti-Reflective Domed Sapphire',
      'NFC Security': 'AES-256 Dynamic Crypto Chip',
      'Limited Edition': '#14 / 50 Worldwide'
    }
  },
  {
    id: 'prod-002',
    sku: 'TT-ELEC-4420',
    name: 'NeuralPulse Quantum Audio Pro Headset',
    category: 'Electronics',
    brand: 'NeuralPulse Tech',
    manufacturer: 'OptoChip Semiconductor Fab 4',
    manufacturingDate: '2025-04-02',
    origin: 'Hsinchu, Taiwan',
    currentLocation: 'Distribution Center West, San Jose, CA',
    status: 'authentic',
    verificationCount: 142,
    lastVerified: '3 mins ago',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    description: 'Ultra-low latency lossless planar magnetic headphones with active biometric calibration and anti-counterfeit cryptographic Bluetooth controller.',
    batchNumber: 'BATCH-NP-2025-04A',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://truetrace.io/verify/TT-ELEC-4420',
    securityScore: 98,
    timeline: [
      {
        id: 'step-1',
        title: 'Silicon Fabrication & Hardware Key Burn',
        status: 'completed',
        timestamp: '2025-04-02 04:00 UTC',
        location: 'Hsinchu Science Park, Taiwan',
        handler: 'Automated Fab Line 7',
        notes: 'Unique hardware cryptographic seed burned into secure enclave silicon.',
        verifiedBy: 'Fab Security Core'
      },
      {
        id: 'step-2',
        title: 'Precision Acoustic Assembly & Enclosure',
        status: 'completed',
        timestamp: '2025-04-05 10:20 UTC',
        location: 'Taoyuan High-Tech Assembly Complex',
        handler: 'OptoChip Robotics Unit 3',
        notes: 'Passed frequency response parity test within 0.1dB tolerance.',
        verifiedBy: 'Acoustics Lab QA'
      },
      {
        id: 'step-3',
        title: 'Air Freight Cargo Handover',
        status: 'completed',
        timestamp: '2025-04-08 19:30 UTC',
        location: 'Taoyuan International Airport (TPE)',
        handler: 'Pacific Air Express Logistics',
        notes: 'Palletized in RFID-tracked container #PAE-9901.',
        verifiedBy: 'Taiwan Export Customs'
      },
      {
        id: 'step-4',
        title: 'Port of Entry Customs Clearance',
        status: 'completed',
        timestamp: '2025-04-10 06:15 PDT',
        location: 'San Francisco International Airport (SFO)',
        handler: 'US Customs & Border Protection',
        notes: 'Digital manifest verified via TrueTrace Supply Chain Bridge.',
        verifiedBy: 'US Customs Digital Registry'
      },
      {
        id: 'step-5',
        title: 'Regional Fulfillment Distribution Hub',
        status: 'completed',
        timestamp: '2025-04-12 13:40 PDT',
        location: 'San Jose Logistics Hub, CA',
        handler: 'Fulfillment Logistics Lead',
        notes: 'Ready for authorized retailer allocation.',
        verifiedBy: 'Bay Area Fulfillment System'
      },
      {
        id: 'step-6',
        title: 'Retailer Stock Intake Verification',
        status: 'in-progress',
        timestamp: '2025-04-15 09:00 PDT',
        location: 'San Jose, CA',
        handler: 'Logistics Scanner Station 4',
        notes: 'Awaiting final shelf placement scan.',
        verifiedBy: 'Pending'
      }
    ],
    specs: {
      'Driver Type': '50mm Planar Magnetic Diaphragm',
      'DAC / Amp': 'Integrated 32-bit / 384kHz Quad DAC',
      'Wireless': 'Bluetooth 5.4 + TrueTrace UltraLink',
      'Enclave': 'Hardware RoT (Root of Trust) Crypto Chip',
      'Battery': '45 Hours ANC Playback'
    }
  },
  {
    id: 'prod-003',
    sku: 'TT-PHARM-8819',
    name: 'Visiocure Neo Biologics 50mg/mL',
    category: 'Pharmaceuticals',
    brand: 'Novagen BioPharma',
    manufacturer: 'Novagen Sterile Biologics Facility',
    manufacturingDate: '2025-04-10',
    origin: 'Cambridge, MA, USA',
    currentLocation: 'Metropolitan Medical Center Pharmacy, NYC',
    status: 'authentic',
    verificationCount: 89,
    lastVerified: '1 hour ago',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    description: 'Cold-chain tracked targeted immunotherapy injection with digital thermal monitoring data points embedded in smart RFID vial seal.',
    batchNumber: 'LOT-NC-99120-B',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://truetrace.io/verify/TT-PHARM-8819',
    securityScore: 100,
    timeline: [
      {
        id: 'step-1',
        title: 'Sterile Formulation & Fill-Finish',
        status: 'completed',
        timestamp: '2025-04-10 03:00 EDT',
        location: 'Cambridge Cleanroom Facility A',
        handler: 'Certified Bio-Chemist Dr. S. Patel',
        notes: 'Batch purity 99.98%. Temperature logged at 2.4°C.',
        verifiedBy: 'FDA cGMP Validation System'
      },
      {
        id: 'step-2',
        title: 'Cryo-Sensor Capsule Integration',
        status: 'completed',
        timestamp: '2025-04-10 11:30 EDT',
        location: 'Cambridge Packaging Suite',
        handler: 'Automated Cryo-Labeling Unit',
        notes: 'IoT Cold-Chain beacon active with 10-minute heartbeat.',
        verifiedBy: 'Novagen Track & Trace'
      },
      {
        id: 'step-3',
        title: 'Cold-Chain Refrigerated Transport',
        status: 'completed',
        timestamp: '2025-04-11 07:00 EDT',
        location: 'Interstate Cryo-Fleet Unit #19',
        handler: 'MediTransit Cold Logistics Driver',
        notes: 'Continuous temp log maintained between 2.0°C and 3.1°C.',
        verifiedBy: 'IoT Fleet Telemetry Hub'
      },
      {
        id: 'step-4',
        title: 'Hospital Pharmacy Vault Intake',
        status: 'completed',
        timestamp: '2025-04-11 14:20 EDT',
        location: 'Metropolitan Medical Center, NYC',
        handler: 'Chief Pharmacist Dr. R. Chen',
        notes: 'Cold chain chain-of-custody unbroken. Seal verified intact.',
        verifiedBy: 'Hospital Pharmacy System'
      },
      {
        id: 'step-5',
        title: 'Bedside Dispense Verification',
        status: 'completed',
        timestamp: '2025-04-12 10:05 EDT',
        location: 'Metropolitan Medical Center Oncology Dept',
        handler: 'Registered Nurse M. Adams',
        notes: 'Scan matched patient prescription token #RX-99120.',
        verifiedBy: 'Hospital Epic EHR Integration'
      },
      {
        id: 'step-6',
        title: 'Post-Administration Vial Decommission',
        status: 'completed',
        timestamp: '2025-04-12 10:30 EDT',
        location: 'Metropolitan Medical Center',
        handler: 'Registered Nurse M. Adams',
        notes: 'Vial QR token marked consumed to prevent container re-use.',
        verifiedBy: 'TrueTrace Anti-Reuse Ledger'
      }
    ],
    specs: {
      'Active Compound': 'OncoPeptide Conjugate 50mg/mL',
      'Storage Requirement': '2°C to 8°C (Refrigerated, Do Not Freeze)',
      'Preservative Free': 'Single-Dose Sterile Glass Vial',
      'NDC Code': '70129-881-01',
      'IoT Sensor Battery': '6 Months Shelf Life Sensor'
    }
  },
  {
    id: 'prod-004',
    sku: 'TT-BAG-7718',
    name: 'Maison Éternelle Noir Cuir Handbag',
    category: 'Luxury',
    brand: 'Maison Éternelle',
    manufacturer: 'Atelier de Maroquinerie Parisienne',
    manufacturingDate: '2025-02-20',
    origin: 'Paris, France',
    currentLocation: 'Fifth Avenue Flagship, New York',
    status: 'suspicious',
    verificationCount: 19,
    lastVerified: '25 mins ago',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
    description: 'Handcrafted full-grain calfskin leather bag featuring gold-plated hardware and micro-stitched encrypted authenticity thread.',
    batchNumber: 'BATCH-ME-2025-P2',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://truetrace.io/verify/TT-BAG-7718',
    securityScore: 48,
    timeline: [
      {
        id: 'step-1',
        title: 'Artisanal Leather Cutting & Threading',
        status: 'completed',
        timestamp: '2025-02-20 10:00 CET',
        location: 'Paris Atelier, France',
        handler: 'Master Leather Artisan Henri D.',
        notes: 'Original security microthread woven into lining.',
        verifiedBy: 'Maison Éternelle Registry'
      },
      {
        id: 'step-2',
        title: 'Export Customs Handover',
        status: 'completed',
        timestamp: '2025-02-24 15:30 CET',
        location: 'Paris Charles de Gaulle (CDG)',
        handler: 'Luxury Freight Carrier',
        notes: 'Secured in sealed air freight container.',
        verifiedBy: 'French Customs'
      },
      {
        id: 'step-3',
        title: 'US Customs Inbound Inspection',
        status: 'completed',
        timestamp: '2025-02-26 12:00 EST',
        location: 'JFK International Airport, NY',
        handler: 'US Customs Import Inspector',
        notes: 'Standard clearance granted.',
        verifiedBy: 'US Customs Service'
      },
      {
        id: 'step-4',
        title: 'Unauthorized Reseller Secondary Scan',
        status: 'in-progress',
        timestamp: '2025-04-14 18:22 EDT',
        location: 'Secondary Marketplace Warehouse, Miami, FL',
        handler: 'Unverified Third Party Scanner',
        notes: 'Anomaly: Scan location mismatch from authorized boutique distribution network.',
        verifiedBy: 'TrueTrace Fraud Engine'
      }
    ],
    specs: {
      'Material': 'Full-Grain French Taurillon Leather',
      'Hardware': '24K Gold-Plated Brass',
      'Lining': 'Suede Calfskin with Cryptographic Weave',
      'Authentication': 'TrueTrace Dual-Layer RFID Thread'
    }
  },
  {
    id: 'prod-005',
    sku: 'TT-SNEAK-3190',
    name: 'HyperKicks Velocity Alpha Limited Sneakers',
    category: 'Apparel',
    brand: 'HyperKicks Studio',
    manufacturer: 'HyperKicks Advanced Footwear Lab',
    manufacturingDate: '2025-03-29',
    origin: 'Busan, South Korea',
    currentLocation: 'SneakerVault Resale Hub, Los Angeles',
    status: 'failed',
    verificationCount: 52,
    lastVerified: '5 mins ago',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=80',
    description: 'High-performance collectible sneaker with responsive carbon-plate cushioning. Cryptographic chip in tongue tag.',
    batchNumber: 'BATCH-HK-2025-V1',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://truetrace.io/verify/TT-SNEAK-3190',
    securityScore: 12,
    timeline: [
      {
        id: 'step-1',
        title: 'Tongue Tag Chip Simulation Attempt',
        status: 'completed',
        timestamp: '2025-04-18 14:02 PDT',
        location: 'Los Angeles, CA',
        handler: 'SneakerVault Authentication Kiosk',
        notes: 'CRITICAL: Cryptographic signature mismatch. Cloned serial identifier detected.',
        verifiedBy: 'TrueTrace Anti-Counterfeit Gate'
      }
    ],
    specs: {
      'Sole': 'Supercritical Foam + Carbon Fiber Shank',
      'Upper': 'Seamless FlyKnit Matrix',
      'Edition': '0042 / 1000 Pair Drop',
      'Security Chip': 'Counterfeit / Cloned RFID Detected'
    }
  },
  {
    id: 'prod-006',
    sku: 'TT-AUTO-5581',
    name: 'Apex Carbon Ceramic Brake Caliper Assembly',
    category: 'Automotive',
    brand: 'Apex Performance Systems',
    manufacturer: 'Apex Motorsport Engineering',
    manufacturingDate: '2025-01-10',
    origin: 'Stuttgart, Germany',
    currentLocation: 'Apex Certified Tuning Facility, Austin, TX',
    status: 'authentic',
    verificationCount: 16,
    lastVerified: '4 hours ago',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&auto=format&fit=crop&q=80',
    description: 'Motorsport-spec monobloc forged aluminium 6-piston brake caliper with integrated high-temperature laser engraved serial QR and anti-tamper thermal seal.',
    batchNumber: 'BATCH-APEX-CCB-2025',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://truetrace.io/verify/TT-AUTO-5581',
    securityScore: 97,
    timeline: [
      {
        id: 'step-1',
        title: 'CNC Precision Forging & Laser Etching',
        status: 'completed',
        timestamp: '2025-01-10 08:00 CET',
        location: 'Stuttgart Factory 1, Germany',
        handler: 'Senior CNC Engineer Klaus W.',
        notes: 'Laser serial engraved with high-resolution micro-matrix code.',
        verifiedBy: 'TÜV Rheinland Inspection'
      },
      {
        id: 'step-2',
        title: 'Thermal Stress & Hydrostatic Pressure Test',
        status: 'completed',
        timestamp: '2025-01-15 14:30 CET',
        location: 'Apex Testing Laboratory',
        handler: 'Dynamics Test Specialist',
        notes: 'Passed 800°C ceramic rotor thermal shock resistance test.',
        verifiedBy: 'FIA Component Registry'
      },
      {
        id: 'step-3',
        title: 'Airfreight Transport Outbound',
        status: 'completed',
        timestamp: '2025-01-20 11:00 CET',
        location: 'Frankfurt Airport (FRA)',
        handler: 'Lufthansa Cargo Security',
        notes: 'Dispatched to US Distribution.',
        verifiedBy: 'German Customs Export'
      },
      {
        id: 'step-4',
        title: 'Certified Performance Shop Receipt',
        status: 'completed',
        timestamp: '2025-01-26 15:45 CST',
        location: 'Apex Certified Facility, Austin, TX',
        handler: 'Master Automotive Technician',
        notes: 'Verified authenticity token prior to track car installation.',
        verifiedBy: 'Apex Digital Portal'
      }
    ],
    specs: {
      'Piston Count': '6-Piston Opposed Monobloc',
      'Material': 'Aerospace 6061-T6 Forged Aluminum',
      'Rotor Compatibility': 'Carbon Ceramic 380mm - 410mm',
      'Max Operating Temp': '950°C',
      'Laser Security': 'Tamper-Evident Direct Part Marking (DPM)'
    }
  }
];

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalProducts: 1248,
  totalProductsChange: '+12.4% this month',
  verifiedProducts: 1102,
  verifiedProductsChange: '+18.2% vs last month',
  flaggedProducts: 37,
  flaggedProductsChange: '-8.5% counterfeit reduction',
  verificationRate: 94.8,
  verificationRateChange: '+2.1% confidence score',
};
