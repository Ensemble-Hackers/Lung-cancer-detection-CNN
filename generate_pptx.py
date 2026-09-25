import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    # 16:9 widescreen format
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette - Modern Medical Tech Dark Theme
    BG_DARK = RGBColor(15, 23, 42)        # #0F172A (Deep Slate)
    CARD_BG = RGBColor(30, 41, 59)        # #1E293B (Card Slate)
    CARD_BORDER = RGBColor(51, 65, 85)    # #334155 (Subtle border)
    ACCENT_CYAN = RGBColor(14, 165, 233)  # #0EA5E9 (Primary Accent)
    ACCENT_TEAL = RGBColor(16, 185, 129)  # #10B981 (Success/Solution)
    ACCENT_ROSE = RGBColor(244, 63, 94)   # #F43F5E (Limitation/Alert)
    ACCENT_AMBER = RGBColor(245, 158, 11) # #F59E0B (Warning)
    ACCENT_PURPLE = RGBColor(168, 85, 247) # #A855F7
    TEXT_WHITE = RGBColor(248, 250, 252)  # #F8FAFC
    TEXT_MUTED = RGBColor(148, 163, 184)  # #94A3B8
    TEXT_DIM = RGBColor(100, 116, 139)    # #64748B

    def set_slide_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_DARK
        bg.line.fill.background()
        return bg

    def add_header(slide, tag_text, title_text, subtitle_text="", nav_button_text=None, target_slide=None):
        # Tag pill
        tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.35), Inches(8), Inches(0.3))
        tf = tag_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = tag_text.upper()
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = ACCENT_CYAN

        # Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.65), Inches(11.7), Inches(0.55))
        tf2 = title_box.text_frame
        tf2.word_wrap = True
        tf2.margin_left = tf2.margin_top = tf2.margin_right = tf2.margin_bottom = 0
        p2 = tf2.paragraphs[0]
        p2.text = title_text
        p2.font.size = Pt(21)
        p2.font.bold = True
        p2.font.color.rgb = TEXT_WHITE

        # Subtitle
        if subtitle_text:
            sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.22), Inches(8.5), Inches(0.35))
            tf3 = sub_box.text_frame
            tf3.word_wrap = True
            tf3.margin_left = tf3.margin_top = tf3.margin_right = tf3.margin_bottom = 0
            p3 = tf3.paragraphs[0]
            p3.text = subtitle_text
            p3.font.size = Pt(11)
            p3.font.color.rgb = TEXT_MUTED

        # Optional Top-Right Nav Action Pill
        if nav_button_text and target_slide:
            btn = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.6), Inches(0.6), Inches(2.9), Inches(0.48))
            btn.fill.solid()
            btn.fill.fore_color.rgb = RGBColor(15, 45, 65)
            btn.line.color.rgb = ACCENT_CYAN
            btn.line.width = Pt(1)
            
            btf = btn.text_frame
            bp = btf.paragraphs[0]
            bp.alignment = PP_ALIGN.CENTER
            run = bp.add_run()
            run.text = nav_button_text
            run.font.size = Pt(10)
            run.font.bold = True
            run.font.color.rgb = ACCENT_CYAN
            run.hyperlink.target_slide = target_slide

    # ==========================================
    # SLIDE 1: Title & Strategic Overview
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)

    bar = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.8), Inches(0.08), Inches(3.8))
    bar.fill.solid()
    bar.fill.fore_color.rgb = ACCENT_CYAN
    bar.line.fill.background()

    tbox = s1.shapes.add_textbox(Inches(1.1), Inches(1.7), Inches(11.4), Inches(2.2))
    tf = tbox.text_frame
    tf.word_wrap = True
    p0 = tf.paragraphs[0]
    p0.text = "CRSP PROJECT DEFENSE | MEDICAL AI & THORACIC ONCOLOGY"
    p0.font.size = Pt(11)
    p0.font.bold = True
    p0.font.color.rgb = ACCENT_CYAN

    p1 = tf.add_paragraph()
    p1.text = "The 5 Limitations of Traditional Ways\n& The Exact Solutions We Built in CRSP"
    p1.font.size = Pt(28)
    p1.font.bold = True
    p1.font.color.rgb = TEXT_WHITE
    p1.space_before = Pt(12)

    p2 = tf.add_paragraph()
    p2.text = "PulmoVision AI: Deep Transfer Learning for Automated Lung Cancer Detection & Histopathological Subtyping"
    p2.font.size = Pt(13)
    p2.font.color.rgb = TEXT_MUTED
    p2.space_before = Pt(10)

    # 3 Summary callouts
    card_w = Inches(3.64)
    card_h = Inches(1.8)
    card_y = Inches(4.8)
    
    cards_data = [
        ("THE CLINICAL DILEMMA", ">75% Diagnosed Late", "1.8M global deaths/yr. Stage I survival is >65%, collapsing to <15% in Stage IV due to subtle early lesions.", ACCENT_ROSE),
        ("TRADITIONAL LIMITATION", "Binary 'Cancer/No Cancer'", "Conventional tools & academic models ignore histological subtyping needed for chemotherapy vs. surgery.", ACCENT_AMBER),
        ("THE CRSP SOLUTION", "PulmoVision AI (<95ms)", "4-class subtyping on 350x350 CT scans with Xception + GAP, eliminating false alarms & radiologist fatigue.", ACCENT_TEAL),
    ]

    for i, (tag, stat, desc, accent) in enumerate(cards_data):
        cx = Inches(0.8 + i * 4.0)
        c = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, card_y, card_w, card_h)
        c.fill.solid()
        c.fill.fore_color.rgb = CARD_BG
        c.line.color.rgb = CARD_BORDER
        c.line.width = Pt(1)

        c_tb = s1.shapes.add_textbox(cx + Inches(0.2), card_y + Inches(0.15), card_w - Inches(0.4), card_h - Inches(0.3))
        ctf = c_tb.text_frame
        ctf.word_wrap = True
        
        cp0 = ctf.paragraphs[0]
        cp0.text = tag
        cp0.font.size = Pt(9)
        cp0.font.bold = True
        cp0.font.color.rgb = accent

        cp1 = ctf.add_paragraph()
        cp1.text = stat
        cp1.font.size = Pt(15)
        cp1.font.bold = True
        cp1.font.color.rgb = TEXT_WHITE
        cp1.space_before = Pt(4)

        cp2 = ctf.add_paragraph()
        cp2.text = desc
        cp2.font.size = Pt(9.5)
        cp2.font.color.rgb = TEXT_MUTED
        cp2.space_before = Pt(4)

    # Pre-declare slide 2 and slide 3 so we can cross-link them!
    s2 = prs.slides.add_slide(blank_layout)
    s3 = prs.slides.add_slide(blank_layout)

    # ==========================================
    # SLIDE 2: PAGE 1 - THE 5 PROBLEMS OF TRADITIONAL WAYS
    # ==========================================
    set_slide_background(s2)
    add_header(
        s2, 
        "Page 1: Inherent Bottlenecks", 
        "The 5 Critical Limitations of Traditional Diagnostic Methods", 
        "Click on any problem card to jump directly to its engineered solution in PulmoVision AI",
        nav_button_text="➡️ Jump to Solutions Slide",
        target_slide=s3
    )

    problems_list = [
        {
            "id": "PROBLEM 01",
            "title": "The 'Binary Detection' Trap",
            "category": "CLINICAL DEFICIENCY",
            "body": "Traditional CAD systems and academic CNNs classify scans simply as 'Cancer vs. Normal'. In clinical oncology, this is insufficient because Adenocarcinoma, Squamous Cell, and Large Cell carcinomas require radically different surgical, chemotherapy, and targeted drug regimens.",
            "link_text": "➡️ Direct Solution: 4-Class Histological Subtyping",
            "accent": ACCENT_ROSE
        },
        {
            "id": "PROBLEM 02",
            "title": "Destructive Resolution Downsampling",
            "category": "SPATIAL ARTIFACTS",
            "body": "Standard vision models forcefully resize thoracic CT scans down to 224x224 pixels. This downsampling obliterates micro-spiculations, ground-glass opacities (GGO), and delicate nodule margin contours essential for differential diagnosis.",
            "link_text": "➡️ Direct Solution: High-Fidelity 350x350 Pipeline",
            "accent": ACCENT_AMBER
        },
        {
            "id": "PROBLEM 03",
            "title": "Severe Dense Overfitting via Flatten()",
            "category": "ARCHITECTURAL FLAW",
            "body": "Standard CNNs use Flatten() layers between convolutional backbones and classifiers, generating 247,000+ dense connections and millions of weights. This leads to severe parameter memorization and poor generalization on specialized medical datasets.",
            "link_text": "➡️ Direct Solution: Xception + Global Average Pooling",
            "accent": ACCENT_PURPLE
        },
        {
            "id": "PROBLEM 04",
            "title": "Radiologist Burnout & Diagnostic Latency",
            "category": "WORKFLOW BOTTLENECK",
            "body": "A single chest CT generates hundreds of axial slices. Reviewing thousands of images daily induces severe cognitive fatigue, leading to up to 25% inter-observer disagreement on borderline nodules and multi-week turnaround backlogs.",
            "link_text": "➡️ Direct Solution: Sub-95ms Automated Pre-Triage",
            "accent": ACCENT_CYAN
        },
        {
            "id": "PROBLEM 05",
            "title": "Academic Black-Box Notebooks",
            "category": "CLINICAL DEPLOYMENT GAP",
            "body": "Most research algorithms remain trapped in messy Jupyter notebooks without standalone CLI execution, automated weight checkpoints, or interpretable visual probability distributions for oncologist decision-making.",
            "link_text": "➡️ Direct Solution: Dual Visual Diagnostic Reporting",
            "accent": ACCENT_TEAL
        }
    ]

    # Layout for 5 cards: Top Row (3 cards), Bottom Row (2 cards)
    row1_w = Inches(3.64)
    row1_h = Inches(2.6)
    row1_y = Inches(1.75)

    row2_w = Inches(5.65)
    row2_h = Inches(2.35)
    row2_y = Inches(4.55)

    for i in range(3):
        p = problems_list[i]
        cx = Inches(0.8 + i * 4.0)
        
        # Outer Card
        c = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, row1_y, row1_w, row1_h)
        c.fill.solid()
        c.fill.fore_color.rgb = CARD_BG
        c.line.color.rgb = CARD_BORDER
        c.line.width = Pt(1)

        # Top accent strip
        strip = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, row1_y, row1_w, Inches(0.08))
        strip.fill.solid()
        strip.fill.fore_color.rgb = p["accent"]
        strip.line.fill.background()

        tb = s2.shapes.add_textbox(cx + Inches(0.2), row1_y + Inches(0.15), row1_w - Inches(0.4), row1_h - Inches(0.3))
        tf = tb.text_frame
        tf.word_wrap = True

        p_id = tf.paragraphs[0]
        p_id.text = f"{p['id']} • {p['category']}"
        p_id.font.size = Pt(8.5)
        p_id.font.bold = True
        p_id.font.color.rgb = p["accent"]

        p_title = tf.add_paragraph()
        p_title.text = p["title"]
        p_title.font.size = Pt(12.5)
        p_title.font.bold = True
        p_title.font.color.rgb = TEXT_WHITE
        p_title.space_before = Pt(3)

        p_body = tf.add_paragraph()
        p_body.text = p["body"]
        p_body.font.size = Pt(8.5)
        p_body.font.color.rgb = TEXT_MUTED
        p_body.space_before = Pt(4)

        # Hyperlinked Action Run
        p_link = tf.add_paragraph()
        p_link.space_before = Pt(8)
        run = p_link.add_run()
        run.text = p["link_text"]
        run.font.size = Pt(8.5)
        run.font.bold = True
        run.font.color.rgb = ACCENT_CYAN
        run.hyperlink.target_slide = s3

    for i in range(2):
        p = problems_list[3 + i]
        cx = Inches(0.8 + i * 6.0)

        c = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, row2_y, row2_w, row2_h)
        c.fill.solid()
        c.fill.fore_color.rgb = CARD_BG
        c.line.color.rgb = CARD_BORDER
        c.line.width = Pt(1)

        strip = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, row2_y, row2_w, Inches(0.08))
        strip.fill.solid()
        strip.fill.fore_color.rgb = p["accent"]
        strip.line.fill.background()

        tb = s2.shapes.add_textbox(cx + Inches(0.25), row2_y + Inches(0.15), row2_w - Inches(0.5), row2_h - Inches(0.3))
        tf = tb.text_frame
        tf.word_wrap = True

        p_id = tf.paragraphs[0]
        p_id.text = f"{p['id']} • {p['category']}"
        p_id.font.size = Pt(8.5)
        p_id.font.bold = True
        p_id.font.color.rgb = p["accent"]

        p_title = tf.add_paragraph()
        p_title.text = p["title"]
        p_title.font.size = Pt(12.5)
        p_title.font.bold = True
        p_title.font.color.rgb = TEXT_WHITE
        p_title.space_before = Pt(3)

        p_body = tf.add_paragraph()
        p_body.text = p["body"]
        p_body.font.size = Pt(8.5)
        p_body.font.color.rgb = TEXT_MUTED
        p_body.space_before = Pt(4)

        p_link = tf.add_paragraph()
        p_link.space_before = Pt(6)
        run = p_link.add_run()
        run.text = p["link_text"]
        run.font.size = Pt(8.5)
        run.font.bold = True
        run.font.color.rgb = ACCENT_CYAN
        run.hyperlink.target_slide = s3

    # ==========================================
    # SLIDE 3: PAGE 2 - THE 5 EXACT SOLUTIONS WE ARE SOLVING IN CRSP
    # ==========================================
    set_slide_background(s3)
    add_header(
        s3, 
        "Page 2: Engineered Solutions", 
        "The 5 Exact Solutions Engineered in PulmoVision AI (CRSP)", 
        "Direct 1-to-1 technological counterparts resolving each traditional limitation. Click to navigate back.",
        nav_button_text="⬅️ Back to Problems Slide",
        target_slide=s2
    )

    solutions_list = [
        {
            "id": "SOLUTION 01",
            "solves": "DIRECTLY SOLVES PROBLEM 01",
            "title": "4-Class Histological Subtyping",
            "category": "ONCOLOGICAL TRIAGE",
            "body": "Classifies scans concurrently into Normal, Adenocarcinoma, Squamous Cell Carcinoma, and Large Cell Carcinoma. Delivers actionable therapeutic intelligence to oncologists before invasive biopsy results arrive.",
            "link_text": "⬅️ Corresponds to Problem 01 (Binary Trap)",
            "accent": ACCENT_TEAL
        },
        {
            "id": "SOLUTION 02",
            "solves": "DIRECTLY SOLVES PROBLEM 02",
            "title": "High-Resolution 350x350 Input Pipeline",
            "category": "SUB-CELLULAR FIDELITY",
            "body": "Processes images at 350x350x3 with bilinear interpolation. Preserves fine micro-spicular margins, subtle Ground-Glass Opacities (GGO), and edge calcifications necessary to distinguish ambiguous nodule phenotypes.",
            "link_text": "⬅️ Corresponds to Problem 02 (Downscaling)",
            "accent": ACCENT_CYAN
        },
        {
            "id": "SOLUTION 03",
            "solves": "DIRECTLY SOLVES PROBLEM 03",
            "title": "Xception Backbone + Global Average Pooling",
            "category": "REGULARIZATION BY DESIGN",
            "body": "Replaces standard convolution and Flatten() with Depthwise Separable Convolutions and GlobalAveragePooling2D. Compresses 2048 feature maps directly to spatial means, capping the dense head to only 8,196 parameters.",
            "link_text": "⬅️ Corresponds to Problem 03 (Dense Overfitting)",
            "accent": ACCENT_PURPLE
        },
        {
            "id": "SOLUTION 04",
            "solves": "DIRECTLY SOLVES PROBLEM 04",
            "title": "Sub-95ms Pre-Triage Inference Engine",
            "category": "FATIGUE ERADICATION",
            "body": "Runs single-slice inference in <95ms on standard hardware. Acts as a high-speed tireless 'second reader', automatically screening full volume stacks and prioritizing high-risk suspicious slices for immediate radiologist review.",
            "link_text": "⬅️ Corresponds to Problem 04 (Radiologist Burnout)",
            "accent": ACCENT_AMBER
        },
        {
            "id": "SOLUTION 05",
            "solves": "DIRECTLY SOLVES PROBLEM 05",
            "title": "Dual Visual Diagnostic Reporting Engine",
            "category": "CLINICAL DEPLOYABILITY",
            "body": "Built via standalone inference.py with zero notebook dependency. Automatically renders prediction_result.png combining the input CT slice side-by-side with full posterior probability distribution meters for transparent clinical auditing.",
            "link_text": "⬅️ Corresponds to Problem 05 (Academic Notebooks)",
            "accent": ACCENT_ROSE
        }
    ]

    for i in range(3):
        s = solutions_list[i]
        cx = Inches(0.8 + i * 4.0)

        c = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, row1_y, row1_w, row1_h)
        c.fill.solid()
        c.fill.fore_color.rgb = CARD_BG
        c.line.color.rgb = CARD_BORDER
        c.line.width = Pt(1)

        # Top accent strip (Emerald green / cyan)
        strip = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, row1_y, row1_w, Inches(0.08))
        strip.fill.solid()
        strip.fill.fore_color.rgb = s["accent"]
        strip.line.fill.background()

        tb = s3.shapes.add_textbox(cx + Inches(0.2), row1_y + Inches(0.15), row1_w - Inches(0.4), row1_h - Inches(0.3))
        tf = tb.text_frame
        tf.word_wrap = True

        p_id = tf.paragraphs[0]
        p_id.text = f"{s['id']} • {s['solves']}"
        p_id.font.size = Pt(8)
        p_id.font.bold = True
        p_id.font.color.rgb = s["accent"]

        p_title = tf.add_paragraph()
        p_title.text = s["title"]
        p_title.font.size = Pt(12)
        p_title.font.bold = True
        p_title.font.color.rgb = TEXT_WHITE
        p_title.space_before = Pt(3)

        p_body = tf.add_paragraph()
        p_body.text = s["body"]
        p_body.font.size = Pt(8.5)
        p_body.font.color.rgb = TEXT_MUTED
        p_body.space_before = Pt(4)

        p_link = tf.add_paragraph()
        p_link.space_before = Pt(8)
        run = p_link.add_run()
        run.text = s["link_text"]
        run.font.size = Pt(8.5)
        run.font.bold = True
        run.font.color.rgb = ACCENT_TEAL
        run.hyperlink.target_slide = s2

    for i in range(2):
        s = solutions_list[3 + i]
        cx = Inches(0.8 + i * 6.0)

        c = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, row2_y, row2_w, row2_h)
        c.fill.solid()
        c.fill.fore_color.rgb = CARD_BG
        c.line.color.rgb = CARD_BORDER
        c.line.width = Pt(1)

        strip = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, row2_y, row2_w, Inches(0.08))
        strip.fill.solid()
        strip.fill.fore_color.rgb = s["accent"]
        strip.line.fill.background()

        tb = s3.shapes.add_textbox(cx + Inches(0.25), row2_y + Inches(0.15), row2_w - Inches(0.5), row2_h - Inches(0.3))
        tf = tb.text_frame
        tf.word_wrap = True

        p_id = tf.paragraphs[0]
        p_id.text = f"{s['id']} • {s['solves']}"
        p_id.font.size = Pt(8)
        p_id.font.bold = True
        p_id.font.color.rgb = s["accent"]

        p_title = tf.add_paragraph()
        p_title.text = s["title"]
        p_title.font.size = Pt(12)
        p_title.font.bold = True
        p_title.font.color.rgb = TEXT_WHITE
        p_title.space_before = Pt(3)

        p_body = tf.add_paragraph()
        p_body.text = s["body"]
        p_body.font.size = Pt(8.5)
        p_body.font.color.rgb = TEXT_MUTED
        p_body.space_before = Pt(4)

        p_link = tf.add_paragraph()
        p_link.space_before = Pt(6)
        run = p_link.add_run()
        run.text = s["link_text"]
        run.font.size = Pt(8.5)
        run.font.bold = True
        run.font.color.rgb = ACCENT_TEAL
        run.hyperlink.target_slide = s2

    # ==========================================
    # SLIDE 4: Comprehensive Comparison Matrix
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_header(s4, "Head-to-Head Benchmarking", "Traditional Approaches vs. PulmoVision AI", "Direct side-by-side comparison across diagnostic granularity, latency, resolution, and clinical usability")

    rows = 6
    cols = 4
    left = Inches(0.8)
    top = Inches(1.8)
    width = Inches(11.7)
    height = Inches(5.0)

    table_shape = s4.shapes.add_table(rows, cols, left, top, width, height)
    table = table_shape.table

    table.columns[0].width = Inches(2.5)
    table.columns[1].width = Inches(3.0)
    table.columns[2].width = Inches(3.0)
    table.columns[3].width = Inches(3.2)

    headers = ["Evaluation Criteria", "Manual PACS Review", "Traditional CAD / Academic CNNs", "PulmoVision AI (Our CRSP)"]
    row_data = [
        ("Output Granularity", "Descriptive narrative report (Subjective)", "Binary flag ('Cancer' vs 'Normal')", "4-Class Histological Subtyping (Adeno, Squamous, Large, Normal)"),
        ("Diagnostic Latency", "Hours to multiple days / weeks", "2 - 5 min (CAD) / 200ms without reporting", "< 95 ms instantaneous slice pre-triage"),
        ("CT Input Resolution", "Full axial slice (Human visual scan)", "Downscaled to 224x224 (Margin loss)", "350 x 350 x 3 (Preserves micro-spiculations & GGO)"),
        ("Overfitting Defense", "N/A (Subject to cognitive fatigue)", "Flatten() layer (250k+ dense inputs)", "Xception Backbone + Global Average Pooling (8k top params)"),
        ("Deployment & Output", "Standard PACS workstation", "Academic notebook / proprietary closed box", "Standalone CLI + Auto Visual Diagnostic Report (PNG)")
    ]

    for col_idx, header_text in enumerate(headers):
        cell = table.cell(0, col_idx)
        cell.fill.solid()
        if col_idx == 3:
            cell.fill.fore_color.rgb = RGBColor(14, 116, 144)
        else:
            cell.fill.fore_color.rgb = RGBColor(30, 41, 59)
        p = cell.text_frame.paragraphs[0]
        p.text = header_text
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE
        p.alignment = PP_ALIGN.LEFT

    for r_idx, row in enumerate(row_data):
        for c_idx, val in enumerate(row):
            cell = table.cell(r_idx + 1, c_idx)
            cell.fill.solid()
            if c_idx == 3:
                cell.fill.fore_color.rgb = RGBColor(15, 45, 60)
            else:
                cell.fill.fore_color.rgb = RGBColor(22, 30, 46) if r_idx % 2 == 0 else RGBColor(18, 25, 38)
            
            p = cell.text_frame.paragraphs[0]
            p.text = val
            p.font.size = Pt(9.5)
            if c_idx == 0:
                p.font.bold = True
                p.font.color.rgb = ACCENT_CYAN
            elif c_idx == 3:
                p.font.bold = True
                p.font.color.rgb = ACCENT_TEAL
            else:
                p.font.color.rgb = TEXT_MUTED
            p.alignment = PP_ALIGN.LEFT

    output_filename = "CRSP_Limitations_and_Solutions.pptx"
    prs.save(output_filename)
    print(f"Presentation regenerated successfully as {output_filename}")

if __name__ == "__main__":
    create_presentation()
