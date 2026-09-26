import React, { useState, useEffect } from "react";
import KnowledgeMap from "./KnowledgeMap";
import InteractiveSphere from "./InteractiveSphere";
import FluxBot from "./FluxBot";
import MultiModalHub from "./MultiModalHub";
import {
  ArrowUpRight,
  Target,
  Trophy,
  AlertTriangle,
  Flame,
  Sparkles,
  BookOpen,
  Play,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Zap,
  GraduationCap,
  Activity,
  Layers,
  Plus,
} from "lucide-react";
import { backendApi } from "../services/backendApi";
import { getSubjectsForUser, getAgeBandInfo } from "../data/subjectRegistry";
import AddSubjectModal from "./AddSubjectModal";

export default function Dashboard({ setPage, user, onAskAITutor, onSelectSubject, onAddCustomSubject }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [mistakeDNA, setMistakeDNA] = useState({ conceptual: 4, calculation: 1, careless: 2, application: 1 });
  const [nextBestAction, setNextBestAction] = useState(null);
  const [activeSubtopicForStudy, setActiveSubtopicForStudy] = useState("sub-cs-complexity");
  const [loading, setLoading] = useState(true);

  // Daily focus tasks
  const [tasks, setTasks] = useState([
    { id: 1, text: "Focus Gap • Remediation Practice", duration: "15 min", xp: "+50 XP", done: false, type: "gap" },
    { id: 2, text: "Adaptive Quiz • 8 Pattern Questions", duration: "20 min", xp: "+80 XP", done: false, type: "quiz" },
    { id: 3, text: "Flashcard Recall • 10 Core Cards", duration: "10 min", xp: "+30 XP", done: true, type: "tutor" },
  ]);

  useEffect(() => {
    async function loadStudentData() {
      setLoading(true);
      const studentId = user?.id || "student-arjun";
      const fullProfile = await backendApi.getFullProfile(studentId);
      setDashboardData(fullProfile.dashboardData);
      setMistakeDNA(fullProfile.mistakeDNA);
      setNextBestAction(fullProfile.nextBestAction);
      if (fullProfile.nextBestAction?.subtopicId) {
        setActiveSubtopicForStudy(fullProfile.nextBestAction.subtopicId);
      }
      setLoading(false);
    }
    loadStudentData();
  }, [user]);

  const toggleTask = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const handleFluxBotRedirect = (customPrompt) => {
    if (onAskAITutor) {
      onAskAITutor(customPrompt);
    } else {
      setPage("tutor");
    }
  };

  const handleMasteryUpdated = (result) => {
    if (result?.mistakeDNA) {
      setMistakeDNA(result.mistakeDNA);
    }
  };

  const totalMistakes =
    (mistakeDNA.conceptual || 0) +
    (mistakeDNA.calculation || 0) +
    (mistakeDNA.careless || 0) +
    (mistakeDNA.application || 0) || 1;

  return (
    <div className="dashboard-view">
      {/* Student Profile Top Bar with Grade & Age Badge */}
      <div className="student-profile-strip card flex-between">
        <div className="student-identity-col">
          <div className="student-avatar-orb" style={{ background: user?.avatar_color || "#8b5cf6" }}>
            {user?.display_name ? user.display_name[0].toUpperCase() : user?.name ? user.name[0].toUpperCase() : "A"}
          </div>
          <div>
            <div className="student-title-row">
              <h3>{user?.display_name || user?.name || "Arjun Sharma"}</h3>
              <span className="grade-pill">
                <GraduationCap size={13} /> Grade {user?.grade_level || 10} • Age {user?.age || 15}
              </span>
              <span className="goal-pill">🎯 {user?.learning_goal || "Exam Prep"}</span>
            </div>
            <p className="student-subtext">Supabase RLS Session: Active • Curated Grade {user?.grade_level || 10} Stream</p>
          </div>
        </div>

        <div className="student-stats-strip">
          <div className="strip-metric">
            <Flame size={16} className="text-warning" />
            <span>{user?.streak_days || 14} Day Streak!</span>
          </div>
          <div className="strip-metric">
            <Trophy size={16} className="text-accent" />
            <span>Rank #4 in Grade {user?.grade_level || 10}</span>
          </div>
        </div>
      </div>

      {/* Next-Best-Action Hero Card */}
      <div className="next-action-hero card">
        <div className="hero-banner-content">
          <div className="kicker-pill">
            <Sparkles size={14} />
            <span>NEXT-BEST-ACTION • KNOWLEDGE GRAPH BOTTLENECK</span>
          </div>
          <h2>
            Focus Area: <span>{nextBestAction?.subtopicName || "Time Complexity & Big-O"}</span>
          </h2>
          <p>
            {nextBestAction?.reason || "Identified as primary knowledge bottleneck across your prerequisite graph."}{" "}
            Resolving this concept unlocks 4 subsequent topics.
          </p>
          <div className="banner-actions">
            <button
              className="primary-btn"
              onClick={() => {
                setActiveSubtopicForStudy(nextBestAction?.subtopicId || "sub-cs-complexity");
                const el = document.getElementById("multi-modal-hub-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span>Start Multi-Modal Practice</span>
              <ArrowUpRight size={17} />
            </button>
            <button className="ghost-btn banner-ghost" onClick={() => setPage("tutor")}>
              <Sparkles size={17} />
              <span>Ask AI Tutor to Explain</span>
            </button>
          </div>
        </div>

        {/* 3D Mouse Cursor-Tracking Sphere */}
        <div className="hero-orb-wrap">
          <InteractiveSphere
            score={`${nextBestAction?.currentMastery || 48}%`}
            label="MASTERY INDEX"
          />
        </div>
      </div>

      {/* Robot Companion: Flux Bot */}
      <FluxBot onRedirectToTutor={handleFluxBotRedirect} />

      {/* Mistake DNA & Analytics Panel */}
      <div className="two-col">
        {/* Mistake DNA Profiler Card */}
        <div className="card mistake-dna-card">
          <div className="card-title">
            <div>
              <span className="eyebrow">COGNITIVE ERROR PROFILING</span>
              <h3>Student Mistake DNA</h3>
            </div>
            <Activity size={18} className="text-accent" />
          </div>
          <p className="dna-subtext">
            Our engine categorizes errors into four cognitive types to prescribe targeted remediation:
          </p>

          <div className="dna-bars-list">
            {[
              { label: "Conceptual Error (Missing prerequisite intuition)", count: mistakeDNA.conceptual, color: "#f43f5e" },
              { label: "Calculation Error (Arithmetic or sign mistake)", count: mistakeDNA.calculation, color: "#f59e0b" },
              { label: "Careless Error (Misread question or hasty answer)", count: mistakeDNA.careless, color: "#38bdf8" },
              { label: "Application Error (Formula used in wrong scenario)", count: mistakeDNA.application, color: "#c084fc" },
            ].map((dna) => {
              const pct = Math.round((dna.count / totalMistakes) * 100);
              return (
                <div key={dna.label} className="dna-bar-item">
                  <div className="flex-between dna-meta-row">
                    <span className="dna-label">{dna.label}</span>
                    <strong style={{ color: dna.color }}>{dna.count} ({pct}%)</strong>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: dna.color }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="dna-foot-hint">
            💡 <b>AI Diagnosis</b>: Conceptual misconceptions are your primary bottleneck. Reviewing fundamental notes before quizzing reduces errors by 38%.
          </div>
        </div>

        {/* Daily Goals & Today's Schedule */}
        <div className="card focus-card">
          <div className="card-title">
            <div>
              <span className="eyebrow">DAILY TARGET: 45 MIN</span>
              <h3>Today's Learning Goals</h3>
            </div>
            <span className="xp-pill">+160 XP Total</span>
          </div>

          <div className="focus-list">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`focus-item ${task.done ? "done" : ""}`}
                onClick={() => toggleTask(task.id)}
              >
                <button
                  type="button"
                  className={`task-checkbox ${task.done ? "checked" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTask(task.id);
                  }}
                >
                  {task.done ? <CheckCircle2 size={16} /> : <div className="checkbox-empty" />}
                </button>
                <div className="task-content">
                  <span className="task-text">{task.text}</span>
                  <div className="task-meta">
                    <span className="task-time"><Clock size={12} /> {task.duration}</span>
                    <span className="task-xp">{task.xp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="primary-btn-sm full-w" onClick={() => setPage("quiz")}>
            Start Daily Focus Goal
          </button>
        </div>
      </div>

      {/* Multi-Modal Resource Hub (Notes, Mind Maps, Flashcards, Quiz Sandbox) */}
      <div id="multi-modal-hub-section">
        <MultiModalHub
          subtopicId={activeSubtopicForStudy}
          studentId={user?.id || "student-arjun"}
          onMasteryUpdated={handleMasteryUpdated}
        />
      </div>

      {/* Grade-Curated Subjects & Knowledge Map */}
      <div className="two-col">
        <KnowledgeMap />

        <div className="card path-preview-card">
          <div className="card-title flex-between">
            <div>
              <span className="eyebrow">
                AGE {user?.age || "16"} • {getAgeBandInfo(user?.age || "16").bandLabel.toUpperCase()}
              </span>
              <h3>Registered Subjects & Curriculum</h3>
            </div>
            <div className="flex-row-gap">
              <button
                type="button"
                className="primary-btn-sm"
                onClick={() => setIsAddSubjectOpen(true)}
              >
                <Plus size={14} />
                <span>+ Add Subject</span>
              </button>
              <button className="text-link-small" onClick={() => setPage("courses")}>
                Courses →
              </button>
            </div>
          </div>

          <div className="path-preview-list">
            {getSubjectsForUser(user).map((subj, idx) => (
              <div
                key={subj.id || idx}
                className="path-line-item done clickable-path-item"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  if (onSelectSubject) onSelectSubject(subj.id);
                  setPage("path");
                }}
              >
                <div className="path-line-badge" style={{ borderColor: subj.color, color: subj.color }}>
                  {idx + 1}
                </div>
                <div className="path-line-info">
                  <div className="flex-between">
                    <strong>{subj.name}</strong>
                    {subj.is_custom && <span className="custom-indicator-badge">Custom</span>}
                  </div>
                  <small>{subj.desc || subj.description}</small>
                </div>
                <span className="status-pill done" style={{ borderColor: subj.color, color: subj.color }}>
                  VIEW PATH →
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Custom Subject Modal */}
      <AddSubjectModal
        isOpen={isAddSubjectOpen}
        onClose={() => setIsAddSubjectOpen(false)}
        onAddCustomSubject={(newSubj) => {
          if (onAddCustomSubject) onAddCustomSubject(newSubj);
          if (onSelectSubject) onSelectSubject(newSubj.id);
        }}
      />
    </div>
  );
}
