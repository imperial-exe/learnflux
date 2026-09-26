import React, { useState, useEffect, useMemo } from "react";
import {
  Database, RefreshCw, Download, Trash2, Search, ChevronDown, ChevronUp,
  Users, BookOpen, Activity, Zap, BarChart3, Clock, AlertTriangle,
  CheckCircle, Wifi, WifiOff, Eye, Copy, ChevronLeft, ChevronRight,
} from "lucide-react";
import { backendApi, isSupabaseConnected } from "../services/backendApi";

// ─── helpers ─────────────────────────────────────────────────────────────────
const PAGE_SIZE = 10;

function fmt(val) {
  if (val === null || val === undefined) return <span style={{ color: "#4b5563" }}>null</span>;
  if (typeof val === "boolean") return <span style={{ color: val ? "#34d399" : "#f87171" }}>{String(val)}</span>;
  if (typeof val === "object") {
    const str = JSON.stringify(val, null, 2);
    return (
      <details style={{ cursor: "pointer" }}>
        <summary style={{ color: "#a78bfa", fontSize: 11 }}>
          {Array.isArray(val) ? `[Array • ${val.length}]` : "{Object}"}
        </summary>
        <pre style={{ color: "#d1d5db", fontSize: 10, marginTop: 4, maxHeight: 120, overflow: "auto" }}>
          {str}
        </pre>
      </details>
    );
  }
  const s = String(val);
  // Timestamp detection
  if (/^\d{4}-\d{2}-\d{2}T/.test(s)) {
    const d = new Date(s);
    return <span title={s} style={{ color: "#67e8f9", fontSize: 11 }}>{d.toLocaleString()}</span>;
  }
  // Color swatch
  if (/^#[0-9a-fA-F]{6}$/.test(s)) {
    return (
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 14, height: 14, borderRadius: 3, background: s, display: "inline-block", border: "1px solid #374151" }} />
        <span style={{ color: "#e5e7eb" }}>{s}</span>
      </span>
    );
  }
  // Mastery %
  if (typeof val === "number" && s.length <= 3 && Number(val) >= 0 && Number(val) <= 100) {
    const pct = Number(val);
    const color = pct >= 80 ? "#34d399" : pct >= 50 ? "#fbbf24" : "#f87171";
    return (
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ color }}>{pct}%</span>
        <span style={{ width: 48, height: 5, background: "#1f2937", borderRadius: 3, overflow: "hidden", display: "inline-block" }}>
          <span style={{ display: "block", width: `${pct}%`, height: "100%", background: color, borderRadius: 3 }} />
        </span>
      </span>
    );
  }
  return <span style={{ color: "#e5e7eb" }}>{s}</span>;
}

// ─── Table component ─────────────────────────────────────────────────────────
function DataTable({ rows, title, icon: Icon, color }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  if (!rows || rows.length === 0) return null;

  const cols = Object.keys(rows[0]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter((r) =>
      Object.values(r).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [rows, search]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (col) => {
    if (sortKey === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(col); setSortDir("asc"); }
    setPage(1);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(rows, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="dv-table-card" style={{ "--accent": color }}>
      {/* Header */}
      <div className="dv-table-header" onClick={() => setExpanded((e) => !e)}>
        <div className="dv-table-title">
          <span className="dv-table-icon" style={{ background: `${color}22`, color }}>
            <Icon size={16} />
          </span>
          <span>{title}</span>
          <span className="dv-row-badge">{rows.length} rows</span>
          <span className="dv-col-badge">{cols.length} cols</span>
        </div>
        <div className="dv-table-actions" onClick={(e) => e.stopPropagation()}>
          <div className="dv-search-wrap">
            <Search size={12} />
            <input
              className="dv-search"
              placeholder="Search…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <button className="dv-icon-btn" title="Copy JSON" onClick={handleCopy}>
            {copied ? <CheckCircle size={14} style={{ color: "#34d399" }} /> : <Copy size={14} />}
          </button>
          <button className="dv-icon-btn" title="Download JSON" onClick={handleExport}>
            <Download size={14} />
          </button>
          <button className="dv-icon-btn" onClick={() => setExpanded((e) => !e)}>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {expanded && (
        <>
          <div className="dv-table-wrap">
            <table className="dv-table">
              <thead>
                <tr>
                  <th style={{ width: 40, color: "#6b7280" }}>#</th>
                  {cols.map((col) => (
                    <th
                      key={col}
                      onClick={() => handleSort(col)}
                      style={{ cursor: "pointer", userSelect: "none", whiteSpace: "nowrap" }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        {col}
                        {sortKey === col ? (
                          sortDir === "asc" ? <ChevronUp size={11} /> : <ChevronDown size={11} />
                        ) : (
                          <ChevronDown size={11} style={{ opacity: 0.3 }} />
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((row, i) => (
                  <tr key={i} className="dv-row">
                    <td style={{ color: "#4b5563", fontSize: 11 }}>
                      {(page - 1) * PAGE_SIZE + i + 1}
                    </td>
                    {cols.map((col) => (
                      <td key={col}>{fmt(row[col])}</td>
                    ))}
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={cols.length + 1} style={{ textAlign: "center", color: "#6b7280", padding: "24px 0" }}>
                      No rows match "{search}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="dv-pagination">
              <span style={{ color: "#6b7280", fontSize: 12 }}>
                {filtered.length} results · Page {page} of {totalPages}
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                <button className="dv-pg-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    className={`dv-pg-btn ${page === p ? "active" : ""}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}
                <button className="dv-pg-btn" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Main DataViewer ──────────────────────────────────────────────────────────
export default function DataViewer() {
  const [db, setDb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [lastRefresh, setLastRefresh] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await backendApi.getAllData();
      setDb(data);
      setLastRefresh(new Date());
    } catch (e) {
      setError(e.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleClearLocal = () => {
    if (window.confirm("⚠️ This will delete ALL localStorage data and reset to defaults. Continue?")) {
      backendApi.clearLocalData();
      load();
    }
  };

  const handleExportAll = () => {
    if (!db) return;
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `learnflux_full_export_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tables = db
    ? [
        { key: "profiles",          title: "User Profiles",       icon: Users,    color: "#a78bfa", data: db.profiles || [] },
        { key: "subjects",          title: "Subjects",             icon: BookOpen,  color: "#34d399", data: db.subjects || [] },
        { key: "student_progress",  title: "Student Progress",     icon: Activity,  color: "#fbbf24", data: db.student_progress || [] },
        { key: "attempts",          title: "Quiz Attempts",        icon: Zap,       color: "#f87171", data: db.attempts || [] },
        { key: "mastery_snapshots", title: "Mastery Snapshots",    icon: BarChart3, color: "#67e8f9", data: db.mastery_snapshots || [] },
        { key: "study_sessions",    title: "Study Sessions",       icon: Clock,     color: "#fb923c", data: db.study_sessions || [] },
        { key: "flashcard_decks",   title: "Flashcard Decks",      icon: BookOpen,  color: "#c084fc", data: db.flashcard_decks || [] },
        { key: "questions",         title: "Question Bank",        icon: Eye,       color: "#2dd4bf", data: db.questions || [] },
      ].filter((t) => t.data.length > 0)
    : [];

  const visible = activeTab === "all"
    ? tables
    : tables.filter((t) => t.key === activeTab);

  const totalRows = tables.reduce((s, t) => s + t.data.length, 0);

  return (
    <div className="dv-root">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="dv-header">
        <div className="dv-header-left">
          <div className="dv-header-icon">
            <Database size={22} />
          </div>
          <div>
            <h1 className="dv-title">Data Viewer</h1>
            <p className="dv-subtitle">
              Inspect all stored data • {totalRows} total rows across {tables.length} tables
            </p>
          </div>
        </div>
        <div className="dv-header-right">
          <div className={`dv-conn-badge ${isSupabaseConnected ? "connected" : "local"}`}>
            {isSupabaseConnected ? (
              <><Wifi size={13} /> Supabase Connected</>
            ) : (
              <><WifiOff size={13} /> localStorage Mode</>
            )}
          </div>
          {lastRefresh && (
            <span className="dv-refresh-time">
              Updated {lastRefresh.toLocaleTimeString()}
            </span>
          )}
          <button className="dv-btn dv-btn-ghost" onClick={load} disabled={loading}>
            <RefreshCw size={14} className={loading ? "spin" : ""} /> Refresh
          </button>
          <button className="dv-btn dv-btn-ghost" onClick={handleExportAll}>
            <Download size={14} /> Export All
          </button>
          {!isSupabaseConnected && (
            <button className="dv-btn dv-btn-danger" onClick={handleClearLocal}>
              <Trash2 size={14} /> Reset DB
            </button>
          )}
        </div>
      </div>

      {/* ── Connection Setup Banner (when no Supabase) ────────────────────── */}
      {!isSupabaseConnected && (
        <div className="dv-setup-banner">
          <AlertTriangle size={16} />
          <div>
            <strong>Running in offline mode</strong> — data is stored in your browser's localStorage only.
            To connect a real Supabase database:{" "}
            <ol style={{ margin: "6px 0 0 16px", fontSize: 12, lineHeight: 1.7 }}>
              <li>Create a free project at <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color: "#a78bfa" }}>supabase.com</a></li>
              <li>Run <code>supabase_schema.sql</code> in your project's SQL Editor</li>
              <li>Create <code>.env</code> in project root with:<br />
                <code>VITE_SUPABASE_URL=https://xxxx.supabase.co</code><br />
                <code>VITE_SUPABASE_ANON_KEY=eyJxxxx…</code>
              </li>
              <li>Restart dev server — data will sync to Supabase automatically</li>
            </ol>
          </div>
        </div>
      )}

      {/* ── Stats row ─────────────────────────────────────────────────────── */}
      {db && (
        <div className="dv-stats-row">
          {tables.map((t) => (
            <button
              key={t.key}
              className={`dv-stat-chip ${activeTab === t.key ? "active" : ""}`}
              style={{ "--c": t.color }}
              onClick={() => setActiveTab((prev) => (prev === t.key ? "all" : t.key))}
            >
              <t.icon size={13} />
              <span>{t.title}</span>
              <span className="dv-stat-count">{t.data.length}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <div className="dv-content">
        {loading && (
          <div className="dv-center">
            <div className="dv-spinner" />
            <p style={{ color: "#6b7280", marginTop: 12 }}>Loading data…</p>
          </div>
        )}

        {error && (
          <div className="dv-error">
            <AlertTriangle size={20} />
            <p>{error}</p>
            <button className="dv-btn dv-btn-ghost" onClick={load}>Retry</button>
          </div>
        )}

        {!loading && !error && db && (
          <div className="dv-tables-list">
            {visible.length === 0 && (
              <div className="dv-center" style={{ color: "#6b7280" }}>
                No data found for selected table.
              </div>
            )}
            {visible.map((t) => (
              <DataTable
                key={t.key}
                rows={t.data}
                title={t.title}
                icon={t.icon}
                color={t.color}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
