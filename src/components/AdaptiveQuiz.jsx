import React, { useState, useEffect } from "react";
import {
  BrainCircuit,
  Zap,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Bot,
  Flame,
  Award,
  Clock,
  BookOpen,
  Plus,
  FileText,
} from "lucide-react";
import { getSubjectsForUser, getAgeBandInfo } from "../data/subjectRegistry";
import AddSubjectModal from "./AddSubjectModal";

export default function AdaptiveQuiz({
  setPage,
  user,
  initialSubjectId = null,
  onSelectSubject = null,
  onAddCustomSubject = null,
}) {
  const [selectedSubjectId, setSelectedSubjectId] = useState(initialSubjectId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);

  // Sync if initialSubjectId prop changes
  useEffect(() => {
    if (initialSubjectId && initialSubjectId !== selectedSubjectId) {
      setSelectedSubjectId(initialSubjectId);
      setCurrentIndex(0);
      setSelected(null);
      setFeedback(null);
      setScore(0);
      setStreak(0);
      setIsDone(false);
    }
  }, [initialSubjectId]);

  const ageBandInfo = getAgeBandInfo(user?.age || "16");
  const availableSubjects = getSubjectsForUser(user);

  // Build subject quiz map
  const subjectQuizMap = {};
  availableSubjects.forEach((s) => {
    const qList = (s.adaptiveQuestions && s.adaptiveQuestions.length)
      ? s.adaptiveQuestions
      : (s.diagnosticQuestion
          ? [
              {
                level: "FOUNDATION",
                tier: 1,
                q: s.diagnosticQuestion.q,
                options: s.diagnosticQuestion.options,
                correct: s.diagnosticQuestion.correct,
                explanation: s.diagnosticQuestion.explanation,
              },
            ]
          : [
              {
                level: "FOUNDATION",
                tier: 1,
                q: `What is a primary foundational principle of ${s.name}?`,
                options: ["Core verified definitions", "Unproven guesses", "Skipping prerequisites", "Arbitrary memorization"],
                correct: 0,
                explanation: "Foundational conceptual mastery requires establishing verified baseline axioms.",
              },
            ]);

    subjectQuizMap[s.id] = {
      ...s,
      questions: qList,
    };
  });

  const activeSubject = selectedSubjectId ? subjectQuizMap[selectedSubjectId] : null;
  const questions = activeSubject?.questions || [];
  const currentQ = questions[currentIndex] || questions[0];

  const handleSelectSubject = (subjId) => {
    setSelectedSubjectId(subjId);
    if (onSelectSubject) onSelectSubject(subjId);
    setCurrentIndex(0);
    setSelected(null);
    setFeedback(null);
    setScore(0);
    setStreak(0);
    setIsDone(false);
  };

  const handleBackToSubjectList = () => {
    setSelectedSubjectId(null);
    if (onSelectSubject) onSelectSubject(null);
    setCurrentIndex(0);
    setSelected(null);
    setFeedback(null);
    setScore(0);
    setStreak(0);
    setIsDone(false);
  };

  const handlePick = (idx) => {
    if (selected !== null || !currentQ) return; // prevent multi-click
    setSelected(idx);

    const isCorrect = idx === currentQ.correct;
    if (isCorrect) {
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
      setFeedback({
        type: "success",
        msg: `Correct! ${streak >= 1 ? "🔥 Streak bonus! Difficulty scaling up." : "Great intuition."}`,
        explanation: currentQ.explanation,
      });
    } else {
      setStreak(0);
      setFeedback({
        type: "error",
        msg: "Let's review the fundamental prerequisite concept.",
        explanation: currentQ.explanation,
      });
    }

    setTimeout(() => {
      // Advance to next question or complete
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
        setSelected(null);
        setFeedback(null);
      } else {
        setIsDone(true);
      }
    }, 1800);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelected(null);
    setFeedback(null);
    setScore(0);
    setStreak(0);
    setIsDone(false);
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
      <div className="adaptive-quiz-container">
        <div className="section-heading">
          <div className="flex-between heading-top">
            <span className="eyebrow">{ageBandInfo.bandLabel.toUpperCase()}</span>
            <div className="flex-row-gap">
              <span className="step-counter-tag">
                {availableSubjects.length} Disciplines Calibrated for Age {user?.age || "16"}
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
          <h2>Select a Subject to Begin Adaptive Knowledge Quiz</h2>
          <p>
            Curriculum calibrated for <b>{ageBandInfo.tierLabel}</b>. Questions dynamically adjust in cognitive
            difficulty (Foundation → Intermediate → Advanced) tailored to your accuracy.
          </p>
        </div>

        <div className="subject-cards-selection-grid">
          {availableSubjects.map((subj) => {
            const IconComponent = subj.icon || BookOpen;
            const qCount = subjectQuizMap[subj.id]?.questions.length || 3;
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

                <div className="subj-bottleneck-chip">
                  <Zap size={12} style={{ color: subj.color }} />
                  <span>
                    Adaptive Tiers: <b>Foundation → Advanced</b>
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
                    <Clock size={13} /> ~3 mins • {qCount} Questions
                  </span>
                  <button className="primary-btn-sm">
                    <span>Start Adaptive Quiz</span>
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

  // 2. QUIZ COMPLETED RECAP SCREEN
  if (isDone) {
    const accuracy = Math.round((score / questions.length) * 100);
    return (
      <div className="card center-card quiz-done-card">
        <div className="success-orb">
          <Award size={32} />
        </div>
        <span className="eyebrow">{activeSubject.name.toUpperCase()} • ADAPTIVE SESSION COMPLETE</span>
        <h2>Quiz Session Results</h2>
        <p>
          You answered <b>{score} of {questions.length} questions correctly</b> ({accuracy}% Mastery Accuracy).
          You earned <b>+120 XP</b> in {activeSubject.name}!
        </p>

        <div className="quiz-result-metrics">
          <div className="res-pill">
            <span>Accuracy:</span>
            <strong>{accuracy}%</strong>
          </div>
          <div className="res-pill">
            <span>XP Earned:</span>
            <strong className="text-success">+120 XP</strong>
          </div>
          <div className="res-pill">
            <span>Gap Status:</span>
            <strong className="text-accent">{accuracy >= 75 ? "RESOLVED ✓" : "REINFORCING"}</strong>
          </div>
        </div>

        <div className="result-actions">
          <button
            className="primary-btn"
            onClick={() => {
              if (onSelectSubject) onSelectSubject(activeSubject.id);
              setPage("path");
            }}
          >
            <span>Continue {activeSubject.name} Learning Path</span>
            <ArrowRight size={17} />
          </button>
          <button className="ghost-btn" onClick={() => setPage("tutor")}>
            <Bot size={17} />
            <span>Ask Tutor to Clarify Mistakes</span>
          </button>
          <button className="outline-btn" onClick={handleRestart}>
            <RotateCcw size={16} />
            <span>Try Again</span>
          </button>
          <button className="outline-btn" onClick={handleBackToSubjectList}>
            <span>← Switch Subject</span>
          </button>
        </div>
      </div>
    );
  }

  // 3. ACTIVE ADAPTIVE QUIZ SCREEN
  const SubjectIcon = activeSubject.icon || BookOpen;

  return (
    <div className="adaptive-quiz-container">
      {/* Active Subject Navigation Header */}
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
          <span>Adaptive Quiz Active</span>
        </div>

        <div className="subject-quick-chips">
          {Object.keys(subjectQuizMap).map((id) => (
            <button
              key={id}
              className={`chip-min ${id === selectedSubjectId ? "active" : ""}`}
              onClick={() => handleSelectSubject(id)}
            >
              {subjectQuizMap[id].name.split(" ")[0]}
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
          <span className="eyebrow">{activeSubject.name.toUpperCase()} • DIFFICULTY ENGINE</span>
          <div className="quiz-head-badges">
            {streak > 1 && (
              <span className="streak-live-tag">
                <Flame size={14} /> {streak} In A Row!
              </span>
            )}
            <span className="step-counter-tag">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>
        </div>
        <h2>{activeSubject.name} Adaptive Quiz</h2>
        <p>
          Each subsequent question dynamically adjusts in cognitive difficulty based on your speed and accuracy.
        </p>
      </div>

      <div className="card question-card">
        {/* Tier & Difficulty Bar */}
        <div className="quiz-top-bar flex-between">
          <div className="difficulty-indicator">
            <span className="diff-label">CURRENT DIFFICULTY TIER:</span>
            <span
              className={`diff-badge tier-${currentQ?.tier || 1}`}
              style={{
                borderColor: activeSubject.color,
                color: activeSubject.color,
                background: `${activeSubject.color}18`,
              }}
            >
              <Zap size={13} /> {currentQ?.level || "FOUNDATION"}
            </span>
          </div>

          <div className="quiz-score-indicator">
            <span>Score: <b>{score}</b>/{currentIndex}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-bar-wrap">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
                background: `linear-gradient(90deg, #9d4edd, ${activeSubject.color})`,
              }}
            />
          </div>
        </div>

        <h3 className="question-title">{currentQ?.q}</h3>

        <div className="options-list">
          {currentQ?.options?.map((opt, i) => {
            let stateClass = "";
            if (selected !== null) {
              if (i === currentQ.correct) stateClass = "correct-choice";
              else if (i === selected) stateClass = "wrong-choice";
            }

            return (
              <button
                key={opt}
                type="button"
                className={`answer-option ${stateClass} ${selected === i ? "selected" : ""}`}
                onClick={() => handlePick(i)}
                disabled={selected !== null}
              >
                <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                <span className="option-text">{opt}</span>
                {selected !== null && i === currentQ.correct && (
                  <CheckCircle2 size={18} className="option-state-icon text-success" />
                )}
                {selected !== null && i === selected && i !== currentQ.correct && (
                  <AlertCircle size={18} className="option-state-icon text-danger" />
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Feedback Card */}
        {feedback && (
          <div className={`quiz-feedback-box ${feedback.type}`}>
            <div className="feedback-head">
              {feedback.type === "success" ? (
                <CheckCircle2 size={18} />
              ) : (
                <AlertCircle size={18} />
              )}
              <strong>{feedback.msg}</strong>
            </div>
            <p className="feedback-exp">{feedback.explanation}</p>
          </div>
        )}
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
