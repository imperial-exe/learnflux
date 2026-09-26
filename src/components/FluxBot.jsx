import React, { useState, useEffect } from "react";
import { Sparkles, Bot, MessageSquare, ArrowRight, Zap, Volume2 } from "lucide-react";

export default function FluxBot({ onRedirectToTutor }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechText, setSpeechText] = useState("Hello! How can I help you today? ✦ Click me to chat!");
  const [hasInteracted, setHasInteracted] = useState(false);

  // Play browser speech synthesis greeting
  const speakGreeting = (textToSpeak) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // stop any active speech
      const utterance = new SpeechSynthesisUtterance(textToSpeak || "Hello! How can I help you?");
      utterance.rate = 1.05;
      utterance.pitch = 1.2; // cute/techy robot pitch
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleBotClick = () => {
    setHasInteracted(true);
    const greeting = "Hello! How can I help you today?";
    setSpeechText("Hello! How can I help you? Opening your AI Tutor now... 🚀");
    speakGreeting(greeting);

    // Smooth redirect to AI tutor after greeting animation
    setTimeout(() => {
      if (onRedirectToTutor) {
        onRedirectToTutor("Hello! I clicked on Flux Bot. How can you help me today?");
      }
    }, 750);
  };

  return (
    <div className="fluxbot-companion-banner card">
      <div className="fluxbot-card-glow" />

      {/* Robot Graphic & Animation */}
      <div className="fluxbot-avatar-area" onClick={handleBotClick} role="button" tabIndex={0}>
        <div className={`fluxbot-figure ${isSpeaking ? "speaking" : ""}`}>
          {/* Holographic antenna */}
          <div className="fluxbot-antenna">
            <div className="antenna-bulb" />
          </div>

          {/* Robot Head */}
          <div className="fluxbot-head">
            {/* Glowing visor / eyes */}
            <div className="fluxbot-visor">
              <div className="fluxbot-eye left">
                <div className="eye-pupil" />
              </div>
              <div className="fluxbot-eye right">
                <div className="eye-pupil" />
              </div>
            </div>
            {/* Audio frequency wave on mouth when speaking */}
            <div className={`fluxbot-mouth ${isSpeaking ? "active-waves" : ""}`}>
              <span className="wave-bar" />
              <span className="wave-bar" />
              <span className="wave-bar" />
              <span className="wave-bar" />
              <span className="wave-bar" />
            </div>
          </div>

          {/* Robotic Body & Floating Hands */}
          <div className="fluxbot-torso">
            <div className="flux-core-reactor">
              <Sparkles size={14} className="reactor-sparkle" />
            </div>
          </div>
          <div className="fluxbot-hand left-hand" />
          <div className="fluxbot-hand right-hand" />

          {/* Shadow hover ring */}
          <div className="fluxbot-shadow-ring" />
        </div>

        <div className="fluxbot-tag-pill">
          <span className="live-blip" />
          <span>FLUX BOT • AI ASSISTANT</span>
        </div>
      </div>

      {/* Speech & Interaction Content */}
      <div className="fluxbot-speech-col">
        <div className="fluxbot-bubble-box" onClick={handleBotClick}>
          <div className="bubble-pointer" />
          <div className="bubble-header flex-between">
            <span className="bubble-sender">
              <Bot size={15} /> Flux Bot
            </span>
            <span className="bubble-voice-indicator">
              <Volume2 size={13} className={isSpeaking ? "pulsing-voice" : ""} />
              {isSpeaking ? "Speaking..." : "Click to Speak & Chat"}
            </span>
          </div>
          <p className="bubble-message-text">"{speechText}"</p>
        </div>

        <div className="fluxbot-actions-row">
          <button className="primary-btn fluxbot-chat-btn" onClick={handleBotClick}>
            <Zap size={16} />
            <span>Ask Flux Bot a Question</span>
            <ArrowRight size={16} />
          </button>

          <div className="fluxbot-prompt-suggestions">
            <button
              className="flux-suggestion-chip"
              onClick={(e) => {
                e.stopPropagation();
                if (onRedirectToTutor) onRedirectToTutor("Explain how to solve Two Sum in O(n) time");
              }}
            >
              "Solve Two Sum in O(n)"
            </button>
            <button
              className="flux-suggestion-chip"
              onClick={(e) => {
                e.stopPropagation();
                if (onRedirectToTutor) onRedirectToTutor("Explain Time Complexity simply");
              }}
            >
              "Explain Time Complexity"
            </button>
            <button
              className="flux-suggestion-chip"
              onClick={(e) => {
                e.stopPropagation();
                if (onRedirectToTutor) onRedirectToTutor("How does Transformers self-attention work?");
              }}
            >
              "How does Self-Attention work?"
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
