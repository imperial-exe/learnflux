import React from "react";
import KnowledgeMap from "./KnowledgeMap";
import { ArrowUpRight, Target, Trophy, AlertTriangle, Flame } from "lucide-react";

export default function Dashboard({ setPage }) {
  return <div>
    <div className="hero-banner">
      <div>
        <span className="eyebrow">PERSONALIZED FOR YOU</span>
        <h2>Learn smarter.<br/><span>Not harder.</span></h2>
        <p>LearnFlux continuously studies your performance, detects knowledge gaps, and adapts what you learn next.</p>
        <button className="primary" onClick={() => setPage("assessment")}>Start Diagnostic Assessment <ArrowUpRight size={17}/></button>
      </div>
      <div className="hero-orb"><div>AI</div></div>
    </div>

    <div className="stat-grid">
      <Stat icon={<Target/>} label="LEARNING SCORE" value="78%" note="↑ 8% this week"/>
      <Stat icon={<Trophy/>} label="CONCEPTS MASTERED" value="24" note="+5 this week"/>
      <Stat icon={<AlertTriangle/>} label="KNOWLEDGE GAPS" value="6" note="Need attention" warning/>
      <Stat icon={<Flame/>} label="STREAK" value="7 days" note="Personal best"/>
    </div>

    <div className="two-col">
      <div className="card insight-card">
        <div className="card-title"><div><span className="eyebrow">LIVE AI INSIGHT</span><h3>Your next best step</h3></div><span className="live">LIVE</span></div>
        <p>Your performance shows strong understanding of <b>Arrays</b> and <b>Loops</b>. Before moving to advanced algorithms, LearnFlux recommends reinforcing <b>Time Complexity</b>.</p>
        <button className="link-btn" onClick={() => setPage("path")}>View personalized path →</button>
      </div>
      <div className="card">
        <div className="card-title"><div><span className="eyebrow">45 MINUTES</span><h3>Today's focus</h3></div></div>
        {["Time Complexity • Knowledge gap • 15 min","Adaptive Practice • 8 questions • 20 min","Quick Review • Flash concepts • 10 min"].map((x,i)=>
          <div className="focus-row" key={x}><span>{i===0?"✦":i+1}</span><div>{x}</div></div>
        )}
      </div>
    </div>
    <div className="two-col">
      <KnowledgeMap/>
      <div className="card path-preview">
        <span className="eyebrow">AI GENERATED</span><h3>Personalized learning path</h3>
        {["Arrays","Loops","Functions","Time Complexity","Searching Algorithms"].map((x,i)=>
          <div className={`path-line ${i<3?"done":i===3?"current":""}`} key={x}><span>{i<3?"✓":String(i+1).padStart(2,"0")}</span><div><b>{x}</b><small>{i<3?"Mastered":i===3?"Current focus":"Unlocks next"}</small></div></div>
        )}
      </div>
    </div>
  </div>
}

function Stat({icon,label,value,note,warning}) {
 return <div className="stat-card"><div className="stat-icon">{icon}</div><span>{label}</span><strong>{value}</strong><small className={warning?"warning":""}>{note}</small></div>
}