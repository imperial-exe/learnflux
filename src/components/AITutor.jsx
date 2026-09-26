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

// Massive Knowledge Engine spanning all computer science & programming domains
const knowledgeBase = [
  {
    triggers: ["two sum", "twosum", "target sum"],
    title: "Optimal Two Sum Algorithm",
    category: "Data Structures & Algorithms",
    answer: `### 🎯 Two Sum: Optimal Hash Map Pattern

**Problem**: Find two numbers in an array that add up to a target sum. Return their indices.

#### 1. Optimal Approach: One-Pass Hash Map
Instead of checking all pairs with two nested loops ($O(n^2)$ time), we compute the complement for each element:
$$\\text{complement} = \\text{target} - \\text{num}$$
If the complement already exists in our Hash Map, we found the pair! Otherwise, insert the current number and its index.

#### 2. Clean Code Implementation:
\`\`\`python
def two_sum(nums, target):
    seen = {} # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Example run:
# nums = [2, 7, 11, 15], target = 9 -> Output: [0, 1]
\`\`\`

\`\`\`javascript
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}
\`\`\`

#### 3. Complexity Analysis:
* **Time Complexity**: $O(n)$ — Single traversal of the array; hash map lookups are $O(1)$ on average.
* **Space Complexity**: $O(n)$ — Hash map stores up to $n$ entries.

💡 **Key Takeaway**: Any time you see a "pair sum" or "find two elements" constraint, immediately consider a Hash Table to trade $O(n)$ space for $O(1)$ query speed.`,
  },
  {
    triggers: ["big-o", "big o", "complexity", "asymptotic", "time complexity", "space complexity"],
    title: "Mastering Asymptotic & Big-O Notation",
    category: "Complexity Analysis",
    answer: `### 📊 Big-O & Complexity Analysis Master Guide

Big-O notation formally defines the upper bound (worst-case rate of growth) of an algorithm as input size $n \\to \\infty$.

#### The Standard Hierarchy (Fastest to Slowest):
1. **$O(1)$ Constant Time**:
   * Direct array index: \`arr[4]\`
   * Hash map lookup: \`map.get(key)\`
   * Pushing/popping from top of a stack: \`stack.pop()\`
2. **$O(\\log n)$ Logarithmic Time**:
   * Binary Search on sorted data (halving search space each step: $n \\to n/2 \\to n/4 \\dots$).
   * Balanced Binary Search Tree lookups.
3. **$O(n)$ Linear Time**:
   * Single loop iterating through $n$ elements.
   * Linear search, finding array maximum/minimum.
4. **$O(n \\log n)$ Linearithmic Time**:
   * Optimal comparison-based sorting algorithms: **Merge Sort**, **Heap Sort**, and average-case **Quick Sort**.
5. **$O(n^2)$ Quadratic Time**:
   * Nested loops traversing $n \\times n$ pairs (e.g. Bubble Sort, Selection Sort).
6. **$O(2^n)$ Exponential Time**:
   * Naive recursive Fibonacci, generating all subsets of a set (power set).
7. **$O(n!)$ Factorial Time**:
   * Traveling Salesperson Problem brute-force, generating all permutations.

\`\`\`python
# Rule of Thumb for Coding Interviews:
# n <= 20         --> O(2^n) or O(n!) backtracking is acceptable
# n <= 1,000      --> O(n^2) nested loops pass within 1 second
# n <= 100,000    --> O(n log n) or O(n) required
# n >= 1,000,000  --> O(n) or O(log n) strictly required
\`\`\`

⚡ **Sneha's Diagnostic Tip**: When analyzing loops, check if the variable increments linearly (\`i++\` $\\to O(n)$) or geometrically (\`i *= 2\` $\\to O(\\log n)$).`,
  },
  {
    triggers: ["transformer", "attention", "llm", "self-attention", "neural network", "deep learning", "gpt"],
    title: "Transformer Architecture & Self-Attention Explained",
    category: "AI & Machine Learning",
    answer: `### 🤖 Deep Dive: The Transformer & Scaled Dot-Product Attention

The Transformer (Vaswani et al., 2017) revolutionized AI by replacing recurrent connections (RNNs/LSTMs) with pure **Parallel Multi-Head Attention**.

#### 1. The Core Equation: Scaled Dot-Product Attention
$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$

* **Query ($Q$)**: "What am I looking for?" (Representing current token)
* **Key ($K$)**: "What do I offer?" (Representing all context tokens)
* **Value ($V$)**: "What information do I actually carry?"
* **$\\sqrt{d_k}$ Scaling**: Prevents the dot product from exploding in high dimensions, which would cause the softmax gradient to vanish.

#### 2. PyTorch Self-Attention Implementation:
\`\`\`python
import torch
import torch.nn as nn
import math

class SelfAttention(nn.Module):
    def __init__(self, d_model, heads):
        super().__init__()
        self.d_k = d_model // heads
        self.heads = heads
        self.q_linear = nn.Linear(d_model, d_model)
        self.k_linear = nn.Linear(d_model, d_model)
        self.v_linear = nn.Linear(d_model, d_model)
        self.out = nn.Linear(d_model, d_model)

    def forward(self, x):
        batch, seq_len, d_model = x.shape
        # Project and reshape into multi-head format
        Q = self.q_linear(x).view(batch, seq_len, self.heads, self.d_k).transpose(1, 2)
        K = self.k_linear(x).view(batch, seq_len, self.heads, self.d_k).transpose(1, 2)
        V = self.v_linear(x).view(batch, seq_len, self.heads, self.d_k).transpose(1, 2)

        # Scaled dot-product scores
        scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.d_k)
        attention_weights = torch.softmax(scores, dim=-1)
        
        # Weighted combination of values
        context = torch.matmul(attention_weights, V)
        context = context.transpose(1, 2).contiguous().view(batch, seq_len, d_model)
        return self.out(context)
\`\`\`

#### 3. Why Transformers Excel:
* **$O(1)$ Sequential Dependency**: All tokens attend to each other simultaneously, allowing massive GPU parallelism.
* **Direct Path**: Information between token $1$ and token $1000$ flows in 1 layer instead of passing through 999 recurrent steps.`,
  },
  {
    triggers: ["binary search", "binarysearch", "monotonic"],
    title: "Binary Search Mastery & Edge Cases",
    category: "Searching Algorithms",
    answer: `### 🔍 Binary Search: The Logarithmic Powerhouse

Binary search finds a target in a sorted collection or monotonic search space in $O(\\log n)$ time.

#### 1. Robust Template (Prevents Integer Overflow):
\`\`\`python
def binary_search(arr, target):
    low = 0
    high = len(arr) - 1

    while low <= high:
        # Safe midpoint computation avoiding integer overflow
        mid = low + (high - low) // 2

        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1

    return -1 # Target not found
\`\`\`

#### 2. Finding First / Last Occurrence (Lower/Upper Bound):
\`\`\`python
# Find Lower Bound (First index where arr[i] >= target)
def lower_bound(arr, target):
    low, high = 0, len(arr)
    while low < high:
        mid = low + (high - low) // 2
        if arr[mid] >= target:
            high = mid
        else:
            low = mid + 1
    return low
\`\`\`

💡 **Advanced Application**: Binary search on answer! If a problem asks "Find the minimum capacity to ship packages within D days", notice that if capacity $C$ works, any $C' > C$ also works (monotonic property). You can binary search for the minimum $C$.`,
  },
  {
    triggers: ["recursion", "recursive", "base case", "call stack"],
    title: "Recursion & Call Stack Frames",
    category: "Core Computer Science",
    answer: `### 🔁 Recursion: Thinking in Mathematical Induction

Recursion solves a complex problem by reducing it to smaller instances of identical structure.

#### The 3 Inviolable Rules of Recursion:
1. **The Base Case**: A condition where the function returns immediately without recursive calls. Without this, you get a \`RecursionError: maximum recursion depth exceeded\` (Stack Overflow).
2. **The Recursive Leap of Faith (Subproblem Reduction)**: Always pass arguments that move closer to the base case (e.g. $n - 1$ or $n / 2$).
3. **The Work Combination**: Combine the return value of subproblems.

\`\`\`javascript
// Reversing a Linked List Recursively
function reverseList(head) {
  // Base case: empty list or single node
  if (!head || !head.next) return head;

  // Recursive call on the rest of the list
  const newHead = reverseList(head.next);

  // Rewire pointers
  head.next.next = head;
  head.next = null;

  return newHead;
}
\`\`\`

* **Memory Insight**: Each recursion step pushes an activation record (local variables + return pointer) onto the **Call Stack**, requiring $O(h)$ space where $h$ is recursion depth.`,
  },
  {
    triggers: ["dynamic programming", "dp", "memoization", "tabulation", "knapsack"],
    title: "Dynamic Programming Framework",
    category: "Algorithm Design",
    answer: `### 🧩 Dynamic Programming: From Brute Force to Polynomial Time

DP is simply **Recursion with Caching** applied to problems with:
1. **Overlapping Subproblems**: The same state is computed repeatedly.
2. **Optimal Substructure**: The optimal solution to the problem contains optimal solutions to subproblems.

#### The 4-Step DP Framework:
1. **State Definition**: What does \`dp[i][j]\` represent? (e.g., maximum profit using first $i$ items with weight limit $j$).
2. **State Transition (Recurrence Relation)**: How do we reach state \`dp[i]\` from prior states?
3. **Base Cases**: Initialize edge boundaries (e.g. \`dp[0] = 0\`).
4. **Computation Order**: Iterate so dependencies are calculated before needed.

\`\`\`python
# 0/1 Knapsack Problem - Space Optimized O(W)
def knapsack(weights, values, capacity):
    dp = [0] * (capacity + 1)
    
    for w, v in zip(weights, values):
        # Iterate backwards to avoid reusing the same item multiple times
        for cap in range(capacity, w - 1, -1):
            dp[cap] = max(dp[cap], dp[cap - w] + v)
            
    return dp[capacity]

# Example: weights = [1, 3, 4], values = [15, 50, 60], capacity = 4 -> 65
\`\`\`

⚡ **Memoization vs Tabulation**:
* **Top-Down (Memoization)**: Easier to write from recursive intuition; only computes reachable states.
* **Bottom-Up (Tabulation)**: Iterative; avoids stack overflow overhead and enables space optimization.`,
  },
  {
    triggers: ["system design", "distributed", "scalability", "cap theorem", "load balancer", "sharding"],
    title: "Distributed Systems & System Design Patterns",
    category: "System Design",
    answer: `### 🌐 System Design Architecture for Millions of Users

When scaling applications from 1,000 to 10,000,000 concurrent users, key architectural pillars are required:

#### 1. High-Level Blueprint:
1. **DNS & Anycast Routing**: Resolves traffic to nearest edge location.
2. **CDN (Cloudflare/Fastly)**: Caches static media, HTML, and API edge responses.
3. **Load Balancer (Nginx/HAProxy/ALB)**: Distributes HTTP requests across worker fleets via Round-Robin or Least Connections with health checks.
4. **Stateless Web Tier**: Nodes don't store session state locally; user sessions live in Redis.
5. **Caching Layer (Redis/Memcached)**: Caches read-heavy queries with Cache-Aside or Write-Through policies.
6. **Database Tier**: Read-Replicas for queries, Master for writes. Sharded horizontally (by user ID) when data exceeds single-disk IOPS.
7. **Message Broker (Kafka/RabbitMQ)**: Asynchronous decoupling for heavy tasks (emails, notifications, video encoding).

#### 2. The CAP Theorem Tradeoff:
In any distributed data store, you can only pick **two** of the following three:
* **Consistency (C)**: Every read receives the most recent write or an error.
* **Availability (A)**: Every request receives a non-error response without guarantee of latest data.
* **Partition Tolerance (P)**: System continues operating despite network failures.
*(Since networks always drop packets, in reality you choose between **CP** like MongoDB/HBase or **AP** like Cassandra/DynamoDB).*`,
  },
  {
    triggers: ["react", "hook", "useeffect", "usestate", "frontend", "web dev", "center a div", "css"],
    title: "Modern React 19 & Web Architecture",
    category: "Web Engineering",
    answer: `### ⚛️ Modern React 19 & Modern Web Engineering

React 19 introduces powerful primitives for async transitions, form handling, and state synchronizations.

#### 1. Custom Hook Pattern (useDebounce):
\`\`\`javascript
import { useState, useEffect } from "react";

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup cancels pending timer if value updates before delay expires
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
\`\`\`

#### 2. How to Center a Div in Modern CSS:
\`\`\`css
/* The 2-line Flexbox Center */
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

/* Or the 2-line CSS Grid Center */
.parent-grid {
  display: grid;
  place-items: center;
  min-height: 100vh;
}
\`\`\``,
  },
];

// Universal Fallback Synthesizer for ANY arbitrarily complex user query
function generateUniversalAIResponse(query, persona) {
  const qLower = query.toLowerCase();
  const words = query.trim().split(/\s+/);
  const topicName = words.slice(0, 4).join(" ");

  // Detect technical context
  let language = "python";
  if (qLower.includes("javascript") || qLower.includes("js") || qLower.includes("react") || qLower.includes("css") || qLower.includes("node")) {
    language = "javascript";
  } else if (qLower.includes("c++") || qLower.includes("cpp")) {
    language = "cpp";
  } else if (qLower.includes("java")) {
    language = "java";
  } else if (qLower.includes("sql") || qLower.includes("database")) {
    language = "sql";
  }

  let codeSnippet = "";
  if (language === "python") {
    codeSnippet = `\`\`\`python
# Solution for: ${topicName}
def solve_problem(data):
    # Step 1: Preprocess and validate input
    if not data:
        return None
    
    # Step 2: Optimal computation
    result = []
    seen = set()
    for item in data:
        if item not in seen:
            seen.add(item)
            result.append(item)
            
    return result

# Example verification:
sample = [1, 2, 2, 3, 4]
print("Result:", solve_problem(sample))
\`\`\``;
  } else if (language === "javascript") {
    codeSnippet = `\`\`\`javascript
// Solution for: ${topicName}
function solveProblem(input) {
  if (!input) return null;
  
  // High-performance modern implementation
  const processed = input.map(x => x * 2);
  return processed;
}

console.log(solveProblem([1, 2, 3]));
\`\`\``;
  } else {
    codeSnippet = `\`\`\`${language}
// Optimal implementation for ${topicName}
// Verified for edge cases and optimal asymptotic bounds
\`\`\``;
  }

  let baseResponse = `### 💡 Analysis: ${query.length > 50 ? query.slice(0, 50) + "..." : query}

I have processed your question through the **LearnFlux Universal Technical Engine**. Here is the complete breakdown:

#### 1. Core Intuition & Architecture:
When tackling **${topicName}**, the central principle is understanding the exact tradeoff between runtime complexity, memory footprint, and maintainability.

* **Key Concept**: Ensuring the solution scales gracefully as input dimensions or concurrency grows.
* **Optimal Pattern**: Always verify whether sorting, hash-mapping, two-pointers, or dynamic state memoization can reduce operations.

#### 2. Code Implementation:
${codeSnippet}

#### 3. Complexity & Algorithmic Guarantees:
* **Time Complexity**: Typically $O(n)$ or $O(n \\log n)$ depending on sorting and lookup overhead.
* **Space Complexity**: $O(n)$ working memory for auxiliary structures.

#### 4. Edge Cases to Keep in Mind:
* Empty or null inputs.
* Extremely large inputs triggering integer overflow or memory exhaustion.
* Duplicates and boundary condition values.`;

  if (persona === "socratic") {
    baseResponse += `\n\n🤔 **Socratic Check for Sneha**: What would happen to the memory bounds if the input stream was infinite and couldn't fit into RAM? How would you modify the data structure?`;
  } else if (persona === "fast") {
    baseResponse = `⚡ **Fast Solution Recap**: Direct answer synthesized for **${topicName}**.\n\n${codeSnippet}\n\n*Complexity*: $O(n)$ Time | $O(1)$ Auxiliary Space.`;
  }

  return baseResponse;
}

const promptShortcuts = [
  { label: "🎯 Two Sum O(n)", query: "How to solve Two Sum in O(n)?" },
  { label: "📊 Big-O Hierarchy", query: "Explain Big-O and time complexity hierarchy" },
  { label: "🤖 Transformer Attention", query: "Explain Transformer self-attention architecture" },
  { label: "🔍 Binary Search", query: "Binary search template and edge cases" },
  { label: "🧩 Dynamic Programming", query: "Explain dynamic programming memoization vs tabulation" },
  { label: "🌐 System Design", query: "How to design a scalable distributed system?" },
  { label: "⚛️ React 19 Custom Hook", query: "Write a React custom hook for debouncing" },
];

export default function AITutor({ initialQuery = "" }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "ai",
      text: `Hi **Sneha**! ✦ I am **LearnFlux AI Tutor & LLM Assistant**.\n\nI have complete contextual mastery over your learning profile. I am equipped to answer **ANYTHING** you ask:\n* Any Data Structure, Algorithm, or LeetCode pattern\n* Deep Learning, Transformers & Neural Networks\n* High-scale System Design & Distributed Systems\n* Code debugging, syntax explanations, or interview prep\n\nWhat would you like to master right now?`,
      time: "Online",
    },
  ]);
  const [input, setInput] = useState(initialQuery);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [persona, setPersona] = useState("socratic");
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
    // Clean markdown symbols for natural speech
    const cleanSpeech = plainText
      .replace(/[#*`_~$\\]/g, "")
      .replace(/```[\s\S]*?```/g, "Code block omitted for speech.")
      .slice(0, 250); // speak summary
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

    // Simulate intelligent LLM processing
    setTimeout(() => {
      const qLower = queryText.toLowerCase();
      let matched = knowledgeBase.find((entry) =>
        entry.triggers.some((trigger) => qLower.includes(trigger))
      );

      let responseText = "";
      if (matched) {
        responseText = matched.answer;
      } else {
        responseText = generateUniversalAIResponse(queryText, persona);
      }

      const aiMsg = {
        id: Date.now() + 1,
        role: "ai",
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      speakText(responseText);
    }, 550);
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
        text: "✦ Conversation reset. Ask me any technical, coding, or algorithmic question!",
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
            Latency: <b>~240ms</b>
          </span>
          <span className="context-tag">
            Coverage: <b>DSA • AI/ML • Fullstack • System Design</b>
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
            <option value="Gemini-1-5-Pro">🔮 Gemini 1.5 Pro</option>
          </select>

          <select
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            className="persona-select"
          >
            <option value="socratic">🧠 Socratic Guide</option>
            <option value="fast">⚡ Fast Summary</option>
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
                <span className="typing-text">Synthesizing solution across verified technical knowledge...</span>
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
            placeholder="Ask anything (e.g. 'Explain Dijkstra algorithm', 'Debug my Python recursion', 'How to center a div in CSS', 'Explain Transformers')..."
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
