import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Bot, Volume2, MessageSquare, X } from "lucide-react";

export default function FloatingEyeBot({ onRedirectToTutor }) {
  const headRef = useRef(null);
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);

  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0, angle: 0 });
  const [headTilt, setHeadTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [bubbleText, setBubbleText] = useState("Hello! I'm Flux Bot ✦ Click me for AI Help!");
  const [isBlinking, setIsBlinking] = useState(false);

  // Mouse cursor tracking for eye pupils and 3D head rotation
  useEffect(() => {
    let animationFrameId;

    const handleMouseMove = (e) => {
      if (!headRef.current) return;

      animationFrameId = requestAnimationFrame(() => {
        if (!headRef.current) return;
        const rect = headRef.current.getBoundingClientRect();
        const headCenterX = rect.left + rect.width / 2;
        const headCenterY = rect.top + rect.height / 2;

        const deltaX = e.clientX - headCenterX;
        const deltaY = e.clientY - headCenterY;
        const distance = Math.hypot(deltaX, deltaY);
        const angle = Math.atan2(deltaY, deltaX);

        // Max pupil translation radius in pixels
        const maxRadius = 6;
        const pupilDist = Math.min(distance / 40, maxRadius);
        const px = Math.cos(angle) * pupilDist;
        const py = Math.sin(angle) * pupilDist;

        // Subtle 3D tilt of head facing toward the mouse
        const tiltX = Math.max(-14, Math.min(14, -deltaY / 35));
        const tiltY = Math.max(-18, Math.min(18, deltaX / 35));

        setPupilPos({ x: px, y: py, angle: angle * (180 / Math.PI) });
        setHeadTilt({ rotateX: tiltX, rotateY: tiltY });
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Periodic natural blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 4200);

    return () => clearInterval(blinkInterval);
  }, []);

  // Speech synthesis greeting when clicked
  const speakGreeting = (textToSpeak) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak || "Hello! How can I help you?");
      utterance.rate = 1.05;
      utterance.pitch = 1.25; // cute, friendly robotic tone
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleBotClick = () => {
    const greeting = "Hello! How can I help you today?";
    setBubbleText("Opening AI Tutor now... 🚀");
    speakGreeting(greeting);

    setTimeout(() => {
      if (onRedirectToTutor) {
        onRedirectToTutor("Hello! How can I help you today?");
      }
    }, 600);
  };

  return (
    <div
      className="floating-eyebot-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Speech Bubble that pops up above the bot */}
      {(isHovered || isSpeaking) && (
        <div className="eyebot-speech-bubble" onClick={handleBotClick}>
          <div className="eyebot-bubble-tail" />
          <div className="flex-between eyebot-bubble-header">
            <span className="bubble-bot-title">
              <Bot size={13} /> Flux Bot
            </span>
            <span className="bubble-status-live">
              <Volume2 size={11} className={isSpeaking ? "pulsing-voice" : ""} />
              {isSpeaking ? "Speaking..." : "Online"}
            </span>
          </div>
          <p className="eyebot-bubble-msg">{bubbleText}</p>
          <span className="eyebot-click-hint">Click robot to open AI Tutor →</span>
        </div>
      )}

      {/* Main 3D Floating Robot Body */}
      <div
        className="floating-eyebot-body"
        onClick={handleBotClick}
        role="button"
        tabIndex={0}
        aria-label="Flux Bot companion"
        title="Flux Bot - Click to chat with AI Tutor"
      >
        {/* Holographic Glowing Antenna */}
        <div className="eyebot-antenna">
          <div className="eyebot-antenna-stem" />
          <div className="eyebot-antenna-beacon" />
        </div>

        {/* Robot Head with 3D Mouse Tilt */}
        <div
          ref={headRef}
          className="eyebot-head"
          style={{
            transform: `perspective(300px) rotateX(${headTilt.rotateX}deg) rotateY(${headTilt.rotateY}deg)`,
          }}
        >
          {/* Ear audio receptors */}
          <div className="eyebot-ear left" />
          <div className="eyebot-ear right" />

          {/* Glossy Dark Visor Screen */}
          <div className="eyebot-visor">
            {/* Left Eye */}
            <div
              ref={leftEyeRef}
              className={`eyebot-eye left ${isBlinking ? "blinking" : ""}`}
            >
              <div
                className="eyebot-pupil"
                style={{
                  transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)`,
                }}
              >
                <div
                  className="pupil-iris-indicator"
                  style={{ transform: `rotate(${pupilPos.angle}deg)` }}
                />
              </div>
            </div>

            {/* Right Eye */}
            <div
              ref={rightEyeRef}
              className={`eyebot-eye right ${isBlinking ? "blinking" : ""}`}
            >
              <div
                className="eyebot-pupil"
                style={{
                  transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)`,
                }}
              >
                <div
                  className="pupil-iris-indicator"
                  style={{ transform: `rotate(${pupilPos.angle}deg)` }}
                />
              </div>
            </div>

            {/* Audio Wave Mouth (animates during speech or hover) */}
            <div className={`eyebot-mouth ${isSpeaking || isHovered ? "speaking-wave" : ""}`}>
              <span className="mouth-bar bar-1" />
              <span className="mouth-bar bar-2" />
              <span className="mouth-bar bar-3" />
              <span className="mouth-bar bar-4" />
              <span className="mouth-bar bar-5" />
            </div>
          </div>
        </div>

        {/* Levitating Torso with Arc Reactor Core */}
        <div className="eyebot-torso">
          <div className="eyebot-core-reactor">
            <Sparkles size={11} className="reactor-glow-icon" />
          </div>
        </div>

        {/* Floating Hands */}
        <div className="eyebot-hand left" />
        <div className="eyebot-hand right" />

        {/* Neon Ion Thruster Glow underneath */}
        <div className="eyebot-thruster-aura" />
      </div>
    </div>
  );
}
