import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>LearnFlux AI — Hackathon Pitch & Technical Architecture</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

    @page {
      size: A4;
      margin: 14mm 14mm 14mm 14mm;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.5;
      font-size: 10.5pt;
      margin: 0;
      padding: 0;
    }

    .cover-header {
      background: linear-gradient(135deg, #090d16 0%, #17112d 50%, #2e1065 100%);
      color: #ffffff;
      padding: 26px 28px;
      border-radius: 12px;
      margin-bottom: 22px;
      border: 1px solid rgba(255, 255, 255, 0.12);
    }

    .kicker {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(168, 85, 247, 0.25);
      border: 1px solid rgba(192, 132, 252, 0.4);
      color: #e9d5ff;
      font-size: 8pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 3px 10px;
      border-radius: 999px;
      margin-bottom: 12px;
    }

    .live-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #4ade80;
      display: inline-block;
    }

    h1 {
      font-size: 22pt;
      font-weight: 800;
      letter-spacing: -0.03em;
      margin: 0 0 6px 0;
      color: #ffffff;
    }

    h1 span {
      background: linear-gradient(90deg, #c084fc, #38bdf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .subtitle {
      font-size: 11pt;
      color: #cbd5e1;
      margin: 0 0 14px 0;
      max-width: 680px;
      font-weight: 400;
    }

    .meta-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      padding-top: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.12);
      font-size: 8.5pt;
      color: #94a3b8;
    }

    .meta-item strong {
      color: #f1f5f9;
    }

    h2 {
      font-size: 13.5pt;
      font-weight: 700;
      color: #0f172a;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 4px;
      margin: 22px 0 10px 0;
      display: flex;
      align-items: center;
      gap: 8px;
      page-break-after: avoid;
    }

    h3 {
      font-size: 11pt;
      font-weight: 700;
      color: #1e293b;
      margin: 14px 0 6px 0;
      page-break-after: avoid;
    }

    p {
      margin: 0 0 8px 0;
      color: #334155;
    }

    .callout {
      background: #f8fafc;
      border-left: 4px solid #6366f1;
      padding: 10px 14px;
      border-radius: 0 8px 8px 0;
      margin: 12px 0;
      font-size: 9.5pt;
      page-break-inside: avoid;
    }

    .callout-title {
      font-weight: 700;
      color: #4338ca;
      margin-bottom: 4px;
      text-transform: uppercase;
      font-size: 8pt;
      letter-spacing: 0.05em;
    }

    .elevator-box {
      background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
      border: 1px solid #cbd5e1;
      border-left: 5px solid #8b5cf6;
      border-radius: 8px;
      padding: 12px 16px;
      margin: 12px 0 18px 0;
      font-size: 9.5pt;
      font-style: italic;
      color: #1e293b;
      line-height: 1.55;
      page-break-inside: avoid;
    }

    /* Grid Layouts */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin: 12px 0;
      page-break-inside: avoid;
    }

    .card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }

    .card-accent-purple { border-top: 3px solid #8b5cf6; }
    .card-accent-blue { border-top: 3px solid #0284c7; }
    .card-accent-emerald { border-top: 3px solid #10b981; }
    .card-accent-amber { border-top: 3px solid #f59e0b; }

    .card h4 {
      margin: 0 0 4px 0;
      font-size: 9.5pt;
      font-weight: 700;
      color: #0f172a;
    }

    .card p {
      font-size: 8.5pt;
      color: #475569;
      margin: 0;
      line-height: 1.45;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0 16px 0;
      font-size: 8.5pt;
      page-break-inside: avoid;
    }

    th {
      background: #0f172a;
      color: #ffffff;
      text-align: left;
      padding: 7px 9px;
      font-weight: 600;
      font-size: 8pt;
      letter-spacing: 0.02em;
    }

    th:first-child { border-top-left-radius: 6px; }
    th:last-child { border-top-right-radius: 6px; }

    td {
      padding: 6px 9px;
      border-bottom: 1px solid #e2e8f0;
      color: #334155;
      vertical-align: top;
    }

    tr:nth-child(even) td {
      background: #f8fafc;
    }

    tr:last-child td {
      border-bottom: 2px solid #cbd5e1;
    }

    .badge {
      display: inline-block;
      font-size: 7.5pt;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
    }

    .badge-purple { background: #f3e8ff; color: #7e22ce; }
    .badge-blue { background: #e0f2fe; color: #0369a1; }
    .badge-emerald { background: #d1fae5; color: #047857; }
    .badge-amber { background: #fef3c7; color: #b45309; }
    .badge-slate { background: #f1f5f9; color: #334155; }

    .code-block {
      background: #0f172a;
      color: #e2e8f0;
      font-family: 'JetBrains Mono', monospace;
      padding: 10px 12px;
      border-radius: 6px;
      font-size: 8pt;
      line-height: 1.45;
      margin: 8px 0;
      overflow-x: hidden;
      page-break-inside: avoid;
    }

    .math-formula {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 8px 12px;
      border-radius: 6px;
      font-family: 'JetBrains Mono', monospace;
      color: #1e1b4b;
      font-size: 9pt;
      text-align: center;
      margin: 8px 0;
      font-weight: 600;
      page-break-inside: avoid;
    }

    .page-break {
      page-break-before: always;
    }

    ol, ul {
      margin: 4px 0 10px 0;
      padding-left: 18px;
      font-size: 9pt;
      color: #334155;
    }

    li {
      margin-bottom: 4px;
    }

    .pill-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin: 6px 0;
    }

    .footer {
      margin-top: 16px;
      padding-top: 8px;
      border-top: 1px solid #e2e8f0;
      font-size: 8pt;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>

  <!-- COVER HEADER -->
  <div class="cover-header">
    <div class="kicker">
      <span class="live-dot"></span>
      Hackathon Pitch & Technical Architecture Specification
    </div>
    <h1>LearnFlux <span>AI</span></h1>
    <div class="subtitle">The Next-Generation Intelligent Adaptive Learning & Cognitive Telemetry Engine</div>
    <div class="meta-bar">
      <div class="meta-item">Product: <strong>LearnFlux AI</strong></div>
      <div class="meta-item">Status: <strong>Production Ready Prototype</strong></div>
      <div class="meta-item">Live Application: <strong>http://localhost:5173/</strong></div>
      <div class="meta-item">Target: <strong>Hackathon Grand Prize Pitch</strong></div>
    </div>
  </div>

  <!-- SECTION 1: 60-SEC ELEVATOR PITCH -->
  <h2>⚡ 1. The 60-Second Elevator Pitch</h2>
  <div class="elevator-box">
    "Right now, global education is broken because it treats millions of unique minds like identical assembly-line machines. Whether you are on Coursera, Khan Academy, or in a traditional classroom, everyone is fed the exact same static video or quiz. If you fail, the system just says 'Wrong: -1 point'—never telling you <strong>why</strong> your brain made that mistake.<br><br>
    Introducing <strong>LearnFlux AI</strong>—an intelligent adaptive learning engine that replaces static courses with an evolving <strong>Prerequisite Knowledge Graph</strong>. LearnFlux doesn't just score you; it extracts your <strong>'Mistake DNA'</strong>, classifying errors into conceptual misconceptions, calculation slips, careless mistakes, or application errors. Powered by a real-time <strong>Mastery Engine</strong>, an interactive <strong>3D spatial WebGL canvas</strong>, and a multimodal learning hub, LearnFlux identifies your exact bottleneck and prescribes the single <strong>'Next-Best-Action'</strong> to unlock mastery."
  </div>

  <!-- SECTION 2: 3-5 MINUTE HACKATHON STAGE PRESENTATION -->
  <h2>🎤 2. The 3–5 Minute Stage Presentation Script</h2>
  
  <div class="card card-accent-purple" style="margin-bottom: 10px;">
    <h4>Act I: The Hook & The Problem (0:00 – 0:45)</h4>
    <p><em>"Judges, have you ever spent 3 hours studying a topic, only to fail the exam because you lacked a single foundational prerequisite taught two years ago? 85% of students who drop out of STEM do so not because they aren't smart, but because of <strong>hidden prerequisite knowledge gaps</strong> that traditional courses never detect. Traditional EdTech platforms are passive, linear, and blind to how the human brain actually retains concepts."</em></p>
  </div>

  <div class="card card-accent-blue" style="margin-bottom: 10px;">
    <h4>Act II: The Solution — LearnFlux AI (0:45 – 1:30)</h4>
    <p><em>"We built LearnFlux AI. When a learner logs on—whether a 10-year-old mastering fractions or a university senior preparing for placement exams—LearnFlux runs a rapid Diagnostic Knowledge Assessment. Behind the scenes, our graph algorithms map their responses directly against a prerequisite dependency tree, instantly generating an individualized Learning Path calibrated to their cognitive velocity."</em></p>
  </div>

  <div class="card card-accent-emerald" style="margin-bottom: 10px;">
    <h4>Act III: The Breakthrough Innovations (1:30 – 2:45)</h4>
    <p><strong>1. Mistake DNA™:</strong> Categorizes errors into Conceptual, Calculation, Careless, or Application errors instead of binary 0/1 scores.<br>
    <strong>2. Next-Best-Action Engine:</strong> Eliminates decision fatigue by pinpointing the single prerequisite bottleneck that unlocks the most downstream topics.<br>
    <strong>3. Multi-Modal Learning Hub:</strong> Serves 4 parallel formats for every concept: Theory Notes, Visual Mind Maps, Active Flashcards, and Adaptive Quizzes.</p>
  </div>

  <div class="card card-accent-amber" style="margin-bottom: 10px;">
    <h4>Act IV: Market & Closing Call-to-Action (2:45 – 4:00)</h4>
    <p><em>"The Smart EdTech market is projected to reach $400B+ by 2030. Our B2C freemium model ($12/mo) pairs with institutional B2B licensing for colleges and school districts. LearnFlux turns education from a passive one-way broadcast into an intelligent, adaptive dialog."</em></p>
  </div>

  <!-- SECTION 3: CONCEPT DEEP DIVE -->
  <div class="page-break"></div>
  <h2>🧠 3. Detailed Concept & Algorithmic Mechanics</h2>

  <div class="grid-2">
    <div class="card card-accent-purple">
      <h4>🧬 The 4 Cognitive Mistake DNA™ Axes</h4>
      <ul>
        <li><strong>Conceptual ($E_{\text{concept}}$):</strong> Missing baseline theorem or axiomatic definition. <em>Action: Direct to theory notes & mind maps.</em></li>
        <li><strong>Calculation ($E_{\text{calc}}$):</strong> Mechanical arithmetic or syntax error. <em>Action: Flashcard recall drills.</em></li>
        <li><strong>Careless ($E_{\text{careless}}$):</strong> Misread prompt under time pressure. <em>Action: Pacing drills.</em></li>
        <li><strong>Application ($E_{\text{apply}}$):</strong> Correct formula applied to wrong context. <em>Action: Diagnostic case quizzes.</em></li>
      </ul>
    </div>

    <div class="card card-accent-blue">
      <h4>🎯 Prerequisite Knowledge Graph & Bottlenecks</h4>
      <p>Concepts are modeled as a Directed Acyclic Graph (DAG). If a student struggles in <em>Dynamic Programming</em>, LearnFlux traverses backward to test <em>Recursion</em>, <em>Binary Search</em>, and <em>Big-O</em>. It isolates the highest-leverage node—resolving one bottleneck unlocks multiple downstream milestones.</p>
    </div>
  </div>

  <h3>Accuracy-Weighted Mastery Score Formula</h3>
  <p>Rather than a crude percentage, LearnFlux computes student mastery via a dynamic difficulty-weighted equation:</p>
  <div class="math-formula">
    Mastery = min( 100, max( 0, Accuracy × 100 × (0.7 + 0.3 × (AvgDifficulty / 5)) ) )
  </div>
  <p style="font-size: 8.5pt; color: #64748b;">Where <code>Accuracy</code> is evaluated over the last 10 attempts, and <code>AvgDifficulty</code> scales from 1 to 5. Scores ≥ 80% mark the node <strong>Mastered</strong>; 50–79% marks it <strong>Developing</strong>; &lt; 50% flags an active <strong>Knowledge Gap</strong>.</p>

  <!-- SECTION 4: TECH STACK TABLES -->
  <h2>🛠️ 4. Complete Technical Stack Breakdown</h2>

  <h3>Frontend & UI Architecture</h3>
  <table>
    <thead>
      <tr>
        <th style="width: 22%;">Technology</th>
        <th style="width: 18%;">Category</th>
        <th style="width: 14%;">Version</th>
        <th>Role & Implementation in LearnFlux AI</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>React</strong></td>
        <td>UI Framework</td>
        <td><span class="badge badge-purple">^19.1.1</span></td>
        <td>Component lifecycle, concurrent rendering, dynamic state hydration, hooks, and responsive layout management.</td>
      </tr>
      <tr>
        <td><strong>Vite</strong></td>
        <td>Build & Dev Tool</td>
        <td><span class="badge badge-blue">^7.1.7</span></td>
        <td>Sub-millisecond Hot Module Replacement (HMR) and optimized ESM asset bundling.</td>
      </tr>
      <tr>
        <td><strong>Three.js</strong></td>
        <td>3D WebGL Core</td>
        <td><span class="badge badge-emerald">^0.180.0</span></td>
        <td>Low-level WebGL graphics engine, 3D matrix math, geometry, camera transforms, and lighting pipelines.</td>
      </tr>
      <tr>
        <td><strong>@react-three/fiber</strong></td>
        <td>React 3D Bridge</td>
        <td><span class="badge badge-purple">^9.3.0</span></td>
        <td>Declarative Three.js scene graph rendering directly inside React's virtual DOM tree.</td>
      </tr>
      <tr>
        <td><strong>@react-three/drei</strong></td>
        <td>3D Utilities</td>
        <td><span class="badge badge-blue">^10.7.6</span></td>
        <td>Powers <code>OrbitControls</code>, <code>Float</code> dynamics, 3D particle systems (<code>Sparkles</code>), and mesh management.</td>
      </tr>
      <tr>
        <td><strong>Lucide React</strong></td>
        <td>Iconography</td>
        <td><span class="badge badge-slate">^0.468.0</span></td>
        <td>Pixel-perfect iconography for telemetry badges, status indicators, and course catalog streams.</td>
      </tr>
      <tr>
        <td><strong>Custom CSS3</strong></td>
        <td>UI Design System</td>
        <td><span class="badge badge-slate">CSS3 / BEM</span></td>
        <td>Neon glassmorphism, responsive grid/flexbox layouts, CSS variables, and real-time cursor light aura (<code>CursorGlow</code>).</td>
      </tr>
      <tr>
        <td><strong>Web Speech API</strong></td>
        <td>Audio & Voice</td>
        <td><span class="badge badge-amber">Native API</span></td>
        <td>Browser-native <code>SpeechSynthesis</code> for real-time text-to-speech voice narration in Flux Bot and AI Tutor.</td>
      </tr>
      <tr>
        <td><strong>Cursor Shaders</strong></td>
        <td>Spatial Shaders</td>
        <td><span class="badge badge-emerald">Custom Math</span></td>
        <td>Normalized coordinate interpolation (<code>lerp</code>) controlling 3D mouse spotlights and animated 3D pupil gaze.</td>
      </tr>
      <tr>
        <td><strong>SVG / HTML5 Canvas</strong></td>
        <td>Data Visualization</td>
        <td><span class="badge badge-blue">Native SVG</span></td>
        <td>Smooth bezier curve learning velocity charts and 6-axis cognitive radar polygons in Progress Tracker.</td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>
  <h3>Backend, Database & Algorithmic Stack</h3>
  <table>
    <thead>
      <tr>
        <th style="width: 22%;">Technology</th>
        <th style="width: 18%;">Category</th>
        <th style="width: 14%;">Version / Spec</th>
        <th>Role & Implementation in LearnFlux AI</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Supabase (PostgreSQL)</strong></td>
        <td>Primary Database</td>
        <td><span class="badge badge-purple">PostgreSQL 15+</span></td>
        <td>Relational Knowledge Graph modeling: <code>profiles</code>, <code>subjects</code>, <code>topics</code>, <code>subtopics</code>, <code>study_materials</code>, <code>questions</code>, <code>attempts</code>.</td>
      </tr>
      <tr>
        <td><strong>PostgreSQL pgcrypto</strong></td>
        <td>Cryptographic Engine</td>
        <td><span class="badge badge-slate">Core Extension</span></td>
        <td>Generates cryptographically secure <code>UUIDv4</code> primary keys across all relational tables.</td>
      </tr>
      <tr>
        <td><strong>Row-Level Security (RLS)</strong></td>
        <td>Data Security</td>
        <td><span class="badge badge-emerald">Zero-Trust Policies</span></td>
        <td>Enforces multi-tenant isolation: students can only access and modify their own attempts and progress via <code>auth.uid()</code>.</td>
      </tr>
      <tr>
        <td><strong>Deno / TypeScript</strong></td>
        <td>Serverless Compute</td>
        <td><span class="badge badge-blue">Supabase Edge</span></td>
        <td>Executes serverless Edge Functions (<code>record-attempt</code>, <code>get-full-profile</code>, <code>get-progress-over-time</code>) with &lt;50ms cold starts.</td>
      </tr>
      <tr>
        <td><strong>Mastery Engine</strong></td>
        <td>Algorithmic Core</td>
        <td><span class="badge badge-purple">masteryEngine.ts</span></td>
        <td>Calculates dynamic accuracy-weighted scores and manages status transitions (Locked → Weak → Developing → Mastered).</td>
      </tr>
      <tr>
        <td><strong>Mistake DNA™ Classifier</strong></td>
        <td>Cognitive Profiler</td>
        <td><span class="badge badge-amber">Custom Engine</span></td>
        <td>Parses quiz distractor error taxonomies in real time to update student cognitive breakdown.</td>
      </tr>
      <tr>
        <td><strong>Universal Hybrid Client</strong></td>
        <td>Data Access Layer</td>
        <td><span class="badge badge-slate">backendApi.js</span></td>
        <td>Dual-mode connector: operates against live Supabase endpoints with instant local fallback for zero-fail hackathon demos.</td>
      </tr>
      <tr>
        <td><strong>Supabase & Firebase Auth</strong></td>
        <td>Identity Provider</td>
        <td><span class="badge badge-blue">JWT / Token</span></td>
        <td>Manages user onboarding, authentication sessions, grade-level tagging (Grade 1–12), and target learning goals.</td>
      </tr>
      <tr>
        <td><strong>Multi-LLM Orchestrator</strong></td>
        <td>AI Reasoning Layer</td>
        <td><span class="badge badge-purple">Swappable API</span></td>
        <td>Connects to fine-tuned LearnFlux models, GPT-4o, Claude 3.5 Sonnet, and Gemini Pro with 4 pedagogical personas.</td>
      </tr>
      <tr>
        <td><strong>Prerequisite DAG Router</strong></td>
        <td>Graph Engine</td>
        <td><span class="badge badge-emerald">Directed Graph</span></td>
        <td>Traverses prerequisite node relationships to compute the critical path bottleneck and assign Next-Best-Action focus.</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 5: LIVE DEMO SEQUENCE -->
  <h2>🎬 5. The 6-Step Hackathon Live Demo Flow</h2>
  <ol>
    <li><strong>Step 1: The Visual Hook</strong> — Showcase the interactive 3D crystal core rotating at 60fps on the landing page (<code>http://localhost:5173/</code>).</li>
    <li><strong>Step 2: Diagnostic Assessment</strong> — Launch a subject diagnostic test; intentionally answer with a distractor to demonstrate real-time Mistake DNA error classification.</li>
    <li><strong>Step 3: Adaptive Learning Path</strong> — Show how the curriculum dynamically rearranged itself to isolate the detected bottleneck (<em>Time Complexity & Big-O</em>).</li>
    <li><strong>Step 4: Interactive 3D Sphere & Multi-Modal Hub</strong> — Navigate to the Dashboard; hover mouse to show the 3D Sphere tracking cursor vectors, spotlighting, and pupil gazing. Scroll down and toggle between Theory Notes, Visual Mind Maps, and Interactive Flashcards.</li>
    <li><strong>Step 5: Adaptive Knowledge Quiz</strong> — Complete a 3-question sequence showing streak multipliers and dynamic difficulty scaling from Foundation to Intermediate.</li>
    <li><strong>Step 6: Voice Flux Bot & AI Tutor</strong> — Click Flux Bot on the dashboard to hear vocal speech greeting, then ask the AI Tutor a technical query with multi-persona switching and one-click Markdown chat export.</li>
  </ol>

  <!-- SECTION 6: JUDGE Q&A DEFENSE -->
  <h2>❓ 6. Anticipated Judge Questions & Winning Defenses</h2>
  <div class="card card-accent-purple" style="margin-bottom: 8px;">
    <h4>Q: "How is this different from Khan Academy or Duolingo?"</h4>
    <p><strong>A:</strong> Khan Academy and Duolingo are linear tracks with binary right/wrong scoring. LearnFlux diagnoses <em>why</em> you failed using Mistake DNA (conceptual vs careless vs calculation) and provides multi-modal learning modalities (mind maps, notes, flashcards) for every single node.</p>
  </div>
  <div class="card card-accent-blue" style="margin-bottom: 8px;">
    <h4>Q: "Can LearnFlux support custom university syllabi or notes?"</h4>
    <p><strong>A:</strong> Yes! LearnFlux features a '+ Add Subject' engine where students or educators can upload lecture notes and syllabi, which automatically synthesize into personalized diagnostics and prerequisite learning paths.</p>
  </div>
  <div class="card card-accent-emerald">
    <h4>Q: "How is student data protected?"</h4>
    <p><strong>A:</strong> Full enterprise-grade PostgreSQL Row-Level Security (RLS) is implemented on Supabase. Every telemetry point, attempt, and progress record is bound to <code>auth.uid()</code>, preventing any unauthorized cross-tenant data leaks.</p>
  </div>

  <div class="footer">
    <span>LearnFlux AI — Intelligent Adaptive Learning Engine</span>
    <span>Confidential Pitch Deck & Technical Spec • 2026</span>
  </div>

</body>
</html>`;

const htmlPath = path.resolve('c:/Users/jhanvi/Desktop/LearnFluxAi 2/LearnFlux_AI_Pitch_and_Tech_Stack.html');
const pdfWorkspacePath = path.resolve('c:/Users/jhanvi/Desktop/LearnFluxAi 2/LearnFlux_AI_Pitch_and_Tech_Stack.pdf');
const desktopPath = path.resolve('C:/Users/jhanvi/Desktop/LearnFlux_AI_Pitch_and_Tech_Stack.pdf');
const publicDir = path.resolve('c:/Users/jhanvi/Desktop/LearnFluxAi 2/public');
const publicPdfPath = path.join(publicDir, 'LearnFlux_AI_Pitch_and_Tech_Stack.pdf');

// 1. Write HTML
fs.writeFileSync(htmlPath, htmlContent, 'utf8');
console.log('HTML file created at:', htmlPath);

// 2. Ensure public folder exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 3. Convert to PDF using Edge Headless
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const fileUrl = 'file:///' + htmlPath.replace(/\\\\/g, '/');
const cmd = `"${edgePath}" --headless --disable-gpu --print-to-pdf="${pdfWorkspacePath}" --no-pdf-header-footer "${fileUrl}"`;

console.log('Running Edge headless PDF generation...');
execSync(cmd, { stdio: 'inherit' });

// 4. Verify & Copy to Desktop and public folder
if (fs.existsSync(pdfWorkspacePath)) {
  const stats = fs.statSync(pdfWorkspacePath);
  console.log(`PDF successfully created! Size: ${stats.size} bytes`);

  // Copy to Desktop
  fs.copyFileSync(pdfWorkspacePath, desktopPath);
  console.log('Copied to Desktop at:', desktopPath);

  // Copy to public folder for browser access
  fs.copyFileSync(pdfWorkspacePath, publicPdfPath);
  console.log('Copied to public folder at:', publicPdfPath);
} else {
  console.error('Failed to generate PDF at:', pdfWorkspacePath);
  process.exit(1);
}
