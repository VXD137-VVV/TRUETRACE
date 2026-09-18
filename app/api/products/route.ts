import { NextResponse } from 'next/server';
import { readDatabase, writeDatabase, getBlockchain, saveBlockchain } from '@/lib/server/db';
import { Product } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const db = readDatabase();

    let products = db.products;
    if (userId) {
      products = products.filter((p) => p.userId === userId);
    }

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = readDatabase();
    const blockchain = getBlockchain();

    const productId = `prod-${Date.now().toString().slice(-6)}`;
    const sku = body.sku || `TT-${body.category?.slice(0, 3).toUpperCase() || 'GEN'}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newProduct: Product = {
      id: productId,
      sku,
      name: body.name,
      category: body.category || 'Luxury',
      brand: body.brand,
      manufacturer: body.manufacturer || `${body.brand} Manufacturing SA`,
      manufacturingDate: body.manufacturingDate || new Date().toISOString().split('T')[0],
      origin: body.origin || 'Geneva, Switzerland',
      currentLocation: body.currentLocation || 'Registered in Decentralized Vault',
      status: 'authentic',
      verificationCount: 0,
      lastVerified: 'Not verified yet',
      image:
        body.image ||
        (body.category === 'Luxury'
          ? 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'),
      description: body.description || 'Cryptographically sealed decentralized product passport.',
      batchNumber: body.batchNumber || `BATCH-${new Date().getFullYear()}-01`,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://truetrace.io/verify/${sku}`,
      securityScore: 99,
      userId: body.userId || 'admin-001',
      timeline: body.timeline || [
        {
          id: 'step-genesis',
          title: 'Genesis Passport Minted on Blockchain',
          status: 'completed',
          timestamp: new Date().toLocaleString(),
          location: body.origin || 'Genesis Manufacturing Facility',
          handler: body.brand || 'Authorized Authority',
          notes: `Recorded on TrueTrace Blockchain with single-use rotational token ${sku}`,
          verifiedBy: 'TrueTrace Ledger Node #1',
        },
      ],
      specs: body.specs || {
        'Provenance Standard': 'ISO/IEC 27001 Cryptographic RoT',
        'Blockchain Ledger Status': 'Mined in Block',
      },
    };

    // Add to DB products
    db.products.unshift(newProduct);

    // Record on Blockchain Ledger
    blockchain.addTransaction({
      type: 'PRODUCT_MINT',
      sku: newProduct.sku,
      productId: newProduct.id,
      productName: newProduct.name,
      actor: newProduct.brand,
      location: newProduct.origin,
      details: {
        category: newProduct.category,
        batch: newProduct.batchNumber,
        registeredBy: newProduct.userId,
      },
    });

    // Automatically mine block on TrueTrace ledger
    const minedBlock = blockchain.minePendingTransactions(`Validator Node (${newProduct.origin})`);

    // Update specs with block hash
    newProduct.specs['Block Index'] = `#${minedBlock.index}`;
    newProduct.specs['Block Hash'] = `${minedBlock.hash.substring(0, 16)}...`;

    // Persist changes
    writeDatabase(db);
    saveBlockchain(blockchain);

    return NextResponse.json({
      success: true,
      product: newProduct,
      blockchain: {
        blockIndex: minedBlock.index,
        blockHash: minedBlock.hash,
        previousHash: minedBlock.previousHash,
        nonce: minedBlock.nonce,
        timestamp: minedBlock.timestamp,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to register product on blockchain' },
      { status: 500 }
    );
  }
}
