// TrueTrace Supply Chain Smart Contract Configuration & ABI

export const TRUETRACE_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_TRUETRACE_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3';

export const SUPPORTED_NETWORKS = {
  11155111: {
    name: 'Sepolia Testnet',
    currency: 'ETH',
    explorer: 'https://sepolia.etherscan.io',
    rpcUrl: 'https://rpc.sepolia.org',
  },
  31337: {
    name: 'Hardhat Localhost',
    currency: 'ETH',
    explorer: 'http://localhost:8545',
    rpcUrl: 'http://127.0.0.1:8545',
  },
  1337: {
    name: 'Ganache Localhost',
    currency: 'ETH',
    explorer: 'http://localhost:7545',
    rpcUrl: 'http://127.0.0.1:7545',
  },
  80002: {
    name: 'Polygon Amoy Testnet',
    currency: 'MATIC',
    explorer: 'https://amoy.polygonscan.com',
    rpcUrl: 'https://rpc-amoy.polygon.technology',
  },
};

export const PRODUCT_STATUS_LABELS: Record<number, { label: string; color: string; bg: string; border: string }> = {
  0: { label: 'Pending Admin Approval', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  1: { label: 'Approved by Site Admin', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  2: { label: 'Rejected by Admin', color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
  3: { label: 'In Transit / Logistics', color: 'text-cyan-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
  4: { label: 'Delivered & Authentic', color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
};

export const TRUETRACE_ABI = [
  "function admin() view returns (address)",
  "function transferAdmin(address _newAdmin)",
  "function registerProduct(string _sku, string _name, string _brand, string _origin, string _ipfsMetadata) returns (uint256)",
  "function reviewProduct(uint256 _id, bool _approve, string _notes)",
  "function updateTransitLocation(uint256 _id, string _newLocation, string _notes)",
  "function markDelivered(uint256 _id, string _finalLocation)",
  "function verifyBySku(string _sku) view returns (uint256 id, string name, string brand, string origin, address vendor, address approvedByAdmin, uint8 status, uint256 createdAt, uint256 approvedAt, string currentLocation, string notes)",
  "function totalProducts() view returns (uint256)",
  "function products(uint256) view returns (uint256 id, string sku, string name, string brand, string origin, string ipfsMetadata, address vendor, address approvedByAdmin, uint8 status, uint256 createdAt, uint256 approvedAt, string currentLocation, string notes)",
  "event ProductRegistered(uint256 indexed id, string indexed sku, string name, address indexed vendor, uint256 timestamp)",
  "event ProductReviewedByAdmin(uint256 indexed id, string indexed sku, address indexed admin, bool approved, string notes, uint256 timestamp)",
  "event CustodyUpdated(uint256 indexed id, string indexed sku, string newLocation, address indexed handler, uint256 timestamp)"
];
