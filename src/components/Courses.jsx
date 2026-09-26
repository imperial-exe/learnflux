import React, { useState } from "react";
import {
  Search,
  BookOpen,
  Clock,
  Award,
  Star,
  Play,
  CheckCircle,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Filter,
  Sparkles,
  Layers,
  X,
} from "lucide-react";

const coursesData = [
  {
    id: "dsa-101",
    title: "Data Structures & Algorithmic Problem Solving",
    category: "DSA",
    level: "Intermediate",
    rating: 4.9,
    reviews: "2.4k",
    hours: "32 Hours",
    modulesCount: 8,
    enrolled: true,
    progress: 65,
    tag: "High Priority",
    desc: "Master arrays, hash tables, trees, dynamic programming, and asymptotic runtime analysis for top engineering interviews.",
    syllabus: [
      "Module 1: Dynamic Arrays & Two-Pointer Mechanics",
      "Module 2: Hash Tables & Collision Resolution",
      "Module 3: Recursion & Stack Frame Diagnostics",
      "Module 4: Asymptotic Notations (Big-O, Omega, Theta)",
      "Module 5: Binary Search & Monotonic Space Predicates",
      "Module 6: Trees, BSTs & Lowest Common Ancestor",
      "Module 7: Dynamic Programming: Memoization vs Tabulation",
      "Module 8: Graph Traversals: BFS, DFS & Dijkstra",
    ],
  },
  {
    id: "ai-llm",
    title: "Transformers & LLM Architecture Foundations",
    category: "AI & ML",
    level: "Advanced",
    rating: 4.95,
    reviews: "1.8k",
    hours: "40 Hours",
    modulesCount: 10,
    enrolled: true,
    progress: 40,
    tag: "Trending",
    desc: "Deep dive into self-attention, multi-head attention, rotary positional embeddings, and vector similarity search.",
    syllabus: [
      "Module 1: Linear Algebra & Matrix Tensor Operations",
      "Module 2: Self-Attention & Query-Key-Value Mechanisms",
      "Module 3: Transformer Encoder-Decoder Architecture",
      "Module 4: Tokenization & Byte-Pair Encoding (BPE)",
      "Module 5: Vector Databases & Approximate Nearest Neighbors",
      "Module 6: Fine-Tuning with LoRA & QLoRA",
      "Module 7: Prompt Engineering & Context Caching",
      "Module 8: RAG (Retrieval-Augmented Generation) Pipelines",
      "Module 9: Model Alignment & RLHF Principles",
      "Module 10: Deploying Quantized LLMs on Edge Hardware",
    ],
  },
  {
    id: "sys-design",
    title: "High-Scale Distributed Systems & Architecture",
    category: "System Design",
    level: "Intermediate",
    rating: 4.88,
    reviews: "1.1k",
    hours: "26 Hours",
    modulesCount: 6,
    enrolled: false,
    progress: 0,
    tag: "Industry Standard",
    desc: "Design resilient systems handling millions of queries per second: caching strategies, sharding, message queues, and consensus.",
    syllabus: [
      "Module 1: Scalability Fundamentals: Vertical vs Horizontal",
      "Module 2: Load Balancing, Reverse Proxies & CDN Caching",
      "Module 3: Database Sharding, Replication & CAP Theorem",
      "Module 4: Asynchronous Processing with Kafka & RabbitMQ",
      "Module 5: Distributed Locking & Consistency Protocols (Raft/Paxos)",
      "Module 6: Real-World Case Studies: Designing YouTube & Uber",
    ],
  },
  {
    id: "python-mastery",
    title: "Modern Python 3.12 for High Performance",
    category: "Python",
    level: "Beginner",
    rating: 4.85,
    reviews: "3.2k",
    hours: "18 Hours",
    modulesCount: 7,
    enrolled: false,
    progress: 0,
    tag: "Essential",
    desc: "From Pythonic idioms and generators to asyncio, memory profiling, and type annotations for clean production code.",
    syllabus: [
      "Module 1: Memory Model & Mutable vs Immutable Objects",
      "Module 2: List/Dict Comprehensions & Generator Pipelines",
      "Module 3: Decorators, Closures & Dunder Magic Methods",
      "Module 4: Concurrent Programming with Asyncio & ThreadPools",
      "Module 5: Type Hinting, Pydantic & Static Analysis",
      "Module 6: Profiling Code with cProfile & Memory-Profiler",
      "Module 7: Building High-Performance CLI Tools",
    ],
  },
  {
    id: "fullstack-react",
    title: "Full-Stack Web Engineering with React & Node",
    category: "Web Dev",
    level: "Intermediate",
    rating: 4.92,
    reviews: "2.9k",
    hours: "35 Hours",
    modulesCount: 9,
    enrolled: false,
    progress: 0,
    tag: "Popular",
    desc: "Build modern, responsive full-stack applications with React 19, state management, REST/GraphQL APIs, and secure authentication.",
    syllabus: [
      "Module 1: Modern React 19: Server Actions & Hooks",
      "Module 2: State Management & Optimistic UI Patterns",
      "Module 3: RESTful API Architecture with Express & Node",
      "Module 4: PostgreSQL, Prisma ORM & Database Indexing",
      "Module 5: JWT Authentication, OAuth2 & Role-Based Access",
      "Module 6: WebSockets & Real-Time Event Streaming",
      "Module 7: Unit Testing with Vitest & React Testing Library",
      "Module 8: CI/CD Pipeline Automation & Docker Deployment",
      "Module 9: Full-Stack Capstone Project",
    ],
  },
  {
    id: "algo-deepdive",
    title: "Graph Algorithms & Advanced Optimization",
    category: "DSA",
    level: "Advanced",
    rating: 4.97,
    reviews: "870",
    hours: "22 Hours",
    modulesCount: 5,
    enrolled: false,
    progress: 0,
    tag: "Elite",
    desc: "Shortest paths, maximum flow, minimum spanning trees, and network optimization with competitive programming techniques.",
    syllabus: [
      "Module 1: Graph Representation: Adjacency Lists vs Matrices",
      "Module 2: Dijkstra, Bellman-Ford & Floyd-Warshall Algorithms",
      "Module 3: Disjoint Set Union (DSU) & Kruskal's MST",
      "Module 4: Topological Sort, Strongly Connected Components (Tarjan)",
      "Module 5: Max-Flow Min-Cut & Ford-Fulkerson Algorithm",
    ],
  },
];

export default function Courses({ setPage, onSelectSubject }) {
  const [courses, setCourses] = useState(coursesData);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [bookmarked, setBookmarked] = useState(["dsa-101"]);
  const [activeSyllabusCourse, setActiveSyllabusCourse] = useState(null);

  const categories = ["All", "DSA", "AI & ML", "System Design", "Python", "Web Dev"];

  const filteredCourses = courses.filter((c) => {
    const matchesCat = selectedCategory === "All" || c.category === selectedCategory;
    const matchesLevel = selectedLevel === "All" || c.level === selectedLevel;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesLevel && matchesSearch;
  });

  const toggleBookmark = (id, e) => {
    e.stopPropagation();
    if (bookmarked.includes(id)) {
      setBookmarked(bookmarked.filter((x) => x !== id));
    } else {
      setBookmarked([...bookmarked, id]);
    }
  };

  const handleEnroll = (id) => {
    setCourses(
      courses.map((c) => (c.id === id ? { ...c, enrolled: true, progress: 10 } : c))
    );
    setActiveSyllabusCourse(null);
  };

  return (
    <div className="courses-page-container">
      {/* Header */}
      <div className="section-heading">
        <span className="eyebrow">CURATED AI TRACKS</span>
        <h2>Explore Adaptive Courses & Curricula</h2>
        <p>
          Every track dynamically connects to your Knowledge Map. As you complete lessons and quizzes,
          prerequisite dependencies update automatically.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="course-filter-bar card">
        <div className="search-input-wrap">
          <Search size={17} />
          <input
            type="text"
            placeholder="Search courses by keyword, topic, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-chips">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`cat-chip ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="level-select-wrap">
          <Filter size={15} />
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="level-select"
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="course-cards-grid">
        {filteredCourses.map((course) => {
          const isBookmarked = bookmarked.includes(course.id);
          return (
            <div key={course.id} className="course-card card">
              {/* Card Banner */}
              <div className={`course-banner-top ${course.category.toLowerCase().replace(/[^a-z]/g, "")}-theme`}>
                <div className="banner-badges">
                  <span className="course-badge category">{course.category}</span>
                  <span className={`course-badge level ${course.level.toLowerCase()}`}>{course.level}</span>
                </div>
                <button
                  className={`bookmark-btn ${isBookmarked ? "active" : ""}`}
                  onClick={(e) => toggleBookmark(course.id, e)}
                  title={isBookmarked ? "Remove Bookmark" : "Save Course"}
                >
                  {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                </button>
              </div>

              {/* Card Body */}
              <div className="course-body">
                <div className="course-meta-row">
                  <span className="course-rating">
                    <Star size={14} className="star-icon" /> {course.rating} ({course.reviews})
                  </span>
                  <span className="course-time">
                    <Clock size={13} /> {course.hours}
                  </span>
                </div>

                <h3 className="course-title">{course.title}</h3>
                <p className="course-desc">{course.desc}</p>

                <div className="course-highlights">
                  <span>✦ {course.modulesCount} Adaptive Modules</span>
                  <span>✦ AI Tutor Ready</span>
                </div>

                {/* Progress bar if enrolled */}
                {course.enrolled ? (
                  <div className="course-progress-section">
                    <div className="flex-between progress-text">
                      <span>In Progress</span>
                      <strong>{course.progress}%</strong>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${course.progress}%` }} />
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Card Footer Actions */}
              <div className="course-footer">
                <button
                  className="syllabus-btn"
                  onClick={() => setActiveSyllabusCourse(course)}
                >
                  <Layers size={14} />
                  <span>Syllabus</span>
                </button>

                {course.enrolled ? (
                  <button
                    className="primary-btn-sm"
                    onClick={() => {
                      if (onSelectSubject) onSelectSubject("cs");
                      setPage("path");
                    }}
                  >
                    <span>Resume</span>
                    <Play size={14} />
                  </button>
                ) : (
                  <button
                    className="enroll-btn"
                    onClick={() => handleEnroll(course.id)}
                  >
                    <span>Enroll Track</span>
                    <ChevronRight size={15} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="empty-courses card text-center">
          <BookOpen size={40} className="empty-icon" />
          <h3>No courses found matching your filter</h3>
          <p>Try clearing your search query or selecting "All" categories.</p>
          <button
            className="primary-btn"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setSelectedLevel("All");
            }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Syllabus Modal / Drawer */}
      {activeSyllabusCourse && (
        <div className="auth-overlay" onClick={() => setActiveSyllabusCourse(null)}>
          <div className="syllabus-modal card" onClick={(e) => e.stopPropagation()}>
            <button
              className="auth-close-btn"
              onClick={() => setActiveSyllabusCourse(null)}
            >
              <X size={20} />
            </button>

            <div className="syllabus-header">
              <span className="eyebrow">{activeSyllabusCourse.category} • {activeSyllabusCourse.level}</span>
              <h2>{activeSyllabusCourse.title}</h2>
              <p>{activeSyllabusCourse.desc}</p>
            </div>

            <div className="syllabus-list">
              <h4>Course Syllabus ({activeSyllabusCourse.modulesCount} Interactive Modules)</h4>
              {activeSyllabusCourse.syllabus.map((mod, idx) => (
                <div key={idx} className="syllabus-item">
                  <div className="mod-idx">{idx + 1}</div>
                  <div className="mod-text">
                    <strong>{mod}</strong>
                    <small>Includes AI practice diagnostic & concept flashcards</small>
                  </div>
                  <span className="mod-check">✓</span>
                </div>
              ))}
            </div>

            <div className="syllabus-modal-foot flex-between">
              <div>
                <strong>⏱ {activeSyllabusCourse.hours} total</strong>
                <small className="block-sub">Includes live AI tutor assistance</small>
              </div>
              {activeSyllabusCourse.enrolled ? (
                <button
                  className="primary-btn"
                  onClick={() => {
                    setActiveSyllabusCourse(null);
                    if (onSelectSubject) onSelectSubject("cs");
                    setPage("path");
                  }}
                >
                  Continue Learning →
                </button>
              ) : (
                <button
                  className="primary-btn"
                  onClick={() => handleEnroll(activeSyllabusCourse.id)}
                >
                  Enroll in Track →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
