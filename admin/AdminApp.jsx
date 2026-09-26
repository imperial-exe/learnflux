// admin/AdminApp.jsx — Standalone Admin Panel for LearnFlux AI
// Displays all stored data including the 4 Demo Accounts (Priya, Arjun, Meera, Sneha)

import React, { useState, useEffect, useMemo } from "react";
import {
  Database, RefreshCw, Download, Trash2, Search,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Users, BookOpen, Activity, Zap, BarChart3, Clock,
  AlertTriangle, CheckCircle, Copy, Eye, Code2, Table2,
  LayoutDashboard, LogOut, HelpCircle, Award, Target,
  Flame, Sparkles, Filter, Check, ArrowUpRight, GraduationCap,
} from "lucide-react";

import { seedDatabase } from "../src/data/seedDatabase.js";

const LOCAL_STORAGE_KEY = "learnflux_supabase_db_v2";

// ─── Direct Storage Access with Auto-Seed ─────────────────────────────────────
function readAllData() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      // Auto-seed so demo accounts are IMMEDIATELY visible!
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(seedDatabase));
      return seedDatabase;
    }
    const parsed = JSON.parse(raw);
    // If profiles array is empty or missing, populate with seedDatabase
    if (!parsed.profiles || parsed.profiles.length === 0) {
      const merged = { ...seedDatabase, ...parsed, profiles: seedDatabase.profiles };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
    return parsed;
  } catch (e) {
    console.error("Error reading localStorage, using seedDatabase:", e);
    return seedDatabase;
  }
}

function clearData() {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}

function reseedAllData() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(seedDatabase));
  return seedDatabase;
}

// ─── Table metadata definitions ───────────────────────────────────────────────
const TABLE_META = [
  { key: "profiles",          label: "User Profiles",       icon: Users,        color: "#a78bfa" },
  { key: "subjects",          label: "Subjects",             icon: BookOpen,      color: "#34d399" },
  { key: "student_progress",  label: "Student Progress",     icon: Activity,      color: "#fbbf24" },
  { key: "attempts",          label: "Quiz Attempts",        icon: Zap,           color: "#f87171" },
  { key: "mastery_snapshots", label: "Mastery Snapshots",    icon: BarChart3,     color: "#67e8f9" },
  { key: "study_sessions",    label: "Study Sessions",       icon: Clock,         color: "#fb923c" },
  { key: "flashcard_decks",   label: "Flashcard Decks",      icon: BookOpen,      color: "#c084fc" },
  { key: "questions",         label: "Question Bank",        icon: HelpCircle,    color: "#2dd4bf" },
];

const PAGE_SIZE = 12;

// ─── Cell value formatter ─────────────────────────────────────────────────────
function CellVal({ val }) {
  if (val === null || val === undefined)
    return <span style={{ color: "#374151" }}>—</span>;
  if (typeof val === "boolean")
    return <span style={{ color: val ? "#34d399" : "#f87171", fontWeight: 600 }}>{String(val)}</span>;
  if (typeof val === "object") {
    return (
      <details>
        <summary style={{ cursor: "pointer", color: "#a78bfa", fontSize: 11, userSelect: "none" }}>
          {Array.isArray(val) ? `[…${val.length} items]` : `{…${Object.keys(val).length} keys}`}
        </summary>
        <pre style={{
          color: "#d1d5db", fontSize: 10.5, marginTop: 6, background: "#0a0814",
          padding: "8px", borderRadius: 6, maxHeight: 150, overflow: "auto",
          border: "1px solid #241c2d",
        }}>
          {JSON.stringify(val, null, 2)}
        </pre>
      </details>
    );
  }
  const s = String(val);
  if (/^\d{4}-\d{2}-\d{2}T/.test(s)) {
    const d = new Date(s);
    return <span title={s} style={{ color: "#67e8f9", fontSize: 11 }}>{d.toLocaleString("en-IN")}</span>;
  }
  if (/^#[0-9a-fA-F]{6}$/.test(s)) {
    return (
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 13, height: 13, borderRadius: 3, background: s, border: "1px solid #374151", display: "inline-block" }} />
        <span style={{ color: "#e5e7eb" }}>{s}</span>
      </span>
    );
  }
  if (typeof val === "number" && val >= 0 && val <= 100) {
    const color = val >= 80 ? "#34d399" : val >= 50 ? "#fbbf24" : "#f87171";
    return (
      <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <span style={{ color, fontWeight: 600 }}>{val}%</span>
        <span style={{ width: 44, height: 4, background: "#1f2937", borderRadius: 2, display: "inline-block", overflow: "hidden" }}>
          <span style={{ display: "block", width: `${val}%`, height: "100%", background: color, borderRadius: 2 }} />
        </span>
      </span>
    );
  }
  return <span style={{ color: "#e5e7eb" }}>{s}</span>;
}

// ─── Reusable Data Table Component ────────────────────────────────────────────
function DataTable({ rows, meta, studentFilter, onStudentFilterChange, profiles = [] }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [view, setView] = useState("table"); // "table" | "json"
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const cols = rows.length > 0 ? Object.keys(rows[0]) : [];
  const hasStudentCol = cols.includes("student_id") || cols.includes("id");

  const filtered = useMemo(() => {
    let result = rows;
    if (studentFilter && studentFilter !== "all") {
      result = result.filter(r => (r.student_id === studentFilter || r.id === studentFilter));
    }
    if (!search.trim()) return result;
    const q = search.toLowerCase();
    return result.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(q)));
  }, [rows, search, studentFilter]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? ""; const bv = b[sortKey] ?? "";
      const c = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === "asc" ? c : -c;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (col) => {
    if (sortKey === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(col); setSortDir("asc"); }
    setPage(1);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(rows, null, 2));
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${meta.key}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const Icon = meta.icon;

  return (
    <div className="adm-table-card" style={{ "--accent-c": meta.color }}>
      {/* Card Header */}
      <div className="adm-card-header" onClick={() => setCollapsed(c => !c)}>
        <div className="adm-card-title">
          <div className="adm-card-icon" style={{ background: `${meta.color}22`, color: meta.color }}>
            <Icon size={15} />
          </div>
          {meta.label}
          <span className="adm-badge adm-badge-rows">{rows.length} rows</span>
          <span className="adm-badge adm-badge-cols">{cols.length} cols</span>
        </div>
        <div className="adm-card-controls" onClick={e => e.stopPropagation()}>
          {/* View toggle */}
          <button
            className="adm-icon-btn"
            title={view === "table" ? "JSON view" : "Table view"}
            onClick={() => setView(v => v === "table" ? "json" : "table")}
          >
            {view === "table" ? <Code2 size={13} /> : <Table2 size={13} />}
          </button>
          {/* Search */}
          <div className="adm-search-wrap">
            <Search size={11} />
            <input
              className="adm-search"
              placeholder="Search…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          {/* Copy */}
          <button className="adm-icon-btn" title="Copy JSON" onClick={handleCopy}>
            {copied ? <CheckCircle size={13} style={{ color: "#34d399" }} /> : <Copy size={13} />}
          </button>
          {/* Download */}
          <button className="adm-icon-btn" title="Download JSON" onClick={handleDownload}>
            <Download size={13} />
          </button>
          {/* Collapse */}
          <button className="adm-icon-btn" onClick={() => setCollapsed(c => !c)}>
            {collapsed ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
          </button>
        </div>
      </div>

      {/* Filter by Demo Student row (if applicable) */}
      {!collapsed && hasStudentCol && profiles.length > 0 && (
        <div className="adm-student-filter-bar">
          <span className="filter-label"><Filter size={11} /> Filter by Demo Student:</span>
          <button
            className={`filter-chip ${!studentFilter || studentFilter === "all" ? "active" : ""}`}
            onClick={() => onStudentFilterChange && onStudentFilterChange("all")}
          >
            All Students ({rows.length})
          </button>
          {profiles.map(p => {
            const count = rows.filter(r => r.student_id === p.id || r.id === p.id).length;
            return (
              <button
                key={p.id}
                className={`filter-chip ${studentFilter === p.id ? "active" : ""}`}
                style={{ "--chip-color": p.avatar_color }}
                onClick={() => onStudentFilterChange && onStudentFilterChange(p.id)}
              >
                <span className="chip-avatar-dot" style={{ background: p.avatar_color }} />
                <span>{p.name || p.display_name}</span>
                <span className="chip-count">{count}</span>
              </button>
            );
          })}
        </div>
      )}

      {!collapsed && (
        <>
          {view === "json" ? (
            <pre className="adm-json-view">{JSON.stringify(rows, null, 2)}</pre>
          ) : (
            <>
              <div className="adm-table-scroll">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th style={{ width: 38, color: "#4b5563" }}>#</th>
                      {cols.map(col => (
                        <th key={col} onClick={() => handleSort(col)}>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            {col}
                            {sortKey === col
                              ? sortDir === "asc" ? <ChevronUp size={10} /> : <ChevronDown size={10} />
                              : <ChevronDown size={10} style={{ opacity: 0.25 }} />}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((row, i) => (
                      <tr key={i}>
                        <td style={{ color: "#4b5563", fontSize: 11 }}>{(page - 1) * PAGE_SIZE + i + 1}</td>
                        {cols.map(col => (
                          <td key={col}><CellVal val={row[col]} /></td>
                        ))}
                      </tr>
                    ))}
                    {paged.length === 0 && (
                      <tr>
                        <td colSpan={cols.length + 1} style={{ textAlign: "center", color: "#4b5563", padding: "28px 0" }}>
                          No records match {search ? `"${search}"` : "the selected filter"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="adm-pagination">
                  <span className="adm-pg-info">
                    Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length}
                  </span>
                  <div className="adm-pg-btns">
                    <button className="adm-pg-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                      <ChevronLeft size={13} />
                    </button>
                    {Array.from({ length: Math.min(totalPages, 8) }, (_, i) => i + 1).map(p => (
                      <button key={p} className={`adm-pg-btn ${page === p ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
                    ))}
                    {totalPages > 8 && page < totalPages && <span style={{ color: "#4b5563", alignSelf: "center" }}>…</span>}
                    <button className="adm-pg-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

// ─── 4 Demo Profiles Interactive Detail View ──────────────────────────────────
function DemoProfilesView({ db, onSelectStudentTab }) {
  const profiles = db.profiles || [];
  const [selectedStudentId, setSelectedStudentId] = useState(profiles[0]?.id || "student-priya");

  const currentStudent = profiles.find(p => p.id === selectedStudentId) || profiles[0];

  const studentProgress = (db.student_progress || []).filter(p => p.student_id === currentStudent?.id);
  const studentSessions = (db.study_sessions || []).filter(s => s.student_id === currentStudent?.id);
  const studentAttempts = (db.attempts || []).filter(a => a.student_id === currentStudent?.id);
  const studentSnapshots = (db.mastery_snapshots || []).filter(m => m.student_id === currentStudent?.id);

  // Calculate aggregated stats
  const avgMastery = studentProgress.length > 0
    ? Math.round(studentProgress.reduce((s, p) => s + (p.mastery || 0), 0) / studentProgress.length)
    : 80;

  const masteredCount = studentProgress.filter(p => p.status === "mastered" || p.mastery >= 80).length;

  // Aggregate Mistake DNA
  const mistakeDNA = { conceptual: 0, calculation: 0, careless: 0, application: 0 };
  studentProgress.forEach(p => {
    if (p.error_profile) {
      mistakeDNA.conceptual += p.error_profile.conceptual || 0;
      mistakeDNA.calculation += p.error_profile.calculation || 0;
      mistakeDNA.careless += p.error_profile.careless || 0;
      mistakeDNA.application += p.error_profile.application || 0;
    }
  });

  return (
    <div className="demo-profiles-container">
      <div className="profile-selector-header">
        <div>
          <h2 className="section-gradient-title">4 Demo Student Profiles</h2>
          <p className="section-subtext">
            Select any learner profile to inspect complete progress telemetry, Mistake DNA, study sessions, and attempts.
          </p>
        </div>
      </div>

      {/* 4 Demo Student Cards Selector */}
      <div className="demo-cards-grid">
        {profiles.map(p => {
          const isSelected = p.id === selectedStudentId;
          const prog = (db.student_progress || []).filter(sp => sp.student_id === p.id);
          const studentAvg = prog.length > 0
            ? Math.round(prog.reduce((s, item) => s + (item.mastery || 0), 0) / prog.length)
            : 75;

          return (
            <div
              key={p.id}
              className={`demo-card-item ${isSelected ? "selected" : ""}`}
              style={{ "--student-color": p.avatar_color }}
              onClick={() => setSelectedStudentId(p.id)}
            >
              <div className="demo-card-top">
                <div className="demo-avatar-circle" style={{ background: p.avatar_color }}>
                  {p.avatar_letter || p.name?.charAt(0) || "S"}
                </div>
                <div className="demo-card-meta">
                  <div className="demo-name">{p.name || p.display_name}</div>
                  <div className="demo-badges">
                    <span className="age-pill">Age {p.age}</span>
                    <span className="grade-pill">Grade {p.grade_level}</span>
                  </div>
                </div>
              </div>

              <div className="demo-goal">{p.learning_goal}</div>

              <div className="demo-card-stats">
                <div className="mini-stat">
                  <span className="stat-label">Mastery</span>
                  <span className="stat-value" style={{ color: p.avatar_color }}>{studentAvg}%</span>
                </div>
                <div className="mini-stat">
                  <span className="stat-label">Streak</span>
                  <span className="stat-value">🔥 {p.streak_days}d</span>
                </div>
                <div className="mini-stat">
                  <span className="stat-label">XP</span>
                  <span className="stat-value">⚡ {p.xp_points || 1200}</span>
                </div>
              </div>

              {isSelected && (
                <div className="selected-active-marker">
                  <Check size={12} /> Active Profile
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Student Telemetry View */}
      {currentStudent && (
        <div className="student-detail-panel" style={{ "--panel-accent": currentStudent.avatar_color }}>
          {/* Header Strip */}
          <div className="student-profile-strip">
            <div className="profile-identity">
              <div className="large-avatar" style={{ background: currentStudent.avatar_color }}>
                {currentStudent.avatar_letter || currentStudent.name?.charAt(0) || "S"}
              </div>
              <div>
                <h3 className="profile-display-name">{currentStudent.display_name || currentStudent.name}</h3>
                <div className="profile-meta-row">
                  <span><b>ID:</b> {currentStudent.id}</span>
                  <span>•</span>
                  <span><b>Email:</b> {currentStudent.email}</span>
                  <span>•</span>
                  <span><b>Age Band:</b> {currentStudent.age} Years</span>
                  <span>•</span>
                  <span><b>Grade:</b> {currentStudent.grade_level}</span>
                </div>
              </div>
            </div>

            <div className="student-summary-metrics">
              <div className="summary-pill">
                <span className="lbl">Average Mastery</span>
                <span className="val" style={{ color: currentStudent.avatar_color }}>{avgMastery}%</span>
              </div>
              <div className="summary-pill">
                <span className="lbl">Mastered Subtopics</span>
                <span className="val" style={{ color: "#34d399" }}>{masteredCount} of {studentProgress.length}</span>
              </div>
              <div className="summary-pill">
                <span className="lbl">Study Time</span>
                <span className="val">{currentStudent.total_study_minutes || 360} mins</span>
              </div>
            </div>
          </div>

          {/* Telemetry Grid */}
          <div className="telemetry-grid">
            {/* Mistake DNA Breakdown Card */}
            <div className="telemetry-card">
              <div className="tel-card-title">
                <Sparkles size={15} style={{ color: "#fbbf24" }} />
                <span>Mistake DNA Profile</span>
              </div>
              <div className="mistake-dna-grid">
                <div className="dna-cell conceptual">
                  <div className="dna-count">{mistakeDNA.conceptual}</div>
                  <div className="dna-label">Conceptual</div>
                </div>
                <div className="dna-cell calculation">
                  <div className="dna-count">{mistakeDNA.calculation}</div>
                  <div className="dna-label">Calculation</div>
                </div>
                <div className="dna-cell careless">
                  <div className="dna-count">{mistakeDNA.careless}</div>
                  <div className="dna-label">Careless</div>
                </div>
                <div className="dna-cell application">
                  <div className="dna-count">{mistakeDNA.application}</div>
                  <div className="dna-label">Application</div>
                </div>
              </div>
              <p className="dna-note">
                AI dynamically adapts problem difficulty and explanations based on dominant mistake taxonomy.
              </p>
            </div>

            {/* Subtopic Progress List */}
            <div className="telemetry-card span-2">
              <div className="tel-card-title">
                <Target size={15} style={{ color: "#67e8f9" }} />
                <span>Active Subtopic Mastery & Status</span>
              </div>
              <div className="subtopic-mastery-list">
                {studentProgress.map((p, idx) => (
                  <div key={idx} className="subtopic-row">
                    <div className="subtopic-info">
                      <div className="subtopic-name">{p.subtopic_name || p.subtopic_id}</div>
                      <span className={`status-badge ${p.status}`}>{p.status}</span>
                    </div>
                    <div className="mastery-bar-wrap">
                      <span className="mastery-pct">{p.mastery}%</span>
                      <div className="mastery-bar-bg">
                        <div
                          className="mastery-bar-fill"
                          style={{
                            width: `${p.mastery}%`,
                            background: p.mastery >= 80 ? "#34d399" : p.mastery >= 50 ? "#fbbf24" : "#f87171"
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {studentProgress.length === 0 && (
                  <div className="empty-sub">No progress records logged yet for this student.</div>
                )}
              </div>
            </div>
          </div>

          {/* Secondary Rows: Sessions & Attempts */}
          <div className="telemetry-grid" style={{ marginTop: 14 }}>
            {/* Study Sessions */}
            <div className="telemetry-card">
              <div className="tel-card-title">
                <Clock size={15} style={{ color: "#fb923c" }} />
                <span>Recent Study Sessions</span>
              </div>
              <div className="session-mini-list">
                {studentSessions.map((s, idx) => (
                  <div key={idx} className="session-item">
                    <div>
                      <div className="sess-topic">{s.subtopic_id}</div>
                      <div className="sess-date">{new Date(s.started_at).toLocaleDateString()} · {s.mode}</div>
                    </div>
                    <div className="sess-right">
                      <span className="sess-duration">{s.duration_mins}m</span>
                      {s.score && <span className="sess-score">{s.score}%</span>}
                    </div>
                  </div>
                ))}
                {studentSessions.length === 0 && (
                  <div className="empty-sub">No sessions recorded yet.</div>
                )}
              </div>
            </div>

            {/* Quiz Attempts */}
            <div className="telemetry-card span-2">
              <div className="tel-card-title">
                <Zap size={15} style={{ color: "#f87171" }} />
                <span>Question Bank & Quiz Attempts</span>
              </div>
              <div className="attempts-table-wrap">
                <table className="mini-attempts-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Subtopic</th>
                      <th>Difficulty</th>
                      <th>Result</th>
                      <th>Error Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentAttempts.map((a, idx) => (
                      <tr key={idx}>
                        <td style={{ color: "#6b7280" }}>{new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                        <td>{a.subtopic_id}</td>
                        <td>Level {a.difficulty || 1}</td>
                        <td>
                          {a.correct
                            ? <span className="tag-correct">✓ Correct</span>
                            : <span className="tag-wrong">✗ Incorrect</span>}
                        </td>
                        <td>
                          {a.error_type
                            ? <span className="error-tag">{a.error_type}</span>
                            : <span style={{ color: "#4b5563" }}>—</span>}
                        </td>
                      </tr>
                    ))}
                    {studentAttempts.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: "center", color: "#6b7280", padding: "16px 0" }}>
                          No attempts logged yet for this student.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab({ db, tables, onSelectStudentProfile }) {
  const total = tables.reduce((s, t) => s + t.rows.length, 0);
  const profiles = db.profiles || [];

  return (
    <div>
      <div style={{ marginBottom: 20, display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #67e8f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Database Overview
        </div>
        <div style={{ fontSize: 13, color: "#6b7280" }}>
          {total} total records indexed across {tables.filter(t => t.rows.length > 0).length} database tables &nbsp;·&nbsp; 4 Active Demo Learners Synchronized
        </div>
      </div>

      {/* 4 Demo Students Highlight Strip */}
      <div className="overview-demo-strip">
        <div className="strip-header">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <GraduationCap size={16} style={{ color: "#a78bfa" }} />
            <span style={{ fontWeight: 700, fontSize: 13.5, color: "#e5e7eb" }}>4 Active Demo Learner Accounts</span>
          </div>
          <button className="view-profiles-link" onClick={() => onSelectStudentProfile("demo_profiles")}>
            Inspect Full Telemetry <ArrowUpRight size={13} />
          </button>
        </div>

        <div className="overview-students-grid">
          {profiles.map(p => (
            <div
              key={p.id}
              className="overview-student-chip"
              style={{ "--c": p.avatar_color }}
              onClick={() => onSelectStudentProfile("demo_profiles")}
            >
              <div className="overview-chip-avatar" style={{ background: p.avatar_color }}>
                {p.avatar_letter || p.name?.charAt(0) || "S"}
              </div>
              <div className="overview-chip-details">
                <div className="overview-chip-name">{p.name || p.display_name}</div>
                <div className="overview-chip-sub">Age {p.age} • Grade {p.grade_level}</div>
                <div className="overview-chip-goal">{p.learning_goal}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        {tables.map(t => (
          <div key={t.meta.key} className="admin-stat-card" style={{ "--c": t.meta.color }}>
            <div className="admin-stat-icon">
              <t.meta.icon size={16} />
            </div>
            <div className="admin-stat-value">{t.rows.length}</div>
            <div className="admin-stat-label">{t.meta.label}</div>
          </div>
        ))}
      </div>

      {/* System Health & Adaptive Platform Summary */}
      <div className="overview-system-status-card">
        <div className="system-status-header">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Sparkles size={16} style={{ color: "#34d399" }} />
            <span style={{ fontWeight: 700, fontSize: 13.5, color: "#e5e7eb" }}>Adaptive Platform Health & Diagnostics</span>
          </div>
          <span className="live-status-pill">● System Operational</span>
        </div>

        <div className="system-metrics-grid">
          <div className="sys-metric-cell">
            <span className="sys-metric-title">Curriculum Scope</span>
            <span className="sys-metric-val">Grade 1 to 12 & Advanced</span>
            <span className="sys-metric-note">5 core subjects with age-adaptive tiers</span>
          </div>
          <div className="sys-metric-cell">
            <span className="sys-metric-title">Mistake DNA Engine</span>
            <span className="sys-metric-val">Active Taxonomy</span>
            <span className="sys-metric-note">Conceptual, Calculation, Careless, Application</span>
          </div>
          <div className="sys-metric-cell">
            <span className="sys-metric-title">Multi-Modal Hub</span>
            <span className="sys-metric-val">4 Learning Modalities</span>
            <span className="sys-metric-note">Notes, Mind Maps, Flashcards, Adaptive Quizzes</span>
          </div>
          <div className="sys-metric-cell">
            <span className="sys-metric-title">Data Integrity</span>
            <span className="sys-metric-val">100% Synchronized</span>
            <span className="sys-metric-note">Real-time session and mastery persistence</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main AdminApp ────────────────────────────────────────────────────────────
export default function AdminApp() {
  const [db, setDb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("overview"); // "overview" | "demo_profiles" | tableKey
  const [studentFilter, setStudentFilter] = useState("all");
  const [lastRefresh, setLastRefresh] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);

  const load = () => {
    setLoading(true);
    setTimeout(() => {
      const data = readAllData();
      setDb(data);
      setLastRefresh(new Date());
      setLoading(false);
    }, 150);
  };

  useEffect(() => { load(); }, []);

  const tables = useMemo(() => {
    if (!db) return [];
    return TABLE_META.map(meta => ({
      meta,
      rows: Array.isArray(db[meta.key]) ? db[meta.key] : [],
    }));
  }, [db]);

  const handleClearAll = () => {
    if (window.confirm("⚠️ This will permanently delete ALL localStorage data. Continue?")) {
      clearData();
      load();
      notify("Database reset");
    }
  };

  const handleReseed = () => {
    reseedAllData();
    load();
    notify("4 Demo Accounts reseeded successfully!");
  };

  const notify = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleExportAll = () => {
    if (!db) return;
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `learnflux_full_export_${Date.now()}.json`;
    a.click();
    notify("Export complete!");
  };

  const activeTable = tables.find(t => t.meta.key === activePage);

  return (
    <div className="admin-layout">
      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <div className="admin-logo-badge">
            <div className="admin-logo-icon">🗄️</div>
            <div className="admin-logo-text">
              <div className="admin-logo-title">LearnFlux AI</div>
              <div className="admin-logo-sub">Admin Panel</div>
            </div>
          </div>
        </div>

        <nav className="admin-nav">
          <div className="admin-sidebar-section">Overview & Students</div>
          <button
            className={`admin-nav-btn ${activePage === "overview" ? "active" : ""}`}
            onClick={() => setActivePage("overview")}
          >
            <LayoutDashboard size={15} /> Overview
          </button>
          <button
            className={`admin-nav-btn ${activePage === "demo_profiles" ? "active" : ""}`}
            onClick={() => setActivePage("demo_profiles")}
            style={{ "--c": "#ec4899" }}
          >
            <GraduationCap size={15} style={{ color: "#ec4899" }} />
            <span>4 Demo Profiles</span>
            <span className="nav-count" style={{ background: "#ec489922", color: "#ec4899" }}>4</span>
          </button>

          <div className="admin-sidebar-section" style={{ marginTop: 12 }}>Tables</div>
          {tables.map(t => (
            <button
              key={t.meta.key}
              className={`admin-nav-btn ${activePage === t.meta.key ? "active" : ""}`}
              onClick={() => { setActivePage(t.meta.key); setStudentFilter("all"); }}
              style={{ "--c": t.meta.color }}
            >
              <t.meta.icon size={14} style={{ color: activePage === t.meta.key ? t.meta.color : undefined }} />
              {t.meta.label}
              <span className="nav-count">{t.rows.length}</span>
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-conn-pill connected">
            <span className="admin-conn-dot" style={{ background: "#34d399" }} />
            Database Synced
          </div>
          <div style={{ fontSize: 10.5, color: "#4b5563", textAlign: "center", marginTop: 8 }}>
            Main App: localhost:5174
          </div>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div className="admin-main">
        {/* Topbar */}
        <div className="admin-topbar">
          <div className="admin-topbar-left">
            <div>
              <div className="admin-page-title">
                {activePage === "overview" && "📊 Database Overview"}
                {activePage === "demo_profiles" && "👤 4 Demo Learner Accounts Telemetry"}
                {activeTable && activeTable.meta.label}
              </div>
              {lastRefresh && (
                <div className="admin-page-sub">Last refreshed: {lastRefresh.toLocaleTimeString("en-IN")}</div>
              )}
            </div>
            {actionNotice && (
              <div className="action-toast">
                <CheckCircle size={13} /> {actionNotice}
              </div>
            )}
          </div>

          <div className="admin-topbar-right">
            <button className="adm-btn adm-btn-primary" onClick={handleReseed} title="Reload 4 demo accounts">
              <Sparkles size={13} /> Re-seed 4 Demo Accounts
            </button>
            <button className="adm-btn adm-btn-ghost" onClick={load} disabled={loading}>
              <RefreshCw size={13} className={loading ? "spin" : ""} /> Refresh
            </button>
            <button className="adm-btn adm-btn-ghost" onClick={handleExportAll}>
              <Download size={13} /> Export All
            </button>
            <button className="adm-btn adm-btn-danger" onClick={handleClearAll}>
              <Trash2 size={13} /> Reset DB
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="admin-content">
          {loading ? (
            <div className="adm-center">
              <div className="adm-spinner" />
              <span>Loading database telemetry…</span>
            </div>
          ) : (
            <>
              {/* Overview */}
              {activePage === "overview" && (
                <OverviewTab
                  db={db}
                  tables={tables}
                  onSelectStudentProfile={(page) => setActivePage(page)}
                />
              )}

              {/* 4 Demo Student Profiles View */}
              {activePage === "demo_profiles" && (
                <DemoProfilesView
                  db={db}
                  onSelectStudentTab={(studentId) => {
                    setActivePage("student_progress");
                    setStudentFilter(studentId);
                  }}
                />
              )}

              {/* Individual table */}
              {activeTable && (
                <DataTable
                  rows={activeTable.rows}
                  meta={activeTable.meta}
                  studentFilter={studentFilter}
                  onStudentFilterChange={setStudentFilter}
                  profiles={db.profiles || []}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
