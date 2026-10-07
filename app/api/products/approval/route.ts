import { NextResponse } from 'next/server';
import { readDatabase, writeDatabase, getBlockchain, saveBlockchain } from '@/lib/server/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, sku, approved, adminWallet, txHash, notes } = body;

    if (!productId && !sku) {
      return NextResponse.json(
        { success: false, error: 'Product ID or SKU is required for approval' },
        { status: 400 }
      );
    }

    const db = readDatabase();
    const blockchain = getBlockchain();

    const cleanSku = (sku || '').trim().toUpperCase();
    const cleanId = (productId || '').trim().toUpperCase();
    const targetCode = cleanSku || cleanId;

    // Match product by id or sku flexibly
    let prodIndex = db.products.findIndex((p) => {
      const pSku = p.sku.toUpperCase();
      const pId = p.id.toUpperCase();
      return (
        (cleanSku && pSku === cleanSku) ||
        (cleanId && pId === cleanId) ||
        (targetCode && pSku.includes(targetCode)) ||
        (targetCode && targetCode.includes(pSku))
      );
    });

    let product = prodIndex >= 0 ? db.products[prodIndex] : null;
    const newStatus = approved ? 'APPROVED' : 'REJECTED';
    const timestamp = new Date().toISOString();

    if (!product) {
      // Auto-create product record if it originated from a client without prior sync
      const generatedId = productId || `prod-${Date.now().toString().slice(-6)}`;
      const finalSku = sku || productId || `TT-GEN-${Math.floor(1000 + Math.random() * 9000)}`;

      product = {
        id: generatedId,
        sku: finalSku,
        name: body.name || `Batch ${finalSku}`,
        category: body.category || 'Luxury',
        brand: body.brand || 'Verified Authority',
        manufacturer: 'Registered Genesis Facility',
        manufacturingDate: new Date().toISOString().split('T')[0],
        origin: 'Central Manufacturing Vault',
        currentLocation: 'Central Security Node',
        status: approved ? 'authentic' : 'suspicious',
        verificationCount: 1,
        lastVerified: 'Just now (Admin Approved)',
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80',
        description: notes || 'Cryptographically verified registered asset.',
        batchNumber: `BATCH-${new Date().getFullYear()}`,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://truetrace.io/verify/${finalSku}`,
        securityScore: 99,
        onChainStatus: newStatus,
        vendorWallet: body.vendorWallet || '0x71C8364f3B8820B134D0d32B8180E2e89BfEb950',
        adminApproverWallet: adminWallet,
        approvalTxHash: txHash,
        approvedAt: timestamp,
        specs: {
          'Origin Standard': 'ISO/IEC 27001 Cryptographic RoT',
          'Approval Tx': `${txHash.substring(0, 14)}...`,
        },
        timeline: [
          {
            id: `step-genesis-${Date.now()}`,
            title: 'Vendor Genesis Mint',
            status: 'completed',
            timestamp: new Date().toLocaleString(),
            location: 'Genesis Production Node',
            handler: 'Authorized Vendor',
            notes: 'Registered on decentralized ledger.',
          },
        ],
      };
      db.products.unshift(product);
      prodIndex = 0;
    } else {
      product.onChainStatus = newStatus;
      product.adminApproverWallet = adminWallet;
      product.approvalTxHash = txHash;
      product.approvedAt = timestamp;
      product.lastVerified = approved ? 'Site Admin Approved & Verified' : 'Rejected by Site Admin';
    }

    const approvalStep = {
      id: `step-admin-${Date.now()}`,
      title: approved ? 'Site Admin Verified & Approved on MetaMask' : 'Rejected by Site Admin',
      status: (approved ? 'completed' : 'pending') as 'completed' | 'in-progress' | 'pending',
      timestamp: new Date().toLocaleString(),
      location: 'TrueTrace Security Root Authority Node',
      handler: `Site Admin (${adminWallet.substring(0, 6)}...${adminWallet.substring(adminWallet.length - 4)})`,
      notes:
        notes ||
        (approved
          ? `Cryptographic signature validated via MetaMask. Blockchain Tx: ${txHash.substring(0, 10)}...`
          : 'Batch rejected during audit review.'),
      verifiedBy: `Admin Authority (${adminWallet.substring(0, 8)}...)`,
    };

    if (product.timeline && product.timeline.length > 1 && product.timeline[1].title.includes('Awaiting')) {
      product.timeline[1] = approvalStep;
    } else {
      product.timeline = product.timeline || [];
      product.timeline.push(approvalStep);
    }

    // Record on-chain event on decentralized blockchain
    blockchain.addTransaction({
      type: approved ? 'ADMIN_APPROVAL' : 'ADMIN_REJECTION',
      sku: product.sku,
      productId: product.id,
      productName: product.name,
      actor: `Admin (${adminWallet.substring(0, 8)}...)`,
      location: 'Site Admin Node',
      details: {
        action: approved ? 'APPROVED' : 'REJECTED',
        adminWallet,
        txHash,
        notes: approvalStep.notes,
        timestamp,
      },
    });

    // Mine verification block
    const minedBlock = blockchain.minePendingTransactions(
      `Site Admin Node (${adminWallet.substring(0, 6)}...)`
    );

    product.specs = product.specs || {};
    product.specs['Approval Block'] = `#${minedBlock.index}`;
    product.specs['Approval Tx'] = `${txHash.substring(0, 14)}...`;

    // Persist to server database and ledger
    db.products[prodIndex] = product;
    writeDatabase(db);
    saveBlockchain(blockchain);

    return NextResponse.json({
      success: true,
      product,
      blockchain: {
        blockIndex: minedBlock.index,
        blockHash: minedBlock.hash,
        previousHash: minedBlock.previousHash,
        timestamp: minedBlock.timestamp,
      },
    });
  } catch (error: any) {
    console.error('Error processing product approval:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Server error processing approval' },
      { status: 500 }
    );
  }
}
