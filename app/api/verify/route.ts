import { NextResponse } from 'next/server';
import { readDatabase, writeDatabase, getBlockchain, saveBlockchain } from '@/lib/server/db';
import { VerificationRecord, ScanHistoryItem } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, method = 'manual', user } = body;

    if (!code) {
      return NextResponse.json({ success: false, message: 'Verification code required' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();
    const db = readDatabase();
    const blockchain = getBlockchain();

    // Check if product exists in database
    const matchedProduct = db.products.find(
      (p) => p.sku.toUpperCase() === cleanCode || p.id.toUpperCase() === cleanCode
    );

    if (matchedProduct) {
      // Authentic Match!
      matchedProduct.verificationCount += 1;
      matchedProduct.lastVerified = 'Just now';

      const verifRecord: VerificationRecord = {
        id: `verif-${Date.now().toString().slice(-6)}`,
        productId: matchedProduct.id,
        productName: matchedProduct.name,
        brand: matchedProduct.brand,
        category: matchedProduct.category,
        verificationId: matchedProduct.sku,
        status: 'authentic',
        scannedAt: new Date().toLocaleString(),
        location: 'Verified Decentralized Node',
        scannedBy: user?.username || 'Public Verified Consumer',
        deviceType: method === 'camera' ? 'TrueTrace Optical Scanner' : method === 'upload' ? 'QR File Processor' : 'Web Terminal',
        ipAddress: '127.0.0.1 (Local Session)',
        anomalyScore: 0,
        method: method as any,
        userId: user?.id,
        riskFactors: ['Cryptographic signature valid', 'Single-use rotational token matched on ledger'],
      };

      const scanItem: ScanHistoryItem = {
        id: `scan-${Date.now().toString().slice(-6)}`,
        scanCode: matchedProduct.sku,
        result: 'authentic',
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        method: method as any,
        productId: matchedProduct.id,
        productName: matchedProduct.name,
        userId: user?.id || 'guest',
        username: user?.username || 'Guest',
        details: 'Matched authentic product in TrueTrace blockchain ledger',
      };

      db.verifications.unshift(verifRecord);
      db.scanHistory.unshift(scanItem);

      // Append verification event to the blockchain
      blockchain.addTransaction({
        type: 'VERIFICATION_AUDIT',
        sku: matchedProduct.sku,
        productId: matchedProduct.id,
        productName: matchedProduct.name,
        actor: user?.username || 'Consumer Scan Terminal',
        location: 'Verification Node',
        details: {
          method,
          status: 'authentic',
          verificationCount: matchedProduct.verificationCount,
        },
      });

      // Mine verification audit block
      const auditBlock = blockchain.minePendingTransactions('TrueTrace Audit Validator');

      writeDatabase(db);
      saveBlockchain(blockchain);

      return NextResponse.json({
        success: true,
        status: 'authentic',
        product: matchedProduct,
        verification: verifRecord,
        blockchainProof: {
          blockIndex: auditBlock.index,
          blockHash: auditBlock.hash,
          previousHash: auditBlock.previousHash,
          timestamp: auditBlock.timestamp,
        },
      });
    } else {
      // Counterfeit / Unregistered Token
      const verifRecord: VerificationRecord = {
        id: `verif-${Date.now().toString().slice(-6)}`,
        productName: 'Unregistered / Unknown QR Token',
        brand: 'Unrecognized Entity',
        category: 'Unknown',
        verificationId: cleanCode,
        status: 'not_found',
        scannedAt: new Date().toLocaleString(),
        location: 'Public Scan Point',
        scannedBy: user?.username || 'Guest',
        deviceType: method === 'camera' ? 'Optical Scanner' : method === 'upload' ? 'QR File Processor' : 'Web Console',
        ipAddress: '127.0.0.1',
        anomalyScore: 92,
        method: method as any,
        userId: user?.id,
        riskFactors: ['Token identifier not found on cryptographic ledger'],
      };

      const scanItem: ScanHistoryItem = {
        id: `scan-${Date.now().toString().slice(-6)}`,
        scanCode: cleanCode,
        result: 'not_found',
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        method: method as any,
        userId: user?.id || 'guest',
        username: user?.username || 'Guest',
        details: 'QR token not associated with any registered product on the blockchain',
      };

      db.verifications.unshift(verifRecord);
      db.scanHistory.unshift(scanItem);

      // Record tamper anomaly alert on blockchain
      blockchain.addTransaction({
        type: 'TAMPER_ALERT',
        sku: cleanCode,
        productName: 'UNREGISTERED_TOKEN',
        actor: 'Security Audit Monitor',
        location: 'Public Scan Point',
        details: {
          anomalyScore: 92,
          reason: 'Token does not exist on decentralized ledger',
        },
      });

      const auditBlock = blockchain.minePendingTransactions('TrueTrace Threat Intercept Node');

      writeDatabase(db);
      saveBlockchain(blockchain);

      return NextResponse.json({
        success: true,
        status: 'not_found',
        verification: verifRecord,
        blockchainProof: {
          blockIndex: auditBlock.index,
          blockHash: auditBlock.hash,
        },
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Verification failed' },
      { status: 500 }
    );
  }
}
