import React, { useState } from "react";
import { Check, Settings, Sparkles, Bell, Shield, Sliders, Save } from "lucide-react";

export default function SettingsPage({ user, onUpdateUser }) {
  const [goal, setGoal] = useState(user?.goal || "Placement Preparation");
  const [dailyTime, setDailyTime] = useState("45 minutes");
  const [tutorTone, setTutorTone] = useState("Socratic (Guided questions & hints)");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (onUpdateUser) {
      onUpdateUser({ goal });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="settings-container">
      <div className="section-heading">
        <span className="eyebrow">PREFERENCES & CONFIGURATION</span>
        <h2>Platform Settings</h2>
        <p>Customize your AI tutor behavior, daily study pace, and curriculum objectives.</p>
      </div>

      <div className="card settings-card">
        {saved && (
          <div className="settings-saved-banner">
            <Check size={16} />
            <span>Preferences successfully updated!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="settings-form">
          <div className="form-section">
            <span className="section-label">
              <Sliders size={16} /> Learning Objectives
            </span>

            <div className="setting-field">
              <label>Primary Learning Target</label>
              <select value={goal} onChange={(e) => setGoal(e.target.value)} className="settings-select">
                <option value="Placement Preparation">💼 Placement & Campus Recruitment</option>
                <option value="Competitive Programming">🏆 Competitive Programming (LeetCode / Codeforces)</option>
                <option value="Semester Exams">🎓 University Semester & Core CS Exams</option>
                <option value="AI & ML Career Track">🤖 AI & Deep Learning Specialization</option>
              </select>
              <small className="field-hint">
                LearnFlux tailors diagnostic questions and path difficulty based on this choice.
              </small>
            </div>

            <div className="setting-field">
              <label>Daily Study Time Target</label>
              <select
                value={dailyTime}
                onChange={(e) => setDailyTime(e.target.value)}
                className="settings-select"
              >
                <option value="30 minutes">⚡ 30 minutes / day (Quick Pace)</option>
                <option value="45 minutes">🎯 45 minutes / day (Recommended)</option>
                <option value="60 minutes">🚀 60 minutes / day (Intensive)</option>
                <option value="90 minutes">🔥 90 minutes / day (Immersion)</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <span className="section-label">
              <Sparkles size={16} /> AI Tutor Persona
            </span>

            <div className="setting-field">
              <label>Tutor Explanation Style</label>
              <select
                value={tutorTone}
                onChange={(e) => setTutorTone(e.target.value)}
                className="settings-select"
              >
                <option value="Socratic (Guided questions & hints)">
                  🧠 Socratic Guide (Nudges you toward the answer with intuition)
                </option>
                <option value="Direct & Concise (Fast answers)">
                  ⚡ Direct & Concise (Quick bullet points and TL;DRs)
                </option>
                <option value="Code First (Full syntax & debug analysis)">
                  💻 Code First (Syntax snippets with time/space complexity)
                </option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <span className="section-label">
              <Bell size={16} /> Notifications & Telemetry
            </span>

            <div className="checkbox-setting">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                />
                <span>Daily streak protection & knowledge gap reminders</span>
              </label>
            </div>
          </div>

          <div className="settings-foot">
            <button type="submit" className="primary-btn">
              <Save size={16} />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
