import React from "react";
import Hero3D from "./Hero3D";
import {
  Sparkles,
  ArrowRight,
  BrainCircuit,
  Compass,
  Zap,
  Target,
  Bot,
  CheckCircle2,
  BookOpen,
  Award,
  Users,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

export default function LandingPage({ setPage, onOpenAuth }) {
  return (
    <div className="landing">
      {/* Navigation */}
      <header className="landing-nav">
        <div className="brand" onClick={() => setPage("landing")}>
          <span className="brand-star">✦</span> LearnFlux <b>AI</b>
        </div>
        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#courses" onClick={(e) => { e.preventDefault(); setPage("courses"); }}>Courses</a>
          <a href="#demo" onClick={(e) => { e.preventDefault(); setPage("tutor"); }}>AI Tutor</a>
        </nav>
        <div className="nav-actions">
          <button className="ghost-btn" onClick={() => onOpenAuth("login")}>
            Sign In
          </button>
          <button className="primary-btn pulse" onClick={() => onOpenAuth("signup")}>
            Get Started Free
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-copy">
          <div className="hero-kicker-badge">
            <span className="live-dot" />
            <span>AI ADAPTIVE ENGINE 2.0 • ONLINE</span>
          </div>
          <h1>
            YOUR LEARNING.<br />
            <em>YOUR PACE.</em><br />
            YOUR AI.
          </h1>
          <p>
            The world's most intuitive adaptive learning platform. LearnFlux maps your prerequisite
            understanding, identifies hidden conceptual gaps in real time, and auto-generates custom
            curricula tailored precisely to your brain's velocity.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn hero-cta" onClick={() => setPage("assessment")}>
              <span>Start Diagnostic Test</span>
              <ArrowRight size={18} />
            </button>
            <button className="ghost-btn hero-ghost" onClick={() => setPage("tutor")}>
              <Sparkles size={18} className="sparkle-icon" />
              <span>Ask LearnFlux AI</span>
            </button>
            <button className="outline-btn" onClick={() => setPage("courses")}>
              <BookOpen size={17} />
              <span>Browse Catalog</span>
            </button>
          </div>

          <div className="hero-social-proof">
            <div className="user-avatars">
              <span className="u-avatar">JD</span>
              <span className="u-avatar">AS</span>
              <span className="u-avatar">RM</span>
              <span className="u-avatar">SK</span>
              <span className="u-avatar-plus">+4.8k</span>
            </div>
            <div className="proof-text">
              <strong>Joined by 12,000+ developers & students</strong>
              <span>★ 4.9/5 satisfaction rating across top universities</span>
            </div>
          </div>
        </div>

        {/* 3D Interactive Canvas */}
        <Hero3D />
      </section>

      {/* Stats Ticker */}
      <div className="stats-ticker">
        <div className="ticker-item">
          <strong>98.4%</strong>
          <span>Diagnostic Accuracy</span>
        </div>
        <div className="ticker-divider" />
        <div className="ticker-item">
          <strong>3.4x</strong>
          <span>Faster Concept Mastery</span>
        </div>
        <div className="ticker-divider" />
        <div className="ticker-item">
          <strong>50k+</strong>
          <span>Adaptive Practice Questions</span>
        </div>
        <div className="ticker-divider" />
        <div className="ticker-item">
          <strong>24/7</strong>
          <span>Context-Aware AI Tutor</span>
        </div>
      </div>

      {/* How it works section */}
      <section id="how-it-works" className="landing-section">
        <div className="section-head text-center">
          <span className="eyebrow">INTELLIGENT ADAPTIVE ARCHITECTURE</span>
          <h2>How LearnFlux AI Accelerates Your Mastery</h2>
          <p>
            Traditional courses treat every student identically. LearnFlux constructs a real-time
            knowledge graph that rewires itself around your strengths and gaps.
          </p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-num">01</div>
            <div className="step-icon-box">
              <Target size={24} />
            </div>
            <h3>5-Minute Diagnostic</h3>
            <p>
              Take an interactive rapid diagnostic assessment. Our engine evaluates not just right/wrong answers, but time per question and cognitive depth.
            </p>
            <span className="step-badge">Baseline Evaluation</span>
          </div>

          <div className="step-card highlight">
            <div className="step-num">02</div>
            <div className="step-icon-box">
              <BrainCircuit size={24} />
            </div>
            <h3>Deep Gap Detection</h3>
            <p>
              Struggling with Dynamic Programming? LearnFlux discovers the root problem is actually Recursion and Tree Traversals, preventing wasted study time.
            </p>
            <span className="step-badge active-badge">Graph Analysis</span>
          </div>

          <div className="step-card">
            <div className="step-num">03</div>
            <div className="step-icon-box">
              <Compass size={24} />
            </div>
            <h3>Personalized Pathway</h3>
            <p>
              A dynamic roadmap organizes micro-lessons, hands-on challenges, and adaptive quizzes tailored specifically to eliminate your specific blind spots.
            </p>
            <span className="step-badge">Dynamic Sequencing</span>
          </div>

          <div className="step-card">
            <div className="step-num">04</div>
            <div className="step-icon-box">
              <Bot size={24} />
            </div>
            <h3>24/7 Contextual AI Tutor</h3>
            <p>
              Whenever you're stuck, the LearnFlux AI tutor already knows your active quiz score, recent errors, and optimal explanation style.
            </p>
            <span className="step-badge">Socratic Guidance</span>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="landing-section dark-alt">
        <div className="section-head text-center">
          <span className="eyebrow">BUILT FOR PEAK RETENTION</span>
          <h2>Everything You Need To Master Complex Tech</h2>
          <p>Cutting-edge cognitive science meets generative AI tooling.</p>
        </div>

        <div className="feature-grid-3">
          <div className="feature-card">
            <div className="f-icon purple">
              <Zap size={22} />
            </div>
            <h4>Real-Time Adaptive Quizzing</h4>
            <p>
              Difficulty shifts continuously between Foundation, Intermediate, and Advanced tiers depending on your current accuracy streak.
            </p>
          </div>

          <div className="feature-card">
            <div className="f-icon cyan">
              <TrendingUp size={22} />
            </div>
            <h4>Visual Skill Mastery Radar</h4>
            <p>
              Inspect your granular proficiency across Data Structures, Algorithms, Time Complexity, and System Architecture with live telemetry.
            </p>
          </div>

          <div className="feature-card">
            <div className="f-icon green">
              <ShieldCheck size={22} />
            </div>
            <h4>Targeted Knowledge Repair</h4>
            <p>
              Instant micro-remediation modules trigger automatically the moment a confusion pattern is detected in your quiz responses.
            </p>
          </div>

          <div className="feature-card">
            <div className="f-icon pink">
              <Award size={22} />
            </div>
            <h4>Milestone Badges & Streaks</h4>
            <p>
              Stay motivated with continuous streak multipliers, milestone certifications, and cognitive progress analytics.
            </p>
          </div>

          <div className="feature-card">
            <div className="f-icon orange">
              <BookOpen size={22} />
            </div>
            <h4>Industry-Ready Curricula</h4>
            <p>
              Comprehensive tracks curated for top-tier software engineering interviews, competitive programming, and semester exams.
            </p>
          </div>

          <div className="feature-card">
            <div className="f-icon violet">
              <Bot size={22} />
            </div>
            <h4>Voice & Code AI Chat</h4>
            <p>
              Ask complex algorithmic questions, paste code snippets, or request step-by-step mathematical proofs with instant markdown rendering.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Courses Teaser */}
      <section id="courses" className="landing-section">
        <div className="section-head flex-between">
          <div>
            <span className="eyebrow">POPULAR LEARNING PATHS</span>
            <h2>Top Recommended AI-Powered Tracks</h2>
          </div>
          <button className="link-arrow-btn" onClick={() => setPage("courses")}>
            <span>View All Courses (24)</span>
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="courses-teaser-grid">
          <div className="course-teaser-card" onClick={() => setPage("courses")}>
            <div className="course-banner dsa-bg">
              <span className="c-tag">DSA Masterclass</span>
              <span className="c-level">Intermediate</span>
            </div>
            <div className="c-body">
              <h3>Data Structures & Algorithmic Thinking</h3>
              <p>Arrays, Trees, Dynamic Programming, Graph Theory, and Big-O Mastery.</p>
              <div className="c-meta">
                <span>✦ 8 Modules</span>
                <span>⏱ 32 Hours</span>
                <span className="c-rating">★ 4.9 (2.1k reviews)</span>
              </div>
            </div>
          </div>

          <div className="course-teaser-card" onClick={() => setPage("courses")}>
            <div className="course-banner aiml-bg">
              <span className="c-tag">AI & Machine Learning</span>
              <span className="c-level">Advanced</span>
            </div>
            <div className="c-body">
              <h3>Neural Networks & LLM Foundations</h3>
              <p>Transformers, Attention Mechanisms, Fine-tuning, and Vector Embeddings.</p>
              <div className="c-meta">
                <span>✦ 10 Modules</span>
                <span>⏱ 40 Hours</span>
                <span className="c-rating">★ 4.95 (1.8k reviews)</span>
              </div>
            </div>
          </div>

          <div className="course-teaser-card" onClick={() => setPage("courses")}>
            <div className="course-banner sys-bg">
              <span className="c-tag">System Design</span>
              <span className="c-level">Comprehensive</span>
            </div>
            <div className="c-body">
              <h3>High-Scale Distributed Systems</h3>
              <p>Load balancing, sharding, caching, microservices, and fault tolerance.</p>
              <div className="c-meta">
                <span>✦ 6 Modules</span>
                <span>⏱ 26 Hours</span>
                <span className="c-rating">★ 4.88 (950 reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="landing-section dark-alt">
        <div className="section-head text-center">
          <span className="eyebrow">COMMUNITY PRAISE</span>
          <h2>Loved by ambitious engineers & students</h2>
        </div>

        <div className="testimonial-grid">
          <div className="testimonial-card">
            <p>
              "The diagnostic test flagged that I kept failing DP questions because of weak tree traversal intuition. After 2 days on the tailored path, I cracked my FAANG coding interview."
            </p>
            <div className="t-user">
              <div className="t-avatar">R</div>
              <div>
                <strong>Rohan Mehta</strong>
                <small>Software Engineer @ TechCorp</small>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <p>
              "The AI Tutor understands the exact quiz question I just missed. Instead of giving me the code immediately, it nudged me through Socratic hints. Brilliant experience."
            </p>
            <div className="t-user">
              <div className="t-avatar">A</div>
              <div>
                <strong>Ananya Sharma</strong>
                <small>Computer Science Senior</small>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <p>
              "The 3D interactive knowledge map makes seeing what to learn next so addictive. I've maintained a 28-day streak without even feeling burnt out."
            </p>
            <div className="t-user">
              <div className="t-avatar">S</div>
              <div>
                <strong>Siddharth Patel</strong>
                <small>Competitive Programmer</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="cta-banner-section">
        <div className="cta-card">
          <span className="eyebrow">READY TO LEVEL UP?</span>
          <h2>Experience AI Learning Tailored to Your Mind</h2>
          <p>
            Join thousands of learners accelerating their technical growth. Get your personalized knowledge map in under 5 minutes.
          </p>
          <div className="cta-action-btns">
            <button className="primary-btn cta-large" onClick={() => onOpenAuth("signup")}>
              Create Free Account →
            </button>
            <button className="ghost-btn cta-large" onClick={() => setPage("dashboard")}>
              Explore Live Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand">
              <span className="brand-star">✦</span> LearnFlux <b>AI</b>
            </div>
            <p>The next-generation adaptive AI learning engine.</p>
          </div>
          <div className="footer-col">
            <strong>Platform</strong>
            <span onClick={() => setPage("dashboard")}>Dashboard</span>
            <span onClick={() => setPage("assessment")}>Diagnostic Test</span>
            <span onClick={() => setPage("courses")}>Course Catalog</span>
            <span onClick={() => setPage("tutor")}>AI Tutor</span>
          </div>
          <div className="footer-col">
            <strong>Engine</strong>
            <span onClick={() => setPage("path")}>Knowledge Map</span>
            <span onClick={() => setPage("quiz")}>Adaptive Quiz</span>
            <span onClick={() => setPage("progress")}>Progress Tracker</span>
            <span onClick={() => setPage("profile")}>Learner Profile</span>
          </div>
          <div className="footer-col">
            <strong>Connect</strong>
            <span>GitHub Repository</span>
            <span>Documentation</span>
            <span>Community Discord</span>
            <span>Privacy & Terms</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 LearnFlux AI. All rights reserved.</span>
          <div className="footer-badges">
            <span>ADAPTIVE ENGINE v2.4</span>
            <span>⚡ POWERED BY REACT & THREE.JS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
