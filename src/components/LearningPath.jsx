import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Lock,
  Play,
  Sparkles,
  Zap,
  ArrowRight,
  ArrowLeft,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  Bot,
  Target,
  Layers,
  Plus,
  FileText,
} from "lucide-react";
import { getSubjectsForUser, getAgeBandInfo } from "../data/subjectRegistry";
import AddSubjectModal from "./AddSubjectModal";

export default function LearningPath({
  setPage,
  user,
  initialSubjectId = null,
  onSelectSubject = null,
  onAddCustomSubject = null,
}) {
  const [selectedSubjectId, setSelectedSubjectId] = useState(initialSubjectId);
  const [expandedId, setExpandedId] = useState(3);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);

  // Sync if initialSubjectId prop changes
  useEffect(() => {
    if (initialSubjectId && initialSubjectId !== selectedSubjectId) {
      setSelectedSubjectId(initialSubjectId);
      setExpandedId(3);
    }
  }, [initialSubjectId]);

  const ageBandInfo = getAgeBandInfo(user?.age || "16");
  const availableSubjects = getSubjectsForUser(user);

  // Build pathways map from available subjects
  const pathwaysMap = {};
  availableSubjects.forEach((s) => {
    const nodes = (s.pathNodes && s.pathNodes.length)
      ? s.pathNodes
      : [
          { id: 1, name: "Foundational Axioms & Vocabulary", status: "done", score: "92% Mastery", desc: `Core definitions and terminology in ${s.name}.`, duration: "35 min", topics: ["Terminology Baseline", "Core Definitions"] },
          { id: 2, name: "Structural Frameworks & Mechanics", status: "done", score: "86% Mastery", desc: `Systematic problem decomposition in ${s.name}.`, duration: "45 min", topics: ["Decomposition", "First Principles"] },
          { id: 3, name: "Applied Practice & Case Diagnostics", status: "current", score: "49% • Active Focus", desc: `Solving complex problems and verifying solutions in ${s.name}.`, duration: "45 min", topics: ["Real-world application", "Error reduction"], highlight: true },
          { id: 4, name: "Advanced Synthesis & Mastery", status: "locked", score: "Unlocks Next", desc: `Comprehensive project and examination level mastery in ${s.name}.`, duration: "60 min", topics: ["Higher-order synthesis", "Peer evaluation"] },
        ];

    const completed = nodes.filter((n) => n.status === "done").length;
    const total = nodes.length;
    const pct = Math.round((completed / total) * 100);
    const focusNode = nodes.find((n) => n.highlight) || nodes.find((n) => n.status === "current") || nodes[0];

    pathwaysMap[s.id] = {
      ...s,
      path: nodes,
      totalModules: total,
      completedModules: completed,
      completionPct: pct,
      estHours: `~${(total * 1.2).toFixed(1)} Study Hours`,
      bottleneck: focusNode ? focusNode.name : "Core Synthesis",
      bottleneckDesc: `Resolving unlocks subsequent milestones in ${s.name}`,
    };
  });

  const activeSubject = selectedSubjectId ? pathwaysMap[selectedSubjectId] : null;

  const handleSelectSubject = (id) => {
    setSelectedSubjectId(id);
    const subjNodes = pathwaysMap[id]?.path || [];
    const focusNode = subjNodes.find((n) => n.highlight) || subjNodes.find((n) => n.status === "current") || subjNodes[0];
    setExpandedId(focusNode ? focusNode.id : 1);
    if (onSelectSubject) onSelectSubject(id);
  };

  const handleBackToSubjectList = () => {
    setSelectedSubjectId(null);
    if (onSelectSubject) onSelectSubject(null);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleCustomSubjectCreated = (newSubj) => {
    if (onAddCustomSubject) {
      onAddCustomSubject(newSubj);
    }
    handleSelectSubject(newSubj.id);
  };

  // 1. SUBJECT SELECTION SCREEN (When no subject is chosen yet)
  if (!selectedSubjectId || !activeSubject) {
    return (
      <div className="learning-path-view">
        <div className="section-heading">
          <div className="flex-between heading-top">
            <span className="eyebrow">{ageBandInfo.bandLabel.toUpperCase()}</span>
            <div className="flex-row-gap">
              <span className="step-counter-tag">
                {availableSubjects.length} Pathways Calibrated for Age {user?.age || "16"}
              </span>
              <button
                type="button"
                className="primary-btn-sm"
                onClick={() => setIsAddSubjectOpen(true)}
              >
                <Plus size={14} />
                <span>+ Add Subject</span>
              </button>
            </div>
          </div>
          <h2>Select a Subject to View Your Learning Path</h2>
          <p>
            Real-world classroom curriculum progression for <b>{ageBandInfo.tierLabel}</b>. Explore
            unlocked milestones, active focus bottlenecks, and prerequisite dependencies.
          </p>
        </div>

        <div className="subject-cards-selection-grid">
          {availableSubjects.map((subj) => {
            const IconComponent = subj.icon || BookOpen;
            const pathInfo = pathwaysMap[subj.id] || {};
            return (
              <div
                key={subj.id}
                className="subject-select-card card"
                onClick={() => handleSelectSubject(subj.id)}
              >
                <div className="subj-card-top flex-between">
                  <div
                    className="subj-icon-orb"
                    style={{ color: subj.color, background: `${subj.color}1a` }}
                  >
                    <IconComponent size={24} />
                  </div>
                  <div className="flex-row-gap">
                    {subj.is_custom && <span className="custom-indicator-badge">Custom</span>}
                    <span className="subj-grade-badge">{subj.gradeRange}</span>
                  </div>
                </div>

                <div className="subj-card-body">
                  <h3>{subj.name}</h3>
                  <p>{subj.desc}</p>
                </div>

                {/* Progress bar preview */}
                <div className="subj-path-preview-stats">
                  <div className="flex-between subj-progress-meta">
                    <span className="subj-prog-label">Curriculum Progress</span>
                    <span className="subj-prog-val" style={{ color: subj.color }}>
                      {pathInfo.completedModules}/{pathInfo.totalModules} Modules ({pathInfo.completionPct}%)
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${pathInfo.completionPct}%`,
                        background: `linear-gradient(90deg, #9d4edd, ${subj.color})`,
                      }}
                    />
                  </div>
                </div>

                <div className="subj-bottleneck-chip">
                  <Target size={12} style={{ color: subj.color }} />
                  <span>
                    Focus: <b>{pathInfo.bottleneck}</b>
                  </span>
                </div>

                {subj.is_custom && subj.media?.length > 0 && (
                  <div className="custom-media-chip">
                    <FileText size={13} style={{ color: subj.color }} />
                    <span>{subj.media.length} reference note(s) attached</span>
                  </div>
                )}

                <div className="subj-card-foot flex-between">
                  <span className="subj-time-tag">
                    <Clock size={13} /> {pathInfo.estHours}
                  </span>
                  <button className="primary-btn-sm">
                    <span>Explore Pathway</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Custom Subject Modal */}
        <AddSubjectModal
          isOpen={isAddSubjectOpen}
          onClose={() => setIsAddSubjectOpen(false)}
          onAddCustomSubject={handleCustomSubjectCreated}
        />
      </div>
    );
  }

  // 2. ACTIVE PERSONALIZED LEARNING PATHWAY SCREEN
  const SubjectIcon = activeSubject.icon || BookOpen;

  return (
    <div className="learning-path-view">
      {/* Subject Header & Switcher Strip */}
      <div className="active-subject-header-strip flex-between">
        <button className="back-subj-btn" onClick={handleBackToSubjectList}>
          <ArrowLeft size={16} />
          <span>Switch Subject</span>
        </button>

        <div className="active-subj-pill">
          <SubjectIcon size={16} style={{ color: activeSubject.color }} />
          <strong>{activeSubject.name}</strong>
          {activeSubject.is_custom && <span className="custom-indicator-badge">Custom</span>}
          <span className="pill-status-dot" style={{ background: activeSubject.color }} />
          <span>Adaptive Graph Active</span>
        </div>

        <div className="subject-quick-chips">
          {Object.keys(pathwaysMap).map((id) => (
            <button
              key={id}
              className={`chip-min ${id === selectedSubjectId ? "active" : ""}`}
              onClick={() => handleSelectSubject(id)}
            >
              {pathwaysMap[id].name.split(" ")[0]}
            </button>
          ))}
          <button
            type="button"
            className="chip-min add-quick-chip"
            onClick={() => setIsAddSubjectOpen(true)}
          >
            + Add
          </button>
        </div>
      </div>

      <div className="section-heading">
        <div className="flex-between heading-top">
          <span className="eyebrow">{activeSubject.name.toUpperCase()} • AI ROADMAP</span>
          <span className="live-badge">REAL-TIME ADAPTIVE GRAPH</span>
        </div>
        <h2>{activeSubject.name} Learning Pathway</h2>
        <p>
          LearnFlux dynamically reorders your prerequisites. Nodes are automatically unlocked as your
          knowledge gaps are resolved.
        </p>
      </div>

      {/* Pathway Overview Stats Banner */}
      <div className="card path-stats-banner">
        <div className="path-stat-col">
          <span className="p-label">PATHWAY COMPLETION</span>
          <strong className="p-val">
            {activeSubject.completedModules} / {activeSubject.totalModules} Modules ({activeSubject.completionPct}%)
          </strong>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${activeSubject.completionPct}%`,
                background: `linear-gradient(90deg, #9d4edd, ${activeSubject.color})`,
              }}
            />
          </div>
        </div>
        <div className="path-stat-col">
          <span className="p-label">ESTIMATED TIME TO COMPLETION</span>
          <strong className="p-val">{activeSubject.estHours}</strong>
          <small>At your average 30–45 min/day pace</small>
        </div>
        <div className="path-stat-col">
          <span className="p-label">PRIMARY BOTTLENECK</span>
          <strong className="p-val" style={{ color: activeSubject.color }}>
            {activeSubject.bottleneck}
          </strong>
          <small>{activeSubject.bottleneckDesc}</small>
        </div>
      </div>

      {/* Interactive Path Timeline */}
      <div className="path-timeline">
        {activeSubject.path.map((item, idx) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className={`path-node-card card ${item.status} ${
                item.highlight ? "highlight-node" : ""
              }`}
              style={
                item.highlight
                  ? { borderColor: activeSubject.color, boxShadow: `0 0 25px ${activeSubject.color}22` }
                  : {}
              }
            >
              <div className="node-main-row" onClick={() => toggleExpand(item.id)}>
                <div className="node-icon-wrap">
                  {item.status === "done" && <span className="icon-done">✓</span>}
                  {item.status === "current" && (
                    <span className="icon-current" style={{ color: activeSubject.color }}>
                      <Sparkles size={16} />
                    </span>
                  )}
                  {item.status === "locked" && <Lock size={15} className="icon-locked" />}
                </div>

                <div className="node-body">
                  <div className="flex-between node-title-row">
                    <h4>
                      <span className="node-step-num">0{idx + 1}.</span> {item.name}
                    </h4>
                    <span className={`status-pill ${item.status}`}>
                      {item.status === "done"
                        ? "MASTERED"
                        : item.status === "current"
                        ? "CURRENT FOCUS"
                        : "LOCKED"}
                    </span>
                  </div>
                  <p className="node-desc">{item.desc}</p>

                  <div className="node-meta-row">
                    <span className="node-score-tag">✦ {item.score}</span>
                    <span className="node-time-tag">
                      <Clock size={12} /> {item.duration}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="expand-node-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(item.id);
                  }}
                >
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>

              {/* Expandable Module Details */}
              {isExpanded && (
                <div className="node-expanded-panel">
                  <div className="expanded-divider" />
                  <div className="expanded-content">
                    <span className="expanded-title">Learning Objectives & Prerequisites:</span>
                    <ul className="topics-list">
                      {(item.topics || ["Core Conceptual Mastery", "Analytical Problem Formulation"]).map((top, tIdx) => (
                        <li key={tIdx}>
                          <span className="check-dot" style={{ color: activeSubject.color }}>
                            ✦
                          </span>
                          <span>{top}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="node-actions-row">
                      {item.status === "current" && (
                        <>
                          <button
                            className="primary-btn-sm"
                            onClick={() => {
                              if (onSelectSubject) onSelectSubject(activeSubject.id);
                              setPage("quiz");
                            }}
                          >
                            <Zap size={14} />
                            <span>Start Adaptive Quiz (3 min)</span>
                          </button>
                          <button
                            className="ghost-btn-sm"
                            onClick={() => setPage("tutor")}
                          >
                            <Bot size={14} />
                            <span>Ask AI Tutor to Explain</span>
                          </button>
                        </>
                      )}

                      {item.status === "done" && (
                        <button
                          className="outline-btn-sm"
                          onClick={() => {
                            if (onSelectSubject) onSelectSubject(activeSubject.id);
                            setPage("quiz");
                          }}
                        >
                          Review Flash Quiz
                        </button>
                      )}

                      {item.status === "locked" && (
                        <span className="locked-hint">
                          🔒 Complete "{activeSubject.bottleneck}" to unlock this milestone.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer action */}
      <div className="path-footer-action card flex-between">
        <div>
          <strong>Ready to advance in {activeSubject.name}?</strong>
          <p>
            Complete the <b>{activeSubject.bottleneck}</b> adaptive quiz to automatically unlock subsequent milestones.
          </p>
        </div>
        <div className="flex-row-gap">
          <button className="outline-btn" onClick={handleBackToSubjectList}>
            <span>← Switch Subject</span>
          </button>
          <button
            className="primary-btn"
            onClick={() => {
              if (onSelectSubject) onSelectSubject(activeSubject.id);
              setPage("quiz");
            }}
          >
            <span>Launch Adaptive Quiz</span>
            <ArrowRight size={17} />
          </button>
        </div>
      </div>

      {/* Add Custom Subject Modal */}
      <AddSubjectModal
        isOpen={isAddSubjectOpen}
        onClose={() => setIsAddSubjectOpen(false)}
        onAddCustomSubject={handleCustomSubjectCreated}
      />
    </div>
  );
}
