import crypto from 'crypto';

export type TransactionType = 'PRODUCT_MINT' | 'CUSTODY_TRANSFER' | 'VERIFICATION_AUDIT' | 'TAMPER_ALERT';

export interface BlockchainTransaction {
  id: string;
  type: TransactionType;
  timestamp: string;
  productId?: string;
  sku: string;
  productName: string;
  actor: string;
  location: string;
  signature: string;
  details: Record<string, any>;
}

export interface BlockData {
  index: number;
  timestamp: string;
  transactions: BlockchainTransaction[];
  previousHash: string;
  hash: string;
  nonce: number;
  difficulty: number;
  merkleRoot: string;
  validator: string;
}

export class Block implements BlockData {
  public index: number;
  public timestamp: string;
  public transactions: BlockchainTransaction[];
  public previousHash: string;
  public hash: string;
  public nonce: number;
  public difficulty: number;
  public merkleRoot: string;
  public validator: string;

  constructor(
    index: number,
    timestamp: string,
    transactions: BlockchainTransaction[],
    previousHash: string = '',
    difficulty: number = 2,
    validator: string = 'TrueTrace Node Authority'
  ) {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.difficulty = difficulty;
    this.validator = validator;
    this.nonce = 0;
    this.merkleRoot = this.calculateMerkleRoot();
    this.hash = this.calculateHash();
  }

  public calculateMerkleRoot(): string {
    if (this.transactions.length === 0) {
      return crypto.createHash('sha256').update('EMPTY_TRANSACTIONS').digest('hex');
    }
    const txHashes = this.transactions.map((tx) =>
      crypto.createHash('sha256').update(JSON.stringify(tx)).digest('hex')
    );
    return crypto.createHash('sha256').update(txHashes.join('')).digest('hex');
  }

  public calculateHash(): string {
    return crypto
      .createHash('sha256')
      .update(
        this.index +
          this.previousHash +
          this.timestamp +
          this.merkleRoot +
          this.nonce +
          this.difficulty
      )
      .digest('hex');
  }

  public mineBlock(difficulty: number): void {
    const target = Array(difficulty + 1).join('0');
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }
}

export class Blockchain {
  public chain: Block[];
  public difficulty: number;
  public pendingTransactions: BlockchainTransaction[];
  public isTampered: boolean = false;
  public tamperedBlockIndex: number | null = null;
  private originalChainBackup: Block[] = [];

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.backupChain();
  }

  private createGenesisBlock(): Block {
    const genesisTx: BlockchainTransaction = {
      id: 'tx-genesis-0000',
      type: 'PRODUCT_MINT',
      timestamp: '2025-01-01T00:00:00.000Z',
      sku: 'TT-GENESIS-PROTOCOL',
      productName: 'TrueTrace Decentralized Provenance Protocol Genesis',
      actor: 'System Master Authority',
      location: 'Geneva Decentralized Node #0',
      signature: '0x0000000000000000000000000000000000000000000000000000000000000000',
      details: {
        network: 'TrueTrace Security Mainnet',
        protocolVersion: '2.4.0',
        rootOfTrust: 'ISO/IEC 27001 Cryptographic RoT',
      },
    };

    const genesisBlock = new Block(
      0,
      '2025-01-01T00:00:00.000Z',
      [genesisTx],
      '0000000000000000000000000000000000000000000000000000000000000000',
      2,
      'Genesis Authority Node'
    );
    genesisBlock.mineBlock(2);
    return genesisBlock;
  }

  public getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  public addTransaction(transaction: Omit<BlockchainTransaction, 'id' | 'timestamp' | 'signature'>): BlockchainTransaction {
    const fullTx: BlockchainTransaction = {
      ...transaction,
      id: `tx-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      timestamp: new Date().toISOString(),
      signature: '0x' + crypto.createHash('sha256').update(JSON.stringify(transaction) + Date.now()).digest('hex'),
    };

    this.pendingTransactions.push(fullTx);
    return fullTx;
  }

  public minePendingTransactions(validator: string = 'TrueTrace Consensus Node'): Block {
    const block = new Block(
      this.chain.length,
      new Date().toISOString(),
      [...this.pendingTransactions],
      this.getLatestBlock().hash,
      this.difficulty,
      validator
    );

    block.mineBlock(this.difficulty);
    this.chain.push(block);
    this.pendingTransactions = [];
    this.backupChain();

    return block;
  }

  public isChainValid(): { valid: boolean; error?: string; blockIndex?: number } {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Verify that current block's hash is correctly computed
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return {
          valid: false,
          error: `Block #${currentBlock.index} hash integrity failed! Stored: ${currentBlock.hash.substring(0, 12)}..., Computed: ${currentBlock.calculateHash().substring(0, 12)}...`,
          blockIndex: currentBlock.index,
        };
      }

      // Verify cryptographic linkage with previous block
      if (currentBlock.previousHash !== previousBlock.hash) {
        return {
          valid: false,
          error: `Block #${currentBlock.index} previousHash mismatch! Broken cryptographic link from Block #${previousBlock.index}.`,
          blockIndex: currentBlock.index,
        };
      }
    }

    return { valid: true };
  }

  // Backup state for tamper demo
  private backupChain(): void {
    this.originalChainBackup = JSON.parse(JSON.stringify(this.chain)).map((b: any) => {
      const block = new Block(b.index, b.timestamp, b.transactions, b.previousHash, b.difficulty, b.validator);
      block.hash = b.hash;
      block.nonce = b.nonce;
      block.merkleRoot = b.merkleRoot;
      return block;
    });
  }

  // Live Evaluator / Viva Demo: Simulate hacker modifying data in database
  public tamperBlock(blockIndex: number, fakeProductName: string = 'MALICIOUS_COUNTERFEIT_DATA'): boolean {
    if (blockIndex <= 0 || blockIndex >= this.chain.length) return false;

    // Mutate transaction without re-mining
    const targetBlock = this.chain[blockIndex];
    if (targetBlock.transactions.length > 0) {
      targetBlock.transactions[0].productName = fakeProductName;
      targetBlock.transactions[0].details.tamperedBy = 'Simulated Hacker Injection';
    }

    this.isTampered = true;
    this.tamperedBlockIndex = blockIndex;
    return true;
  }

  // Restore chain integrity
  public restoreChain(): void {
    if (this.originalChainBackup.length > 0) {
      this.chain = this.originalChainBackup.map((b: any) => {
        const block = new Block(b.index, b.timestamp, b.transactions, b.previousHash, b.difficulty, b.validator);
        block.hash = b.hash;
        block.nonce = b.nonce;
        block.merkleRoot = b.merkleRoot;
        return block;
      });
      this.isTampered = false;
      this.tamperedBlockIndex = null;
    }
  }

  // Load from persisted JSON
  public static fromJSON(jsonData: any): Blockchain {
    const bc = new Blockchain();
    if (jsonData && Array.isArray(jsonData.chain) && jsonData.chain.length > 0) {
      bc.chain = jsonData.chain.map((b: any) => {
        const block = new Block(b.index, b.timestamp, b.transactions, b.previousHash, b.difficulty, b.validator);
        block.hash = b.hash;
        block.nonce = b.nonce;
        block.merkleRoot = b.merkleRoot;
        return block;
      });
      bc.difficulty = jsonData.difficulty || 2;
      bc.pendingTransactions = jsonData.pendingTransactions || [];
      bc.backupChain();
    }
    return bc;
  }
}
