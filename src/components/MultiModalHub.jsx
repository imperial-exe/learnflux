import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Network,
  Layers,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Brain,
  Zap,
} from "lucide-react";
import { backendApi } from "../services/backendApi";

export default function MultiModalHub({ subtopicId = "sub-cs-complexity", studentId, onMasteryUpdated }) {
  const [activeTab, setActiveTab] = useState("notes"); // "notes", "mind_map", "flashcards", "quiz"
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardsReviewStats, setCardsReviewStats] = useState({ mastered: 0, reviewAgain: 0 });

  // Quiz state
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const mats = await backendApi.getStudyMaterials(subtopicId);
      const qs = await backendApi.getQuestions(subtopicId);
      setMaterials(mats);
      setQuestions(qs);
      setLoading(false);
    }
    loadData();
  }, [subtopicId]);

  const noteMaterial = materials.find((m) => m.material_type === "note");
  const mindMapMaterial = materials.find((m) => m.material_type === "mind_map");
  const flashcardMaterial = materials.find((m) => m.material_type === "flashcard");
  const flashcards = flashcardMaterial?.content?.cards || [];

  // Flashcard Handlers
  const handleNextCard = (status) => {
    if (status === "got_it") {
      setCardsReviewStats((prev) => ({ ...prev, mastered: prev.mastered + 1 }));
    } else {
      setCardsReviewStats((prev) => ({ ...prev, reviewAgain: prev.reviewAgain + 1 }));
    }

    setIsFlipped(false);
    if (currentCardIndex + 1 < flashcards.length) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

  // Quiz Attempt Handler with Mistake DNA Tagging
  const handleQuizAnswer = async (option) => {
    if (selectedOption !== null) return;
    setSelectedOption(option.id);

    const isCorrect = option.isCorrect;
    const currentQ = questions[currentQIndex];

    if (isCorrect) {
      setQuizScore((s) => s + 1);
      setQuizFeedback({
        correct: true,
        text: "Correct! Outstanding understanding.",
      });
    } else {
      setQuizFeedback({
        correct: false,
        errorType: option.errorType,
        text: `Mistake detected (${option.errorType || "conceptual"} error). Re-evaluating Mistake DNA.`,
      });
    }

    // Call backend engine to record attempt & update student Mistake DNA
    const result = await backendApi.recordAttempt({
      studentId: studentId || "student-arjun",
      subtopicId,
      source: "multiModalQuiz",
      correct: isCorrect,
      errorType: isCorrect ? null : (option.errorType || "conceptual"),
      difficulty: currentQ.difficulty || 2,
    });

    if (onMasteryUpdated) {
      onMasteryUpdated(result);
    }

    setTimeout(() => {
      setSelectedOption(null);
      setQuizFeedback(null);
      if (currentQIndex + 1 < questions.length) {
        setCurrentQIndex((prev) => prev + 1);
      } else {
        setQuizCompleted(true);
      }
    }, 1500);
  };

  const restartQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setQuizFeedback(null);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  if (loading) {
    return <div className="card loading-card">Loading Multi-Modal Study Resources...</div>;
  }

  return (
    <div className="card multi-modal-container">
      {/* Tab Switcher Header */}
      <div className="modal-hub-header flex-between">
        <div>
          <span className="eyebrow">MULTI-MODAL RESOURCE HUB</span>
          <h3>Adaptive Study Modes</h3>
        </div>

        <div className="hub-tabs-list">
          <button
            className={`hub-tab-btn ${activeTab === "notes" ? "active" : ""}`}
            onClick={() => setActiveTab("notes")}
          >
            <BookOpen size={15} />
            <span>Structured Notes</span>
          </button>
          <button
            className={`hub-tab-btn ${activeTab === "mind_map" ? "active" : ""}`}
            onClick={() => setActiveTab("mind_map")}
          >
            <Network size={15} />
            <span>Interactive Mind Map</span>
          </button>
          <button
            className={`hub-tab-btn ${activeTab === "flashcards" ? "active" : ""}`}
            onClick={() => setActiveTab("flashcards")}
          >
            <Layers size={15} />
            <span>Recall Flashcards</span>
          </button>
          <button
            className={`hub-tab-btn ${activeTab === "quiz" ? "active" : ""}`}
            onClick={() => setActiveTab("quiz")}
          >
            <Zap size={15} />
            <span>Mistake DNA Quiz</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Structured Markdown Notes */}
      {activeTab === "notes" && (
        <div className="hub-content-box notes-panel">
          <div className="notes-header flex-between">
            <h4>{noteMaterial?.title || "Core Conceptual Notes"}</h4>
            <span className="notes-badge">MARKDOWN VERIFIED</span>
          </div>
          <div className="markdown-render-box">
            <RenderNotesMarkdown text={noteMaterial?.content?.markdown || "No notes available for this subtopic."} />
          </div>
        </div>
      )}

      {/* TAB 2: Interactive Mind Map View */}
      {activeTab === "mind_map" && (
        <div className="hub-content-box mindmap-panel">
          <div className="mindmap-header flex-between">
            <h4>{mindMapMaterial?.title || "Concept Hierarchy Graph"}</h4>
            <span className="nodes-count-tag">
              {mindMapMaterial?.content?.nodes?.length || 4} Concept Nodes
            </span>
          </div>

          <div className="mindmap-svg-canvas">
            <svg viewBox="0 0 540 240" className="mindmap-svg">
              <defs>
                <linearGradient id="edgeGlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>

              {/* Connecting Edges */}
              {(mindMapMaterial?.content?.edges || []).map((edge, i) => {
                const sourceNode = mindMapMaterial?.content?.nodes.find((n) => n.id === edge.source);
                const targetNode = mindMapMaterial?.content?.nodes.find((n) => n.id === edge.target);
                const sIdx = mindMapMaterial?.content?.nodes.indexOf(sourceNode) || 0;
                const tIdx = mindMapMaterial?.content?.nodes.indexOf(targetNode) || 1;

                const x1 = 80 + (sIdx % 3) * 170;
                const y1 = 60 + Math.floor(sIdx / 3) * 110;
                const x2 = 80 + (tIdx % 3) * 170;
                const y2 = 60 + Math.floor(tIdx / 3) * 110;

                return (
                  <g key={i}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#edgeGlow)" strokeWidth="2.5" />
                    {edge.label && (
                      <text
                        x={(x1 + x2) / 2}
                        y={(y1 + y2) / 2 - 8}
                        fill="#c77dff"
                        fontSize="9"
                        textAnchor="middle"
                        fontWeight="700"
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Concept Nodes */}
              {(mindMapMaterial?.content?.nodes || []).map((node, idx) => {
                const x = 80 + (idx % 3) * 170;
                const y = 60 + Math.floor(idx / 3) * 110;
                return (
                  <g key={node.id} transform={`translate(${x}, ${y})`} className="mindmap-node-group">
                    <circle
                      r="36"
                      fill="#120c1d"
                      stroke={node.color || "#8b5cf6"}
                      strokeWidth="2.5"
                      style={{ filter: `drop-shadow(0 0 10px ${node.color || "#8b5cf6"}55)` }}
                    />
                    <text
                      textAnchor="middle"
                      dy="4"
                      fill="#ffffff"
                      fontSize="9.5"
                      fontWeight="700"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {/* TAB 3: Recall Flashcard Deck */}
      {activeTab === "flashcards" && (
        <div className="hub-content-box flashcards-panel">
          <div className="flex-between flashcard-topbar">
            <span>
              Card {currentCardIndex + 1} of {flashcards.length}
            </span>
            <div className="flashcard-score-pill">
              <span className="text-success">Mastered: {cardsReviewStats.mastered}</span>
              <span>•</span>
              <span className="text-warning">Review: {cardsReviewStats.reviewAgain}</span>
            </div>
          </div>

          {flashcards.length > 0 ? (
            <div className="flashcard-display-area">
              <div
                className={`flashcard-3d-card ${isFlipped ? "flipped" : ""}`}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div className="card-face front-face">
                  <span className="card-hint-tag">QUESTION (CLICK TO REVEAL)</span>
                  <h3>{flashcards[currentCardIndex].front}</h3>
                  <small>Tap anywhere to flip card</small>
                </div>

                <div className="card-face back-face">
                  <span className="card-hint-tag answer-tag">ANSWER</span>
                  <h3>{flashcards[currentCardIndex].back}</h3>
                  {flashcards[currentCardIndex].tip && (
                    <p className="card-tip-note">💡 {flashcards[currentCardIndex].tip}</p>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flashcard-action-bar">
                <button
                  className="card-review-btn"
                  onClick={() => handleNextCard("review_again")}
                >
                  <RotateCcw size={15} />
                  <span>Review Again</span>
                </button>
                <button
                  className="primary-btn-sm card-master-btn"
                  onClick={() => handleNextCard("got_it")}
                >
                  <CheckCircle2 size={16} />
                  <span>Got It! (Mastered)</span>
                </button>
              </div>
            </div>
          ) : (
            <p>No flashcards found for this subtopic.</p>
          )}
        </div>
      )}

      {/* TAB 4: Mistake DNA Tagged Quiz Sandbox */}
      {activeTab === "quiz" && (
        <div className="hub-content-box quiz-panel">
          {quizCompleted ? (
            <div className="quiz-complete-recap text-center">
              <div className="success-orb">✓</div>
              <h4>Quiz Session Complete!</h4>
              <p>
                Score: <b>{quizScore} of {questions.length}</b>. Your Mistake DNA metrics and mastery score have been updated in real-time.
              </p>
              <button className="primary-btn" onClick={restartQuiz}>
                <span>Practice Again</span>
                <RotateCcw size={16} />
              </button>
            </div>
          ) : questions.length > 0 ? (
            <div className="quiz-question-box">
              <div className="flex-between quiz-q-meta">
                <span className="q-badge">
                  Question {currentQIndex + 1} of {questions.length}
                </span>
                <span className="diff-tag">
                  Difficulty: Level {questions[currentQIndex].difficulty || 1}
                </span>
              </div>

              <h4 className="quiz-prompt-text">{questions[currentQIndex].prompt}</h4>

              <div className="quiz-options-grid">
                {questions[currentQIndex].options.map((opt) => {
                  let optClass = "";
                  if (selectedOption !== null) {
                    if (opt.isCorrect) optClass = "correct-opt";
                    else if (selectedOption === opt.id) optClass = "wrong-opt";
                  }

                  return (
                    <button
                      key={opt.id}
                      className={`quiz-opt-btn ${optClass}`}
                      onClick={() => handleQuizAnswer(opt)}
                      disabled={selectedOption !== null}
                    >
                      <span className="opt-id">{opt.id.toUpperCase()}</span>
                      <span className="opt-txt">{opt.text}</span>
                      {selectedOption === opt.id && !opt.isCorrect && (
                        <span className="error-dna-pill">{opt.errorType || "conceptual"} error</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {quizFeedback && (
                <div className={`quiz-feedback-bar ${quizFeedback.correct ? "success" : "error"}`}>
                  {quizFeedback.correct ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <span>{quizFeedback.text}</span>
                </div>
              )}
            </div>
          ) : (
            <p>No questions registered for this concept.</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Inline formatter: bold, italic, inline-code, inline-math ───────────────
function InlineMarkdown({ text }) {
  // Tokenise: **bold**, *italic*, `code`, $math$
  const tokens = [];
  let remaining = text;
  const patterns = [
    { re: /\*\*(.+?)\*\*/,  render: (m) => <strong key={Math.random()} style={{ color: "#e2d9ff", fontWeight: 700 }}>{m[1]}</strong> },
    { re: /\*(.+?)\*/,      render: (m) => <em key={Math.random()} style={{ color: "#c4b5fd" }}>{m[1]}</em> },
    { re: /`([^`]+)`/,      render: (m) => (
        <code key={Math.random()} style={{
          background: "#1a1030", color: "#a78bfa", padding: "1px 6px",
          borderRadius: 4, fontFamily: "JetBrains Mono, monospace", fontSize: "0.88em",
        }}>{m[1]}</code>
      )
    },
    { re: /\$([^$]+)\$/,    render: (m) => (
        <span key={Math.random()} style={{
          fontFamily: "Georgia, serif", color: "#67e8f9", fontStyle: "italic", fontSize: "0.95em",
        }}>{m[1]}</span>
      )
    },
  ];

  while (remaining.length > 0) {
    let earliest = { index: Infinity, length: 0, render: null };
    let matchedPattern = null;
    for (const p of patterns) {
      const m = remaining.match(p.re);
      if (m && m.index < earliest.index) {
        earliest = { index: m.index, length: m[0].length, render: () => p.render(m) };
      }
    }
    if (earliest.render) {
      if (earliest.index > 0) tokens.push(remaining.slice(0, earliest.index));
      tokens.push(earliest.render());
      remaining = remaining.slice(earliest.index + earliest.length);
    } else {
      tokens.push(remaining);
      break;
    }
  }
  return <>{tokens}</>;
}

// ─── Full markdown renderer ───────────────────────────────────────────────────
function RenderNotesMarkdown({ text }) {
  const lines = text.split("\n");
  const output = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block  ```lang … ```
    if (line.trimStart().startsWith("```")) {
      const lang = line.trimStart().slice(3).trim() || "code";
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      output.push(
        <div key={i} style={{ position: "relative", margin: "14px 0" }}>
          <div style={{
            position: "absolute", top: 8, right: 12,
            fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1,
          }}>
            {lang}
          </div>
          <pre style={{
            background: "#0a0814", border: "1px solid #2d1f45", borderRadius: 10,
            padding: "32px 20px 16px", overflowX: "auto",
            fontFamily: "JetBrains Mono, monospace", fontSize: 12.5,
            lineHeight: 1.75, color: "#a5f3fc", margin: 0,
          }}>
            <code>{codeLines.join("\n")}</code>
          </pre>
        </div>
      );
      i++;
      continue;
    }

    // Block math  $$ … $$
    if (line.trim() === "$$") {
      const mathLines = [];
      i++;
      while (i < lines.length && lines[i].trim() !== "$$") {
        mathLines.push(lines[i]);
        i++;
      }
      output.push(
        <div key={i} style={{
          background: "#0d0a1a", border: "1px solid #3730a344",
          borderRadius: 8, padding: "10px 16px", margin: "12px 0",
          fontFamily: "Georgia, serif", color: "#67e8f9",
          fontSize: 15, textAlign: "center", fontStyle: "italic",
        }}>
          {mathLines.join("  ")}
        </div>
      );
      i++;
      continue;
    }

    // H1  #
    if (/^# /.test(line)) {
      output.push(
        <h2 key={i} style={{
          fontSize: 22, fontWeight: 800, margin: "20px 0 8px",
          background: "linear-gradient(135deg, #a78bfa, #67e8f9)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          <InlineMarkdown text={line.replace(/^# /, "")} />
        </h2>
      );
      i++; continue;
    }

    // H2  ##
    if (/^## /.test(line)) {
      output.push(
        <h3 key={i} style={{
          fontSize: 17, fontWeight: 700, color: "#c4b5fd",
          margin: "18px 0 6px", borderBottom: "1px solid #2d1f4566", paddingBottom: 6,
        }}>
          <InlineMarkdown text={line.replace(/^## /, "")} />
        </h3>
      );
      i++; continue;
    }

    // H3  ###
    if (/^### /.test(line)) {
      output.push(
        <h4 key={i} style={{ fontSize: 14, fontWeight: 700, color: "#a78bfa", margin: "14px 0 4px" }}>
          <InlineMarkdown text={line.replace(/^### /, "")} />
        </h4>
      );
      i++; continue;
    }

    // H4  ####
    if (/^#### /.test(line)) {
      output.push(
        <h5 key={i} style={{ fontSize: 13, fontWeight: 600, color: "#818cf8", margin: "10px 0 4px" }}>
          <InlineMarkdown text={line.replace(/^#### /, "")} />
        </h5>
      );
      i++; continue;
    }

    // Blockquote  > …
    if (/^> /.test(line)) {
      output.push(
        <blockquote key={i} style={{
          borderLeft: "3px solid #7c3aed", paddingLeft: 14, margin: "10px 0",
          color: "#9ca3af", fontStyle: "italic", fontSize: 13,
        }}>
          <InlineMarkdown text={line.replace(/^> /, "")} />
        </blockquote>
      );
      i++; continue;
    }

    // Ordered list  1. …  2. …
    if (/^\d+\.\s/.test(line)) {
      const listItems = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      output.push(
        <ol key={i} style={{ paddingLeft: 22, margin: "8px 0", color: "#d1d5db", lineHeight: 1.85 }}>
          {listItems.map((item, j) => (
            <li key={j} style={{ marginBottom: 4 }}>
              <InlineMarkdown text={item} />
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Bullet list  - … or * …
    if (/^[-*]\s/.test(line)) {
      const listItems = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        listItems.push(lines[i].replace(/^[-*]\s/, ""));
        i++;
      }
      output.push(
        <ul key={i} style={{ listStyle: "none", padding: 0, margin: "8px 0" }}>
          {listItems.map((item, j) => (
            <li key={j} style={{ display: "flex", gap: 10, marginBottom: 5, color: "#d1d5db", lineHeight: 1.7 }}>
              <span style={{ color: "#a78bfa", flexShrink: 0, marginTop: 2 }}>✦</span>
              <span><InlineMarkdown text={item} /></span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Horizontal rule  ---
    if (/^---+$/.test(line.trim())) {
      output.push(
        <hr key={i} style={{ border: "none", borderTop: "1px solid #2d1f45", margin: "16px 0" }} />
      );
      i++; continue;
    }

    // Empty line → spacing
    if (!line.trim()) {
      output.push(<div key={i} style={{ height: 8 }} />);
      i++; continue;
    }

    // Default paragraph
    output.push(
      <p key={i} style={{ color: "#d1d5db", lineHeight: 1.8, margin: "6px 0", fontSize: 14 }}>
        <InlineMarkdown text={line} />
      </p>
    );
    i++;
  }

  return <div className="notes-md-body">{output}</div>;
}

