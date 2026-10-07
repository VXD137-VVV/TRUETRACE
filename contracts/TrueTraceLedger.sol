// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TrueTraceLedger
 * @notice Cryptographic Supply Chain Provenance Protocol
 * @dev Manages product lifecycle: Vendor Registration -> Site Admin Review/Approval -> Transit -> Consumer Verification
 */
contract TrueTraceLedger {
    address public admin;

    enum ProductStatus {
        PENDING_ADMIN_APPROVAL,
        APPROVED,
        REJECTED,
        IN_TRANSIT,
        DELIVERED
    }

    struct ProductItem {
        uint256 id;
        string sku;
        string name;
        string brand;
        string origin;
        string ipfsMetadata;
        address vendor;
        address approvedByAdmin;
        ProductStatus status;
        uint256 createdAt;
        uint256 approvedAt;
        string currentLocation;
        string notes;
    }

    uint256 private _productCounter;
    mapping(uint256 => ProductItem) public products;
    mapping(string => uint256) public skuToId;
    mapping(address => bool) public authorizedVendors;

    event ProductRegistered(
        uint256 indexed id,
        string indexed sku,
        string name,
        address indexed vendor,
        uint256 timestamp
    );

    event ProductReviewedByAdmin(
        uint256 indexed id,
        string indexed sku,
        address indexed admin,
        bool approved,
        string notes,
        uint256 timestamp
    );

    event CustodyUpdated(
        uint256 indexed id,
        string indexed sku,
        string newLocation,
        address indexed handler,
        uint256 timestamp
    );

    event AdminTransferred(address indexed previousAdmin, address indexed newAdmin);

    modifier onlyAdmin() {
        require(msg.sender == admin, "TrueTrace: Caller is not the Site Admin");
        _;
    }

    modifier onlyVendorOrAdmin(uint256 _id) {
        require(
            msg.sender == products[_id].vendor || msg.sender == admin,
            "TrueTrace: Caller is not the vendor or admin"
        );
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /**
     * @notice Transfer admin authority to another address
     */
    function transferAdmin(address _newAdmin) external onlyAdmin {
        require(_newAdmin != address(0), "Invalid new admin address");
        emit AdminTransferred(admin, _newAdmin);
        admin = _newAdmin;
    }

    /**
     * @notice Vendor registers a new product batch into the supply chain
     * Sets initial status to PENDING_ADMIN_APPROVAL
     */
    function registerProduct(
        string calldata _sku,
        string calldata _name,
        string calldata _brand,
        string calldata _origin,
        string calldata _ipfsMetadata
    ) external returns (uint256) {
        require(bytes(_sku).length > 0, "SKU cannot be empty");
        require(skuToId[_sku] == 0, "Product with this SKU already registered");

        _productCounter++;
        uint256 newId = _productCounter;

        products[newId] = ProductItem({
            id: newId,
            sku: _sku,
            name: _name,
            brand: _brand,
            origin: _origin,
            ipfsMetadata: _ipfsMetadata,
            vendor: msg.sender,
            approvedByAdmin: address(0),
            status: ProductStatus.PENDING_ADMIN_APPROVAL,
            createdAt: block.timestamp,
            approvedAt: 0,
            currentLocation: _origin,
            notes: "Awaiting Site Admin Cryptographic Verification"
        });

        skuToId[_sku] = newId;

        emit ProductRegistered(newId, _sku, _name, msg.sender, block.timestamp);
        return newId;
    }

    /**
     * @notice Site Admin verifies vendor product and signs approval on blockchain
     * @param _id Product ID to approve
     * @param _approve True to approve, false to reject
     * @param _notes Inspection or audit remarks
     */
    function reviewProduct(
        uint256 _id,
        bool _approve,
        string calldata _notes
    ) external onlyAdmin {
        require(_id > 0 && _id <= _productCounter, "Product does not exist");
        ProductItem storage item = products[_id];
        require(
            item.status == ProductStatus.PENDING_ADMIN_APPROVAL,
            "Product is not pending approval"
        );

        if (_approve) {
            item.status = ProductStatus.APPROVED;
            item.approvedByAdmin = msg.sender;
            item.approvedAt = block.timestamp;
            item.notes = bytes(_notes).length > 0 ? _notes : "Site Admin Verified and Accepted on Blockchain";
        } else {
            item.status = ProductStatus.REJECTED;
            item.approvedByAdmin = msg.sender;
            item.notes = bytes(_notes).length > 0 ? _notes : "Rejected by Site Admin";
        }

        emit ProductReviewedByAdmin(_id, item.sku, msg.sender, _approve, item.notes, block.timestamp);
    }

    /**
     * @notice Update transit location / custody stage along the supply chain
     */
    function updateTransitLocation(
        uint256 _id,
        string calldata _newLocation,
        string calldata _notes
    ) external onlyVendorOrAdmin(_id) {
        require(_id > 0 && _id <= _productCounter, "Product does not exist");
        ProductItem storage item = products[_id];
        require(
            item.status == ProductStatus.APPROVED || item.status == ProductStatus.IN_TRANSIT,
            "Product must be approved before transit"
        );

        item.status = ProductStatus.IN_TRANSIT;
        item.currentLocation = _newLocation;
        item.notes = _notes;

        emit CustodyUpdated(_id, item.sku, _newLocation, msg.sender, block.timestamp);
    }

    /**
     * @notice Mark product as delivered to destination/retailer
     */
    function markDelivered(uint256 _id, string calldata _finalLocation) external onlyVendorOrAdmin(_id) {
        require(_id > 0 && _id <= _productCounter, "Product does not exist");
        ProductItem storage item = products[_id];
        require(item.status == ProductStatus.IN_TRANSIT, "Product must be in transit to mark delivered");

        item.status = ProductStatus.DELIVERED;
        item.currentLocation = _finalLocation;

        emit CustodyUpdated(_id, item.sku, _finalLocation, msg.sender, block.timestamp);
    }

    /**
     * @notice Consumer / Auditor verification query by SKU
     * Returns the full cryptographic trail: Vendor, Admin Approver, Timestamps, and Status
     */
    function verifyBySku(string calldata _sku)
        external
        view
        returns (
            uint256 id,
            string memory name,
            string memory brand,
            string memory origin,
            address vendor,
            address approvedByAdmin,
            ProductStatus status,
            uint256 createdAt,
            uint256 approvedAt,
            string memory currentLocation,
            string memory notes
        )
    {
        uint256 productId = skuToId[_sku];
        require(productId != 0, "SKU not found on TrueTrace Ledger");
        ProductItem storage item = products[productId];

        return (
            item.id,
            item.name,
            item.brand,
            item.origin,
            item.vendor,
            item.approvedByAdmin,
            item.status,
            item.createdAt,
            item.approvedAt,
            item.currentLocation,
            item.notes
        );
    }

    /**
     * @notice Get total registered products count
     */
    function totalProducts() external view returns (uint256) {
        return _productCounter;
    }
}
