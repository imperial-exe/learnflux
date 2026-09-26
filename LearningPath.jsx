import React from "react";
export default function LearningPath({ setPage }) {
 const path=[["Arrays","Mastered • 92%","done"],["Loops","Mastered • 86%","done"],["Functions","Mastered • 81%","done"],["Time Complexity","Knowledge gap detected • Recommended now","current"],["Searching Algorithms","Unlocks after Time Complexity","locked"],["Sorting Algorithms","Prerequisite: Searching","locked"]];
 return <div><div className="section-heading"><span className="eyebrow">AI GENERATED</span><h2>Your Personalized Learning Path</h2><p>LearnFlux rearranges concepts using your prerequisite knowledge and latest performance.</p></div>
 <div className="path-full">{path.map(([x,s,c],i)=><div className={`path-card ${c}`} key={x}><div className="path-number">{c==="done"?"✓":String(i+1).padStart(2,"0")}</div><div><h3>{x}</h3><p>{s}</p></div><span>{c==="done"?"MASTERED":c==="current"?"FOCUS":"LOCKED"}</span></div>)}</div>
 <button className="primary" onClick={()=>setPage("quiz")}>Continue with Adaptive Quiz →</button></div>
}