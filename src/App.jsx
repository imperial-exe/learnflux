import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import LandingPage from "./components/LandingPage";
import AuthModal from "./components/AuthModal";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./components/Dashboard";
import Courses from "./components/Courses";
import Assessment from "./components/Assessment";
import LearningPath from "./components/LearningPath";
import AdaptiveQuiz from "./components/AdaptiveQuiz";
import AITutor from "./components/AITutor";
import ProgressTracker from "./components/ProgressTracker";
import Profile from "./components/Profile";
import SettingsPage from "./components/SettingsPage";
import CursorGlow from "./components/CursorGlow";
import FloatingEyeBot from "./components/FloatingEyeBot";

const pageTitles = {
  dashboard: "Learning Analytics & Dashboard",
  courses: "Adaptive Course Catalog",
  assessment: "Diagnostic Knowledge Assessment",
  path: "Personalized Learning Path",
  quiz: "Adaptive Knowledge Quiz",
  tutor: "Universal AI Tutor & LLM Engine",
  progress: "Cognitive Progress & Mastery Tracker",
  profile: "Learner Profile & Telemetry",
  settings: "Platform & AI Preferences",
};

export default function App() {
  const [page, setPage] = useState("landing");
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeTutorQuery, setActiveTutorQuery] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [user, setUser] = useState({
    id: "student-sneha",
    name: "Sneha",
    email: "sneha.learner@flux.ai",
    goal: "Placement Preparation",
    avatarLetter: "S",
    provider: "Firebase Auth",
    age: "18+",
    grade_level: 12,
    custom_subjects: [],
  });

  const handleOpenAuth = (mode = "login") => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleAuthSuccess = (userData) => {
    setUser((prev) => ({
      ...prev,
      ...userData,
      age: userData.age || prev.age || "16",
      custom_subjects: userData.custom_subjects || prev.custom_subjects || [],
    }));
    // Reset subject to let them explore newly mapped subjects
    setSelectedSubjectId(null);
    setPage("dashboard");
  };

  const handleAddCustomSubject = (newSubject) => {
    setUser((prev) => {
      const updated = {
        ...prev,
        custom_subjects: [...(prev.custom_subjects || []), newSubject],
      };
      return updated;
    });
  };

  const handleUpdateUser = (updated) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  const handleLogout = () => {
    setPage("landing");
  };

  const handleAskAITutor = (promptText) => {
    setActiveTutorQuery(promptText || "");
    setPage("tutor");
  };

  return (
    <div className="app-root">
      {/* Real-time Cursor Lighting Aura */}
      <CursorGlow />

      {page === "landing" ? (
        <LandingPage
          setPage={setPage}
          onOpenAuth={handleOpenAuth}
        />
      ) : (
        <div className="app-shell">
          <Sidebar
            page={page}
            setPage={setPage}
            user={user}
            onLogout={handleLogout}
            isMobileOpen={isMobileOpen}
            onCloseMobile={() => setIsMobileOpen(false)}
          />

          <main className="main-content">
            <Topbar
              page={page}
              titles={pageTitles}
              user={user}
              onOpenMobileMenu={() => setIsMobileOpen(true)}
              onOpenAuth={handleOpenAuth}
              onLogout={handleLogout}
              setPage={setPage}
            />

            <div className="page-body">
              {page === "dashboard" && (
                <Dashboard
                  setPage={setPage}
                  user={user}
                  onAskAITutor={handleAskAITutor}
                  onSelectSubject={setSelectedSubjectId}
                  onAddCustomSubject={handleAddCustomSubject}
                />
              )}
              {page === "courses" && (
                <Courses setPage={setPage} onSelectSubject={setSelectedSubjectId} />
              )}
              {page === "assessment" && (
                <Assessment
                  setPage={setPage}
                  user={user}
                  initialSubjectId={selectedSubjectId}
                  onSelectSubject={setSelectedSubjectId}
                  onAddCustomSubject={handleAddCustomSubject}
                  onComplete={() => {}}
                />
              )}
              {page === "path" && (
                <LearningPath
                  setPage={setPage}
                  user={user}
                  initialSubjectId={selectedSubjectId}
                  onSelectSubject={setSelectedSubjectId}
                  onAddCustomSubject={handleAddCustomSubject}
                />
              )}
              {page === "quiz" && (
                <AdaptiveQuiz
                  setPage={setPage}
                  user={user}
                  initialSubjectId={selectedSubjectId}
                  onSelectSubject={setSelectedSubjectId}
                  onAddCustomSubject={handleAddCustomSubject}
                />
              )}
              {page === "tutor" && <AITutor initialQuery={activeTutorQuery} />}
              {page === "progress" && <ProgressTracker setPage={setPage} />}
              {page === "profile" && <Profile user={user} setPage={setPage} />}
              {page === "settings" && <SettingsPage user={user} onUpdateUser={handleUpdateUser} />}
            </div>
          </main>

        </div>
      )}

      {/* Global Interactive Cursor-Tracking Robot Companion (stays throughout all pages) */}
      <FloatingEyeBot onRedirectToTutor={handleAskAITutor} />

      {/* Futuristic Firebase & Google Auth Modal */}
      <AuthModal
        isOpen={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
