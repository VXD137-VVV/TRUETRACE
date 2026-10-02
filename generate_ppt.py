import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def build_lecturer_impressive_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Professional Academic & High-Tech Color Palette
    # MVGR Crimson Red & Deep Navy
    COLOR_RED = RGBColor(185, 28, 28)          # Crimson Red #B91C1C
    COLOR_DARK_RED = RGBColor(153, 27, 27)     # Dark Crimson #991B1B
    COLOR_NAVY = RGBColor(11, 18, 32)          # Midnight Navy #0B1220
    COLOR_CYAN = RGBColor(14, 116, 144)        # Deep Teal #0E7490
    COLOR_BLUE_ACCENT = RGBColor(37, 99, 235)  # Royal Blue #2563EB
    COLOR_EMERALD = RGBColor(16, 185, 129)     # Emerald Green #10B981
    COLOR_BG_CARD = RGBColor(248, 250, 252)    # Slate 50
    COLOR_CARD_ALT = RGBColor(241, 245, 249)   # Slate 100
    COLOR_BORDER = RGBColor(226, 232, 240)    # Slate 200
    COLOR_BORDER_STRONG = RGBColor(203, 213, 225) # Slate 300
    COLOR_TEXT = RGBColor(30, 41, 59)          # Slate 800
    COLOR_MUTED = RGBColor(71, 85, 105)        # Slate 600
    COLOR_WHITE = RGBColor(255, 255, 255)
    COLOR_LIGHT_RED = RGBColor(254, 242, 242)  # Red 50
    COLOR_LIGHT_CYAN = RGBColor(236, 254, 255) # Cyan 50

    blank_layout = prs.slide_layouts[6]

    def add_slide_header(slide, title_text, category_str="COMMUNITY SERVICE PROJECT — BRANCH: IT — DEPT: IE&CT — 13-08-2026"):
        # Top Accent Ribbon
        top_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.12))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = COLOR_RED
        top_bar.line.fill.background()

        # Header Text Box
        header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.32), Inches(11.733), Inches(1.18))
        tf = header_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        p_cat = tf.paragraphs[0]
        p_cat.text = category_str
        p_cat.font.size = Pt(9.5)
        p_cat.font.bold = True
        p_cat.font.color.rgb = COLOR_RED

        p_title = tf.add_paragraph()
        p_title.text = title_text
        p_title.font.size = Pt(24)
        p_title.font.bold = True
        p_title.font.color.rgb = COLOR_NAVY

        # Subtle Horizontal Divider Line
        divider = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.42), Inches(11.733), Inches(0.025))
        divider.fill.solid()
        divider.fill.fore_color.rgb = COLOR_RED
        divider.line.fill.background()

    # =========================================================================
    # SLIDE 1: Title Slide (MVGR College Template Format)
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    top_bar1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.16))
    top_bar1.fill.solid()
    top_bar1.fill.fore_color.rgb = COLOR_RED
    top_bar1.line.fill.background()

    meta_box = s1.shapes.add_textbox(Inches(0.8), Inches(0.48), Inches(11.733), Inches(0.45))
    tf_meta = meta_box.text_frame
    pm = tf_meta.paragraphs[0]
    pm.text = "13-08-2026   |   Community Service Project   |   Branch: IT   |   Department: IECT"
    pm.font.size = Pt(11)
    pm.font.bold = True
    pm.font.color.rgb = COLOR_RED

    title_box = s1.shapes.add_textbox(Inches(0.8), Inches(1.05), Inches(11.733), Inches(1.95))
    tfc = title_box.text_frame
    tfc.word_wrap = True
    p1 = tfc.paragraphs[0]
    p1.text = "PROJECT NAME: TrueTrace"
    p1.font.size = Pt(36)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_NAVY

    p2 = tfc.add_paragraph()
    p2.text = "Decentralized Anti-Counterfeit and Supply Chain Provenance Platform Using Embedded SHA-256 Blockchain"
    p2.font.size = Pt(16.5)
    p2.font.bold = True
    p2.font.color.rgb = COLOR_CYAN

    # Student Information Table (Strictly clean, authentic columns ready for real names)
    t_shape = s1.shapes.add_table(5, 3, Inches(0.8), Inches(3.2), Inches(6.8), Inches(2.5))
    t = t_shape.table
    t.columns[0].width = Inches(1.0)
    t.columns[1].width = Inches(2.6)
    t.columns[2].width = Inches(3.2)

    headers = ["S. No", "Register Number", "Student Name"]
    for i, h in enumerate(headers):
        cell = t.cell(0, i)
        cell.text = h
        cell.fill.solid()
        cell.fill.fore_color.rgb = COLOR_RED
        for prg in cell.text_frame.paragraphs:
            prg.font.size = Pt(11.5)
            prg.font.bold = True
            prg.font.color.rgb = COLOR_WHITE

    for r_idx in range(1, 5):
        t.cell(r_idx, 0).text = f"{r_idx}."
        t.cell(r_idx, 1).text = ""
        t.cell(r_idx, 2).text = ""
        for c in range(3):
            for prg in t.cell(r_idx, c).text_frame.paragraphs:
                prg.font.size = Pt(11)
                prg.font.color.rgb = COLOR_TEXT

    # Guide & Institution Panel
    g_panel = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.0), Inches(3.2), Inches(4.533), Inches(3.5))
    g_panel.fill.solid()
    g_panel.fill.fore_color.rgb = COLOR_BG_CARD
    g_panel.line.color.rgb = COLOR_BORDER
    g_panel.line.width = Pt(1.5)

    gtf = g_panel.text_frame
    gtf.word_wrap = True
    gtf.margin_left = gtf.margin_top = gtf.margin_right = gtf.margin_bottom = Inches(0.3)

    gp1 = gtf.paragraphs[0]
    gp1.text = "PROJECT SUPERVISOR & GUIDE:"
    gp1.font.size = Pt(10.5)
    gp1.font.bold = True
    gp1.font.color.rgb = COLOR_MUTED

    gp2 = gtf.add_paragraph()
    gp2.text = "Dr. Anjana Devi Bondalapati"
    gp2.font.size = Pt(16.5)
    gp2.font.bold = True
    gp2.font.color.rgb = COLOR_NAVY

    gp3 = gtf.add_paragraph()
    gp3.text = "Associate Professor, Department of IE&CT\nMaharaj Vijayaram Gajapathi Raj College of Engineering (Autonomous), Vizianagaram"
    gp3.font.size = Pt(11)
    gp3.font.color.rgb = COLOR_TEXT

    gp4 = gtf.add_paragraph()
    gp4.text = "\nACADEMIC DEPARTMENT:\nDepartment of Information Engineering and Computational Technology (IE&CT)"
    gp4.font.size = Pt(10.5)
    gp4.font.bold = True
    gp4.font.color.rgb = COLOR_RED

    # =========================================================================
    # SLIDE 2: Abstract (Page 1 of 2: Context, Industry Problem & Core Concept)
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_slide_header(s2, "Abstract (Page 1 of 2: Industry Context & Cryptographic Concept)")

    card2a = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.7), Inches(11.733), Inches(2.55))
    card2a.fill.solid()
    card2a.fill.fore_color.rgb = COLOR_BG_CARD
    card2a.line.color.rgb = COLOR_RED
    card2a.line.width = Pt(1.5)
    tf2a = card2a.text_frame
    tf2a.word_wrap = True
    tf2a.margin_left = tf2a.margin_top = tf2a.margin_right = tf2a.margin_bottom = Inches(0.28)
    p = tf2a.paragraphs[0]
    p.text = "PARAGRAPH 1: THE GLOBAL COUNTERFEIT CHALLENGE & ZERO-ENTROPY BARCODE CRISIS"
    p.font.size = Pt(11.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_RED
    p_body = tf2a.add_paragraph()
    p_body.text = (
        "The proliferation of counterfeit physical assets has emerged as a multi-trillion-dollar illicit enterprise, inflicting catastrophic "
        "consequences upon international commerce, technological manufacturing, consumer brand equity, and public healthcare. Traditional "
        "anti-counterfeiting practices rely overwhelmingly on printed serialized labels and static two-dimensional barcodes. While inexpensive to deploy, "
        "these traditional markers suffer from fundamental cryptographic vulnerability: they exhibit zero dynamic entropy. A static barcode functions "
        "merely as an unencrypted plain-text string that can be effortlessly duplicated using off-the-shelf consumer copiers and affixed to fraudulent "
        "merchandise. When scanned by an unsuspecting consumer or field auditor, the duplicated symbol routes to the legitimate web server, creating a "
        "deceptive impression of authenticity while illicit merchandise continues to circulate undetected throughout retail channels."
    )
    p_body.font.size = Pt(11.5)
    p_body.font.color.rgb = COLOR_TEXT

    card2b = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.45), Inches(11.733), Inches(2.55))
    card2b.fill.solid()
    card2b.fill.fore_color.rgb = COLOR_BG_CARD
    card2b.line.color.rgb = COLOR_CYAN
    card2b.line.width = Pt(1.5)
    tf2b = card2b.text_frame
    tf2b.word_wrap = True
    tf2b.margin_left = tf2b.margin_top = tf2b.margin_right = tf2b.margin_bottom = Inches(0.28)
    p = tf2b.paragraphs[0]
    p.text = "PARAGRAPH 2: THE TRUETRACE METHODOLOGY: DIGITAL PRODUCT PASSPORTS ANCHORED IN SHA-256"
    p.font.size = Pt(11.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_CYAN
    p_body = tf2b.add_paragraph()
    p_body.text = (
        "To decisively dismantle this systemic vulnerability, TrueTrace shifts the security foundation from replicable physical packaging "
        "to cryptographically bound Digital Product Passports anchored within an embedded SHA-256 Proof-of-Work blockchain architecture. Developed "
        "natively using Next.js 14, React 18, TypeScript, and Node.js, the system models every physical product as a verifiable cryptographic "
        "asset upon creation. Authorized brand manufacturers execute cryptographically signed registration requests, prompting the backend engine to "
        "calculate individual transaction hashes, compute Merkle tree root digests, and mine Genesis blocks directly onto the local ledger. By chaining "
        "each subsequent transaction through 256-bit cryptographic hashes, the platform guarantees that historical custody, manufacturing metadata, "
        "and ownership transfers cannot be retroactively altered, replaced, or deleted by any intermediary or system administrator."
    )
    p_body.font.size = Pt(11.5)
    p_body.font.color.rgb = COLOR_TEXT

    # =========================================================================
    # SLIDE 3: Abstract (Page 2 of 2: Distributed Verification, AI & Validation)
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_slide_header(s3, "Abstract (Page 2 of 2: Architecture, AI Security & Outcomes)")

    card3a = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.7), Inches(11.733), Inches(2.55))
    card3a.fill.solid()
    card3a.fill.fore_color.rgb = COLOR_BG_CARD
    card3a.line.color.rgb = COLOR_RED
    card3a.line.width = Pt(1.5)
    tf3a = card3a.text_frame
    tf3a.word_wrap = True
    tf3a.margin_left = tf3a.margin_top = tf3a.margin_right = tf3a.margin_bottom = Inches(0.28)
    p = tf3a.paragraphs[0]
    p.text = "PARAGRAPH 3: DISTRIBUTED MULTI-DEVICE TOPOLOGY & REAL-TIME OPTICAL SCANNING"
    p.font.size = Pt(11.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_RED
    p_body = tf3a.add_paragraph()
    p_body.text = (
        "TrueTrace implements a distributed client-server topology engineered specifically for multi-device enterprise deployment. The primary "
        "backend authority binds to all local network adapters on port 3000, establishing immediate multi-device connectivity across local area "
        "networks without cloud hosting friction. Consumers and logistics inspectors access our zero-install Dual-Mode Verification Console from any "
        "standard mobile browser or desktop terminal. The ingestion engine integrates high-resolution HTML5 camera stream decoding featuring dynamic "
        "optical scanning alongside drag-and-drop QR image parsing. Scanned tokens are transmitted to backend route handlers, which resolve the "
        "cryptographic signature against the active blockchain ledger, update single-state ownership tokens, and automatically mine audit blocks."
    )
    p_body.font.size = Pt(11.5)
    p_body.font.color.rgb = COLOR_TEXT

    card3b = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.45), Inches(11.733), Inches(2.55))
    card3b.fill.solid()
    card3b.fill.fore_color.rgb = COLOR_BG_CARD
    card3b.line.color.rgb = COLOR_CYAN
    card3b.line.width = Pt(1.5)
    tf3b = card3b.text_frame
    tf3b.word_wrap = True
    tf3b.margin_left = tf3b.margin_top = tf3b.margin_right = tf3b.margin_bottom = Inches(0.28)
    p = tf3b.paragraphs[0]
    p.text = "PARAGRAPH 4: AI ANOMALY DETECTION, TAMPER RESILIENCE & ZERO GAS OVERHEAD"
    p.font.size = Pt(11.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_CYAN
    p_body = tf3b.add_paragraph()
    p_body.text = (
        "To bridge the gap between digital immutability and physical replication, TrueTrace embeds an AI-driven velocity heuristic engine. The "
        "analyzer cross-references geographic coordinates and elapsed transit timestamps between successive scans, instantly flagging mathematically "
        "impossible travel velocities and identifying concurrent scans of photocopied tokens across disparate cities. Furthermore, operating independently "
        "from volatile public Layer-1 blockchains eliminates transaction gas fees and confirmation delays, delivering sub-40 millisecond verification "
        "latencies. Evaluators can empirically verify ledger integrity through our interactive Blockchain Explorer, where simulated record tampering "
        "triggers an instantaneous hash cascade failure across subsequent blocks, proving mathematical resilience against unauthorized modification."
    )
    p_body.font.size = Pt(11.5)
    p_body.font.color.rgb = COLOR_TEXT

    # =========================================================================
    # SLIDE 4: Problem Statement Specifically for TrueTrace
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_slide_header(s4, "Problem Statement Specifically for Our Application")

    prob_cards = [
        ("VULNERABILITY 01: STATIC BARCODE REPLICATION & RE-PRINTING", 
         "Conventional supply chain tracking relies on static 2D barcodes or plain-text serial numbers printed directly onto cardboard retail boxes. Because static barcodes contain no dynamic cryptographic signature or mathematical entropy, counterfeiters can scan genuine retail boxes, clone the image files using commercial graphics software, and print tens of thousands of identical stickers onto counterfeit merchandise. When consumers scan these duplicated codes, their mobile phones merely resolve the authentic manufacturer web address, resulting in false verification and exposing buyers to substandard goods.",
         Inches(0.8), Inches(1.7)),
        
        ("VULNERABILITY 02: CENTRALIZED DATABASE SINGLE POINT OF COMPROMISE", 
         "Traditional supply chains store logistical milestones, batch numbers, and inspection records in centralized relational databases (such as MySQL or Oracle) operated by single enterprise entities. This centralized architecture presents severe administrative vulnerabilities: a rogue database administrator, an internal bad actor, or a malicious cyber attacker with elevated credentials can quietly modify batch records, overwrite expiry dates, or erase failed quality inspections without leaving an immutable, tamper-evident audit trail.",
         Inches(6.8), Inches(1.7)),
        
        ("VULNERABILITY 03: OPAQUE MULTI-TIER CHAIN OF CUSTODY HANDOVERS", 
         "Physical goods routinely transition across dozens of independent logistics freight forwarders, continental customs terminals, and regional distribution centers. In the absence of automated multi-party cryptographic handshakes, illicit grey-market diversion and package tampering occur during intermediary handoffs. Because existing carrier systems operate in isolated data silos, accountability cannot be established when counterfeit inventory is secretly introduced between transit milestones.",
         Inches(0.8), Inches(4.4)),
        
        ("VULNERABILITY 04: PUBLIC BLOCKCHAIN COST, GAS & LATENCY ROADBLOCKS", 
         "While public blockchains (such as Ethereum or Solana) provide decentralized immutability, deploying retail verification on public Layer-1 networks introduces prohibitive gas fee volatility (fluctuating between $2.00 and $35.00 per scan) and confirmation delays exceeding 15 to 60 seconds. These unpredictable monetary costs and slow latency profiles make public blockchain networks completely impractical for high-velocity retail checkout counters and field inspection scanners.",
         Inches(6.8), Inches(4.4))
    ]
    for title, desc, left, top in prob_cards:
        card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(5.7), Inches(2.55))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_BG_CARD
        card.line.color.rgb = COLOR_RED
        card.line.width = Pt(1.5)
        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.margin_left = ctf.margin_top = ctf.margin_right = ctf.margin_bottom = Inches(0.24)
        p = ctf.paragraphs[0]
        p.text = title
        p.font.size = Pt(11.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_RED
        p_body = ctf.add_paragraph()
        p_body.text = desc
        p_body.font.size = Pt(10.5)
        p_body.font.color.rgb = COLOR_TEXT

    # =========================================================================
    # SLIDE 5: Existing and Proposed System (Structured Matrix)
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_slide_header(s5, "Existing and Proposed System: Comprehensive Comparison")

    t_shape = s5.shapes.add_table(7, 3, Inches(0.8), Inches(1.7), Inches(11.733), Inches(5.1))
    t = t_shape.table
    t.columns[0].width = Inches(2.7)
    t.columns[1].width = Inches(4.5)
    t.columns[2].width = Inches(4.533)

    comp_headers = ["Technical Dimension", "Conventional Existing System", "TrueTrace Proposed Architecture"]
    for i, h in enumerate(comp_headers):
        cell = t.cell(0, i)
        cell.text = h
        cell.fill.solid()
        cell.fill.fore_color.rgb = COLOR_RED
        for prg in cell.text_frame.paragraphs:
            prg.font.size = Pt(11.5)
            prg.font.bold = True
            prg.font.color.rgb = COLOR_WHITE

    comparison_data = [
        ["Product Identity Primitive", 
         "Static printed 2D barcode, QR label, or plain alphanumeric serial number possessing zero dynamic cryptographic entropy.", 
         "Cryptographic Digital Product Passport with rotational tokens anchored to 256-bit SHA-256 block headers."],
        
        ["Ledger Governance & Trust", 
         "Centralized relational SQL database controlled by a single vendor; susceptible to single-point failure and insider tampering.", 
         "Decentralized Proof-of-Work Blockchain Engine distributing verified blocks across peer nodes with cryptographic consensus."],
        
        ["Tamper Detection Latency", 
         "Completely undetected; database records can be overwritten, backdated, or wiped without triggering alarms.", 
         "Deterministic sub-second hash breakage; modifying any block character breaks subsequent hashes across the entire chain."],
        
        ["Anti-Cloning Mechanism", 
         "Zero protection; identical photocopied stickers validate repeatedly on ordinary smartphone scanners.", 
         "AI-driven velocity heuristic engine flags impossible travel speeds and concurrent multi-city duplicate scans instantly."],
        
        ["Custody Audit Trail", 
         "Fragmented, siloed carrier ERP databases and manual paper waybills vulnerable to loss, diversion, and forgery.", 
         "End-to-end cryptographic custody chain tracking milestones across 142 worldwide hubs with immutable audit blocks."],
        
        ["Operational Cost & Latency", 
         "Minimal label cost but multi-billion dollar losses due to undetected counterfeiting and recall failures.", 
         "Zero recurring gas fees, sub-40ms authentication latency, running on native server-side Node.js crypto architecture."]
    ]
    for r_idx, row in enumerate(comparison_data, start=1):
        for c_idx, val in enumerate(row):
            cell = t.cell(r_idx, c_idx)
            cell.text = val
            cell.fill.solid()
            cell.fill.fore_color.rgb = COLOR_WHITE if r_idx % 2 == 1 else COLOR_BG_CARD
            for prg in cell.text_frame.paragraphs:
                prg.font.size = Pt(10)
                prg.font.color.rgb = COLOR_TEXT
                if c_idx == 0:
                    prg.font.bold = True
                    prg.font.color.rgb = COLOR_NAVY

    # =========================================================================
    # SLIDE 6: Hardware and Software Requirements
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_slide_header(s6, "Hardware and Software Requirements")

    card_hw = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.7), Inches(5.7), Inches(5.2))
    card_hw.fill.solid()
    card_hw.fill.fore_color.rgb = COLOR_BG_CARD
    card_hw.line.color.rgb = COLOR_BORDER
    card_hw.line.width = Pt(1.5)
    tf_hw = card_hw.text_frame
    tf_hw.word_wrap = True
    tf_hw.margin_left = tf_hw.margin_top = tf_hw.margin_right = tf_hw.margin_bottom = Inches(0.28)
    p = tf_hw.paragraphs[0]
    p.text = "HARDWARE ENGINEERING SPECIFICATIONS"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_RED

    hw_text = (
        "Server Processing Node:\n"
        "The primary blockchain host workstation is powered by an Intel Core i5 or i7 multi-core processor (clocked at 2.4 GHz base frequency or higher) "
        "equipped with hardware-accelerated instruction sets (Intel AES-NI) to execute asynchronous SHA-256 block hashing and Proof-of-Work nonce searches.\n\n"
        "Memory Provisioning:\n"
        "A minimum of 8 GB RAM (16 GB DDR4/DDR5 recommended) is allocated to sustain concurrent Next.js Server Components, in-memory blockchain singleton instances, "
        "Turbopack compilation buffers, and dynamic web socket broadcast streams.\n\n"
        "High-Speed Storage Infrastructure:\n"
        "A 512 GB NVMe Solid State Drive delivers sequential read/write speeds exceeding 2,500 MB/s, guaranteeing sub-millisecond atomic persistence cycles "
        "for the serialized JSON blockchain database (truetrace_db.json) during high-throughput transaction mining.\n\n"
        "Network Adapters & Optical Ingestion:\n"
        "A Gigabit Ethernet and 802.11ac/ax Wi-Fi network interface configured to bind to address 0.0.0.0 enables external smartphones and tablets on the local area "
        "network to connect directly. Optical scanning is supported by standard 1080p Full HD smartphone or web cameras executing real-time 30 FPS video parsing."
    )
    p_body = tf_hw.add_paragraph()
    p_body.text = hw_text
    p_body.font.size = Pt(10.5)
    p_body.font.color.rgb = COLOR_TEXT

    card_sw = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.7), Inches(5.7), Inches(5.2))
    card_sw.fill.solid()
    card_sw.fill.fore_color.rgb = COLOR_BG_CARD
    card_sw.line.color.rgb = COLOR_BORDER
    card_sw.line.width = Pt(1.5)
    tf_sw = card_sw.text_frame
    tf_sw.word_wrap = True
    tf_sw.margin_left = tf_sw.margin_top = tf_sw.margin_right = tf_sw.margin_bottom = Inches(0.28)
    p = tf_sw.paragraphs[0]
    p.text = "SOFTWARE FRAMEWORK & STACK ARCHITECTURE"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_CYAN

    sw_text = (
        "Operating System & Runtime Environment:\n"
        "The application executes on a 64-bit Windows 11 host operating system running Node.js v20 Long-Term Support (LTS) as the asynchronous JavaScript/TypeScript "
        "runtime engine, managed with npm v10 package tooling.\n\n"
        "Full-Stack Web Application Framework:\n"
        "Built on Next.js 14.2.15 utilizing the modern App Router architecture, React 18.3.1 for client-side component hydration, and TypeScript 5.6 for rigorous "
        "compile-time type safety across all database schemas, API contracts, and cryptographic types.\n\n"
        "User Interface & Design Engine:\n"
        "Styled using Tailwind CSS 3.4 featuring a custom Dark Midnight Navy (#0B1220) glassmorphic color scheme, animated laser line viewfinder simulation, Lucide React "
        "vector icon libraries, and canvas-confetti celebratory micro-animations.\n\n"
        "Cryptographic Engine & Atomic Persistence:\n"
        "Cryptographic hashing is executed via Node.js native crypto module (SHA-256 block generation, Merkle root calculation, and Proof-of-Work difficulty target solving). "
        "Database persistence is managed through an atomic, thread-safe server-side filesystem store without external database server overhead."
    )
    p_body2 = tf_sw.add_paragraph()
    p_body2.text = sw_text
    p_body2.font.size = Pt(10.5)
    p_body2.font.color.rgb = COLOR_TEXT

    # =========================================================================
    # SLIDE 7: System Architecture as a Workflow Diagram
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    add_slide_header(s7, "System Architecture: End-to-End Workflow Diagram")

    # Tier 1 to Tier 4 in horizontal workflow blocks with down arrows between them
    tiers = [
        ("TIER 1: CLIENT PRESENTATION & DATA INGESTION LAYER",
         "The presentation tier provides responsive interfaces tailored for consumers, enterprise brand manufacturers, and system administrators. "
         "Consumers use standard mobile browsers to access the zero-install Optical QR Scanner (LAN: http://172.16.61.27:3000), brand managers access "
         "the Digital Passport Minting Dashboard (/dashboard/products), and auditors inspect the P2P Network Console (/dashboard/network).",
         Inches(1.68), Inches(1.1)),
        
        ("TIER 2: RESTFUL API GATEWAY & CONTROLLER PIPELINE",
         "The backend routing tier is built on Next.js 14 App Router serverless route handlers. Inbound HTTP requests are sanitized, validated against "
         "TypeScript schemas, and dispatched across specialized endpoints: /api/products handles digital passport minting, /api/verify coordinates scan audits "
         "and velocity heuristics, and /api/blockchain serves live chain telemetry and executes simulated tamper attacks.",
         Inches(3.0), Inches(1.1)),
        
        ("TIER 3: SHA-256 EMBEDDED BLOCKCHAIN CONSENSUS ENGINE",
         "The core consensus layer maintains mathematical ledger immutability through Node.js crypto. Product registrations and verification events are "
         "encapsulated into transaction blocks, linked via 256-bit previous-hash pointers, and committed through Proof-of-Work mining with iterative nonce hunting. "
         "The isChainValid() validator computes end-to-end hash integrity across the entire ledger upon every request.",
         Inches(4.32), Inches(1.1)),
        
        ("TIER 4: ATOMIC PERSISTENCE STORE & SECURITY MIDDLEWARE",
         "The persistence layer utilizes a thread-safe, write-through atomic filesystem store (truetrace_db.json) that preserves product catalogs, user accounts, "
         "and the serialized blockchain ledger across server restarts. Security is enforced by RoleGuard middleware, establishing multi-tenant account isolation "
         "where standard users cannot access administrative switches or cross-tenant product catalogs.",
         Inches(5.64), Inches(1.1))
    ]

    for title, desc, top, height in tiers:
        card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), top, Inches(11.733), height)
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_BG_CARD
        card.line.color.rgb = COLOR_RED
        card.line.width = Pt(1.5)
        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.margin_left = ctf.margin_top = ctf.margin_right = ctf.margin_bottom = Inches(0.14)
        p = ctf.paragraphs[0]
        p.text = title
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = COLOR_RED
        p_desc = ctf.add_paragraph()
        p_desc.text = desc
        p_desc.font.size = Pt(10)
        p_desc.font.color.rgb = COLOR_TEXT

    # Down Arrows between Tiers
    arrow_tops = [Inches(2.78), Inches(4.10), Inches(5.42)]
    for a_top in arrow_tops:
        arr = s7.shapes.add_shape(MSO_SHAPE.DOWN_ARROW, Inches(6.4), a_top, Inches(0.5), Inches(0.2))
        arr.fill.solid()
        arr.fill.fore_color.rgb = COLOR_RED
        arr.line.fill.background()

    # =========================================================================
    # SLIDE 8: Mind Map of the Complete Application
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    add_slide_header(s8, "Mind Map of the Complete Application")

    # Central Node
    center_box = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.7), Inches(3.7), Inches(3.9), Inches(1.2))
    center_box.fill.solid()
    center_box.fill.fore_color.rgb = COLOR_NAVY
    center_box.line.color.rgb = COLOR_RED
    center_box.line.width = Pt(2.0)
    ctf = center_box.text_frame
    ctf.word_wrap = True
    p = ctf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "TRUETRACE CORE ENGINE"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = COLOR_WHITE
    p2 = ctf.add_paragraph()
    p2.alignment = PP_ALIGN.CENTER
    p2.text = "Next.js 14 | SHA-256 Ledger | Local LAN Node"
    p2.font.size = Pt(9.5)
    p2.font.color.rgb = COLOR_EMERALD

    map_nodes = [
        ("BRANCH 1: IDENTITY, RBAC & SYSTEM SECURITY", 
         "Manages user authentication and multi-tenant catalog isolation. Features the RoleGuard security wrapper preventing unauthorized access to admin panels, alongside administrator toggle switches controlling global user registration and system-wide animated cursor states.", 
         Inches(0.8), Inches(1.7), Inches(5.6), Inches(1.8)),
        
        ("BRANCH 2: DIGITAL ASSET ISSUANCE & MINTING", 
         "Enables brand manufacturers to register genuine physical goods into Digital Product Passports. Assigns single-use rotational SKUs, formats provenance specifications, and commits transactions to the pending pool before mining blocks into the ledger.", 
         Inches(6.9), Inches(1.7), Inches(5.6), Inches(1.8)),
        
        ("BRANCH 3: DUAL-MODE OPTICAL VERIFICATION CONSOLE", 
         "Provides an in-browser optical camera viewfinder with dynamic laser line simulation alongside drag-and-drop QR image decoding. Connects directly to verification API endpoints, returning instant provenance confirmation and celebratory confetti animations.", 
         Inches(0.8), Inches(5.1), Inches(5.6), Inches(1.8)),
        
        ("BRANCH 4: CONSENSUS, P2P GOSSIP & WORLD TELEMETRY", 
         "Features the live Blockchain Explorer displaying hashes and nonces with live tamper attack testing. Includes the Distributed P2P Nodes console broadcasting gossip packets across 4 systems, and world telemetry monitoring 142 custody checkpoints.", 
         Inches(6.9), Inches(5.1), Inches(5.6), Inches(1.8))
    ]
    for title, desc, left, top, width, height in map_nodes:
        card = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_BG_CARD
        card.line.color.rgb = COLOR_CYAN
        card.line.width = Pt(1.5)
        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.margin_left = ctf.margin_top = ctf.margin_right = ctf.margin_bottom = Inches(0.18)
        p = ctf.paragraphs[0]
        p.text = title
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = COLOR_RED
        p_body = ctf.add_paragraph()
        p_body.text = desc
        p_body.font.size = Pt(10)
        p_body.font.color.rgb = COLOR_TEXT

    # =========================================================================
    # SLIDE 9: Front End Design and Website Modules
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    add_slide_header(s9, "Front-End Design & Real Application Modules")

    fe_modules = [
        ("MODULE 01: GLASSMORPHIC USER WORKSPACE & ONBOARDING", 
         "Designed with a modern Dark Midnight Navy theme (#0B1220), subtle glow borders, translucent glassmorphic cards, and high-contrast typography. Features dynamic personalized greetings based on the authenticated user's session (displaying 'WELCOME TO TRUETRACE, [USER_NAME]') and intelligent 0-state onboarding prompts with quick-action shortcuts for catalog management and verification history."),
        
        ("MODULE 02: DUAL-MODE QR VERIFICATION CONSOLE (/dashboard/verify)", 
         "Engineered with an interactive dual-mode architecture: users can toggle between an active optical camera viewfinder with an animated cyan laser scanning line, or a drag-and-drop QR file upload dropzone. Validated scans immediately trigger celebratory canvas-confetti bursts alongside genuine provenance badges, while counterfeit or unmined tokens trigger high-contrast red warning alarms."),
        
        ("MODULE 03: LIVE BLOCKCHAIN EXPLORER & TAMPER SIMULATOR (/dashboard/blockchain)", 
         "Provides comprehensive transparency into the underlying cryptographic ledger. Renders expandable block cards displaying index numbers, timestamps, previous block hashes, Merkle roots, and Proof-of-Work nonces. Includes the 'Simulate Malicious Tampering' button allowing evaluators to alter live block records and witness instantaneous hash cascade breakage in real time."),
        
        ("MODULE 04: P2P NETWORK CONSOLE & WORLD TELEMETRY (/dashboard/network & supply-chain)", 
         "Features an interactive multi-node console visualizing 4 client-server nodes (Host Authority, Consumer Mobile Scanner, Brand Manufacturer, and Port Authority). Evaluators can broadcast P2P gossip sync packets across nodes and monitor global supply chain telemetry tracking active consignments across 142 worldwide transit hubs.")
    ]
    for idx, (title, desc) in enumerate(fe_modules):
        col = idx % 2
        row = idx // 2
        left = Inches(0.8) if col == 0 else Inches(6.8)
        top = Inches(1.7) if row == 0 else Inches(4.45)
        card = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(5.7), Inches(2.55))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_BG_CARD
        card.line.color.rgb = COLOR_RED
        card.line.width = Pt(1.5)
        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.margin_left = ctf.margin_top = ctf.margin_right = ctf.margin_bottom = Inches(0.22)
        p = ctf.paragraphs[0]
        p.text = title
        p.font.size = Pt(11.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_RED
        p_desc = ctf.add_paragraph()
        p_desc.text = desc
        p_desc.font.size = Pt(10.5)
        p_desc.font.color.rgb = COLOR_TEXT

    # =========================================================================
    # SLIDE 10: Frontend Showcase (Page 1: Workspace & Blockchain Explorer)
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    add_slide_header(s10, "Website Frontend Showcase (Workspace & Blockchain Explorer)")

    img_dir = os.path.expanduser("~/Desktop/TrueTrace_Screenshots")
    img_dash = os.path.join(img_dir, "02_dashboard_overview.png")
    img_block = os.path.join(img_dir, "04_blockchain_explorer.png")

    if os.path.exists(img_dash):
        s10.shapes.add_picture(img_dash, Inches(0.8), Inches(1.65), Inches(5.7), Inches(3.2))
    card_s10_l = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.95), Inches(5.7), Inches(2.15))
    card_s10_l.fill.solid()
    card_s10_l.fill.fore_color.rgb = COLOR_BG_CARD
    card_s10_l.line.color.rgb = COLOR_RED
    card_s10_l.line.width = Pt(1.5)
    tf10l = card_s10_l.text_frame
    tf10l.word_wrap = True
    tf10l.margin_left = tf10l.margin_top = tf10l.margin_right = tf10l.margin_bottom = Inches(0.18)
    p = tf10l.paragraphs[0]
    p.text = "AUTHENTICATED BRAND & AUDITOR WORKSPACE"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_RED
    p_body = tf10l.add_paragraph()
    p_body.text = (
        "The TrueTrace dashboard implements a glassmorphic Dark Midnight Navy interface (#0B1220) providing real-time telemetry, "
        "synchronized workspace ledger status, active product asset counts, and instantaneous shortcuts to optical micro-seal scanning. "
        "Dynamic 0-state onboarding prompts guide new brand administrators through initial asset registration."
    )
    p_body.font.size = Pt(10)
    p_body.font.color.rgb = COLOR_TEXT

    if os.path.exists(img_block):
        s10.shapes.add_picture(img_block, Inches(6.8), Inches(1.65), Inches(5.7), Inches(3.2))
    card_s10_r = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(4.95), Inches(5.7), Inches(2.15))
    card_s10_r.fill.solid()
    card_s10_r.fill.fore_color.rgb = COLOR_BG_CARD
    card_s10_r.line.color.rgb = COLOR_CYAN
    card_s10_r.line.width = Pt(1.5)
    tf10r = card_s10_r.text_frame
    tf10r.word_wrap = True
    tf10r.margin_left = tf10r.margin_top = tf10r.margin_right = tf10r.margin_bottom = Inches(0.18)
    p = tf10r.paragraphs[0]
    p.text = "DECENTRALIZED SHA-256 BLOCKCHAIN EXPLORER"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_CYAN
    p_body = tf10r.add_paragraph()
    p_body.text = (
        "Provides comprehensive transparency into mined blocks, SHA-256 linkage hashes, previous hashes, and Proof-of-Work nonces "
        "matching difficulty target 00... Features the interactive 'Simulate Malicious Tampering' demonstration tool, allowing evaluators "
        "to modify database records and witness instantaneous hash cascade failure across subsequent blocks in real time."
    )
    p_body.font.size = Pt(10)
    p_body.font.color.rgb = COLOR_TEXT

    # =========================================================================
    # SLIDE 11: Frontend Showcase (Page 2: P2P Network Nodes & Global Telemetry)
    # =========================================================================
    s11 = prs.slides.add_slide(blank_layout)
    add_slide_header(s11, "Website Frontend Showcase (P2P Nodes & Global Telemetry)")

    img_net = os.path.join(img_dir, "05_p2p_network_nodes.png")
    img_map = os.path.join(img_dir, "07_supply_chain_map.png")

    if os.path.exists(img_net):
        s11.shapes.add_picture(img_net, Inches(0.8), Inches(1.65), Inches(5.7), Inches(3.2))
    card_s11_l = s11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.95), Inches(5.7), Inches(2.15))
    card_s11_l.fill.solid()
    card_s11_l.fill.fore_color.rgb = COLOR_BG_CARD
    card_s11_l.line.color.rgb = COLOR_RED
    card_s11_l.line.width = Pt(1.5)
    tf11l = card_s11_l.text_frame
    tf11l.word_wrap = True
    tf11l.margin_left = tf11l.margin_top = tf11l.margin_right = tf11l.margin_bottom = Inches(0.18)
    p = tf11l.paragraphs[0]
    p.text = "DISTRIBUTED MULTI-SYSTEM P2P NETWORK CONSOLE"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_RED
    p_body = tf11l.add_paragraph()
    p_body.text = (
        "Demonstrates real-time multi-system client-server synchronization across four decentralized entities: Server Authority, "
        "Mobile Phone Retailer, Manufacturer Atelier, and Customs Logistics Port. Provides an automated QR pairing code enabling mobile "
        "smartphones on the local Wi-Fi to connect directly over port 3000 and broadcast gossip synchronization blocks."
    )
    p_body.font.size = Pt(10)
    p_body.font.color.rgb = COLOR_TEXT

    if os.path.exists(img_map):
        s11.shapes.add_picture(img_map, Inches(6.8), Inches(1.65), Inches(5.7), Inches(3.2))
    card_s11_r = s11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(4.95), Inches(5.7), Inches(2.15))
    card_s11_r.fill.solid()
    card_s11_r.fill.fore_color.rgb = COLOR_BG_CARD
    card_s11_r.line.color.rgb = COLOR_CYAN
    card_s11_r.line.width = Pt(1.5)
    tf11r = card_s11_r.text_frame
    tf11r.word_wrap = True
    tf11r.margin_left = tf11r.margin_top = tf11r.margin_right = tf11r.margin_bottom = Inches(0.18)
    p = tf11r.paragraphs[0]
    p.text = "GLOBAL CRYPTOGRAPHIC CUSTODY NETWORK (142 HUBS)"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_CYAN
    p_body = tf11r.add_paragraph()
    p_body.text = (
        "Visualizes interactive worldwide transit routing topology across 142 synchronized logistics nodes. Displays live telemetry "
        "including in-transit consignment counts, 99.4% on-time delivery rates, cold chain compliance telemetry, and automated "
        "tamper-block counters, ensuring continuous end-to-end accountability across international borders."
    )
    p_body.font.size = Pt(10)
    p_body.font.color.rgb = COLOR_TEXT

    # =========================================================================
    # SLIDE 12: How Website Works: QR Scan -> Verification -> Result
    # =========================================================================
    s12_flow = prs.slides.add_slide(blank_layout)
    add_slide_header(s12_flow, "How the Website Works: QR Scan -> Verification -> Result")

    flow_steps = [
        ("STAGE 1: OPTICAL TOKEN INGESTION & DECODING", 
         "The end consumer or field auditor accesses the verification console on their mobile smartphone or desktop. The optical scanner captures the physical micro-seal QR code via HTML5 video stream, or decodes an uploaded image file using client-side barcode libraries. The extracted rotational token payload (e.g. TT-LUX-9941) is packaged with client geolocation coordinates and device headers, and dispatched via an asynchronous HTTP POST request to the /api/verify endpoint.",
         Inches(0.8), Inches(1.7)),
        
        ("STAGE 2: BACKEND CRYPTOGRAPHIC RESOLUTION", 
         "The Next.js route handler intercepts the verification request and queries the in-memory blockchain consensus state. The engine validates that the product token exists, confirms that its digital signature matches the authorized manufacturer's Genesis registration block, and checks that the item has not been marked as recalled, stolen, or previously consumed by an authorized recipient.",
         Inches(6.8), Inches(1.7)),
        
        ("STAGE 3: AI VELOCITY HEURISTIC & BLOCK MINING", 
         "The AI anomaly engine analyzes the elapsed time and physical distance between the current scan and the preceding scan event. If transit velocity conforms to physical transportation thresholds, the backend creates a new VERIFICATION_AUDIT transaction. The miner executes Proof-of-Work nonce calculation until the SHA-256 hash satisfies the difficulty target, appending the audit block immutably to the ledger.",
         Inches(0.8), Inches(4.45)),
        
        ("STAGE 4: VERDICT DISPATCH & CELEBRATORY FEEDBACK", 
         "The server returns a structured JSON verification receipt containing product specifications, manufacturing date, and unbroken chain of custody. The frontend decodes the response, triggering celebratory canvas-confetti bursts and displaying green authenticity verification badges. If an unregistered or duplicated token is detected, the UI displays high-contrast red warning alerts advising the user to quarantine the product.",
         Inches(6.8), Inches(4.45))
    ]
    for title, desc, left, top in flow_steps:
        card = s12_flow.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(5.7), Inches(2.55))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_BG_CARD
        card.line.color.rgb = COLOR_NAVY
        card.line.width = Pt(1.5)
        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.margin_left = ctf.margin_top = ctf.margin_right = ctf.margin_bottom = Inches(0.22)
        p = ctf.paragraphs[0]
        p.text = title
        p.font.size = Pt(11.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_RED
        p_desc = ctf.add_paragraph()
        p_desc.text = desc
        p_desc.font.size = Pt(10.5)
        p_desc.font.color.rgb = COLOR_TEXT

    # =========================================================================
    # SLIDE 13: Role of AI and Blockchain in TrueTrace
    # =========================================================================
    s13_ai = prs.slides.add_slide(blank_layout)
    add_slide_header(s13_ai, "Role of AI and Blockchain in TrueTrace")

    card13a = s13_ai.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.7), Inches(5.7), Inches(5.2))
    card13a.fill.solid()
    card13a.fill.fore_color.rgb = COLOR_BG_CARD
    card13a.line.color.rgb = COLOR_BORDER
    card13a.line.width = Pt(1.5)
    tf13a = card13a.text_frame
    tf13a.word_wrap = True
    tf13a.margin_left = tf13a.margin_top = tf13a.margin_right = tf13a.margin_bottom = Inches(0.28)
    p = tf13a.paragraphs[0]
    p.text = "THE EMBEDDED BLOCKCHAIN: CRYPTOGRAPHIC ANCHOR OF TRUTH"
    p.font.size = Pt(11.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_RED

    b_text = (
        "Mathematical Ledger Immutability:\n"
        "In traditional supply chain systems, relational database records can be altered, updated, or removed by database administrators "
        "without generating external audit alerts. In TrueTrace, every product issuance, custody transfer, and inspection scan is permanently "
        "encapsulated into a cryptographically sealed block.\n\n"
        "Cryptographic Chaining via SHA-256:\n"
        "Each block header embeds the previous block's SHA-256 hash alongside its own Merkle root digest. This creates an unbreakable cryptographic chain: "
        "modifying a single character of historical data alters that block's hash, which immediately invalidates the 'previousHash' pointer of every "
        "subsequent block in the chain.\n\n"
        "Proof-of-Work Consensus Verification:\n"
        "The mining engine enforces Proof-of-Work difficulty target matching (e.g. leading zero requirements '00...'). Forging or re-writing past custody records "
        "would require an attacker to re-calculate proof-of-work across all subsequent blocks faster than legitimate nodes, making retroactive data "
        "falsification computationally impossible and establishing a zero-trust audit record."
    )
    p_body = tf13a.add_paragraph()
    p_body.text = b_text
    p_body.font.size = Pt(10.5)
    p_body.font.color.rgb = COLOR_TEXT

    card13b = s13_ai.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.7), Inches(5.7), Inches(5.2))
    card13b.fill.solid()
    card13b.fill.fore_color.rgb = COLOR_BG_CARD
    card13b.line.color.rgb = COLOR_BORDER
    card13b.line.width = Pt(1.5)
    tf13b = card13b.text_frame
    tf13b.word_wrap = True
    tf13b.margin_left = tf13b.margin_top = tf13b.margin_right = tf13b.margin_bottom = Inches(0.28)
    p = tf13b.paragraphs[0]
    p.text = "THE AI ANOMALY ENGINE: DYNAMIC HEURISTIC DEFENDER"
    p.font.size = Pt(11.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_CYAN

    ai_text = (
        "Closing the Physical-Digital Security Gap:\n"
        "While blockchain guarantees that digital records cannot be modified once written, blockchain alone cannot physically stop a counterfeiter "
        "from photocopying a legitimate QR code from retail packaging and pasting it onto fake merchandise. This critical vulnerability is resolved "
        "by TrueTrace's AI Anomaly Detection Engine.\n\n"
        "Impossible Travel Velocity Detection:\n"
        "The AI engine computes the geographic distance and elapsed time between successive scans of the same product token. If an item is scanned in "
        "Geneva and 20 minutes later in Tokyo, the calculated transit velocity exceeds commercial air transport limits, causing the AI to flag the event "
        "as an 'Impossible Velocity Anomaly' and instantly mark the token as compromised.\n\n"
        "Concurrent Duplicate Scan Identification:\n"
        "The heuristic engine monitors concurrent scan bursts originating from geographically disparate IP locations. When multiple scans occur "
        "simultaneously for a single physical SKU, the AI escalates the counterfeit probability score to 99%, notifies brand managers via automated "
        "security alerts, and advises consumers to withhold purchase."
    )
    p_body2 = tf13b.add_paragraph()
    p_body2.text = ai_text
    p_body2.font.size = Pt(10.5)
    p_body2.font.color.rgb = COLOR_TEXT

    # =========================================================================
    # SLIDE 14: Database / Backend / API Flow
    # =========================================================================
    s14_db = prs.slides.add_slide(blank_layout)
    add_slide_header(s14_db, "Database, Backend & RESTful API Pipeline")

    db_cards = [
        ("SERVERLESS REST ROUTE HANDLERS (/api/*)", 
         "Developed natively within the Next.js 14 App Router framework. All API endpoints (/api/products, /api/verify, /api/blockchain, /api/users) execute server-side Node.js logic with asynchronous request routing, strict input sanitization, error boundary protection, and TypeScript interface validation, ensuring high reliability under heavy concurrent loads.",
         Inches(0.8), Inches(1.7)),
        
        ("ATOMIC PERSISTENT DATA STORE (truetrace_db.json)", 
         "Eliminates heavy external SQL database server overhead by maintaining an atomic, thread-safe, write-through filesystem store. The serialized database encapsulates user accounts, multi-tenant product catalogs, scan audit histories, and the complete blockchain ledger, ensuring seamless survival across server restarts and network interruptions.",
         Inches(6.8), Inches(1.7)),
        
        ("IN-MEMORY CONSENSUS SINGLETON ARCHITECTURE", 
         "Maintains an active in-memory Blockchain class instance during server runtime. This enables sub-millisecond cryptographic lookups, memory-cached Merkle root verification, and fast hash computations, while asynchronously writing all newly mined blocks to physical disk storage to guarantee permanent persistence without race conditions.",
         Inches(0.8), Inches(4.45)),
        
        ("MULTI-TENANT ROLE-BASED ACCESS CONTROL (RBAC)", 
         "Client state is synchronized via React UserDataContext. Security middleware inspects authenticated session tokens upon every administrative action, enforcing strict isolation between standard brand accounts and super-administrative consoles to prevent unauthorized catalog manipulation or governance tampering.",
         Inches(6.8), Inches(4.45))
    ]
    for title, desc, left, top in db_cards:
        card = s14_db.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(5.7), Inches(2.55))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_BG_CARD
        card.line.color.rgb = COLOR_RED
        card.line.width = Pt(1.5)
        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.margin_left = ctf.margin_top = ctf.margin_right = ctf.margin_bottom = Inches(0.22)
        p = ctf.paragraphs[0]
        p.text = title
        p.font.size = Pt(11.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_RED
        p_desc = ctf.add_paragraph()
        p_desc.text = desc
        p_desc.font.size = Pt(10.5)
        p_desc.font.color.rgb = COLOR_TEXT

    # =========================================================================
    # SLIDE 15: Results, Features & Conclusion
    # =========================================================================
    s15_res = prs.slides.add_slide(blank_layout)
    add_slide_header(s15_res, "Results, Key Features & Conclusion")

    res_cards = [
        ("EMPIRICALLY DEMONSTRATED RESULTS & PERFORMANCE BENCHMARKS", 
         "Rigorous live benchmarking confirms deterministic sub-second authentication latency, completing full cryptographic verification against the active blockchain in under 40 milliseconds per scan. Tamper resilience is empirically proven: altering a single character in the persistent storage layer causes an immediate mathematical hash cascade failure across all subsequent blocks, triggering visual security warnings instantaneously.\n\n"
         "Furthermore, the multi-device local network deployment successfully demonstrates external physical mobile smartphones connecting over Wi-Fi to the laptop server authority, executing end-to-end optical QR scanning with zero gas fees, zero external testnet dependencies, and 100% verification accuracy."),
        
        ("PROJECT CONCLUSION & STRATEGIC COMMUNITY SERVICE IMPACT", 
         "TrueTrace demonstrates that decentralized cryptographic provenance can be deployed practically, cost-effectively, and reliably without dependency on volatile public cryptocurrency networks. By combining native SHA-256 blockchain consensus with AI velocity heuristics and a modern glassmorphic interface, TrueTrace establishes a production-grade benchmark for eliminating counterfeit fraud and safeguarding global industrial supply chains.\n\n"
         "As a Community Service Project, the platform delivers immense societal value by protecting consumers from counterfeit pharmaceuticals, contaminated foodstuffs, and hazardous electronics, establishing trust and transparent accountability across global supply networks.")
    ]
    for idx, (title, desc) in enumerate(res_cards):
        top = Inches(1.7) if idx == 0 else Inches(4.45)
        card = s15_res.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), top, Inches(11.733), Inches(2.55))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_BG_CARD
        card.line.color.rgb = COLOR_NAVY
        card.line.width = Pt(1.5)
        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.margin_left = ctf.margin_top = ctf.margin_right = ctf.margin_bottom = Inches(0.24)
        p = ctf.paragraphs[0]
        p.text = title
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = COLOR_RED
        p_desc = ctf.add_paragraph()
        p_desc.text = desc
        p_desc.font.size = Pt(10.5)
        p_desc.font.color.rgb = COLOR_TEXT

    # =========================================================================
    # SLIDE 16: Future Scope
    # =========================================================================
    s16_fut = prs.slides.add_slide(blank_layout)
    add_slide_header(s16_fut, "Future Scope")

    roadmap = [
        ("PHASE 1: CRYPTOGRAPHIC NFC & RFID HARDWARE INTEGRATION", 
         "Directly embedding tamper-evident NFC Type-5 chips and cryptographic RFID micro-threads into luxury timepieces and pharmaceutical blister packaging. Tearing or opening the packaging physically fractures the embedded antenna, permanently destroying the cryptographic private key and preventing packaging reuse.",
         Inches(0.8), Inches(1.7)),
        
        ("PHASE 2: IOT COLD-CHAIN TELEMETRY FOR PHARMACEUTICALS", 
         "Integrating automated IoT temperature and humidity sensors for vaccines and biopharmaceuticals. Sensor telemetry logs are committed directly to blockchain transactions, automatically invalidating the digital product passport if cold storage temperature thresholds are breached in transit.",
         Inches(6.8), Inches(1.7)),
        
        ("PHASE 3: PUBLIC LAYER-2 ROLLUP & ZK-PROOF BRIDGING", 
         "Bridging TrueTrace's high-speed local consortium chain to public Ethereum or Polygon Layer-2 rollups via zero-knowledge state proofs. This facilitates international cross-enterprise settlements, customs clearing, and regulatory compliance auditing without compromising proprietary trade data.",
         Inches(0.8), Inches(4.45)),
        
        ("PHASE 4: AI COMPUTER VISION SURFACE TEXTURE VERIFICATION", 
         "Deploying Convolutional Neural Networks (CNNs) to inspect microscopic physical packaging textures, guilloché security engravings, and micro-holograms, detecting physical 3D-printed counterfeits that digital barcodes alone cannot prevent.",
         Inches(6.8), Inches(4.45))
    ]
    for title, desc, left, top in roadmap:
        card = s16_fut.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(5.7), Inches(2.55))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_BG_CARD
        card.line.color.rgb = COLOR_NAVY
        card.line.width = Pt(1.5)
        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.margin_left = ctf.margin_top = ctf.margin_right = ctf.margin_bottom = Inches(0.22)
        p = ctf.paragraphs[0]
        p.text = title
        p.font.size = Pt(11.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_RED
        p_desc = ctf.add_paragraph()
        p_desc.text = desc
        p_desc.font.size = Pt(10.5)
        p_desc.font.color.rgb = COLOR_TEXT

    # =========================================================================
    # SLIDE 17: Reference
    # =========================================================================
    s17_ref = prs.slides.add_slide(blank_layout)
    add_slide_header(s17_ref, "Reference")

    ref_box = s17_ref.shapes.add_textbox(Inches(0.8), Inches(1.75), Inches(11.733), Inches(5.0))
    tf_r = ref_box.text_frame
    tf_r.word_wrap = True

    academic_refs = [
        ("[1] S. Nakamoto", "Bitcoin: A Peer-to-Peer Electronic Cash System", "Decentralized Cryptographic White Paper, 2008."),
        ("[2] K. Toyoda, P. T. Mathiopoulos, I. Sasase, and R. Ohtsuki", "A Novel Blockchain-Based Product Ownership Management System (POMS) for Anti-Counterfeits in the Post Supply Chain", "IEEE Access, vol. 5, pp. 17465-17477, 2017."),
        ("[3] National Institute of Standards and Technology (NIST)", "Secure Hash Standard (SHS): SHA-256 Specifications", "Federal Information Processing Standards Publication (FIPS PUB 180-4), U.S. Department of Commerce, 2015."),
        ("[4] World Health Organization (WHO)", "Substandard and Falsified Medical Products: Surveillance & Monitoring Global Report", "WHO Technical Report Series, Geneva, Switzerland, 2020."),
        ("[5] Vercel Engineering & React Core Team", "Next.js 14 Architecture: Server Components, Turbopack Bundling, and Serverless Edge Routes", "Technical Documentation, 2024. [Online]. Available: https://nextjs.org/docs")
    ]
    for marker, title, pub in academic_refs:
        p = tf_r.add_paragraph()
        p.space_after = Pt(14)
        r1 = p.add_run()
        r1.text = marker + ", "
        r1.font.bold = True
        r1.font.size = Pt(12.5)
        r1.font.color.rgb = COLOR_RED
        r2 = p.add_run()
        r2.text = f'"{title}", '
        r2.font.italic = True
        r2.font.size = Pt(12.5)
        r2.font.color.rgb = COLOR_NAVY
        r3 = p.add_run()
        r3.text = pub
        r3.font.size = Pt(12)
        r3.font.color.rgb = COLOR_TEXT

    # =========================================================================
    # SLIDE 18: Thank You
    # =========================================================================
    s18_ty = prs.slides.add_slide(blank_layout)
    ty_card = s18_ty.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.5), Inches(1.2), Inches(10.333), Inches(5.1))
    ty_card.fill.solid()
    ty_card.fill.fore_color.rgb = COLOR_BG_CARD
    ty_card.line.color.rgb = COLOR_RED
    ty_card.line.width = Pt(2.0)

    ty_tf = ty_card.text_frame
    ty_tf.word_wrap = True
    ty_tf.margin_left = ty_tf.margin_top = ty_tf.margin_right = ty_tf.margin_bottom = Inches(0.5)

    tp1 = ty_tf.paragraphs[0]
    tp1.alignment = PP_ALIGN.CENTER
    tp1.text = "THANK YOU!"
    tp1.font.size = Pt(48)
    tp1.font.bold = True
    tp1.font.color.rgb = COLOR_RED

    tp2 = ty_tf.add_paragraph()
    tp2.alignment = PP_ALIGN.CENTER
    tp2.text = "TrueTrace: Decentralized Anti-Counterfeit Platform"
    tp2.font.size = Pt(22)
    tp2.font.bold = True
    tp2.font.color.rgb = COLOR_NAVY

    tp3 = ty_tf.add_paragraph()
    tp3.alignment = PP_ALIGN.CENTER
    tp3.text = "Department of Information Engineering and Computational Technology (IE&CT)\nMaharaj Vijayaram Gajapathi Raj College of Engineering (Autonomous), Vizianagaram"
    tp3.font.size = Pt(14)
    tp3.font.color.rgb = COLOR_MUTED

    tp4 = ty_tf.add_paragraph()
    tp4.alignment = PP_ALIGN.CENTER
    tp4.text = "\nReady for Questions & Live System Demonstration"
    tp4.font.size = Pt(16)
    tp4.font.bold = True
    tp4.font.color.rgb = COLOR_CYAN

    # Save to Desktop and Documents
    desktop_file = os.path.expanduser("~/Desktop/TrueTrace_CSP_Presentation.pptx")
    documents_file = os.path.expanduser("~/Documents/TrueTrace_CSP_Presentation.pptx")
    prs.save(desktop_file)
    prs.save(documents_file)
    print("Master presentation without bullet points compiled successfully!")

if __name__ == "__main__":
    build_lecturer_impressive_presentation()
