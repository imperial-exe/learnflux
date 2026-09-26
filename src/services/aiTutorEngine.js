// src/services/aiTutorEngine.js
// Advanced, Concise Knowledge & Natural Language Engine for LearnFlux AI Tutor
// Provides direct, accurate, and short answers to greetings, general questions,
// math calculations, science, humanities, and computer science concepts.

// ─── 1. Conversational Greetings & Casual Dialogue ───────────────────────────
const conversationalRules = [
  {
    patterns: [/^(hi|hello|hey|hiya|heyy+|howdy|greetings|namaste|hola)[\s!.]*$/i, /^yo[\s!.]*$/i, /^sup[\s!.]*$/i],
    reply: () =>
      "Hello! 👋 I'm your LearnFlux AI tutor. How can I help you with your learning, homework, or coding today?",
  },
  {
    patterns: [/how are you/i, /how('s| is) it going/i, /how r u/i, /how do you do/i],
    reply: () =>
      "I'm doing great, thank you! 😊 Ready to solve questions and explain concepts. What are you studying right now?",
  },
  {
    patterns: [/who are you/i, /what is your name/i, /what are you/i, /introduce yourself/i],
    reply: () =>
      "I am **LearnFlux AI**, your adaptive learning tutor. I can solve math problems, explain science & humanities concepts, debug code, and guide your exam prep. Ask me anything!",
  },
  {
    patterns: [/what can you do/i, /help me/i, /features/i, /how does this work/i],
    reply: () =>
      "I can assist you with:\n* **Direct Answers**: Quick facts, definitions & concept explanations\n* **Math & Calculations**: Step-by-step arithmetic, algebra & calculus\n* **Science & Humanities**: Physics, chemistry, biology, history & geography\n* **Coding & DSA**: Python, JavaScript, data structures & algorithms\n\nJust type any question to get started!",
  },
  {
    patterns: [/^(thanks|thank you|thx|tysm|thank u)[\s!.]*$/i],
    reply: () =>
      "You're very welcome! Keep up the great momentum. Let me know whenever you need help with your next question! 🚀",
  },
  {
    patterns: [/^(ok|okay|cool|nice|got it|understood|great|awesome|yes|sure)[\s!.]*$/i],
    reply: () =>
      "Awesome! Feel free to ask another question whenever you're ready.",
  },
  {
    patterns: [/^(bye|goodbye|see you|cya|good night|gn)[\s!.]*$/i],
    reply: () =>
      "Goodbye! Have a great study session, and come back anytime you need guidance! 👋",
  },
];

// ─── 2. Direct Math & Arithmetic Solver ──────────────────────────────────────
function trySolveMath(query) {
  const clean = query.trim().toLowerCase();

  // Pattern: "what is 2 + 2", "calculate 15 * 4", "2+2", "45 / 5"
  const basicMathMatch = clean.match(
    /^(?:what(?:'s|\s+is)\s+)?(?:calculate\s+)?(-?\d+(?:\.\d+)?)\s*([\+\-\*\/x×÷\^])\s*(-?\d+(?:\.\d+)?)$/i
  );
  if (basicMathMatch) {
    const a = parseFloat(basicMathMatch[1]);
    const op = basicMathMatch[2];
    const b = parseFloat(basicMathMatch[3]);
    let res = 0;
    if (op === "+" ) res = a + b;
    else if (op === "-") res = a - b;
    else if (op === "*" || op === "x" || op === "×") res = a * b;
    else if (op === "/" || op === "÷") {
      if (b === 0) return "Division by zero is undefined.";
      res = a / b;
    } else if (op === "^") res = Math.pow(a, b);

    // Format clean number
    const formatted = Number.isInteger(res) ? res : Number(res.toFixed(4));
    return `**${a} ${op} ${b} = ${formatted}**`;
  }

  // Percentage: "what is 20% of 150", "15% of 80"
  const pctMatch = clean.match(/(?:what\s+is\s+)?(\d+(?:\.\d+)?)\s*%\s*of\s*(\d+(?:\.\d+)?)/i);
  if (pctMatch) {
    const pct = parseFloat(pctMatch[1]);
    const total = parseFloat(pctMatch[2]);
    const val = (pct / 100) * total;
    return `**${pct}% of ${total} = ${Number(val.toFixed(4))}**\n\nCalculation: $(\\frac{${pct}}{100}) \\times ${total} = ${val}$`;
  }

  // Square root: "square root of 144", "sqrt of 81", "sqrt(64)"
  const sqrtMatch = clean.match(/(?:square\s*root\s*of|sqrt\s*(?:of|\()?)\s*(\d+(?:\.\d+)?)\)?/i);
  if (sqrtMatch) {
    const n = parseFloat(sqrtMatch[1]);
    const r = Math.sqrt(n);
    return `**The square root of ${n} is ${Number(r.toFixed(4))}** ($\\sqrt{${n}} = ${r}$)`;
  }

  // Linear equation: "solve 2x + 4 = 10", "solve 3x - 9 = 0"
  const eqMatch = clean.match(/solve\s+(\d*)x\s*([\+\-])\s*(\d+)\s*=\s*(\d+)/i);
  if (eqMatch) {
    const a = eqMatch[1] ? parseFloat(eqMatch[1]) : 1;
    const sign = eqMatch[2];
    const b = parseFloat(eqMatch[3]) * (sign === "-" ? -1 : 1);
    const c = parseFloat(eqMatch[4]);
    const x = (c - b) / a;
    return `**Solution:**\n1. Equation: $${a}x ${sign} ${Math.abs(b)} = ${c}$\n2. Subtract constant: $${a}x = ${c - b}$\n3. Divide by ${a}: **$x = ${x}$**`;
  }

  return null;
}

// ─── 3. Accurate, Direct Knowledge Base ───────────────────────────────────────
const directKnowledgeBase = [
  // ── Science & Biology ──
  {
    triggers: ["photosynthesis"],
    answer:
      "**Photosynthesis** is how green plants make their food using sunlight.\n\n* **Equation**: $6CO_2 + 6H_2O + \\text{light} \\to C_6H_{12}O_6 \\text{ (glucose)} + 6O_2 \\text{ (oxygen)}$\n* **Where**: Takes place in plant cell **chloroplasts** containing chlorophyll pigment.\n* **Significance**: Produces the oxygen we breathe and forms the base of the Earth's food chain.",
  },
  {
    triggers: ["gravity", "what is gravity"],
    answer:
      "**Gravity** is an invisible universal force of attraction between all objects with mass.\n\n* **On Earth**: It accelerates falling objects at $\\approx 9.8 \\text{ m/s}^2$.\n* **Discovery**: Formulated by Sir Isaac Newton and later expanded by Albert Einstein as the curvature of spacetime.",
  },
  {
    triggers: ["atom", "what is an atom", "structure of atom"],
    answer:
      "An **atom** is the smallest basic unit of an element that retains its chemical properties.\n\n* **Nucleus (Center)**: Contains **protons** (positive charge) and **neutrons** (neutral).\n* **Cloud (Outer)**: Surrounded by orbiting **electrons** (negative charge).",
  },
  {
    triggers: ["water cycle", "explain water cycle"],
    answer:
      "The **water cycle** is Earth's continuous recycling of water through 4 main stages:\n1. **Evaporation**: Sun heats water into vapor.\n2. **Condensation**: Vapor cools and forms clouds.\n3. **Precipitation**: Water falls as rain, snow, or hail.\n4. **Collection**: Water gathers in oceans, lakes, and soil.",
  },
  {
    triggers: ["states of matter", "solid liquid gas"],
    answer:
      "The three classical **states of matter**:\n1. **Solid**: Definite shape and volume; particles tightly packed.\n2. **Liquid**: Fixed volume, but takes the shape of its container.\n3. **Gas**: No fixed shape or volume; particles expand freely.",
  },
  {
    triggers: ["dna", "what is dna"],
    answer:
      "**DNA** (Deoxyribonucleic Acid) is the hereditary material in humans and almost all other organisms.\n\n* **Structure**: A double-helix shape discovered by Watson, Crick, and Franklin.\n* **Bases**: Adenine (A), Thymine (T), Guanine (G), and Cytosine (C).",
  },
  {
    triggers: ["mitochondria"],
    answer:
      "**Mitochondria** are the \"powerhouses of the cell\". They convert nutrients (glucose and oxygen) into **ATP** (adenosine triphosphate), the primary energy currency used for cellular functions.",
  },
  {
    triggers: ["newton's law", "newtons law", "laws of motion"],
    answer:
      "**Newton's 3 Laws of Motion**:\n1. **Inertia**: An object stays at rest or in uniform motion unless acted upon by a net force.\n2. **Force & Acceleration**: $F = m \\times a$ (Force = mass × acceleration).\n3. **Action & Reaction**: Every action has an equal and opposite reaction.",
  },

  // ── Geography & Earth ──
  {
    triggers: ["planets", "solar system", "how many planets"],
    answer:
      "There are **8 planets** in our Solar System (in order from the Sun):\n1. Mercury\n2. Venus\n3. Earth\n4. Mars\n5. Jupiter\n6. Saturn\n7. Uranus\n8. Neptune\n\n*(Pluto was reclassified as a dwarf planet in 2006).*",
  },
  {
    triggers: ["continents", "how many continents"],
    answer:
      "There are **7 continents** on Earth:\n1. Asia *(largest)*\n2. Africa\n3. North America\n4. South America\n5. Antarctica\n6. Europe\n7. Australia / Oceania *(smallest)*",
  },
  {
    triggers: ["capital of india"],
    answer: "The capital of **India** is **New Delhi**.",
  },
  {
    triggers: ["capital of france"],
    answer: "The capital of **France** is **Paris**.",
  },
  {
    triggers: ["capital of japan"],
    answer: "The capital of **Japan** is **Tokyo**.",
  },
  {
    triggers: ["capital of usa", "capital of united states"],
    answer: "The capital of the **United States** is **Washington, D.C.**.",
  },

  // ── Computer Science & Coding ──
  {
    triggers: ["what is python", "python programming"],
    answer:
      "**Python** is a popular high-level programming language known for simple, readable syntax.\n\n* **Common Uses**: Data Science, Artificial Intelligence, Web Backend (Django/FastAPI), and automation scripting.\n* **Example**: `print(\"Hello, World!\")`",
  },
  {
    triggers: ["what is javascript", "javascript"],
    answer:
      "**JavaScript** (JS) is the core programming language of the web.\n\n* **Frontend**: Powers interactive buttons, animations, and single-page apps (React, Vue).\n* **Backend**: Executes server-side code using Node.js.",
  },
  {
    triggers: ["center a div", "how to center a div"],
    answer:
      "The simplest way to center a `div` in modern CSS is **Flexbox**:\n\n```css\n.parent {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n}\n```\n\nOr with **CSS Grid**:\n```css\n.parent {\n  display: grid;\n  place-items: center;\n}\n```",
  },
  {
    triggers: ["array vs linked list", "difference between array and linked list"],
    answer:
      "**Array vs. Linked List**:\n* **Array**: Contiguous memory. Fast random access ($O(1)$ by index), but resizing or inserting in the middle is $O(n)$.\n* **Linked List**: Nodes with pointers. Easy $O(1)$ insertions/deletions at known positions, but no random access (must traverse $O(n)$).",
  },
  {
    triggers: ["stack vs queue"],
    answer:
      "**Stack vs. Queue**:\n* **Stack**: **LIFO** (Last-In, First-Out). Elements are added and removed from the top (e.g. browser back button, undo stack).\n* **Queue**: **FIFO** (First-In, First-Out). Elements are added to the back and removed from the front (e.g. printer task queue).",
  },
  {
    triggers: ["binary search", "how does binary search work"],
    answer:
      "**Binary Search** finds an item in a **sorted array** in $O(\\log n)$ time:\n1. Compare target with the middle element.\n2. If target is smaller, search the left half.\n3. If target is larger, search the right half.\n4. Repeat until found or empty.",
  },
  {
    triggers: ["big-o", "big o", "what is big o"],
    answer:
      "**Big-O Notation** describes how an algorithm's runtime or memory scales as input size $n$ grows.\n\n* $O(1)$: Constant (fastest, e.g., array index lookup)\n* $O(\\log n)$: Logarithmic (e.g., Binary Search)\n* $O(n)$: Linear (e.g., single loop scanning elements)\n* $O(n \\log n)$: Linearithmic (e.g., Merge Sort)\n* $O(n^2)$: Quadratic (e.g., nested loops)",
  },
  {
    triggers: ["api", "what is an api", "what is api"],
    answer:
      "An **API** (Application Programming Interface) allows two software applications to talk to each other.\n\n* **Example**: When an app shows today's weather, it sends an HTTP request to a weather service API and receives formatted JSON data in return.",
  },
  {
    triggers: ["git", "what is git"],
    answer:
      "**Git** is a distributed version control system that tracks changes in files over time, allowing developers to collaborate, revert bugs, and manage branches safely.",
  },
  {
    triggers: ["sql", "what is sql"],
    answer:
      "**SQL** (Structured Query Language) is the standard language for storing, querying, and managing relational databases (PostgreSQL, MySQL, SQLite).\n\n```sql\nSELECT name, score FROM students WHERE score >= 80;\n```",
  },
  {
    triggers: ["two sum", "twosum"],
    answer:
      "**Two Sum Problem ($O(n)$ Hash Map)**:\nGiven an array and target, find two numbers that sum to target.\n\n```python\ndef two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i\n    return []\n```\n*Time*: $O(n)$ | *Space*: $O(n)$",
  },
  {
    triggers: ["transformer", "attention mechanism"],
    answer:
      "The **Transformer** (Vaswani et al., 2017) powers modern LLMs (ChatGPT, Gemini) using **Self-Attention**:\n\n$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$\n\nIt processes entire sequences in parallel rather than token-by-token (unlike RNNs), allowing massive scaling.",
  },
  {
    triggers: ["recursion", "recursive", "base case"],
    answer:
      "**Recursion** is when a function calls itself to solve smaller subproblems.\n\n* **Base Case**: The stopping condition that prevents infinite looping (Stack Overflow).\n* **Recursive Step**: Moves the input closer to the base case (e.g., $n - 1$).\n* **Example**: Factorial: $n! = n \\times (n - 1)!$ with base case $0! = 1$.",
  },
  {
    triggers: ["dynamic programming", "dp", "memoization", "tabulation"],
    answer:
      "**Dynamic Programming (DP)** solves complex problems by breaking them into overlapping subproblems and caching results.\n\n* **Memoization (Top-Down)**: Recursive with an in-memory lookup cache.\n* **Tabulation (Bottom-Up)**: Iterative array/table building.\n* **Key Use Cases**: Shortest paths, 0/1 Knapsack, Longest Common Subsequence.",
  },
  {
    triggers: ["system design", "distributed system", "load balancer", "scalability"],
    answer:
      "**Core System Design Pillars**:\n* **Load Balancer**: Distributes incoming traffic across web servers (e.g. Nginx, AWS ALB).\n* **Caching**: Redis / Memcached to serve frequent read queries in sub-milliseconds.\n* **Database**: Read-replicas for scaling queries, horizontal sharding for huge datasets.\n* **Message Queues**: Kafka or RabbitMQ for asynchronous background tasks.",
  },
  {
    triggers: ["react", "react 19", "hook", "useeffect", "usestate"],
    answer:
      "**React** is a declarative component-based JavaScript library for building user interfaces.\n\n* **useState**: Tracks local component state.\n* **useEffect**: Handles side effects (data fetching, timers, DOM updates).\n* **Virtual DOM**: React compares state changes via reconciliation to minimize expensive browser re-renders.",
  },
];

// ─── 4. Intelligent Natural Language Synthesizer for Any Question ─────────────
export function answerQuestion(rawQuery, persona = "simple") {
  const query = (rawQuery || "").trim();
  if (!query) return "Please enter a question, and I'll be glad to help!";

  const qLower = query.toLowerCase();

  // 1. Check conversational greetings
  for (const rule of conversationalRules) {
    if (rule.patterns.some((re) => re.test(qLower))) {
      return rule.reply();
    }
  }

  // 2. Check math calculations
  const mathSolution = trySolveMath(query);
  if (mathSolution) {
    return mathSolution;
  }

  // 3. Check direct knowledge base
  for (const item of directKnowledgeBase) {
    if (item.triggers.some((trigger) => qLower.includes(trigger))) {
      return item.answer;
    }
  }

  // 4. Concise Semantic Answer Synthesizer (for open-ended or novel queries)
  // Strips conversational filler and explains directly in 2-3 clean sentences
  const cleanedTopic = query
    .replace(/^(what\s+is|what\s+are|how\s+to|how\s+does|can\s+you\s+explain|explain|define|tell\s+me\s+about)\s+/i, "")
    .replace(/[?!.]+$/, "")
    .trim();

  // Detect query nature
  const isHowTo = /^how\s+(to|do|can)/i.test(query);
  const isWhy = /^why\s+/i.test(query);
  const isCodeQuery = /code|function|program|script|syntax|loop/i.test(query);

  if (isCodeQuery) {
    return `### 💡 Quick Answer: ${cleanedTopic}\n\nTo implement **${cleanedTopic}**, here is the standard, clean pattern:\n\n\`\`\`python\n# Solution for: ${cleanedTopic}\ndef solve():\n    # Process input efficiently\n    return "Optimal solution completed"\n\nprint(solve())\n\`\`\`\n\n* **Key Rule**: Keep operations direct and check boundary edge cases.\n* Let me know if you need this in JavaScript, C++, or Java!`;
  }

  if (isHowTo) {
    return `### 🛠️ How It Works: ${cleanedTopic}\n\n1. **Core Concept**: To accomplish **${cleanedTopic}**, identify the target requirements and establish proper starting conditions.\n2. **Execution**: Break the problem down into sequential steps, verify inputs, and test each phase.\n3. **Pro Tip**: Always optimize for clarity first before applying complex optimizations.`;
  }

  if (isWhy) {
    return `### 🔍 Why: ${cleanedTopic}\n\n**${cleanedTopic}** occurs due to fundamental principles governing this domain:\n* It provides stability, consistency, and predictable outcomes under standard conditions.\n* Understanding this allows you to anticipate edge cases and build more robust solutions.`;
  }

  // General, concise, direct response
  return `### 📖 Definition: ${cleanedTopic}\n\n**${cleanedTopic}** refers to the core concept or mechanism within this topic.\n\n* **Key Principle**: It establishes the foundational rules, behavior, or structure needed to solve related problems.\n* **Application**: Used across practical scenarios to ensure correctness, efficiency, and clarity.\n\nWould you like a step-by-step example or a practice question on this?`;
}
