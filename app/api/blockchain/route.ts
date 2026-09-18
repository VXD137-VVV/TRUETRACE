import { NextResponse } from 'next/server';
import { getBlockchain, saveBlockchain, readDatabase } from '@/lib/server/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const blockchain = getBlockchain();
    const validity = blockchain.isChainValid();
    const db = readDatabase();

    return NextResponse.json({
      success: true,
      chainLength: blockchain.chain.length,
      difficulty: blockchain.difficulty,
      isChainValid: validity.valid,
      validationError: validity.error || null,
      isTampered: blockchain.isTampered,
      tamperedBlockIndex: blockchain.tamperedBlockIndex,
      pendingTransactions: blockchain.pendingTransactions,
      latestBlock: blockchain.getLatestBlock(),
      chain: blockchain.chain,
      totalRegisteredAssets: db.products.length,
      totalAudits: db.verifications.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch blockchain' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, blockIndex, fakeData } = body;
    const blockchain = getBlockchain();

    if (action === 'mine') {
      if (blockchain.pendingTransactions.length === 0) {
        return NextResponse.json({
          success: false,
          message: 'No pending transactions to mine on the ledger.',
        });
      }
      const newBlock = blockchain.minePendingTransactions('Node Consensus Miner #1');
      saveBlockchain(blockchain);
      return NextResponse.json({
        success: true,
        message: `Block #${newBlock.index} successfully mined with SHA-256 hash ${newBlock.hash}`,
        block: newBlock,
      });
    }

    if (action === 'tamper') {
      const targetIndex = typeof blockIndex === 'number' ? blockIndex : 1;
      const tampered = blockchain.tamperBlock(targetIndex, fakeData || 'MALICIOUS_COUNTERFEIT_DATA');
      saveBlockchain(blockchain);
      const validation = blockchain.isChainValid();

      return NextResponse.json({
        success: true,
        tampered,
        isChainValid: validation.valid,
        error: validation.error,
        message: `Simulated malicious modification executed on Block #${targetIndex}. Cryptographic hash integrity broken!`,
      });
    }

    if (action === 'restore') {
      blockchain.restoreChain();
      saveBlockchain(blockchain);
      const validation = blockchain.isChainValid();

      return NextResponse.json({
        success: true,
        isChainValid: validation.valid,
        message: 'Cryptographic ledger state restored to valid genesis consensus.',
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action specified' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Blockchain operation failed' },
      { status: 500 }
    );
  }
}
