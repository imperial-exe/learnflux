import React from "react";
const skills = [
  ["Arrays", 92], ["Loops", 86], ["Functions", 81], ["Time Complexity", 48], ["Searching", 32]
];
export default function KnowledgeMap() {
  return <div className="card">
    <div className="card-title"><div><span className="eyebrow">AI KNOWLEDGE MAP</span><h3>Skill mastery</h3></div><SparkIcon/></div>
    {skills.map(([name, value]) => <div className="skill-row" key={name}>
      <div className="skill-name">{name}</div>
      <div className="bar"><i style={{width:`${value}%`}}/></div>
      <strong className={value < 60 ? "danger-text":""}>{value}%</strong>
    </div>)}
  </div>
}
function SparkIcon(){return <span className="spark-icon">✦</span>}