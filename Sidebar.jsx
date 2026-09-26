import React from "react";
import { LayoutDashboard, ClipboardCheck, Route, BrainCircuit, Bot, UserRound, Settings, Flame, Sparkles } from "lucide-react";

const items = [
  ["dashboard", "Dashboard", LayoutDashboard],
  ["assessment", "Diagnostic Test", ClipboardCheck],
  ["path", "Learning Path", Route],
  ["quiz", "Adaptive Quiz", BrainCircuit],
  ["tutor", "AI Tutor", Bot],
  ["profile", "Learning Profile", UserRound],
];

export default function Sidebar({ page, setPage }) {
  return (
    <aside className="sidebar">
      <div className="brand"><span className="brand-star">✦</span> LearnFlux <b>AI</b></div>
      <div className="mini-profile"><div className="avatar">S</div><div><strong>Sneha</strong><small>AI Learner</small></div></div>
      <nav>
        {items.map(([id, name, Icon]) => (
          <button key={id} className={`side-btn ${page === id ? "active" : ""}`} onClick={() => setPage(id)}>
            <Icon size={18}/><span>{name}</span>
          </button>
        ))}
      </nav>
      <div className="side-bottom">
        <div className="streak"><Flame size={17}/><div><strong>7 day streak</strong><small>Keep learning!</small></div></div>
        <button className="side-btn" onClick={() => setPage("settings")}><Settings size={18}/><span>Settings</span></button>
      </div>
    </aside>
  );
}