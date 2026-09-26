import React from "react";
import {
  LayoutDashboard,
  ClipboardCheck,
  BookOpen,
  Route,
  BrainCircuit,
  Bot,
  BarChart3,
  UserRound,
  Settings,
  Flame,
  Sparkles,
  LogOut,
  X,
  Home,
} from "lucide-react";

const navItems = [
  ["dashboard",   "Dashboard",        LayoutDashboard, null],
  ["courses",     "Explore Courses",  BookOpen,        "NEW"],
  ["assessment",  "Diagnostic Test",  ClipboardCheck,  null],
  ["path",        "Learning Path",    Route,           null],
  ["quiz",        "Adaptive Quiz",    BrainCircuit,    "AI"],
  ["tutor",       "AI Tutor Chat",    Bot,             "24/7"],
  ["progress",    "Progress Tracker", BarChart3,       null],
  ["profile",     "Learner Profile",  UserRound,       null],
];

export default function Sidebar({
  page,
  setPage,
  user,
  onLogout,
  isMobileOpen,
  onCloseMobile,
}) {
  const handleNav = (id) => {
    setPage(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {isMobileOpen && <div className="sidebar-backdrop" onClick={onCloseMobile} />}

      <aside className={`sidebar ${isMobileOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-head">
          <div className="brand" onClick={() => handleNav("landing")}>
            <span className="brand-star">✦</span> LearnFlux <b>AI</b>
          </div>
          {isMobileOpen && (
            <button className="mobile-close-btn" onClick={onCloseMobile}>
              <X size={20} />
            </button>
          )}
        </div>

        <div className="mini-profile" onClick={() => handleNav("profile")}>
          <div className="avatar">{user?.avatarLetter || "S"}</div>
          <div className="profile-text">
            <strong>{user?.name || "Sneha"}</strong>
            <small>{user?.goal || "Placement Preparation"}</small>
          </div>
        </div>

        <nav className="side-nav">
          {navItems.map(([id, name, Icon, badge]) => (
            <button
              key={id}
              className={`side-btn ${page === id ? "active" : ""}`}
              onClick={() => handleNav(id)}
            >
              <Icon size={18} className="side-icon" />
              <span>{name}</span>
              {badge && <span className={`side-badge ${badge.toLowerCase()}`}>{badge}</span>}
            </button>
          ))}
        </nav>

        <div className="side-bottom">
          <div className="streak-box" onClick={() => handleNav("progress")}>
            <div className="streak-icon-wrap">
              <Flame size={19} className="flame-icon" />
            </div>
            <div>
              <strong>7 Day Streak! 🔥</strong>
              <small>3 days to Bronze Master badge</small>
            </div>
          </div>

          <button
            className={`side-btn ${page === "settings" ? "active" : ""}`}
            onClick={() => handleNav("settings")}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>

          <button
            className="side-btn logout-btn"
            onClick={() => {
              if (onLogout) onLogout();
              else setPage("landing");
            }}
          >
            <Home size={18} />
            <span>Back to Landing</span>
          </button>
        </div>
      </aside>
    </>
  );
}
