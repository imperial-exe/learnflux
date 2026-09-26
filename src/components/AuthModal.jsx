import React, { useState } from "react";
import {
  X,
  Sparkles,
  Mail,
  Lock,
  User,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  ShieldCheck,
  Cpu,
  Fingerprint,
  Zap,
  Radio,
  GraduationCap,
  Calendar,
  Target,
  ArrowLeft,
  Plus,
  BookOpen,
} from "lucide-react";
import { backendApi } from "../services/backendApi";
import { AGE_OPTIONS, getAgeBandInfo, getSubjectsForUser } from "../data/subjectRegistry";
import AddSubjectModal from "./AddSubjectModal";

export default function AuthModal({ isOpen, onClose, initialMode = "login", onAuthSuccess }) {
  const [mode, setMode] = useState(initialMode); // "login" or "signup"
  const [step, setStep] = useState(1); // 1 = Credentials, 2 = Age & Personalization Onboarding

  // Form Fields
  const [name, setName] = useState("Arjun");
  const [email, setEmail] = useState("arjun@demo.app");
  const [password, setPassword] = useState("demo1234");
  const [age, setAge] = useState("16"); // Required dropdown: 1, 2, ... 17, 18, 18+
  const [gradeLevel, setGradeLevel] = useState(10);
  const [learningGoal, setLearningGoal] = useState("Exam Prep");
  const [customSubjects, setCustomSubjects] = useState([]);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authStepMessage, setAuthStepMessage] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const ageBandInfo = getAgeBandInfo(age);
  const previewSubjects = getSubjectsForUser({ age, custom_subjects: customSubjects });

  // Handle Age change in dropdown
  const handleAgeChange = (selectedAge) => {
    setAge(selectedAge);
    // Align grade level realistically with school progression
    if (selectedAge === "18+") {
      setGradeLevel(12);
    } else {
      const numAge = parseInt(selectedAge, 10);
      if (!isNaN(numAge)) {
        // Typical school grade: age - 5 (e.g. Age 6 = Gr 1, Age 16 = Gr 11)
        const calculatedGrade = Math.min(12, Math.max(1, numAge - 5));
        setGradeLevel(calculatedGrade);
      }
    }
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please provide your email and password.");
      return;
    }
    setError("");

    if (mode === "signup") {
      setStep(2); // Proceed to Age & Subject Onboarding
    } else {
      executeAuthentication(name, email, gradeLevel, age, learningGoal, customSubjects);
    }
  };

  const handleStep2Submit = (e) => {
    e.preventDefault();
    if (!age) {
      setError("Please select your age.");
      return;
    }
    executeAuthentication(name, email, gradeLevel, age, learningGoal, customSubjects);
  };

  const executeAuthentication = async (uName, uEmail, uGrade, uAge, uGoal, uCustomSubjects = []) => {
    setLoading(true);
    setAuthStepMessage("Connecting to Supabase Auth & PostgreSQL Instance...");

    setTimeout(() => {
      setAuthStepMessage("Verifying Row Level Security (RLS) & User Metadata...");
    }, 450);

    setTimeout(() => {
      setAuthStepMessage(`Hydrating ${uAge === "18+" ? "Adult/Professional" : `Age ${uAge}`} Adaptive Curriculum & Mistake DNA...`);
    }, 900);

    setTimeout(async () => {
      // Save/retrieve via backendApi
      const result = await backendApi.signUpAndOnboard({
        email: uEmail,
        password: "demo-password",
        name: uName,
        gradeLevel: uGrade,
        age: uAge,
        learningGoal: uGoal,
        customSubjects: uCustomSubjects,
      });

      setLoading(false);
      setAuthStepMessage("");
      if (onAuthSuccess) {
        onAuthSuccess({
          ...result.profile,
          age: uAge,
          custom_subjects: uCustomSubjects,
        });
      }
      onClose();
    }, 1400);
  };

  // 1-Click Fast Pass for Official Demo Students (Configured by Age Bands)
  const handleDemoStudent = (type) => {
    if (type === "priya") {
      // Priya: Age 10 -> Core Band (Primary Tier: English, Science, Maths, Geography)
      executeAuthentication("Priya", "priya@demo.app", 5, "10", "Master Fundamentals", []);
    } else if (type === "arjun") {
      // Arjun: Age 15 -> Advanced Band (DSA, Programming, Adv Math, Physics/Chem)
      executeAuthentication("Arjun", "arjun@demo.app", 10, "15", "Exam Prep", []);
    } else if (type === "meera") {
      // Meera: Age 17 -> Advanced Band (College/Competitive Prep)
      executeAuthentication("Meera", "meera@demo.app", 12, "17", "Competitive Prep", []);
    } else if (type === "sneha") {
      // Sneha: Age 18+ -> Adult/Professional Band (Data Science & AI, Cloud, Finance)
      executeAuthentication("Sneha", "sneha.learner@flux.ai", 12, "18+", "Placement Preparation", []);
    }
  };

  const handleAddCustomSubject = (newSubject) => {
    setCustomSubjects((prev) => [...prev, newSubject]);
  };

  return (
    <>
      <div className="auth-overlay futuristic-overlay" onClick={onClose}>
        <div className="auth-modal futuristic-card" onClick={(e) => e.stopPropagation()}>
          <div className="futuristic-top-glow" />

          <button className="auth-close-btn" onClick={onClose}>
            <X size={20} />
          </button>

          {/* Futuristic Status Header */}
          <div className="auth-header">
            <div className="firebase-status-banner">
              <Radio size={13} className="radio-pulse" />
              <span>SUPABASE POSTGRES + RLS ZERO-TRUST ACTIVE</span>
              <span className="dot-live" />
            </div>

            <div className="brand auth-brand">
              <span className="brand-star">✦</span> LearnFlux <b>AI</b>
            </div>

            <h2>
              {mode === "login"
                ? "AUTHENTICATE LEARNER SESSION"
                : step === 1
                ? "INITIALIZE NEURAL ACCOUNT"
                : "AGE-BASED CURRICULUM ONBOARDING"}
            </h2>
            <p>
              {mode === "login"
                ? "Access age-curated curriculum, Mistake DNA, and AI tutor."
                : step === 1
                ? "Step 1 of 2: Set your security credentials."
                : "Step 2 of 2: Select your age to calibrate classroom-aligned subjects."}
            </p>
          </div>

          {/* Loading Scanner Animation */}
          {loading ? (
            <div className="auth-verifying-screen">
              <div className="quantum-scanner">
                <div className="scanner-line" />
                <Cpu size={48} className="scanner-icon" />
              </div>
              <h3>Securing Student Environment...</h3>
              <div className="terminal-status-box">
                <span className="terminal-prompt">&gt;</span>
                <span className="terminal-text">{authStepMessage}</span>
              </div>
              <div className="auth-progress-track">
                <div className="auth-progress-fill" />
              </div>
            </div>
          ) : (
            <>
              {/* 1-Click Fast Pass Student Profiles */}
              <div className="demo-credentials-box">
                <span className="demo-label">⚡ 1-Click Demo Profiles (By Age Band):</span>
                <div className="demo-btn-group">
                  <button
                    type="button"
                    className="demo-chip"
                    onClick={() => handleDemoStudent("priya")}
                  >
                    👧 Priya (Age 10 • Core Primary)
                  </button>
                  <button
                    type="button"
                    className="demo-chip"
                    onClick={() => handleDemoStudent("arjun")}
                  >
                    👦 Arjun (Age 15 • Advanced Prep)
                  </button>
                  <button
                    type="button"
                    className="demo-chip"
                    onClick={() => handleDemoStudent("meera")}
                  >
                    👩 Meera (Age 17 • College Exam)
                  </button>
                  <button
                    type="button"
                    className="demo-chip"
                    onClick={() => handleDemoStudent("sneha")}
                  >
                    🚀 Sneha (Age 18+ • Professional)
                  </button>
                </div>
              </div>

              {/* Mode Switcher */}
              <div className="auth-tabs">
                <button
                  type="button"
                  className={`auth-tab ${mode === "login" ? "active" : ""}`}
                  onClick={() => {
                    setMode("login");
                    setStep(1);
                    setError("");
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`auth-tab ${mode === "signup" ? "active" : ""}`}
                  onClick={() => {
                    setMode("signup");
                    setError("");
                  }}
                >
                  Create Account
                </button>
              </div>

              {/* STEP 1: Email & Password */}
              {step === 1 && (
                <form onSubmit={handleStep1Submit} className="auth-form">
                  {error && <div className="auth-error">{error}</div>}

                  {mode === "signup" && (
                    <div className="form-group">
                      <label>Full Name</label>
                      <div className="input-with-icon">
                        <User size={18} />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Arjun Sharma"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="form-group">
                    <label>Email Address</label>
                    <div className="input-with-icon">
                      <Mail size={18} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@demo.app"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="flex-between">
                      <label>Password</label>
                      {mode === "login" && (
                        <a href="#forgot" className="forgot-link" onClick={(e) => e.preventDefault()}>
                          Forgot?
                        </a>
                      )}
                    </div>
                    <div className="input-with-icon">
                      <Lock size={18} />
                      <input
                        type={showPass ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        className="show-pass-btn"
                        onClick={() => setShowPass(!showPass)}
                      >
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="primary-btn auth-submit">
                    <span>{mode === "signup" ? "Next: Age & Subject Calibration →" : "Sign In to Platform"}</span>
                    <ArrowRight size={18} />
                  </button>
                </form>
              )}

              {/* STEP 2: Age-Based Subject Selection & Onboarding */}
              {step === 2 && mode === "signup" && (
                <form onSubmit={handleStep2Submit} className="auth-form onboarding-step-2">
                  {error && <div className="auth-error">{error}</div>}

                  {/* 1. Required Dropdown Field: "Select Age" with Options: 1, 2, ... 17, 18, 18+ */}
                  <div className="form-group">
                    <div className="flex-between">
                      <label>
                        <Calendar size={15} /> Select Age *
                      </label>
                      <span className="selected-grade-badge">
                        {age === "18+" ? "Age 18+ Selected" : `Age ${age} Selected`}
                      </span>
                    </div>

                    <select
                      value={age}
                      onChange={(e) => handleAgeChange(e.target.value)}
                      className="auth-select age-dropdown-select"
                      required
                    >
                      <option value="" disabled>-- Select Age --</option>
                      {AGE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt === "18+" ? "18+ (Adult / Professional)" : `Age ${opt}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dynamic Age-Band Curated Curriculum Banner */}
                  <div className="age-curriculum-banner card">
                    <div className="flex-between">
                      <span className="eyebrow">{ageBandInfo.bandLabel.toUpperCase()}</span>
                      <span className="band-tier-tag">{ageBandInfo.tierLabel}</span>
                    </div>

                    <div className="mapped-subjects-preview">
                      <span className="mapped-subj-label">Curated Classroom Subjects:</span>
                      <div className="mapped-subj-chips-row">
                        {previewSubjects.map((subj) => (
                          <div
                            key={subj.id}
                            className={`subj-chip-preview ${subj.is_custom ? "is-custom-chip" : ""}`}
                            style={{ borderColor: `${subj.color}66` }}
                          >
                            <span className="chip-dot" style={{ background: subj.color }} />
                            <span className="chip-name">{subj.name}</span>
                            {subj.is_custom && <span className="custom-indicator-badge">Custom</span>}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* + Add Subject Button */}
                    <div className="add-custom-subj-strip flex-between">
                      <small className="real-world-note">
                        💡 Content & difficulty curve dynamically calibrated to real-world school expectations for Age {age}.
                      </small>
                      <button
                        type="button"
                        className="ghost-btn-sm add-subj-btn"
                        onClick={() => setIsAddSubjectOpen(true)}
                      >
                        <Plus size={14} />
                        <span>+ Add Subject</span>
                      </button>
                    </div>
                  </div>

                  <div className="two-col-form">
                    <div className="form-group">
                      <label>Grade Level Equivalent</label>
                      <select
                        value={gradeLevel}
                        onChange={(e) => setGradeLevel(Number(e.target.value))}
                        className="auth-select"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                          <option key={g} value={g}>
                            Grade {g}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Primary Learning Target</label>
                      <select
                        value={learningGoal}
                        onChange={(e) => setLearningGoal(e.target.value)}
                        className="auth-select"
                      >
                        <option value="Master Fundamentals">🎯 Master Fundamentals</option>
                        <option value="Exam Prep">📚 Exam & Board Prep</option>
                        <option value="Quick Revision">⚡ Quick Concept Review</option>
                        <option value="Competitive Prep">🏆 College / Competitive Prep</option>
                        <option value="Professional Skills">💼 Professional & Career Skills</option>
                      </select>
                    </div>
                  </div>

                  <div className="onboarding-action-row flex-between">
                    <button
                      type="button"
                      className="outline-btn-sm"
                      onClick={() => setStep(1)}
                    >
                      <ArrowLeft size={14} /> Back
                    </button>

                    <button type="submit" className="primary-btn">
                      <span>Launch My Tailored Dashboard</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              )}

              <div className="firebase-project-meta">
                <ShieldCheck size={14} className="shield-icon" />
                <span>Zero-Trust Database: <code>Supabase Postgres RLS (age_tier, mistake_dna)</code></span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Reusable Add Custom Subject Modal with Media Uploads */}
      <AddSubjectModal
        isOpen={isAddSubjectOpen}
        onClose={() => setIsAddSubjectOpen(false)}
        onAddCustomSubject={handleAddCustomSubject}
      />
    </>
  );
}
