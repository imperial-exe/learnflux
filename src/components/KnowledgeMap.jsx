import React, { useState } from "react";
import { Sparkles, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";

const initialSkills = [
  { name: "Dynamic Arrays & Hashing", value: 92, category: "Data Structures", status: "Mastered" },
  { name: "Iteration & Nested Loops", value: 86, category: "Control Flow", status: "Mastered" },
  { name: "Recursive Functions & Stacks", value: 81, category: "Recursion", status: "Proficient" },
  { name: "Time & Space Complexity", value: 48, category: "Analysis", status: "Gap Detected", isGap: true },
  { name: "Binary Searching Algorithms", value: 32, category: "Searching", status: "In Progress" },
  { name: "Tree Traversals (BST/DFS)", value: 20, category: "Trees", status: "Locked" },
];

export default function KnowledgeMap() {
  const [filterGapOnly, setFilterGapOnly] = useState(false);

  const displayedSkills = filterGapOnly
    ? initialSkills.filter((s) => s.isGap || s.value < 60)
    : initialSkills;

  return (
    <div className="card knowledge-map-card">
      <div className="card-title">
        <div>
          <span className="eyebrow">AI KNOWLEDGE GRAPH</span>
          <h3>Conceptual Skill Mastery</h3>
        </div>
        <button
          className={`filter-chip-btn ${filterGapOnly ? "active" : ""}`}
          onClick={() => setFilterGapOnly(!filterGapOnly)}
        >
          {filterGapOnly ? "Showing Gaps" : "Show All"}
        </button>
      </div>

      <p className="k-map-sub">
        Real-time telemetry scores across foundational algorithms & memory management.
      </p>

      <div className="skills-list">
        {displayedSkills.map((skill) => {
          const isGap = skill.isGap || skill.value < 60;
          return (
            <div className="skill-row" key={skill.name}>
              <div className="skill-label-group">
                <span className="skill-name">{skill.name}</span>
                <span className="skill-cat">{skill.category}</span>
              </div>

              <div className="bar">
                <div
                  className={`bar-fill ${isGap ? "gap-fill" : "mastered-fill"}`}
                  style={{ width: `${skill.value}%` }}
                />
              </div>

              <div className="skill-stat-right">
                <strong className={isGap ? "danger-text" : "success-text"}>
                  {skill.value}%
                </strong>
                {isGap && <AlertTriangle size={13} className="gap-alert-icon" />}
              </div>
            </div>
          );
        })}
      </div>

      <div className="k-map-foot">
        <span className="k-map-note">
          ✦ <b>1 Active Knowledge Gap</b> flagged for immediate reinforcement.
        </span>
      </div>
    </div>
  );
}
