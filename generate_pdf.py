import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch

# --- Numbered Canvas for Dynamic "Page X of Y" and Header/Footer ---
class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        # Do not draw headers/footers on the cover page (Page 1)
        if self._pageNumber == 1:
            # Draw beautiful cover page backgrounds
            self.saveState()
            # Left accent bar in high-end gradient style
            self.setFillColor(colors.HexColor("#6366F1")) # Indigo
            self.rect(0, 0, 0.4 * inch, 11 * inch, fill=True, stroke=False)
            self.setFillColor(colors.HexColor("#38BDF8")) # Tech Blue
            self.rect(0.4 * inch, 0, 0.1 * inch, 11 * inch, fill=True, stroke=False)
            
            # Subtle branding watermark at bottom right
            self.setFillColor(colors.HexColor("#1E293B"))
            self.setFont("Helvetica-Bold", 8)
            self.drawRightString(8.0 * inch, 0.5 * inch, "DIWAS DINESH RATHOD  //  ENGINEERING BLUEPRINT  //  CONFIDENTIAL")
            self.restoreState()
            return

        self.saveState()
        
        # --- Draw Running Header ---
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#38BDF8")) # Tech Blue
        self.drawString(0.75 * inch, 10.3 * inch, "DIWAS RATHOD")
        
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#94A3B8")) # Slate gray
        self.drawString(1.7 * inch, 10.3 * inch, "|  TECHNICAL SPECIFICATION & ARCHITECTURAL BLUEPRINT")
        
        # Header Rule
        self.setStrokeColor(colors.HexColor("#334155")) # Dark grey divider
        self.setLineWidth(0.5)
        self.line(0.75 * inch, 10.15 * inch, 7.75 * inch, 10.15 * inch)

        # --- Draw Running Footer ---
        # Footer Rule
        self.setStrokeColor(colors.HexColor("#334155"))
        self.setLineWidth(0.5)
        self.line(0.75 * inch, 0.85 * inch, 7.75 * inch, 0.85 * inch)
        
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#94A3B8"))
        self.drawString(0.75 * inch, 0.65 * inch, "CONFIDENTIAL // Diwas Rathod Personal Website Engine v1.0")
        
        # Page Number Right-Aligned
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(7.75 * inch, 0.65 * inch, page_str)
        
        self.restoreState()


def build_blueprint_pdf(filename="Personal_Website_Technical_Blueprint.pdf"):
    # Target 0.75-inch margins for highly elegant technical document flow
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=0.75 * inch,
        rightMargin=0.75 * inch,
        topMargin=1.0 * inch,
        bottomMargin=1.0 * inch
    )

    styles = getSampleStyleSheet()
    
    # Custom Color Palette
    tech_blue = colors.HexColor("#38BDF8")
    indigo = colors.HexColor("#6366F1")
    slate_dark = colors.HexColor("#0F172A")
    slate_light = colors.HexColor("#F8FAFC")
    text_muted = colors.HexColor("#475569")
    text_body = colors.HexColor("#1E293B")
    border_color = colors.HexColor("#E2E8F0")

    # Define custom styles derived from standard ones
    styles.add(ParagraphStyle(
        name="CoverTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=32,
        leading=38,
        textColor=slate_dark,
        spaceAfter=12
    ))

    styles.add(ParagraphStyle(
        name="CoverSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=13,
        leading=18,
        textColor=indigo,
        spaceAfter=40,
        alignment=TA_LEFT
    ))

    styles.add(ParagraphStyle(
        name="CoverMetadataLabel",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#64748B"),
        spaceAfter=2
    ))

    styles.add(ParagraphStyle(
        name="CoverMetadataValue",
        parent=styles["Normal"],
        fontName="Helvetica-Oblique",
        fontSize=9,
        leading=12,
        textColor=slate_dark,
        spaceAfter=15
    ))

    styles.add(ParagraphStyle(
        name="SecHeader",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=18,
        leading=22,
        textColor=slate_dark,
        spaceBefore=18,
        spaceAfter=8,
        keepWithNext=True
    ))

    styles.add(ParagraphStyle(
        name="SubSecHeader",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=16,
        textColor=indigo,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    ))

    styles.add(ParagraphStyle(
        name="TechBody",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=14.5,
        textColor=text_body,
        spaceAfter=10,
        alignment=TA_JUSTIFY
    ))

    styles.add(ParagraphStyle(
        name="TechBodyLeft",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=14.5,
        textColor=text_body,
        spaceAfter=8,
        alignment=TA_LEFT
    ))

    styles.add(ParagraphStyle(
        name="BulletText",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=14,
        textColor=text_body,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=6
    ))

    styles.add(ParagraphStyle(
        name="CodeBlock",
        parent=styles["Normal"],
        fontName="Courier",
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#0F172A"),
        backColor=colors.HexColor("#F1F5F9"),
        borderColor=colors.HexColor("#CBD5E1"),
        borderWidth=0.5,
        borderPadding=8,
        spaceBefore=8,
        spaceAfter=12,
        keepWithNext=False
    ))

    story = []

    # =========================================================================
    # --- COVER PAGE ---
    # =========================================================================
    story.append(Spacer(1, 1.5 * inch))
    story.append(Paragraph("TECHNICAL SPECIFICATIONS & ARCHITECTURAL BLUEPRINT", styles["CoverSubtitle"]))
    story.append(Paragraph("Diwas Dinesh Rathod<br/>Personal Portfolio Engine", styles["CoverTitle"]))
    
    # Divider line
    story.append(HRFlowable(
        width="100%", 
        thickness=2.5, 
        color=indigo, 
        spaceBefore=10, 
        spaceAfter=30, 
        hAlign='LEFT'
    ))

    # Abstract/Introduction Paragraph
    intro_text = (
        "<b>Document Purpose:</b> This document provides an exhaustive, line-by-line technical specification "
        "and architectural teardown of the high-performance personal portfolio website engineered for "
        "Diwas Dinesh Rathod. It delineates the underlying software engineering paradigms, responsive system "
        "mechanisms, style systems, high-frequency scroll interception, and custom WebGL/Canvas preloading "
        "and rendering engines that compose this state-of-the-art web application."
    )
    story.append(Paragraph(intro_text, styles["TechBody"]))
    story.append(Spacer(1, 1.5 * inch))

    # Metadata Table
    metadata_data = [
        [
            Paragraph("<b>DEVELOPER & ARCHITECT</b>", styles["CoverMetadataLabel"]),
            Paragraph("<b>FRAMEWORK PLATFORM</b>", styles["CoverMetadataLabel"])
        ],
        [
            Paragraph("Diwas Dinesh Rathod<br/>Email: diwasrathour@gmail.com", styles["CoverMetadataValue"]),
            Paragraph("Next.js 16.2.6 // React 19.2.4<br/>React Server Components (RSC)", styles["CoverMetadataValue"])
        ],
        [
            Paragraph("<b>STYLE PIPELINE</b>", styles["CoverMetadataLabel"]),
            Paragraph("<b>INTERACTION LAYERS</b>", styles["CoverMetadataLabel"])
        ],
        [
            Paragraph("Tailwind CSS v4 (PostCSS Engine)<br/>Glassmorphism & Fluid Typography", styles["CoverMetadataValue"]),
            Paragraph("Framer Motion 12.4.0 (Custom Spring)<br/>2D DPI-Aware Canvas Scrollytelling", styles["CoverMetadataValue"])
        ],
        [
            Paragraph("<b>DOCUMENT CLASSIFICATION</b>", styles["CoverMetadataLabel"]),
            Paragraph("<b>LAST ARCHITECTURAL STAMP</b>", styles["CoverMetadataLabel"])
        ],
        [
            Paragraph("Engineering Blueprint // RESTRICTED", styles["CoverMetadataValue"]),
            Paragraph("May 27, 2026 // Production Release", styles["CoverMetadataValue"])
        ]
    ]

    t_meta = Table(metadata_data, colWidths=[3.25 * inch, 3.25 * inch])
    t_meta.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t_meta)
    
    story.append(PageBreak())

    # =========================================================================
    # --- SECTION 1: ARCHITECTURAL OVERVIEW ---
    # =========================================================================
    story.append(Paragraph("1. Executive Tech Stack & Architecture", styles["SecHeader"]))
    story.append(HRFlowable(width="100%", thickness=1, color=border_color, spaceBefore=4, spaceAfter=12, hAlign='LEFT'))
    
    overview_p1 = (
        "The web platform designed for Diwas Dinesh Rathod represents a modern, performance-first portfolio "
        "crafted on top of <b>Next.js 16.2.6</b> and <b>React 19.2.4</b>. It utilizes the Next.js App Router paradigm, "
        "optimizing the separation of static content and dynamic client interfaces through React Server Components "
        "(RSC) combined with granular client-side interaction points. Rather than relying on heavy third-party "
        "runtimes or complex heavy web libraries, the application is strictly optimized for fast loading and "
        "extremely smooth animation profiles."
    )
    story.append(Paragraph(overview_p1, styles["TechBody"]))

    # Core Stack Table
    stack_data = [
        [
            Paragraph("<b>Component / Layer</b>", styles["CoverMetadataLabel"]),
            Paragraph("<b>Technology Selected</b>", styles["CoverMetadataLabel"]),
            Paragraph("<b>Technical Purpose & Benefit</b>", styles["CoverMetadataLabel"])
        ],
        [
            Paragraph("Core Architecture", styles["TechBodyLeft"]),
            Paragraph("Next.js 16.2.6 (App Router)", styles["TechBodyLeft"]),
            Paragraph("Enables zero-bundle-size static page generation (SSG), file-system based routing, and rapid hydration.", styles["TechBodyLeft"])
        ],
        [
            Paragraph("UI & Framework State", styles["TechBodyLeft"]),
            Paragraph("React 19.2.4", styles["TechBodyLeft"]),
            Paragraph("Optimized lightweight virtual DOM management with direct concurrent rendering pipelines.", styles["TechBodyLeft"])
        ],
        [
            Paragraph("Styling Engine", styles["TechBodyLeft"]),
            Paragraph("Tailwind CSS v4", styles["TechBodyLeft"]),
            Paragraph("Utilizes a completely redesigned compile-time engine, native CSS parser, CSS-first config imports, and minimal build size.", styles["TechBodyLeft"])
        ],
        [
            Paragraph("Animation Runtime", styles["TechBodyLeft"]),
            Paragraph("Framer Motion 12.4.0", styles["TechBodyLeft"]),
            Paragraph("Provides a declarative syntax for canvas transitions, spring damping curves, and GPU-accelerated motion values.", styles["TechBodyLeft"])
        ],
        [
            Paragraph("Icon Vector Assets", styles["TechBodyLeft"]),
            Paragraph("Lucide React 1.16.0", styles["TechBodyLeft"]),
            Paragraph("Clean SVG icons built as lightweight react components supporting treeshaking and CSS overrides.", styles["TechBodyLeft"])
        ],
        [
            Paragraph("Visual Canvas Pipeline", styles["TechBodyLeft"]),
            Paragraph("HTML5 Canvas 2D + Custom Hook", styles["TechBodyLeft"]),
            Paragraph("Bypasses standard React state tree updates to render a preloaded high-fidelity 74-frame cinematic sequence at high FPS.", styles["TechBodyLeft"])
        ]
    ]

    t_stack = Table(stack_data, colWidths=[1.5 * inch, 1.8 * inch, 3.7 * inch])
    t_stack.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), slate_light),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_stack)
    story.append(Spacer(1, 15))

    story.append(Paragraph("Key Architectural Philosophies:", styles["SubSecHeader"]))
    story.append(Paragraph("&bull; <b>Minimal Hydration Overhead:</b> Interactive sub-trees are strictly labeled with the <font face='Courier'>'use client'</font> directive, keeping the initial JavaScript bundle exceptionally lean.", styles["BulletText"]))
    story.append(Paragraph("&bull; <b>High-DPI Performance:</b> Painting is directed through a raw Canvas 2D Context, bypassing the React component tree and re-rendering operations entirely during scrolling.", styles["BulletText"]))
    story.append(Paragraph("&bull; <b>CSS-First Styling:</b> Moving from Tailwind v3 JS-centric configuration to Tailwind v4 CSS-first declaration avoids configuration overhead and speeds up runtime rendering.", styles["BulletText"]))
    
    story.append(PageBreak())

    # =========================================================================
    # --- SECTION 2: CINEMATIC CANVAS SCROLLYTELLING ---
    # =========================================================================
    story.append(Paragraph("2. Cinematic Canvas Scrollytelling Pipeline", styles["SecHeader"]))
    story.append(HRFlowable(width="100%", thickness=1, color=border_color, spaceBefore=4, spaceAfter=12, hAlign='LEFT'))

    scrolly_intro = (
        "The centerpiece of the landing page experience is a <b>500vh Cinematic Canvas Scrollytelling Section</b>. "
        "As the user scroll/swipe triggers inputs, they do not scroll the webpage in a standard fashion. Instead, "
        "scrolling is intercepted, locking the scroll viewport in place while scrubbing through a 74-frame high-resolution "
        "image sequence. This visual story outlines the professional journey of Diwas Dinesh Rathod."
    )
    story.append(Paragraph(scrolly_intro, styles["TechBody"]))

    story.append(Paragraph("A. Preloading & Image Cache Pipeline", styles["SubSecHeader"]))
    preload_p = (
        "To guarantee stutter-free playback, a custom preloader hooks into the React lifecycle during initial mount. "
        "A sequence of 74 distinct, compressed, high-fidelity WebP images (<font face='Courier'>frame_00.webp</font> to "
        "<font face='Courier'>frame_73.webp</font>) is fetched asynchronously. A React progress bar tracks the loading "
        "percentage in real time. Once all promises in the preloading queue are successfully resolved, the image "
        "references are written directly to a mutable reference object (<font face='Courier'>imagesRef.current</font>) "
        "to prevent React component re-renders from clearing the preloaded cache."
    )
    story.append(Paragraph(preload_p, styles["TechBody"]))

    story.append(Paragraph("B. Spring-Interpolated Deceleration Mechanics", styles["SubSecHeader"]))
    spring_p = (
        "To achieve a cinematic, buttery-smooth flow, the raw scroll values are decoupled from the canvas painter. "
        "When scroll actions occur, they modify a Framer Motion <b>MotionValue</b> called <font face='Courier'>sequenceProgress</font> (0.0 to 1.0). "
        "A secondary motion value, <font face='Courier'>smoothProgress</font>, is computed using the <font face='Courier'>useSpring</font> hook, "
        "configured with a stiffness of <b>60</b> and a damping of <b>22</b>. This spring setup acts as a high-frequency low-pass filter, "
        "smoothing out erratic mousewheel clicks or touch actions and decelerating into each frame with beautiful ease-out physics."
    )
    story.append(Paragraph(spring_p, styles["TechBody"]))

    story.append(Paragraph("C. High-DPI Aware Canvas 2D Painting", styles["SubSecHeader"]))
    dpi_p = (
        "During rendering, the screen resolution is dynamically queried via <font face='Courier'>window.devicePixelRatio</font> (typically 2x for "
        "Apple Retina screens). The HTML5 Canvas's internal backing store width and height are multiplied by this ratio, "
        "while its style properties match the display dimensions. The 2D rendering context is then scaled globally using "
        "<font face='Courier'>ctx.scale(dpr, dpr)</font>. This ensures that text overlay boundaries, graphic edges, and the sequence frames "
        "remain tack-sharp without any blurry bilinear interpolation artifacts."
    )
    story.append(Paragraph(dpi_p, styles["TechBody"]))

    story.append(Paragraph("D. Object-Fit 'Cover' Math in Canvas 2D Context", styles["SubSecHeader"]))
    math_p = (
        "To keep the sequence background responsive under arbitrary browser window aspects (ultrawide, desktop, portrait mobile), "
        "an algorithmic equivalent of CSS's <font face='Courier'>object-fit: cover</font> is executed on every frame draw. The formula is:"
    )
    story.append(Paragraph(math_p, styles["TechBody"]))

    # Mono Code Block for mathematical drawing logic
    code_aspect = (
        "// Aspect Ratio Math implemented in ScrollyCanvas.tsx\n"
        "const imgRatio = imgWidth / imgHeight;\n"
        "const canvasRatio = canvasWidth / canvasHeight;\n"
        "let drawWidth = canvasWidth;\n"
        "let drawHeight = canvasHeight;\n"
        "let offsetX = 0;\n"
        "let offsetY = 0;\n\n"
        "if (imgRatio > canvasRatio) {\n"
        "    drawWidth = canvasHeight * imgRatio;\n"
        "    offsetX = (canvasWidth - drawWidth) / 2;\n"
        "} else {\n"
        "    drawHeight = canvasWidth / imgRatio;\n"
        "    offsetY = (canvasHeight - drawHeight) / 2;\n"
        "}\n"
        "ctx.clearRect(0, 0, canvasWidth, canvasHeight);\n"
        "ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);"
    )
    story.append(Paragraph(code_aspect, styles["CodeBlock"]))

    story.append(PageBreak())

    # =========================================================================
    # --- SECTION 3: ADVANCED SCROLL LOCKING & EVENT HIJACKING ---
    # =========================================================================
    story.append(Paragraph("3. Advanced Scroll Locking & Event Hijacking", styles["SecHeader"]))
    story.append(HRFlowable(width="100%", thickness=1, color=border_color, spaceBefore=4, spaceAfter=12, hAlign='LEFT'))

    hijack_p1 = (
        "Standard CSS scroll-snap structures do not allow for custom spring-damped interactive scrubbing. "
        "To solve this, the page scroll container acts as a viewport trap using complex event interceptors. "
        "The system overrides standard scrolling behavior using a dual-state lock."
    )
    story.append(Paragraph(hijack_p1, styles["TechBody"]))

    story.append(Paragraph("The Multi-Layer Interception System:", styles["SubSecHeader"]))
    story.append(Paragraph("&bull; <b>Snapping Scroll Trap:</b> A global scroll listener locks the viewport at absolute top (<font face='Courier'>window.scrollY = 0</font>) while the interactive sequence progress is between 0.0 and the exit threshold of 0.890 (index 65). If the user attempts to scroll the page using scrollbars, the browser viewport instantly snaps back.", styles["BulletText"]))
    story.append(Paragraph("&bull; <b>Mouse Wheel Interception:</b> The mouse <font face='Courier'>wheel</font> event is registered with <font face='Courier'>{ passive: false }</font>. Calling <font face='Courier'>e.preventDefault()</font> stops the browser's default scroll action. A scroll velocity delta is instead computed: <font face='Courier'>deltaY * 0.0006</font>, updating the virtual timeline progress.", styles["BulletText"]))
    story.append(Paragraph("&bull; <b>Mobile Touch Swipe Integration:</b> Touch starts register the initial touch coordinates on <font face='Courier'>touchstart</font>. Subsequent drag actions trigger <font face='Courier'>touchmove</font>, calculating a vertical travel delta. This swipe distance is scaled by a fine-tuned touch factor (<font face='Courier'>0.002</font>) and added to the progress timeline, ensuring full mobile touch compatibility.", styles["BulletText"]))
    story.append(Paragraph("&bull; <b>Hardware Keyboard Trapper:</b> Keydown events are listened to for navigation keystrokes like <font face='Courier'>ArrowDown</font>, <font face='Courier'>ArrowUp</font>, <font face='Courier'>PageDown</font>, <font face='Courier'>PageUp</font>, and <font face='Courier'>Space</font>. These are blocked via preventDefault, updating the sequence progress by fine-tuned numeric increments (e.g., +/- 0.01 for arrows).", styles["BulletText"]))
    story.append(Paragraph("&bull; <b>Dynamic Speed Dampening:</b> To ensure highly comfortable reading windows, the system automatically slows down scroll progress velocity by <b>3.5x</b> as soon as any text block slides into its final, fully visible position. This dampening is active across three designated reading zones: <i>0.04 to 0.26</i>, <i>0.34 to 0.56</i>, and <i>0.64 to 0.86</i>. When crossing between these zones, the velocity naturally speeds up to produce snappy visual transitions.", styles["BulletText"]))
    story.append(Paragraph("&bull; <b>Unlocking & Seamless Page Transition:</b> The moment <font face='Courier'>sequenceProgress</font> reaches `65/73` (approx. 0.890), the scroll trap releases early. As the page naturally scrolls down through the first 350px, a scroll listener maps the scrollY offset to animate the remaining 9 frames of the sequence seamlessly.", styles["BulletText"]))

    story.append(Paragraph("Interception Lifecycle Logic:", styles["SubSecHeader"]))
    
    code_hijack = (
        "// Event Interception & Timeline Scrubbing Hook in ScrollyCanvas.tsx\n"
        "const handleWheel = (e: WheelEvent) => {\n"
        "    const isAtTop = window.scrollY <= 2;\n"
        "    if (!isAtTop) return;\n\n"
        "    if (!isSequenceFinished) {\n"
        "        e.preventDefault();\n"
        "        const delta = e.deltaY;\n"
        "        const speed = 0.0006;\n"
        "        let nextProgress = sequenceProgress.get() + delta * speed;\n"
        "        nextProgress = Math.max(0, Math.min(exitThreshold, nextProgress));\n"
        "        sequenceProgress.set(nextProgress);\n"
        "        if (nextProgress >= exitThreshold && delta > 0) {\n"
        "            setIsSequenceFinished(true);\n"
        "        }\n"
        "    } else if (isSequenceFinished && e.deltaY < 0 && window.scrollY <= 2) {\n"
        "        e.preventDefault();\n"
        "        setIsSequenceFinished(false);\n"
        "        // lock scroll and scrub back up...\n"
        "    }\n"
        "};"
    )
    story.append(Paragraph(code_hijack, styles["CodeBlock"]))

    story.append(PageBreak())

    # =========================================================================
    # --- SECTION 4: TEXT OVERLAY ENGINE ---
    # =========================================================================
    story.append(Paragraph("4. Synchronized Text Overlay Engine", styles["SecHeader"]))
    story.append(HRFlowable(width="100%", thickness=1, color=border_color, spaceBefore=4, spaceAfter=12, hAlign='LEFT'))

    overlay_p1 = (
        "As the background cinematic frames scroll, a synchronized textual layer displays key titles and subtitles. "
        "The text animations must perfectly coordinate with the frame indices to create a high-fidelity 'interactive presentation' effect."
    )
    story.append(Paragraph(overlay_p1, styles["TechBody"]))

    story.append(Paragraph("A. Scroll-Triggered Progress Ranges", styles["SubSecHeader"]))
    segment_p = (
      "To map the visual progression of text overlay items precisely, the raw scroll progress (0.0 to 1.0) is "
      "split into three continuous active ranges. Within each range, custom Framer Motion hooks smoothly "
      "interpolate opacity, x, and y offsets relative to the scroll speed:"
    )
    story.append(Paragraph(segment_p, styles["TechBody"]))

    # Table displaying frame mappings
    frame_table_data = [
        [
            Paragraph("<b>Scroll Range</b>", styles["CoverMetadataLabel"]),
            Paragraph("<b>Section State</b>", styles["CoverMetadataLabel"]),
            Paragraph("<b>Visual Layout & Animation</b>", styles["CoverMetadataLabel"])
        ],
        [
            Paragraph("Scroll 0.00 - 0.28", styles["TechBodyLeft"]),
            Paragraph("01 // LEADERSHIP", styles["TechBodyLeft"]),
            Paragraph("Right-aligned. Slides in dynamically from the right (+120px to 0px) and fades out left.", styles["TechBodyLeft"])
        ],
        [
            Paragraph("Scroll 0.28 - 0.57", styles["TechBodyLeft"]),
            Paragraph("02 // STRATEGIC DELIVERY", styles["TechBodyLeft"]),
            Paragraph("Left-aligned. Slides in dynamically from the left (-120px to 0px) and fades out right.", styles["TechBodyLeft"])
        ],
        [
            Paragraph("Scroll 0.57 - 0.95", styles["TechBodyLeft"]),
            Paragraph("03 // COGNITIVE OPERATIONS", styles["TechBodyLeft"]),
            Paragraph("Centered. Slides up dynamically from the bottom (+100px to 0px) and exits upwards.", styles["TechBodyLeft"])
        ]
    ]
    t_frame = Table(frame_table_data, colWidths=[1.8 * inch, 2.0 * inch, 3.2 * inch])
    t_frame.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), slate_light),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_frame)
    story.append(Spacer(1, 10))

    story.append(Paragraph("B. Continuous Scroll-Driven Interpolation", styles["SubSecHeader"]))
    ap_p = (
        "To maximize physics-based fidelity, the overlays are completely decoupled from active mount/unmount states. "
        "Instead, each section is continuously active and bound directly to the global <font face='Courier'>scrollYProgress</font> "
        "using Framer Motion's <font face='Courier'>useTransform</font> hook. When the user scrolls, the elements dynamically translate "
        "their coordinates—sliding Section 1 in from the right, Section 2 from the left, and Section 3 up from the bottom. "
        "This physical mapping coordinates perfectly with the scrolling gesture, offering an extremely smooth interactive feel."
    )
    story.append(Paragraph(ap_p, styles["TechBody"]))

    story.append(Paragraph("C. Real-time Progress Tracking Indicators", styles["SubSecHeader"]))
    progress_p = (
        "A technical sub-element is present at the bottom of the viewport: a real-time progress bar. This element maps "
        "the raw <font face='Courier'>scrollYProgress</font> directly to the width percentage of an active gradient element. "
        "The gradient flows across three points (<font face='Courier'>from-blue-500 via-indigo-500 to-purple-500</font>), "
        "offering a sleek and interactive visual indicator that mirrors the user's progress through the presentation."
    )
    story.append(Paragraph(progress_p, styles["TechBody"]))

    story.append(PageBreak())

    # =========================================================================
    # --- SECTION 5: CORE PILLARS & SELECTED IMPACT ---
    # =========================================================================
    story.append(Paragraph("5. Core Pillars & Selected Impact Components", styles["SecHeader"]))
    story.append(HRFlowable(width="100%", thickness=1, color=border_color, spaceBefore=4, spaceAfter=12, hAlign='LEFT'))

    components_intro = (
        "Once the user completes the scrollytelling sequence and scrolls down, the interface shifts to a dark, high-contrast, "
        "glassmorphic layout showcasing Diwas's operational pillars and real-world metrics."
    )
    story.append(Paragraph(components_intro, styles["TechBody"]))

    story.append(Paragraph("A. The Pillars Component: Glassmorphism & Radial Hover Glows", styles["SubSecHeader"]))
    pillars_p = (
        "The <b>Pillars</b> component features a three-column grid outlining key technical competencies. "
        "Each card is engineered using customized Tailwind glassmorphic parameters (<font face='Courier'>glass-card</font>) with extremely "
        "subtle translucent borders. Dynamic hover effects are handled using absolute-positioned radial gradients "
        "with large blur radii (<font face='Courier'>filter: blur(xl)</font>). These gradients translate on mouseover, "
        "causing the cards to glow organically in response to the user's cursor position."
    )
    story.append(Paragraph(pillars_p, styles["TechBody"]))

    story.append(Paragraph("B. The Selected Projects Component: STAR Narrative Timelines", styles["SubSecHeader"]))
    projects_p = (
        "Rather than utilizing standard layouts, the <b>Projects</b> component displays impact metrics "
        "using a structured <b>STAR</b> (Situation, Action, Result) chronological timeline. "
        "This is represented as an interactive vertical node system. Visual indicators are connected via a vertical "
        "timeline rule (<font face='Courier'>border-l border-white/10</font>) and illuminated by styled dot indicators "
        "in various accent colors (Blue for Situation, Indigo for Action, Purple for Result). This structure highlights "
        "not only the project details but also the measurable impact of each initiative."
    )
    story.append(Paragraph(projects_p, styles["TechBody"]))

    story.append(Paragraph("C. Secure Contact Endpoints & Footers", styles["SubSecHeader"]))
    contact_p = (
        "The call to action is built around a customized 'Initiate Conversation' button utilizing an active blue drop shadow glow. "
        "Contact endpoints are laid out in a clear grid showing system availability, timezone offsets (Kathmandu, Nepal / GMT+5:45), "
        "and links to GitHub and LinkedIn. This maintains the clean, tech-oriented look of the portfolio all the way to the footer."
    )
    story.append(Paragraph(contact_p, styles["TechBody"]))

    # Metric Table
    metrics_data = [
        [
            Paragraph("<b>Competency / Project</b>", styles["CoverMetadataLabel"]),
            Paragraph("<b>Target Metric</b>", styles["CoverMetadataLabel"]),
            Paragraph("<b>Measurable Strategic Outcome</b>", styles["CoverMetadataLabel"])
        ],
        [
            Paragraph("AI Workflow Automation", styles["TechBodyLeft"]),
            Paragraph("40% faster tasks", styles["TechBodyLeft"]),
            Paragraph("Replaced manual bottlenecks with multi-agent AI workflows, achieving 80% automated routines.", styles["TechBodyLeft"])
        ],
        [
            Paragraph("Tech Learning Hub", styles["TechBodyLeft"]),
            Paragraph("2 Weeks ahead", styles["TechBodyLeft"]),
            Paragraph("Delivered construction of learning space for 5,000+ members ahead of schedule.", styles["TechBodyLeft"])
        ],
        [
            Paragraph("Digital Upskilling", styles["TechBodyLeft"]),
            Paragraph("80% got jobs", styles["TechBodyLeft"]),
            Paragraph("Developed a modern tech curriculum, placing 1,200+ trained specialists directly into technical roles.", styles["TechBodyLeft"])
        ]
    ]
    t_metrics = Table(metrics_data, colWidths=[2.2 * inch, 1.8 * inch, 3.0 * inch])
    t_metrics.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), slate_light),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_metrics)

    story.append(PageBreak())

    # =========================================================================
    # --- SECTION 6: STYLE SYSTEMS & PERFORMANCE ---
    # =========================================================================
    story.append(Paragraph("6. Style Systems & Performance Optimizations", styles["SecHeader"]))
    story.append(HRFlowable(width="100%", thickness=1, color=border_color, spaceBefore=4, spaceAfter=12, hAlign='LEFT'))

    perf_intro = (
        "Maintaining high performance while managing large animations and images is crucial. "
        "The project implements several performance and optimization techniques to ensure the site runs smoothly."
    )
    story.append(Paragraph(perf_intro, styles["TechBody"]))

    story.append(Paragraph("A. Tailwind CSS v4 & PostCSS Configuration", styles["SubSecHeader"]))
    tailwind_p = (
        "Tailwind CSS v4 introduces significant improvements in compilation speed and asset optimization. "
        "By moving away from JavaScript configurations, v4 relies on a native CSS parser. "
        "The PostCSS config uses the new <font face='Courier'>@tailwindcss/postcss</font> plugin, which compiles styles "
        "directly into light CSS, reducing overall styling overhead and improving initial paint times."
    )
    story.append(Paragraph(tailwind_p, styles["TechBody"]))

    story.append(Paragraph("B. Next-Gen Image Optimization", styles["SubSecHeader"]))
    nextimage_p = (
        "All visual preview banners in the Projects section leverage the Next.js <font face='Courier'>Image</font> component. "
        "This automatically compresses assets into AVIF/WebP formats, limits widths using responsive layout rules, "
        "and handles layout shifts using exact image dimensions. It also leverages lazy-loading on offscreen items, "
        "improving the site's Largest Contentful Paint (LCP) score."
    )
    story.append(Paragraph(nextimage_p, styles["TechBody"]))

    story.append(Paragraph("C. Zero Bundle-Size Server Components", styles["SubSecHeader"]))
    rsc_p = (
        "The main entry point (<font face='Courier'>src/app/page.tsx</font>) is a React Server Component. "
        "This means the high-level page layout, including imports for individual sections, is processed on the server. "
        "Only the interactive components like the ScrollyCanvas and the Framer Motion elements send client-side "
        "JavaScript bundles. This approach improves performance, resulting in faster load times and smoother initial rendering."
    )
    story.append(Paragraph(rsc_p, styles["TechBody"]))

    story.append(Paragraph("D. Detailed CSS Declarations (<font face='Courier'>globals.css</font>)", styles["SubSecHeader"]))
    css_p = (
        "The design system utilizes custom CSS declarations. For instance, the glassmorphic cards and glows are "
        "defined in <font face='Courier'>globals.css</font> using the new Tailwind v4 syntax. Let's look at the implementation:"
    )
    story.append(Paragraph(css_p, styles["TechBody"]))

    code_css = (
        "/* Tailwind CSS v4 custom declarations in globals.css */\n"
        "@import \"tailwindcss\";\n\n"
        "@theme {\n"
        "    --color-background: #121212;\n"
        "    --color-card-dark: #0D0D11;\n"
        "}\n\n"
        "/* Glassmorphic utilities */\n"
        ".glass-card {\n"
        "    background: rgba(13, 13, 17, 0.7);\n"
        "    backdrop-filter: blur(16px) saturate(120%);\n"
        "    -webkit-backdrop-filter: blur(16px) saturate(120%);\n"
        "}\n\n"
        "/* Background glow ambience */\n"
        ".glow-bg {\n"
        "    position: absolute;\n"
        "    border-radius: 50%;\n"
        "    filter: blur(120px);\n"
        "    pointer-events: none;\n"
        "    z-index: 0;\n"
        "}"
    )
    story.append(Paragraph(code_css, styles["CodeBlock"]))

    # Build the document
    doc.build(story, canvasmaker=NumberedCanvas)


if __name__ == "__main__":
    build_blueprint_pdf()
    print("PDF Generation complete.")
