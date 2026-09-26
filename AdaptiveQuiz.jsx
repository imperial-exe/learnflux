import React,{useState} from "react";
const data=[
 ["If an algorithm processes each input once, what is the likely complexity?",["O(1)","O(n)","O(log n)","O(n²)"],1],
 ["Binary search works correctly when the data is...",["Random","Sorted","Duplicated","Encrypted"],1],
 ["Which grows fastest as n becomes large?",["O(log n)","O(n)","O(n²)","O(1)"],2]
];
export default function AdaptiveQuiz(){
 const [n,setN]=useState(0),[feedback,setFeedback]=useState("");
 const pick=(i)=>{const ok=i===data[n][2];setFeedback(ok?"Correct! Difficulty increased.":"Let's reinforce the prerequisite concept.");setTimeout(()=>{setFeedback("");setN((n+1)%data.length)},650)};
 const q=data[n];
 return <div><div className="section-heading"><span className="eyebrow">ADAPTIVE ENGINE</span><h2>Adaptive Quiz</h2><p>The next question changes according to your answer.</p></div>
 <div className="card question-card"><div className="difficulty"><span>DIFFICULTY</span><b>{n===0?"FOUNDATION":n===1?"INTERMEDIATE":"ADVANCED"}</b></div><h2>{q[0]}</h2>{q[1].map((x,i)=><button className="answer" key={x} onClick={()=>pick(i)}>{String.fromCharCode(65+i)} <span>{x}</span></button>)}{feedback&&<div className="feedback">{feedback}</div>}</div></div>
}