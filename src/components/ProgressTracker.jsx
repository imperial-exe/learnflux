import React, { useState } from "react";
import {
  BarChart3,
  Award,
  Flame,
  CheckCircle2,
  Clock,
  Zap,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Calendar,
  Layers,
  Compass,
  Cpu,
} from "lucide-react";

export default function ProgressTracker({ setPage }) {
  const [activeTab, setActiveTab] = useState("charts"); // "charts", "radar", "tree"

  // Data for Radar Chart (6 dimensions)
  const radarDimensions = [
    { label: "Algorithms", value: 92, angle: 0 },
    { label: "Data Structures", value: 88, angle: 60 },
    { label: "Time Complexity", value: 48, angle: 120, isGap: true },
    { label: "Space Complexity", value: 75, angle: 180 },
    { label: "Problem Solving Speed", value: 85, angle: 240 },
    { label: "System Architecture", value: 65, angle: 300 },
  ];

  // Helper to compute polygon points for Radar chart
  const center = 140;
  const radius = 100;
  const getCoordinates = (value, angleDeg) => {
    const angleRad = (angleDeg - 90) * (Math.PI / 180);
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angleRad),
      y: center + r * Math.sin(angleRad),
    };
  };

  const radarPoints = radarDimensions
    .map((d) => {
      const coord = getCoordinates(d.value, d.angle);
      return `${coord.x},${coord.y}`;
    })
    .join(" ");

  // Study hours data for curved area chart
  const weeklyData = [
    { day: "Mon", hours: 1.2, mins: 72 },
    { day: "Tue", hours: 1.8, mins: 108 },
    { day: "Wed", hours: 0.9, mins: 54 },
    { day: "Thu", hours: 1.5, mins: 90 },
    { day: "Fri", hours: 2.2, mins: 132 },
    { day: "Sat", hours: 2.6, mins: 156 },
    { day: "Sun", hours: 1.4, mins: 84 },
  ];

  const maxMins = 160;
  const chartWidth = 520;
  const chartHeight = 160;
  const stepX = chartWidth / (weeklyData.length - 1);

  // Generate smooth SVG bezier path
  const points = weeklyData.map((d, i) => ({
    x: i * stepX,
    y: chartHeight - (d.mins / maxMins) * (chartHeight - 30),
  }));

  const pathD = points.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[idx - 1];
    const cpX1 = prev.x + (curr.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (curr.x - prev.x) / 2;
    const cpY2 = curr.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

  // Skill Tree Nodes
  const skillTreeNodes = [
    { id: 1, name: "Arrays & Memory", status: "mastered", level: "92%", x: 50, y: 50 },
    { id: 2, name: "Loops & Iterations", status: "mastered", level: "86%", x: 180, y: 50 },
    { id: 3, name: "Call Stack Recursion", status: "mastered", level: "81%", x: 310, y: 50 },
    { id: 4, name: "Time Complexity Bounds", status: "focus", level: "48% (GAP)", x: 440, y: 50 },
    { id: 5, name: "Binary Search Space", status: "unlocked", level: "Next", x: 180, y: 150 },
    { id: 6, name: "Binary Trees & BSTs", status: "locked", level: "Locked", x: 310, y: 150 },
    { id: 7, name: "Dynamic Programming", status: "locked", level: "Locked", x: 440, y: 150 },
  ];

  return (
    <div className="progress-tracker-view">
      <div className="section-heading">
        <div className="flex-between">
          <div>
            <span className="eyebrow">GRAPHICAL COGNITIVE TELEMETRY</span>
            <h2>Multi-Dimensional Learning Progress</h2>
          </div>
          <div className="tracker-view-toggle">
            <button
              className={`toggle-btn ${activeTab === "charts" ? "active" : ""}`}
              onClick={() => setActiveTab("charts")}
            >
              <BarChart3 size={15} />
              <span>Gauges & Velocity</span>
            </button>
            <button
              className={`toggle-btn ${activeTab === "radar" ? "active" : ""}`}
              onClick={() => setActiveTab("radar")}
            >
              <Compass size={15} />
              <span>Skill Radar</span>
            </button>
            <button
              className={`toggle-btn ${activeTab === "tree" ? "active" : ""}`}
              onClick={() => setActiveTab("tree")}
            >
              <Layers size={15} />
              <span>Skill Tree Graph</span>
            </button>
          </div>
        </div>
        <p>
          High-fidelity graphical models mapping your conceptual mastery, velocity, and knowledge gap resolution.
        </p>
      </div>

      {/* 4 Circular Radial Gauges */}
      <div className="radial-gauges-grid">
        <RadialGauge
          percentage={78}
          title="Overall Mastery"
          subtitle="Tier 2 Intermediate"
          color="#c77dff"
          glowColor="rgba(199, 125, 255, 0.4)"
        />
        <RadialGauge
          percentage={92}
          title="Diagnostic Accuracy"
          subtitle="Top 8% percentile"
          color="#10b981"
          glowColor="rgba(16, 185, 129, 0.4)"
        />
        <RadialGauge
          percentage={84}
          title="Gap Resolution"
          subtitle="12% faster remediation"
          color="#38bdf8"
          glowColor="rgba(56, 189, 248, 0.4)"
        />
        <RadialGauge
          percentage={100}
          title="Streak Consistency"
          subtitle="7 of 7 days completed"
          color="#f59e0b"
          glowColor="rgba(245, 158, 11, 0.4)"
        />
      </div>

      {/* Main Visualizer Area */}
      {activeTab === "charts" && (
        <div className="two-col">
          {/* Smooth Curved Velocity Area Chart */}
          <div className="card graphical-card">
            <div className="card-title">
              <div>
                <span className="eyebrow">CONTINUOUS VELOCITY</span>
                <h3>Weekly Study Time Curve</h3>
              </div>
              <span className="live-badge">11.6 Total Hours</span>
            </div>

            <div className="svg-chart-container">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="curved-svg-chart">
                <defs>
                  <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9d4edd" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#9d4edd" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#7b2cbf" />
                    <stop offset="50%" stopColor="#c77dff" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                {[0.25, 0.5, 0.75].map((pct, idx) => (
                  <line
                    key={idx}
                    x1="0"
                    y1={chartHeight * pct}
                    x2={chartWidth}
                    y2={chartHeight * pct}
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Area under curve */}
                <path d={areaD} fill="url(#areaGlow)" />

                {/* Smooth Curve */}
                <path d={pathD} fill="none" stroke="url(#lineGlow)" strokeWidth="3.5" />

                {/* Data points */}
                {points.map((pt, i) => (
                  <g key={i}>
                    <circle cx={pt.x} cy={pt.y} r="5" fill="#ffffff" stroke="#c77dff" strokeWidth="2.5" />
                    <circle cx={pt.x} cy={pt.y} r="9" fill="none" stroke="rgba(199, 125, 255, 0.4)" strokeWidth="1" />
                  </g>
                ))}
              </svg>

              <div className="svg-days-row">
                {weeklyData.map((d) => (
                  <div key={d.day} className="day-metric">
                    <strong>{d.day}</strong>
                    <small>{d.mins}m</small>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Granular Mastery Breakdown with Status Meters */}
          <div className="card graphical-card">
            <div className="card-title">
              <div>
                <span className="eyebrow">TOPIC PROFICIENCY TELEMETRY</span>
                <h3>Knowledge Retention Index</h3>
              </div>
              <Sparkles size={16} className="text-accent" />
            </div>

            <div className="graphical-skills-list">
              {[
                { name: "Dynamic Arrays & Address Arithmetic", score: 92, state: "Mastered", color: "#10b981" },
                { name: "Loop Invariants & Iteration Bounds", score: 86, state: "Mastered", color: "#10b981" },
                { name: "Call Stack Recursion Frames", score: 81, state: "Proficient", color: "#38bdf8" },
                { name: "Asymptotic Big-O Complexity", score: 48, state: "Active Gap", color: "#f59e0b", isGap: true },
                { name: "Binary Search Space Predicates", score: 32, state: "Next Focus", color: "#c084fc" },
              ].map((s) => (
                <div key={s.name} className="graph-skill-item">
                  <div className="flex-between">
                    <span className="skill-name-txt">{s.name}</span>
                    <span className="skill-badge-txt" style={{ color: s.color }}>
                      {s.score}% • {s.state}
                    </span>
                  </div>
                  <div className="multi-step-bar">
                    <div
                      className="multi-step-fill"
                      style={{
                        width: `${s.score}%`,
                        background: s.color,
                        boxShadow: `0 0 10px ${s.color}66`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Spider / Radar Chart View */}
      {activeTab === "radar" && (
        <div className="card radar-view-card">
          <div className="card-title">
            <div>
              <span className="eyebrow">COGNITIVE RADAR</span>
              <h3>6-Axis Holistic Competency Radar</h3>
            </div>
            <span className="radar-legend">
              <span className="dot-radar" /> Current Learner Profile
            </span>
          </div>

          <div className="radar-layout">
            <div className="radar-svg-wrap">
              <svg width="280" height="280" className="radar-svg">
                {/* Concentric grid webs */}
                {[0.25, 0.5, 0.75, 1.0].map((level, i) => {
                  const webPoints = radarDimensions
                    .map((d) => {
                      const coord = getCoordinates(level * 100, d.angle);
                      return `${coord.x},${coord.y}`;
                    })
                    .join(" ");
                  return (
                    <polygon
                      key={i}
                      points={webPoints}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.08)"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Spoke lines */}
                {radarDimensions.map((d, i) => {
                  const outer = getCoordinates(100, d.angle);
                  return (
                    <line
                      key={i}
                      x1={center}
                      y1={center}
                      x2={outer.x}
                      y2={outer.y}
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Filled Radar Area */}
                <polygon
                  points={radarPoints}
                  fill="rgba(199, 125, 255, 0.28)"
                  stroke="#c77dff"
                  strokeWidth="2.5"
                />

                {/* Data point dots */}
                {radarDimensions.map((d, i) => {
                  const coord = getCoordinates(d.value, d.angle);
                  return (
                    <circle
                      key={i}
                      cx={coord.x}
                      cy={coord.y}
                      r="4.5"
                      fill={d.isGap ? "#f59e0b" : "#38bdf8"}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  );
                })}
              </svg>
            </div>

            {/* Radar Dimensions Breakdown */}
            <div className="radar-dimensions-details">
              <h4>Evaluated Dimensions:</h4>
              <div className="radar-metrics-grid">
                {radarDimensions.map((d) => (
                  <div key={d.label} className={`dim-pill ${d.isGap ? "gap-highlight" : ""}`}>
                    <strong>{d.label}</strong>
                    <span className="dim-score">{d.value}%</span>
                    {d.isGap && <span className="dim-warning">⚠️ Needs Focus</span>}
                  </div>
                ))}
              </div>
              <button className="primary-btn-sm" onClick={() => setPage("path")}>
                View Recommended Remediation →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skill Tree Graph View */}
      {activeTab === "tree" && (
        <div className="card skill-tree-card">
          <div className="card-title">
            <div>
              <span className="eyebrow">GRAPH VISUALIZATION</span>
              <h3>Interactive Prerequisites Skill Tree</h3>
            </div>
            <span className="tree-legend">
              <span className="legend-node done" /> Mastered &nbsp;
              <span className="legend-node focus" /> Current Gap &nbsp;
              <span className="legend-node locked" /> Locked
            </span>
          </div>

          <div className="skill-tree-canvas-wrap">
            <svg viewBox="0 0 540 220" className="tree-svg">
              <defs>
                <linearGradient id="treeLineGlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#9d4edd" />
                </linearGradient>
              </defs>

              {/* Connecting lines */}
              <line x1="110" y1="50" x2="180" y2="50" stroke="url(#treeLineGlow)" strokeWidth="2.5" />
              <line x1="240" y1="50" x2="310" y2="50" stroke="url(#treeLineGlow)" strokeWidth="2.5" />
              <line x1="370" y1="50" x2="440" y2="50" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="3 3" />
              <path d="M 210 70 L 210 130" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="2" />
              <path d="M 340 70 L 340 130" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="2" />
              <path d="M 470 70 L 470 130" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="2" />

              {/* Nodes */}
              {skillTreeNodes.map((node) => {
                let strokeColor = "#10b981";
                let fillColor = "#14251b";
                if (node.status === "focus") {
                  strokeColor = "#f59e0b";
                  fillColor = "#2d1a12";
                } else if (node.status === "unlocked") {
                  strokeColor = "#c77dff";
                  fillColor = "#1f152d";
                } else if (node.status === "locked") {
                  strokeColor = "#332a40";
                  fillColor = "#0f0c16";
                }

                return (
                  <g key={node.id} transform={`translate(${node.x - 30}, ${node.y - 20})`}>
                    <rect
                      width="80"
                      height="40"
                      rx="8"
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth="2"
                    />
                    <text
                      x="40"
                      y="16"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {node.name.split(" ")[0]}
                    </text>
                    <text
                      x="40"
                      y="29"
                      fill={strokeColor}
                      fontSize="8"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {node.level}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

// Circular SVG Radial Gauge Component
function RadialGauge({ percentage, title, subtitle, color, glowColor }) {
  const size = 110;
  const strokeWidth = 9;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="card radial-gauge-card">
      <div className="gauge-svg-box">
        <svg width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1b1426"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 0.8s ease",
              filter: `drop-shadow(0 0 6px ${glowColor})`,
            }}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <div className="gauge-center-val">
          <strong>{percentage}%</strong>
        </div>
      </div>
      <div className="gauge-info">
        <h4>{title}</h4>
        <small>{subtitle}</small>
      </div>
    </div>
  );
}
