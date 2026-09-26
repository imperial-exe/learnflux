import React, { useState } from "react";
import {
  User,
  Award,
  Flame,
  Target,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Settings,
} from "lucide-react";

export default function Profile({ user, setPage }) {
  const [learningGoal, setLearningGoal] = useState(user?.goal || "Placement Preparation");

  return (
    <div className="profile-container">
      <div className="section-heading">
        <span className="eyebrow">CONTINUOUS COGNITIVE PROFILE</span>
        <h2>Learner Profile & Telemetry</h2>
        <p>
          Your cognitive profile self-calibrates after every diagnostic, adaptive quiz, and AI tutor interaction.
        </p>
      </div>

      {/* Profile Header Banner */}
      <div className="card profile-header-card">
        <div className="profile-header-main">
          <div className="profile-avatar-large">
            {user?.avatarLetter || "S"}
          </div>
          <div className="profile-user-info">
            <div className="flex-between">
              <h3>{user?.name || "Sneha Sharma"}</h3>
              <span className="learner-tier-badge">Tier 2: Intermediate</span>
            </div>
            <p className="user-email-text">{user?.email || "sneha.learner@flux.ai"}</p>
            <div className="profile-meta-pills">
              <span>🎯 Target: <b>{learningGoal}</b></span>
              <span>🔥 Streak: <b>7 Days</b></span>
              <span>⏱ Study Time: <b>28.5 hrs</b></span>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Grid: Strengths vs AI Recommendations */}
      <div className="two-col">
        {/* Strengths */}
        <div className="card">
          <div className="card-title">
            <div>
              <span className="eyebrow">CONFIRMED STRENGTHS</span>
              <h3>Mastered Competencies</h3>
            </div>
            <Award size={18} className="text-accent" />
          </div>

          <div className="strengths-list">
            {[
              { skill: "Dynamic Arrays & Hashing", val: 92, note: "Top 94th percentile" },
              { skill: "Iterative Logic & Loops", val: 86, note: "Zero syntax/logic errors" },
              { skill: "Call Stack Recursion", val: 81, note: "Base case clarity verified" },
            ].map((s) => (
              <div key={s.skill} className="profile-skill-row">
                <div className="flex-between s-head">
                  <strong>{s.skill}</strong>
                  <span className="s-score text-success">{s.val}% Mastered</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${s.val}%` }}></div>
                </div>
                <small className="s-note">{s.note}</small>
              </div>
            ))}
          </div>
        </div>

        {/* AI Action Recommendations */}
        <div className="card">
          <div className="card-title">
            <div>
              <span className="eyebrow">NEURAL RECOMMENDATIONS</span>
              <h3>Action Plan For Today</h3>
            </div>
            <Sparkles size={18} className="sparkle-icon" />
          </div>

          <div className="recommend-list">
            <div className="recommend-box gap-alert" onClick={() => setPage("path")}>
              <div className="r-icon">⚡</div>
              <div className="r-body">
                <strong>Remediate Time Complexity Bounds</strong>
                <p>Complete 15-min Asymptotic analysis module to unlock Binary Search.</p>
                <span className="r-action">Go to module →</span>
              </div>
            </div>

            <div className="recommend-box" onClick={() => setPage("quiz")}>
              <div className="r-icon">🎯</div>
              <div className="r-body">
                <strong>Solve 8 Adaptive Practice Questions</strong>
                <p>Maintain your 7-day consistency multiplier and claim 120 XP.</p>
                <span className="r-action">Start practice →</span>
              </div>
            </div>

            <div className="recommend-box" onClick={() => setPage("tutor")}>
              <div className="r-icon">🤖</div>
              <div className="r-body">
                <strong>Deepen Dynamic Programming Intuition</strong>
                <p>Ask AI Tutor to contrast Memoization (top-down) vs Tabulation (bottom-up).</p>
                <span className="r-action">Open chat →</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
