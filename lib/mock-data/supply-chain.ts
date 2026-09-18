import { SupplyChainNode } from '@/lib/types';

export const MOCK_SUPPLY_CHAIN_NODES: SupplyChainNode[] = [
  {
    id: 'node-1',
    name: 'Precision Watch Atelier',
    type: 'Manufacturer',
    location: 'Geneva, Switzerland',
    coordinates: { x: 15, y: 35 },
    status: 'healthy',
    activeShipments: 14,
    avgDwellTime: '18 hours'
  },
  {
    id: 'node-2',
    name: 'OptoChip Silicon Foundry',
    type: 'Manufacturer',
    location: 'Hsinchu, Taiwan',
    coordinates: { x: 75, y: 55 },
    status: 'healthy',
    activeShipments: 42,
    avgDwellTime: '12 hours'
  },
  {
    id: 'node-3',
    name: 'Novagen Clean Biologics Unit',
    type: 'Packaging Facility',
    location: 'Cambridge, MA, USA',
    coordinates: { x: 30, y: 32 },
    status: 'healthy',
    activeShipments: 8,
    avgDwellTime: '6 hours'
  },
  {
    id: 'node-4',
    name: 'Euro-Trans Continental Customs Hub',
    type: 'Customs/Port',
    location: 'Frankfurt, Germany',
    coordinates: { x: 22, y: 28 },
    status: 'healthy',
    activeShipments: 31,
    avgDwellTime: '14 hours'
  },
  {
    id: 'node-5',
    name: 'Pacific Freight Air Gate',
    type: 'Customs/Port',
    location: 'San Francisco, CA, USA',
    coordinates: { x: 10, y: 38 },
    status: 'healthy',
    activeShipments: 68,
    avgDwellTime: '9 hours'
  },
  {
    id: 'node-6',
    name: 'Southeast Reseller Hub (Flagged)',
    type: 'Regional Hub',
    location: 'Miami, FL, USA',
    coordinates: { x: 26, y: 50 },
    status: 'warning',
    activeShipments: 5,
    avgDwellTime: '48 hours'
  },
  {
    id: 'node-7',
    name: 'Metropolitan Hospital Distribution Hub',
    type: 'Retail Distribution',
    location: 'New York, NY, USA',
    coordinates: { x: 32, y: 34 },
    status: 'healthy',
    activeShipments: 19,
    avgDwellTime: '4 hours'
  },
  {
    id: 'node-8',
    name: 'Bahnhofstrasse Flagship Vault',
    type: 'End Customer',
    location: 'Zurich, Switzerland',
    coordinates: { x: 19, y: 33 },
    status: 'healthy',
    activeShipments: 3,
    avgDwellTime: '2 hours'
  }
];

export const MOCK_SUPPLY_CHAIN_STATS = {
  activeTrackingNodes: 142,
  inTransitItems: 8432,
  onTimeTransitRate: '99.4%',
  tamperAttemptsBlocked: 29,
  avgTransitTime: '2.8 Days',
  coldChainCompliance: '100.0%'
};
