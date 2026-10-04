// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TrueTraceProvenance
 * @dev Autonomous Smart Contract for Fake Product Identification and Provenance Tracking
 * @notice Developed for Community Service Project (IE&CT, Branch IT, MVGR College of Engineering)
 * @author Venkata Vinodh VEGI (24331A12D0), VENKATA RAMANA (24331A12B6), 
 *         DEEKSHIT SAI VAISHNAV (24331A12C7), SHYAM KUMAR (25335A1212)
 * @notice Project Guide: Dr. M. Swarna, Associate Professor
 */
contract TrueTraceProvenance {
    address public networkAuthority;
    uint256 public totalProductsMinted;
    uint256 public totalVerificationsExecuted;

    enum AssetStatus { Active, InTransit, Delivered, Recalled, Compromised }

    struct ProductPassport {
        string sku;
        string name;
        string brand;
        string category;
        string genesisHash;
        uint256 mintedTimestamp;
        address currentCustodian;
        AssetStatus status;
        uint256 verificationCount;
        uint256 lastVerifiedTimestamp;
        string lastVerifiedLocation;
    }

    struct CustodyRecord {
        address from;
        address to;
        string location;
        uint256 timestamp;
        string notes;
    }

    mapping(string => ProductPassport) public passports;
    mapping(string => bool) public isSkuRegistered;
    mapping(string => CustodyRecord[]) internal custodyHistory;

    event ProductMinted(string indexed sku, string brand, string name, address indexed authority);
    event CustodyTransferred(string indexed sku, address indexed from, address indexed to, string location);
    event VerificationRecorded(string indexed sku, address indexed verifier, string location, uint256 timestamp);
    event AnomalyFlagged(string indexed sku, string reason, uint256 riskScore);
    event ProductRecalled(string indexed sku, string reason);

    modifier onlyAuthority() {
        require(msg.sender == networkAuthority, "TrueTrace: Caller is not network authority");
        _;
    }

    constructor() {
        networkAuthority = msg.sender;
    }

    /**
     * @notice Mint a new Cryptographic Digital Product Passport
     */
    function mintProductPassport(
        string memory _sku,
        string memory _name,
        string memory _brand,
        string memory _category,
        string memory _genesisHash
    ) external onlyAuthority {
        require(!isSkuRegistered[_sku], "TrueTrace: SKU already registered on ledger");

        passports[_sku] = ProductPassport({
            sku: _sku,
            name: _name,
            brand: _brand,
            category: _category,
            genesisHash: _genesisHash,
            mintedTimestamp: block.timestamp,
            currentCustodian: msg.sender,
            status: AssetStatus.Active,
            verificationCount: 0,
            lastVerifiedTimestamp: block.timestamp,
            lastVerifiedLocation: "Genesis Manufacturing Vault"
        });

        isSkuRegistered[_sku] = true;
        totalProductsMinted++;

        emit ProductMinted(_sku, _brand, _name, msg.sender);
    }

    /**
     * @notice Record a custody transfer between supply chain participants
     */
    function transferCustody(
        string memory _sku,
        address _to,
        string memory _location,
        string memory _notes
    ) external {
        require(isSkuRegistered[_sku], "TrueTrace: Product not found");
        ProductPassport storage product = passports[_sku];
        require(msg.sender == product.currentCustodian || msg.sender == networkAuthority, "TrueTrace: Not authorized custodian");
        require(product.status != AssetStatus.Compromised, "TrueTrace: Product flagged as compromised");

        address previousCustodian = product.currentCustodian;
        product.currentCustodian = _to;
        product.status = AssetStatus.InTransit;

        custodyHistory[_sku].push(CustodyRecord({
            from: previousCustodian,
            to: _to,
            location: _location,
            timestamp: block.timestamp,
            notes: _notes
        }));

        emit CustodyTransferred(_sku, previousCustodian, _to, _location);
    }

    /**
     * @notice Verify a product token and record the scan event
     */
    function recordVerification(
        string memory _sku,
        string memory _location
    ) external returns (bool isAuthentic, uint256 riskScore) {
        require(isSkuRegistered[_sku], "TrueTrace: Unregistered SKU (Counterfeit Risk)");
        ProductPassport storage product = passports[_sku];

        if (product.status == AssetStatus.Compromised || product.status == AssetStatus.Recalled) {
            emit AnomalyFlagged(_sku, "Product status invalid or compromised", 100);
            return (false, 100);
        }

        // Heuristic travel velocity check
        uint256 elapsed = block.timestamp - product.lastVerifiedTimestamp;
        if (elapsed < 15 minutes && keccak256(bytes(_location)) != keccak256(bytes(product.lastVerifiedLocation))) {
            product.status = AssetStatus.Compromised;
            emit AnomalyFlagged(_sku, "Impossible travel velocity detected", 95);
            return (false, 95);
        }

        product.verificationCount++;
        product.lastVerifiedTimestamp = block.timestamp;
        product.lastVerifiedLocation = _location;
        totalVerificationsExecuted++;

        emit VerificationRecorded(_sku, msg.sender, _location, block.timestamp);
        return (true, 0);
    }

    /**
     * @notice Retrieve custody history length
     */
    function getCustodyHistoryLength(string memory _sku) external view returns (uint256) {
        require(isSkuRegistered[_sku], "TrueTrace: SKU not found");
        return custodyHistory[_sku].length;
    }

    /**
     * @notice Retrieve a specific custody milestone record
     */
    function getCustodyRecord(string memory _sku, uint256 _index) external view returns (
        address from,
        address to,
        string memory location,
        uint256 timestamp,
        string memory notes
    ) {
        require(isSkuRegistered[_sku], "TrueTrace: SKU not found");
        require(_index < custodyHistory[_sku].length, "TrueTrace: Index out of bounds");
        CustodyRecord memory rec = custodyHistory[_sku][_index];
        return (rec.from, rec.to, rec.location, rec.timestamp, rec.notes);
    }

    /**
     * @notice Flag product recall by manufacturer authority
     */
    function recallProduct(string memory _sku, string memory _reason) external onlyAuthority {
        require(isSkuRegistered[_sku], "TrueTrace: SKU not found");
        passports[_sku].status = AssetStatus.Recalled;
        emit ProductRecalled(_sku, _reason);
    }
}
