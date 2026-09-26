import React, { useState } from "react";
const qs = [
 {q:"Which data structure follows FIFO?", a:["Stack","Queue","Tree","Graph"], c:1},
 {q:"What is the average complexity of accessing an array by index?", a:["O(1)","O(n)","O(log n)","O(n²)"], c:0},
 {q:"Which notation describes algorithm growth as input increases?", a:["HTML","Big-O","CSS","SQL"], c:1}
];
export default function Assessment({ setPage, onComplete }) {
 const [n,setN]=useState(0); const [score,setScore]=useState(0); const [done,setDone]=useState(false);
 const answer=(i)=>{const s=score+(i===qs[n].c?1:0);setScore(s); if(n+1<qs.length)setN(n+1);else{setDone(true);onComplete(s)}}};
 if(done)return <div className="center-card card"><div className="success-orb">✓</div><span className="eyebrow">ASSESSMENT COMPLETE</span><h2>Your learning profile is ready.</h2><p>You scored <b>{score}/{qs.length}</b>. LearnFlux detected a focus area around Time Complexity and has prepared a personalized path.</p><button className="primary" onClick={()=>setPage("path")}>View My Learning Path →</button></div>;
 const q=qs[n];
 return <div className="quiz-wrap"><div className="section-heading"><span className="eyebrow">STEP 01 • DIAGNOSTIC</span><h2>Let's understand what you know.</h2><p>Your answers shape your personalized learning path.</p></div>
 <div className="card question-card"><div className="progress"><i style={{width:`${((n+1)/qs.length)*100}%`}}/></div><span className="eyebrow">QUESTION {n+1} OF {qs.length}</span><h2>{q.q}</h2>{q.a.map((x,i)=><button className="answer" key={x} onClick={()=>answer(i)}>{String.fromCharCode(65+i)} <span>{x}</span></button>)}</div></div>
}