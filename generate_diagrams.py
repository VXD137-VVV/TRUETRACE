import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

out_dir = r"C:\Users\vvvin\Desktop\report_diagrams"
os.makedirs(out_dir, exist_ok=True)

# Set global styles
plt.rcParams['font.sans-serif'] = 'Arial'
plt.rcParams['font.family'] = 'sans-serif'

# =============================================================================
# DIAGRAM 1: System Architecture Diagram (4-Tier)
# =============================================================================
fig, ax = plt.subplots(figsize=(10, 7.5), dpi=300)
ax.set_xlim(0, 100)
ax.set_ylim(0, 100)
ax.axis('off')

# Title
ax.text(50, 96, "TrueTrace: Multi-Tier System Architecture", 
        fontsize=16, fontweight='bold', ha='center', color='#0B1220')
ax.text(50, 93, "Decentralized Anti-Counterfeit Platform Using Embedded SHA-256 Blockchain", 
        fontsize=10, fontstyle='italic', ha='center', color='#475569')

# Colors
C_BORDER = '#B91C1C' # Crimson
C_NAVY = '#0B1220'
C_CYAN = '#0E7490'
C_BG_CARD = '#F8FAFC'
C_BLUE = '#2563EB'
C_EMERALD = '#059669'

# Tier 1
rect1 = patches.FancyBboxPatch((5, 73), 90, 16, boxstyle="round,pad=1.5", 
                               edgecolor=C_BORDER, facecolor='#FEF2F2', linewidth=1.5)
ax.add_patch(rect1)
ax.text(8, 86, "TIER 1: PRESENTATION & CLIENT INGESTION LAYER", fontsize=11, fontweight='bold', color=C_BORDER)
# Sub-boxes
for i, (name, sub) in enumerate([
    ("Mobile Consumer Scanner", "LAN: http://172.16.61.27:3000\nHTML5 Camera Viewfinder"),
    ("Brand Management Portal", "Product Minting & Issuance\nRotational QR Generation"),
    ("Admin Governance Console", "P2P Network Node Monitor\nBlockchain Ledger Explorer")
]):
    bx = 8 + i * 29
    r = patches.FancyBboxPatch((bx, 75), 26, 9.5, boxstyle="round,pad=0.8", edgecolor='#CBD5E1', facecolor='#FFFFFF')
    ax.add_patch(r)
    ax.text(bx + 13, 81.5, name, fontsize=9.5, fontweight='bold', ha='center', color=C_NAVY)
    ax.text(bx + 13, 77.5, sub, fontsize=8, ha='center', color='#64748B')

# Down arrow 1
ax.annotate("", xy=(50, 69.5), xytext=(50, 73),
            arrowprops=dict(facecolor=C_BORDER, edgecolor=C_BORDER, width=2.5, headwidth=8))

# Tier 2
rect2 = patches.FancyBboxPatch((5, 50), 90, 16, boxstyle="round,pad=1.5", 
                               edgecolor=C_CYAN, facecolor='#ECFEFF', linewidth=1.5)
ax.add_patch(rect2)
ax.text(8, 63, "TIER 2: RESTFUL API GATEWAY & CONTROLLER PIPELINE (Next.js 14 App Router)", fontsize=11, fontweight='bold', color=C_CYAN)
for i, (name, sub) in enumerate([
    ("/api/products Route", "Validates Passport Specs\nSanitizes Inbound JSON"),
    ("/api/verify Route", "Resolves Token Signature\nExecutes AI Velocity Check"),
    ("/api/blockchain Route", "Serves Live Telemetry\nSimulates Tamper Attacks")
]):
    bx = 8 + i * 29
    r = patches.FancyBboxPatch((bx, 52), 26, 9.5, boxstyle="round,pad=0.8", edgecolor='#CBD5E1', facecolor='#FFFFFF')
    ax.add_patch(r)
    ax.text(bx + 13, 58.5, name, fontsize=9.5, fontweight='bold', ha='center', color=C_NAVY)
    ax.text(bx + 13, 54.5, sub, fontsize=8, ha='center', color='#64748B')

# Down arrow 2
ax.annotate("", xy=(50, 46.5), xytext=(50, 50),
            arrowprops=dict(facecolor=C_CYAN, edgecolor=C_CYAN, width=2.5, headwidth=8))

# Tier 3
rect3 = patches.FancyBboxPatch((5, 27), 90, 16, boxstyle="round,pad=1.5", 
                               edgecolor=C_BLUE, facecolor='#EFF6FF', linewidth=1.5)
ax.add_patch(rect3)
ax.text(8, 40, "TIER 3: EMBEDDED SHA-256 BLOCKCHAIN CONSENSUS ENGINE", fontsize=11, fontweight='bold', color=C_BLUE)
for i, (name, sub) in enumerate([
    ("Cryptographic Hasher", "256-Bit SHA-256 Chaining\nMerkle Tree Root Digest"),
    ("Proof-of-Work Miner", "Difficulty Target Matching (00...)\nIterative Nonce Search"),
    ("Chain Validator", "isChainValid() Full Scan\nInstant Tamper Detection")
]):
    bx = 8 + i * 29
    r = patches.FancyBboxPatch((bx, 29), 26, 9.5, boxstyle="round,pad=0.8", edgecolor='#CBD5E1', facecolor='#FFFFFF')
    ax.add_patch(r)
    ax.text(bx + 13, 35.5, name, fontsize=9.5, fontweight='bold', ha='center', color=C_NAVY)
    ax.text(bx + 13, 31.5, sub, fontsize=8, ha='center', color='#64748B')

# Down arrow 3
ax.annotate("", xy=(50, 23.5), xytext=(50, 27),
            arrowprops=dict(facecolor=C_BLUE, edgecolor=C_BLUE, width=2.5, headwidth=8))

# Tier 4
rect4 = patches.FancyBboxPatch((5, 4), 90, 16, boxstyle="round,pad=1.5", 
                               edgecolor=C_EMERALD, facecolor='#F0FDF4', linewidth=1.5)
ax.add_patch(rect4)
ax.text(8, 17, "TIER 4: ATOMIC PERSISTENCE & ACCESS CONTROL LAYER", fontsize=11, fontweight='bold', color=C_EMERALD)
for i, (name, sub) in enumerate([
    ("truetrace_db.json Store", "Atomic Write-Through\nZero-SQL Crash Resilience"),
    ("RoleGuard Security", "Multi-Tenant Isolation\nJWT/Session Authorization"),
    ("Audit Logs & P2P Cache", "Audit Trail Serialization\nP2P Multi-Node Gossip State")
]):
    bx = 8 + i * 29
    r = patches.FancyBboxPatch((bx, 6), 26, 9.5, boxstyle="round,pad=0.8", edgecolor='#CBD5E1', facecolor='#FFFFFF')
    ax.add_patch(r)
    ax.text(bx + 13, 12.5, name, fontsize=9.5, fontweight='bold', ha='center', color=C_NAVY)
    ax.text(bx + 13, 8.5, sub, fontsize=8, ha='center', color='#64748B')

plt.tight_layout()
fig.savefig(os.path.join(out_dir, "architecture_diagram.png"), dpi=300)
plt.close(fig)
print("Generated architecture_diagram.png")


# =============================================================================
# DIAGRAM 2: End-to-End Process Flow / Sequence Diagram
# =============================================================================
fig, ax = plt.subplots(figsize=(10, 8.5), dpi=300)
ax.set_xlim(0, 100)
ax.set_ylim(0, 100)
ax.axis('off')

ax.text(50, 97, "TrueTrace: End-to-End Operational Process Flow", 
        fontsize=16, fontweight='bold', ha='center', color='#0B1220')
ax.text(50, 94, "From Physical QR Ingestion to Cryptographic Verification Verdict", 
        fontsize=10, fontstyle='italic', ha='center', color='#475569')

steps = [
    ("Step 1: Optical Token Capture", "Consumer/Auditor scans QR micro-seal via HTML5 camera stream or uploads image file"),
    ("Step 2: Token Payload Parsing", "Client engine extracts rotational SKU (e.g. TT-LUX-9941) and captures device GPS coordinates"),
    ("Step 3: Asynchronous API Request", "HTTP POST to /api/verify transmitting token, device fingerprint, and current timestamp"),
    ("Step 4: Blockchain Ledger Lookup", "Backend searches in-memory consensus state for matching Genesis Digital Product Passport"),
    ("Step 5: Signature & Custody Audit", "Engine validates 256-bit cryptographic signature and confirms unbroken custody milestones"),
    ("Step 6: AI Velocity Anomaly Filter", "Calculates elapsed transit velocity between scans; flags impossible speeds or duplicate clones"),
    ("Step 7: Proof-of-Work Block Mining", "Miner groups VERIFICATION_AUDIT, computes nonce to solve target (00...), and commits block"),
    ("Step 8: Persistence & Verdict Dispatch", "Saves state to truetrace_db.json; returns JSON receipt triggering celebratory confetti in UI")
]

y_pos = 86
for idx, (title, desc) in enumerate(steps, start=1):
    # Number circle
    circ = patches.Circle((8, y_pos), 3.2, facecolor=C_BORDER, edgecolor=C_NAVY, linewidth=1.2)
    ax.add_patch(circ)
    ax.text(8, y_pos - 0.9, str(idx), fontsize=11, fontweight='bold', ha='center', color='#FFFFFF')
    
    # Text card
    card = patches.FancyBboxPatch((14, y_pos - 4), 81, 8, boxstyle="round,pad=0.8", 
                                  edgecolor='#E2E8F0', facecolor='#F8FAFC', linewidth=1.2)
    ax.add_patch(card)
    ax.text(17, y_pos + 1.2, title, fontsize=10.5, fontweight='bold', color=C_NAVY)
    ax.text(17, y_pos - 2.2, desc, fontsize=8.5, color='#475569')
    
    # Arrow to next step
    if idx < len(steps):
        ax.annotate("", xy=(8, y_pos - 5.8), xytext=(8, y_pos - 3.4),
                    arrowprops=dict(facecolor=C_BORDER, edgecolor=C_BORDER, width=2, headwidth=6))
    
    y_pos -= 10.5

plt.tight_layout()
fig.savefig(os.path.join(out_dir, "process_flow_diagram.png"), dpi=300)
plt.close(fig)
print("Generated process_flow_diagram.png")


# =============================================================================
# DIAGRAM 3: Database Entity-Relationship & Schema Diagram
# =============================================================================
fig, ax = plt.subplots(figsize=(10, 7.5), dpi=300)
ax.set_xlim(0, 100)
ax.set_ylim(0, 100)
ax.axis('off')

ax.text(50, 96, "TrueTrace: Database Schema & Entity Relationships", 
        fontsize=16, fontweight='bold', ha='center', color='#0B1220')
ax.text(50, 93, "Serialized Atomic Store Architecture (data/truetrace_db.json)", 
        fontsize=10, fontstyle='italic', ha='center', color='#475569')

entities = [
    ("ENTITY: USERS", [
        ("id", "String (UUID-v4, Primary Key)"),
        ("email", "String (Unique, Indexed)"),
        ("passwordHash", "String (Bcrypt Salted Hash)"),
        ("role", "Enum: brand | auditor | admin"),
        ("company", "String (Manufacturer Name)"),
        ("createdAt", "DateTime (ISO 8601)")
    ], 6, 50, 42, 38, C_BORDER),

    ("ENTITY: PRODUCTS", [
        ("id", "String (UUID-v4, Primary Key)"),
        ("sku", "String (Rotational Token, Unique)"),
        ("name", "String (Commercial Product Title)"),
        ("category", "Enum: luxury | pharma | electronics"),
        ("genesisHash", "String (SHA-256 Ledger Anchor)"),
        ("ownerId", "String (FK -> Users.id)"),
        ("status", "Enum: active | recalled | verified")
    ], 52, 50, 42, 38, C_CYAN),

    ("ENTITY: BLOCKCHAIN_BLOCKS", [
        ("index", "Number (Incremental Block Height)"),
        ("timestamp", "DateTime (Block Creation Epoch)"),
        ("previousHash", "String (SHA-256 Parent Hash)"),
        ("hash", "String (SHA-256 Block Header Hash)"),
        ("nonce", "Number (Proof-of-Work Solution)"),
        ("merkleRoot", "String (Transaction Digest Root)"),
        ("transactions", "Array<TransactionObject>")
    ], 6, 6, 42, 38, C_BLUE),

    ("ENTITY: SCAN_AUDIT_LOGS", [
        ("id", "String (UUID-v4, Primary Key)"),
        ("sku", "String (FK -> Products.sku)"),
        ("scannedAt", "DateTime (Verification Epoch)"),
        ("location", "String (Geographic City / GPS)"),
        ("riskScore", "Number (AI Anomaly Score 0-100)"),
        ("isAuthentic", "Boolean (Cryptographic Pass/Fail)"),
        ("blockIndex", "Number (FK -> Blocks.index)")
    ], 52, 6, 42, 38, C_EMERALD)
]

for title, fields, x, y, w, h, col in entities:
    box = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.8", 
                                 edgecolor=col, facecolor='#FFFFFF', linewidth=1.8)
    ax.add_patch(box)
    # Header bar
    hbar = patches.Rectangle((x, y + h - 6), w, 6, facecolor=col)
    ax.add_patch(hbar)
    ax.text(x + w/2, y + h - 4.2, title, fontsize=10, fontweight='bold', ha='center', color='#FFFFFF')
    
    # Fields
    for idx, (f_name, f_type) in enumerate(fields):
        fy = y + h - 9.5 - idx * 4.2
        ax.text(x + 2, fy, f_name, fontsize=8.5, fontweight='bold', color=C_NAVY)
        ax.text(x + 16, fy, f_type, fontsize=7.5, fontstyle='italic', color='#64748B')

# Connectors
ax.annotate("", xy=(52, 68), xytext=(48, 68),
            arrowprops=dict(facecolor='#64748B', edgecolor='#64748B', arrowstyle="<->", lw=1.5))
ax.text(50, 70, "1 : N", fontsize=8, ha='center', color='#64748B')

ax.annotate("", xy=(73, 44), xytext=(73, 50),
            arrowprops=dict(facecolor='#64748B', edgecolor='#64748B', arrowstyle="<->", lw=1.5))
ax.text(76, 47, "1 : N", fontsize=8, ha='center', color='#64748B')

ax.annotate("", xy=(48, 25), xytext=(52, 25),
            arrowprops=dict(facecolor='#64748B', edgecolor='#64748B', arrowstyle="<->", lw=1.5))
ax.text(50, 27, "1 : N", fontsize=8, ha='center', color='#64748B')

plt.tight_layout()
fig.savefig(os.path.join(out_dir, "database_schema_diagram.png"), dpi=300)
plt.close(fig)
print("Generated database_schema_diagram.png")


# =============================================================================
# DIAGRAM 4: Cryptographic Block Chaining & Tamper Detection Model
# =============================================================================
fig, ax = plt.subplots(figsize=(10, 6.5), dpi=300)
ax.set_xlim(0, 100)
ax.set_ylim(0, 100)
ax.axis('off')

ax.text(50, 95, "TrueTrace: Cryptographic Block Chaining & Tamper Detection", 
        fontsize=15, fontweight='bold', ha='center', color='#0B1220')
ax.text(50, 91.5, "Demonstrating SHA-256 Hash Linkage & Instant Mathematical Cascade Failure", 
        fontsize=9.5, fontstyle='italic', ha='center', color='#475569')

blocks = [
    ("GENESIS BLOCK #0", "0000000000000000000...", "008692f5f847e3e2ad...", 252, "GENESIS_PROTOCOL", 5, 20, 26, 62, '#0284C7'),
    ("CONSENSUS BLOCK #1", "008692f5f847e3e2ad...", "0023dc6bca01d05ebb...", 211, "PASSPORT_MINT (TT-LUX)", 37, 20, 26, 62, '#059669'),
    ("CONSENSUS BLOCK #2", "0023dc6bca01d05ebb...", "0072133c40134f8cea...", 6, "VERIFY_AUDIT (Passed)", 69, 20, 26, 62, '#7C3AED')
]

for title, p_hash, b_hash, nonce, tx, x, y, w, h, col in blocks:
    b_card = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.8", 
                                    edgecolor=col, facecolor='#F8FAFC', linewidth=1.8)
    ax.add_patch(b_card)
    
    # Title bar
    t_bar = patches.Rectangle((x, y + h - 7), w, 7, facecolor=col)
    ax.add_patch(t_bar)
    ax.text(x + w/2, y + h - 5, title, fontsize=10, fontweight='bold', ha='center', color='#FFFFFF')
    
    # Fields inside block
    ax.text(x + 2, y + 48, "Previous Hash:", fontsize=7.5, fontweight='bold', color='#64748B')
    ax.text(x + 2, y + 43, p_hash[:18] + "...", fontsize=8, color=C_NAVY, family='monospace')
    
    ax.text(x + 2, y + 36, "Block SHA-256 Hash:", fontsize=7.5, fontweight='bold', color='#64748B')
    ax.text(x + 2, y + 31, b_hash[:18] + "...", fontsize=8, fontweight='bold', color=col, family='monospace')
    
    ax.text(x + 2, y + 24, "Proof-of-Work Nonce:", fontsize=7.5, fontweight='bold', color='#64748B')
    ax.text(x + 2, y + 19, f"{nonce} (Target: 00...)", fontsize=8, color=C_NAVY)
    
    ax.text(x + 2, y + 12, "Encapsulated Tx:", fontsize=7.5, fontweight='bold', color='#64748B')
    ax.text(x + 2, y + 7, tx, fontsize=7.5, fontstyle='italic', color='#334155')

# Connecting cryptographic arrows
ax.annotate("", xy=(37, 52), xytext=(31, 52),
            arrowprops=dict(facecolor='#059669', edgecolor='#059669', width=2.5, headwidth=7))
ax.text(34, 55, "Linked", fontsize=8, fontweight='bold', ha='center', color='#059669')

ax.annotate("", xy=(69, 52), xytext=(63, 52),
            arrowprops=dict(facecolor='#7C3AED', edgecolor='#7C3AED', width=2.5, headwidth=7))
ax.text(66, 55, "Linked", fontsize=8, fontweight='bold', ha='center', color='#7C3AED')

# Tamper warning callout
tw = patches.FancyBboxPatch((15, 3), 70, 11, boxstyle="round,pad=0.8", 
                            edgecolor='#DC2626', facecolor='#FEF2F2', linewidth=1.5)
ax.add_patch(tw)
ax.text(50, 10, "TAMPER DETECTION PRINCIPLE (SIMULATE TAMPERING TOOL):", fontsize=9.5, fontweight='bold', ha='center', color='#DC2626')
ax.text(50, 6, "Modifying any character in Block #1 changes its SHA-256 hash immediately, which breaks the Previous Hash\nof Block #2. The validator isChainValid() detects this mismatch in O(n) time, alerting evaluators instantly.", 
        fontsize=8, ha='center', color='#991B1B')

plt.tight_layout()
fig.savefig(os.path.join(out_dir, "blockchain_chaining_diagram.png"), dpi=300)
plt.close(fig)
print("Generated blockchain_chaining_diagram.png")
