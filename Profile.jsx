import React from "react";
export default function Profile(){
 return <div><div className="section-heading"><span className="eyebrow">CONTINUOUS PROFILE</span><h2>Your Learning Profile</h2><p>Your profile evolves after every assessment and practice session.</p></div>
 <div className="two-col"><div className="card"><span className="eyebrow">LEARNING STRENGTHS</span><h3>What you know</h3>{[["Arrays",92],["Loops",86],["Functions",81],["Time Complexity",48]].map(([x,v])=><div className="profile-skill" key={x}><div><span>{x}</span><b>{v}%</b></div><div className="bar"><i style={{width:v+"%"}}/></div></div>)}</div>
 <div className="card"><span className="eyebrow">AI RECOMMENDATIONS</span><h3>What to do next</h3><div className="recommend">⚡ Revise Big-O notation before sorting algorithms.</div><div className="recommend">🎯 Complete 8 adaptive questions today.</div><div className="recommend">📈 Your consistency improved by 18% this week.</div></div></div></div>
}