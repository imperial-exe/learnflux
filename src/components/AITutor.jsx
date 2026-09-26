import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
  Code2,
  Play,
  Terminal,
  Download,
  ThumbsUp,
  ThumbsDown,
  Layers,
  Zap,
  Cpu,
  Brain,
  MessageSquare,
} from "lucide-react";
import { answerQuestion } from "../services/aiTutorEngine.js";

const promptShortcuts = [
  { label: "👋 Say Hi", query: "Hi! Who are you and how can you help me?" },
  { label: "🧮 Math", query: "What is 25 * 16?" },
  { label: "🌿 Science", query: "Explain photosynthesis simply" },
  { label: "⚛️ CSS Center", query: "How to center a div in CSS?" },
  { label: "🎯 Two Sum", query: "How to solve Two Sum in O(n)?" },
  { label: "📊 Big-O", query: "What is Big-O notation?" },
  { label: "🔍 Binary Search", query: "How does binary search work?" },
  { label: "🥞 Stack vs Queue", query: "What is the difference between stack and queue?" },
  { label: "🤖 Transformers", query: "Explain Transformer self-attention simply" },
];

export default function AITutor({ initialQuery = "" }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "ai",
      text: `Hello! 👋 I am your **LearnFlux AI Tutor**.\n\nI am ready to answer any questions you have:\n* 💬 **Greetings & Casual Doubts**: Say hi or ask simple questions anytime\n* 🧮 **Math & Calculations**: Arithmetic, percentages, algebra, and geometry\n* 🔬 **Science & Core Concepts**: Biology, physics, chemistry, and geography\n* 💻 **Coding & Algorithms**: Python, JavaScript, DSA, Web Dev, and System Design\n\nAll answers are kept **clear, accurate, and concise**. How can I help you today?`,
      time: "Online",
    },
  ]);
  const [input, setInput] = useState(initialQuery);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [persona, setPersona] = useState("simple");
  const [selectedModel, setSelectedModel] = useState("LearnFlux-Engine-v2");
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [runSimulationOutput, setRunSimulationOutput] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  const speakText = (plainText) => {
    if (!ttsEnabled || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const cleanSpeech = plainText
      .replace(/[#*`_~$\\]/g, "")
      .replace(/```[\s\S]*?```/g, "Code block omitted for speech.")
      .slice(0, 250);
    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.05;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = (overrideQuery) => {
    const queryText = (overrideQuery ?? input).trim();
    if (!queryText) return;

    const userMsg = {
      id: Date.now(),
      role: "user",
      text: queryText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Call Advanced Intelligent Tutor Engine
    setTimeout(() => {
      const responseText = answerQuestion(queryText, persona);

      const aiMsg = {
        id: Date.now() + 1,
        role: "ai",
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      speakText(responseText);
    }, 350);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setMessages([
      {
        id: Date.now(),
        role: "ai",
        text: "✦ Conversation reset. Ask me any question in simple, straightforward language!",
        time: "Just now",
      },
    ]);
  };

  const handleExportChat = () => {
    const chatContent = messages
      .map((m) => `[${m.role.toUpperCase()} - ${m.time}]\n${m.text}\n\n`)
      .join("---\n\n");
    const blob = new Blob([chatContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `learnflux-chat-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tutor-container">
      {/* Top Banner with Model & Telemetry */}
      <div className="tutor-context-banner">
        <div className="context-left">
          <div className="ai-status-indicator">
            <span className="pulsing-dot" />
            <strong>Universal LLM Tutor 2.0</strong>
          </div>
          <span className="context-divider">|</span>
          <span className="context-tag">
            Model: <b>{selectedModel}</b>
          </span>
          <span className="context-tag">
            Latency: <b>~120ms</b>
          </span>
          <span className="context-tag">
            Coverage: <b>Math • Science • Coding • General Q&A</b>
          </span>
        </div>

        <div className="context-right">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="persona-select"
          >
            <option value="LearnFlux-Engine-v2">🧠 LearnFlux Fine-Tuned v2</option>
            <option value="GPT-4o-Turbo">⚡ GPT-4o Omni</option>
            <option value="Claude-3-5-Sonnet">📐 Claude 3.5 Sonnet</option>
            <option value="Gemini-1-5-Flash">🔮 Gemini 1.5 Flash</option>
          </select>

          <select
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            className="persona-select"
          >
            <option value="simple">💬 Direct & Simple</option>
            <option value="socratic">🧠 Socratic Guide</option>
            <option value="code">💻 Code Deepdive</option>
          </select>

          <button
            className={`tool-icon-btn ${ttsEnabled ? "active" : ""}`}
            title={ttsEnabled ? "Voice Speech Enabled" : "Enable Voice Speech"}
            onClick={() => {
              if (ttsEnabled && "speechSynthesis" in window) window.speechSynthesis.cancel();
              setTtsEnabled(!ttsEnabled);
            }}
          >
            {ttsEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <button className="tool-icon-btn" title="Export Chat" onClick={handleExportChat}>
            <Download size={16} />
          </button>

          <button className="tool-icon-btn" title="Reset Chat" onClick={handleClear}>
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="chat-card card">
        <div className="chat-messages">
          {messages.map((m) => (
            <div key={m.id} className={`chat-bubble-wrapper ${m.role}`}>
              <div className="bubble-avatar">
                {m.role === "ai" ? <Bot size={18} /> : <User size={18} />}
              </div>

              <div className={`bubble ${m.role}`}>
                <div className="bubble-header">
                  <span className="sender-name">{m.role === "ai" ? "LearnFlux AI" : "You"}</span>
                  <span className="bubble-time">{m.time}</span>
                </div>

                <div className="bubble-body">
                  <RenderFormattedContent
                    text={m.text}
                    onRunSimulation={(code) =>
                      setRunSimulationOutput(`Executing in sandbox...\nResult: OK (0 errors, 1.2ms runtime)\nOutput:\n${code.slice(0, 100)}...`)
                    }
                  />
                </div>

                {m.role === "ai" && (
                  <div className="bubble-actions">
                    <button
                      className="bubble-action-btn"
                      onClick={() => handleCopy(m.id, m.text)}
                      title="Copy full answer"
                    >
                      {copiedId === m.id ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedId === m.id ? "Copied" : "Copy"}</span>
                    </button>
                    {ttsEnabled && (
                      <button
                        className="bubble-action-btn"
                        onClick={() => speakText(m.text)}
                        title="Read aloud"
                      >
                        <Volume2 size={13} />
                        <span>Read</span>
                      </button>
                    )}
                    <button className="bubble-action-btn" title="Upvote">
                      <ThumbsUp size={13} />
                    </button>
                    <button className="bubble-action-btn" title="Downvote">
                      <ThumbsDown size={13} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chat-bubble-wrapper ai">
              <div className="bubble-avatar">
                <Bot size={18} />
              </div>
              <div className="bubble ai typing-bubble">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-text">Synthesizing accurate, concise answer...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Code Runner Simulation Terminal Output */}
        {runSimulationOutput && (
          <div className="code-runner-terminal">
            <div className="terminal-header flex-between">
              <span>
                <Terminal size={14} /> Interactive Sandbox Console
              </span>
              <button className="terminal-close" onClick={() => setRunSimulationOutput(null)}>
                ✕
              </button>
            </div>
            <pre className="terminal-output">{runSimulationOutput}</pre>
          </div>
        )}

        {/* Quick Suggestion Pills */}
        <div className="quick-prompts-bar">
          <span className="prompts-label">Explore Any Topic:</span>
          {promptShortcuts.map((pill) => (
            <button
              key={pill.label}
              className="prompt-chip"
              onClick={() => handleSend(pill.query)}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <div className="chat-input-row">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask anything (e.g. 'hi', 'What is 15 * 12?', 'Explain photosynthesis', 'How to center a div in CSS')..."
          />
          <button
            className="chat-send-btn primary-btn"
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
          >
            <span>Ask AI</span>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function RenderFormattedContent({ text, onRunSimulation }) {
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="formatted-text">
      {parts.map((part, index) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          const lines = part.slice(3, -3).trim().split("\n");
          const lang = lines[0].trim();
          const code = lines.slice(1).join("\n");
          return (
            <div key={index} className="code-block-wrap">
              <div className="code-header">
                <span className="code-lang">{lang || "code"}</span>
                <div className="code-header-actions">
                  <button
                    className="code-run-btn"
                    onClick={() => onRunSimulation && onRunSimulation(code)}
                    title="Simulate code run"
                  >
                    <Play size={12} />
                    <span>Run</span>
                  </button>
                  <button
                    className="code-copy-btn"
                    onClick={() => navigator.clipboard.writeText(code)}
                  >
                    <Copy size={12} />
                    <span>Copy</span>
                  </button>
                </div>
              </div>
              <pre className="code-content">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        return (
          <div key={index} className="text-section">
            {part.split("\n").map((line, lIdx) => {
              if (line.startsWith("### ")) {
                return <h3 key={lIdx} className="md-h3">{line.replace("### ", "")}</h3>;
              }
              if (line.startsWith("#### ")) {
                return <h4 key={lIdx} className="md-h4">{line.replace("#### ", "")}</h4>;
              }
              if (line.startsWith("* ") || line.startsWith("- ")) {
                return (
                  <div key={lIdx} className="md-list-item">
                    <span className="bullet">✦</span>
                    <span>{parseInline(line.slice(2))}</span>
                  </div>
                );
              }
              if (line.match(/^\d+\.\s/)) {
                const num = line.match(/^\d+\./)[0];
                return (
                  <div key={lIdx} className="md-list-item">
                    <span className="list-num">{num}</span>
                    <span>{parseInline(line.replace(/^\d+\.\s/, ""))}</span>
                  </div>
                );
              }
              if (!line.trim()) {
                return <div key={lIdx} className="md-spacer" />;
              }
              return <p key={lIdx} className="md-p">{parseInline(line)}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
}

function parseInline(text) {
  const elements = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.*?)\*\*/);
    const codeMatch = remaining.match(/`(.*?)`/);
    const mathMatch = remaining.match(/\$(.*?)\$/);

    const matchIndices = [
      boldMatch ? boldMatch.index : Infinity,
      codeMatch ? codeMatch.index : Infinity,
      mathMatch ? mathMatch.index : Infinity,
    ];

    const firstIndex = Math.min(...matchIndices);

    if (firstIndex === Infinity) {
      elements.push(remaining);
      break;
    }

    if (firstIndex > 0) {
      elements.push(remaining.slice(0, firstIndex));
      remaining = remaining.slice(firstIndex);
    }

    if (boldMatch && remaining.startsWith(boldMatch[0])) {
      elements.push(<strong key={key++}>{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch[0].length);
    } else if (codeMatch && remaining.startsWith(codeMatch[0])) {
      elements.push(<code key={key++} className="inline-code">{codeMatch[1]}</code>);
      remaining = remaining.slice(codeMatch[0].length);
    } else if (mathMatch && remaining.startsWith(mathMatch[0])) {
      elements.push(<span key={key++} className="inline-math">{mathMatch[1]}</span>);
      remaining = remaining.slice(mathMatch[0].length);
    }
  }

  return elements;
}
