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

    // Match product by id or sku
    const prodIndex = db.products.findIndex(
      (p) =>
        (productId && p.id === productId) ||
        (sku && p.sku.toUpperCase() === sku.toUpperCase()) ||
        (productId && p.sku.toUpperCase() === productId.toUpperCase())
    );

    if (prodIndex < 0) {
      return NextResponse.json(
        { success: false, error: 'Product not found in decentralized database' },
        { status: 404 }
      );
    }

    const product = db.products[prodIndex];
    const newStatus = approved ? 'APPROVED' : 'REJECTED';
    const timestamp = new Date().toISOString();

    product.onChainStatus = newStatus;
    product.adminApproverWallet = adminWallet;
    product.approvalTxHash = txHash;
    product.approvedAt = timestamp;
    product.lastVerified = approved ? 'Site Admin Approved & Verified' : 'Rejected by Site Admin';

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
