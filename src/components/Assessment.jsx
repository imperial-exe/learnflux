import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
  RotateCcw,
  BookOpen,
  Bot,
  Clock,
  Layers,
  Plus,
  FileText,
} from "lucide-react";
import { getSubjectsForUser, getAgeBandInfo } from "../data/subjectRegistry";
import AddSubjectModal from "./AddSubjectModal";

export default function Assessment({
  setPage,
  user,
  initialSubjectId = null,
  onSelectSubject = null,
  onAddCustomSubject = null,
  onComplete,
}) {
  const [selectedSubjectId, setSelectedSubjectId] = useState(initialSubjectId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);

  // Sync if initialSubjectId prop changes
  useEffect(() => {
    if (initialSubjectId && initialSubjectId !== selectedSubjectId) {
      setSelectedSubjectId(initialSubjectId);
      setCurrentIndex(0);
      setSelectedOption(null);
      setAnswers([]);
      setIsCompleted(false);
    }
  }, [initialSubjectId]);

  const ageBandInfo = getAgeBandInfo(user?.age || "16");
  const availableSubjects = getSubjectsForUser(user);

  // Create dictionary of subjects
  const subjectsMap = {};
  availableSubjects.forEach((s) => {
    const qList = [];
    if (s.diagnosticQuestion) {
      qList.push({
        id: 1,
        category: s.diagnosticQuestion.category || s.category || "Diagnostic Check",
        q: s.diagnosticQuestion.q,
        options: s.diagnosticQuestion.options,
        correct: s.diagnosticQuestion.correct,
        explanation: s.diagnosticQuestion.explanation,
      });
    }
    if (s.adaptiveQuestions && s.adaptiveQuestions.length) {
      s.adaptiveQuestions.forEach((aq, idx) => {
        qList.push({
          id: idx + 2,
          category: s.category || "Applied Skill",
          q: aq.q,
          options: aq.options,
          correct: aq.correct,
          explanation: aq.explanation,
        });
      });
    }
    subjectsMap[s.id] = {
      ...s,
      questions: qList.length ? qList : [
        {
          id: 1,
          category: s.category || "Core Concept",
          q: `Which principle is foundational to studying ${s.name}?`,
          options: ["Verified Core Axioms", "Unverified Assumptions", "Ignoring Baseline Definitions", "Skipping Prerequisites"],
          correct: 0,
          explanation: `Mastery in ${s.name} requires rigorous understanding of foundational principles and terminology.`,
        },
      ],
    };
  });

  const activeSubject = selectedSubjectId ? subjectsMap[selectedSubjectId] : null;
  const questions = activeSubject?.questions || [];
  const currentQ = questions[currentIndex];

  const handleSelectSubject = (subjId) => {
    setSelectedSubjectId(subjId);
    if (onSelectSubject) onSelectSubject(subjId);
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setIsCompleted(false);
  };

  const handleBackToSubjectList = () => {
    setSelectedSubjectId(null);
    if (onSelectSubject) onSelectSubject(null);
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setIsCompleted(false);
  };

  const handleSelectOption = (optionIndex) => {
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    if (selectedOption === null || !currentQ) return;

    const isCorrect = selectedOption === currentQ.correct;
    const updatedAnswers = [...answers, { qId: currentQ.id, selected: selectedOption, isCorrect }];
    setAnswers(updatedAnswers);
    setSelectedOption(null);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsEvaluating(true);
      setTimeout(() => {
        setIsEvaluating(false);
        setIsCompleted(true);
        const totalCorrect = updatedAnswers.filter((a) => a.isCorrect).length;
        if (onComplete) onComplete(totalCorrect);
      }, 900);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setIsCompleted(false);
  };

  const handleCustomSubjectCreated = (newSubj) => {
    if (onAddCustomSubject) {
      onAddCustomSubject(newSubj);
    }
    // Automatically select the newly created custom subject
    handleSelectSubject(newSubj.id);
  };

  // 1. SUBJECT SELECTION SCREEN (When no subject is currently open)
  if (!selectedSubjectId || !activeSubject) {
    return (
      <div className="assessment-container">
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
          <h2>Select a Subject to Begin Diagnostic Test</h2>
          <p>
            Real-world classroom curriculum for <b>{ageBandInfo.tierLabel}</b>. Choose an academic
            discipline below or add your own custom subject with uploaded notes.
          </p>
        </div>

        <div className="subject-cards-selection-grid">
          {availableSubjects.map((subj) => {
            const IconComponent = subj.icon || BookOpen;
            return (
              <div
                key={subj.id}
                className="subject-select-card card"
                onClick={() => handleSelectSubject(subj.id)}
              >
                <div className="subj-card-top flex-between">
                  <div className="subj-icon-orb" style={{ color: subj.color, background: `${subj.color}1a` }}>
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

                {subj.is_custom && subj.media?.length > 0 && (
                  <div className="custom-media-chip">
                    <FileText size={13} style={{ color: subj.color }} />
                    <span>{subj.media.length} reference note(s) attached</span>
                  </div>
                )}

                <div className="subj-card-foot flex-between">
                  <span className="subj-time-tag">
                    <Clock size={13} /> ~4 mins • {subjectsMap[subj.id]?.questions.length || 4} Questions
                  </span>
                  <button className="primary-btn-sm">
                    <span>Start Test</span>
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

  // 2. NEURAL EVALUATION LOADING SCREEN
  if (isEvaluating) {
    return (
      <div className="card center-card">
        <div className="pulsing-eval-orb">
          <Sparkles size={36} />
        </div>
        <span className="eyebrow">{activeSubject.name.toUpperCase()} EVALUATION</span>
        <h2>Synthesizing Knowledge Profile...</h2>
        <p>Analyzing response latency, cognitive depth, and calibrating your curriculum.</p>
      </div>
    );
  }

  // 3. ASSESSMENT COMPLETED RESULT SCREEN
  if (isCompleted) {
    const totalCorrect = answers.filter((a) => a.isCorrect).length;
    const scorePct = Math.round((totalCorrect / questions.length) * 100);

    return (
      <div className="card assessment-result-card">
        <div className="result-header">
          <div className="success-orb">✓</div>
          <span className="eyebrow">{activeSubject.name.toUpperCase()} • COMPLETED</span>
          <h2>Diagnostic Profile Calibrated!</h2>
          <p>
            You scored <b>{totalCorrect} of {questions.length}</b> ({scorePct}% Mastery Baseline).
          </p>
        </div>

        <div className="two-col result-details-grid">
          <div className="result-box mastery-box">
            <div className="result-box-head">
              <CheckCircle2 size={18} className="success-icon" />
              <strong>Verified Mastered Concepts</strong>
            </div>
            <ul>
              <li>✦ {activeSubject.name} Foundations ({scorePct}%)</li>
              <li>✦ Core Principles & Nomenclature (Verified)</li>
              <li>✦ Baseline Terminology Mastery</li>
            </ul>
          </div>

          <div className="result-box gap-box">
            <div className="result-box-head">
              <AlertCircle size={18} className="warning-icon" />
              <strong>Detected Knowledge Gap Focus</strong>
            </div>
            <p>
              LearnFlux identified a conceptual bottleneck in advanced application. We have calibrated your
              learning path to reinforce this topic before moving to higher tiers.
            </p>
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
            <span>View {activeSubject.name} Learning Path</span>
            <ArrowRight size={18} />
          </button>
          <button className="ghost-btn" onClick={() => setPage("tutor")}>
            <Bot size={17} />
            <span>Review Mistakes with AI Tutor</span>
          </button>
          <button className="outline-btn" onClick={handleRestart}>
            <RotateCcw size={16} />
            <span>Retake This Test</span>
          </button>
          <button className="outline-btn" onClick={handleBackToSubjectList}>
            <span>← Choose Other Subject</span>
          </button>
        </div>
      </div>
    );
  }

  // 4. ACTIVE DIAGNOSTIC QUESTION SCREEN
  const SubjectIcon = activeSubject.icon || BookOpen;

  return (
    <div className="assessment-container">
      {/* Subject Selector Bar */}
      <div className="active-subject-header-strip flex-between">
        <button className="back-subj-btn" onClick={handleBackToSubjectList}>
          <ArrowLeft size={16} />
          <span>Switch Subject</span>
        </button>

        <div className="active-subj-pill">
          <SubjectIcon size={16} style={{ color: activeSubject.color }} />
          <strong>{activeSubject.name}</strong>
          {activeSubject.is_custom && <span className="custom-indicator-badge">Custom</span>}
          <span>(Diagnostic Test Active)</span>
        </div>

        <div className="subject-quick-chips">
          {Object.keys(subjectsMap).map((id) => (
            <button
              key={id}
              className={`chip-min ${id === selectedSubjectId ? "active" : ""}`}
              onClick={() => handleSelectSubject(id)}
            >
              {subjectsMap[id].name.split(" ")[0]}
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
          <span className="eyebrow">DIAGNOSTIC TEST • {activeSubject.name.toUpperCase()}</span>
          <span className="step-counter-tag">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>
        <h2>Baseline Knowledge Assessment</h2>
        <p>Answer honestly without guessing. Our adaptive AI will pinpoint exactly where to begin.</p>
      </div>

      <div className="card question-card">
        {/* Progress Bar */}
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

        <div className="question-category-tag">
          <span style={{ color: activeSubject.color }}>Topic: {currentQ?.category || "Foundational Knowledge"}</span>
        </div>

        <h3 className="question-title">{currentQ?.q}</h3>

        <div className="options-list">
          {currentQ?.options?.map((optionText, idx) => {
            const isSelected = selectedOption === idx;
            return (
              <button
                key={idx}
                type="button"
                className={`answer-option ${isSelected ? "selected" : ""}`}
                onClick={() => handleSelectOption(idx)}
              >
                <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                <span className="option-text">{optionText}</span>
              </button>
            );
          })}
        </div>

        <div className="question-card-footer flex-between">
          <span className="question-hint">
            <HelpCircle size={14} /> Tip: Select the most accurate answer.
          </span>
          <button
            className="primary-btn next-q-btn"
            disabled={selectedOption === null}
            onClick={handleNext}
          >
            <span>{currentIndex + 1 === questions.length ? "Submit & Analyze" : "Next Question"}</span>
            <ArrowRight size={17} />
          </button>
        </div>
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
