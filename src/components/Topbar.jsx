import React, { useState } from "react";
import { Bell, Sparkles, Search, Menu, X, CheckCircle, Flame, AlertCircle, ArrowUpRight } from "lucide-react";

export default function Topbar({
  page,
  titles,
  user,
  onOpenMobileMenu,
  onOpenAuth,
  onLogout,
  setPage,
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Knowledge Gap Detected",
      desc: "Time Complexity prerequisites need 15 min review before Graph Theory.",
      time: "5m ago",
      type: "gap",
      read: false,
    },
    {
      id: 2,
      title: "Streak Protected! 🔥",
      desc: "You've maintained your 7-day study consistency score.",
      time: "2h ago",
      type: "streak",
      read: false,
    },
    {
      id: 3,
      title: "Diagnostic Ready",
      desc: "Updated roadmap generated based on your latest quiz score.",
      time: "1d ago",
      type: "system",
      read: false,
    },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="mobile-menu-btn" onClick={onOpenMobileMenu}>
          <Menu size={20} />
        </button>
        <div>
          <span className="eyebrow">ADAPTIVE LEARNING ENGINE 2.0</span>
          <h1>{titles[page] || "LearnFlux AI"}</h1>
        </div>
      </div>

      <div className="topbar-center">
        <div className="search-bar">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search concepts, DSA topics, algorithms..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPage("courses");
              }
            }}
          />
          <span className="kbd-shortcut">⌘K</span>
        </div>
      </div>

      <div className="topbar-right">
        <div className="engine-status-pill">
          <span className="online-dot" />
          <span className="engine-text">AI Engine Active</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="notif-wrapper">
          <button
            className={`icon-btn bell-btn ${unreadCount > 0 ? "has-badge" : ""}`}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div className="notif-dropdown card">
              <div className="notif-head flex-between">
                <strong>Real-time AI Alerts</strong>
                {unreadCount > 0 && (
                  <button className="text-link-small" onClick={markAllRead}>
                    Mark all read
                  </button>
                )}
              </div>
              <div className="notif-list">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`notif-item ${n.read ? "read" : "unread"}`}
                    onClick={() => {
                      if (n.type === "gap") setPage("path");
                      if (n.type === "streak") setPage("profile");
                      setShowNotifications(false);
                    }}
                  >
                    <div className={`notif-icon-type ${n.type}`}>
                      {n.type === "gap" && <AlertCircle size={15} />}
                      {n.type === "streak" && <Flame size={15} />}
                      {n.type === "system" && <Sparkles size={15} />}
                    </div>
                    <div className="notif-content">
                      <div className="notif-title">{n.title}</div>
                      <p>{n.desc}</p>
                      <small>{n.time}</small>
                    </div>
                  </div>
                ))}
              </div>
              <div className="notif-foot">
                <button
                  className="link-btn-full"
                  onClick={() => {
                    setPage("dashboard");
                    setShowNotifications(false);
                  }}
                >
                  View Full Activity Stream →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Mini Avatar & Menu */}
        <div className="user-top-chip" onClick={() => setPage("profile")}>
          <div className="avatar-small">{user?.avatarLetter || "S"}</div>
          <span className="user-name-label">{user?.name || "Sneha"}</span>
        </div>
      </div>
    </header>
  );
}
