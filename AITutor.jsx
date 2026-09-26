import React,{useState} from "react";
const replies={
 "big-o":"Based on your current profile, let's keep this simple. Big-O describes how an algorithm's work grows as the input grows. If you inspect every item once, that is O(n). If you instantly access one item by index, that is O(1).",
 "recursion":"Recursion means a function solves a problem by calling itself on a smaller version of that problem. Every recursive solution needs a base case that stops the calls.",
 "arrays":"An array stores values in an ordered collection. Reading an item by index is typically O(1), while searching an unsorted array can require O(n) checks.",
 "default":"I can help you break that down. Tell me the concept, paste the question, or ask for a step-by-step solution. I'll adapt the explanation to your current learning profile."
};
export default function AITutor(){
 const [messages,setMessages]=useState([{role:"ai",text:"Hi Sneha! ✦ I noticed Time Complexity is your current knowledge gap. Ask me a doubt and I'll explain it at your level."}]);
 const [input,setInput]=useState("");
 const send=(preset)=>{const t=(preset??input).trim();if(!t)return;setMessages(m=>[...m,{role:"user",text:t}]);setInput("");setTimeout(()=>{const key=Object.keys(replies).find(k=>t.toLowerCase().includes(k));setMessages(m=>[...m,{role:"ai",text:replies[key||"default"]}])},350)};
 return <div><div className="section-heading"><span className="eyebrow">CONTEXT-AWARE AI</span><h2>Ask LearnFlux AI</h2><p>Doubts, explanations, examples, practice questions and step-by-step solutions.</p></div>
 <div className="chat-card card"><div className="chat-messages">{messages.map((m,i)=><div key={i} className={`bubble ${m.role}`}>{m.text}</div>)}</div>
 <div className="quick-prompts"><button onClick={()=>send("Explain Big-O simply")}>Explain Big-O</button><button onClick={()=>send("Explain recursion")}>Explain recursion</button><button onClick={()=>send("Give me an example")}>Give an example</button></div>
 <div className="chat-input"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask your AI tutor anything..."/><button onClick={()=>send()}>Send</button></div></div></div>
}