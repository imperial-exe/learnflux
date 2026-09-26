// Supabase Seed Script: supabase/seed.ts
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "https://demo.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "demo-service-key";
const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function seedSystem() {
  console.log("Seeding LearnFlux AI database...");

  // 1. Create Demo Students across Grades
  const students = [
    { email: "priya@demo.app", password: "demo1234", name: "Priya", grade: 5, age: 10, color: "#8b5cf6", goal: "Master Fundamentals" },
    { email: "arjun@demo.app", password: "demo1234", name: "Arjun", grade: 10, age: 15, color: "#22d3ee", goal: "Exam Prep" },
    { email: "meera@demo.app", password: "demo1234", name: "Meera", grade: 12, age: 17, color: "#34d399", goal: "Competitive Prep" }
  ];

  for (const s of students) {
    const { data: { user } } = await admin.auth.admin.createUser({
      email: s.email,
      password: s.password,
      email_confirm: true,
      user_metadata: { displayName: s.name, gradeLevel: s.grade, age: s.age, learningGoal: s.goal }
    });

    if (user) {
      await admin.from("profiles").upsert({
        id: user.id,
        display_name: s.name,
        grade_level: s.grade,
        age: s.age,
        avatar_color: s.color,
        learning_goal: s.goal
      });
    }
  }

  // 2. Global Subjects with Grade Ranges (spanning Grade 1 to 12)
  const { data: math } = await admin.from("subjects").insert({
    name: "Mathematics",
    icon: "calculator",
    description: "Arithmetic, Algebra, Geometry, and Advanced Calculus",
    min_grade: 1,
    max_grade: 12
  }).select().single();

  const { data: bio } = await admin.from("subjects").insert({
    name: "Biology",
    icon: "dna",
    description: "Living World, Cellular Systems, and Genetics",
    min_grade: 3,
    max_grade: 12
  }).select().single();

  const { data: cs } = await admin.from("subjects").insert({
    name: "Computer Science",
    icon: "code",
    description: "Computational Thinking, Data Structures, and Algorithmic Complexity",
    min_grade: 6,
    max_grade: 12
  }).select().single();

  // 3. Topics & Subtopics
  // Math Topics (Elementary to Middle)
  const { data: tMath } = await admin.from("topics").insert({
    subject_id: math.id,
    name: "Fundamental Arithmetic",
    order_index: 1
  }).select().single();

  const { data: stMathMulti } = await admin.from("subtopics").insert({
    topic_id: tMath.id,
    name: "Multiplication & Division",
    prerequisite_ids: []
  }).select().single();

  // Biology Topics
  const { data: tBio } = await admin.from("topics").insert({
    subject_id: bio.id,
    name: "Cell Biology & Living Systems",
    order_index: 1
  }).select().single();

  const { data: stBioCell } = await admin.from("subtopics").insert({
    topic_id: tBio.id,
    name: "Plant vs Animal Cells",
    prerequisite_ids: []
  }).select().single();

  // Computer Science Topics
  const { data: tCS } = await admin.from("topics").insert({
    subject_id: cs.id,
    name: "Data Structures & Complexity",
    order_index: 1
  }).select().single();

  const { data: stCSComplexity } = await admin.from("subtopics").insert({
    topic_id: tCS.id,
    name: "Time Complexity & Big-O Notation",
    prerequisite_ids: []
  }).select().single();

  // 4. Multi-Modal Study Materials (Math, Bio, CS)
  await admin.from("study_materials").insert([
    // Math Multi-Modal
    {
      subtopic_id: stMathMulti.id,
      material_type: "note",
      title: "Core Rules of Multiplication & Division",
      content: {
        markdown: `# Core Rules of Multiplication & Division\n\nMultiplication is simply **repeated addition**.\n\n* **Example**: \`4 x 3 = 12\` (which means 4 added 3 times: \`4 + 4 + 4\`).\n* **Commutative Property**: \`a x b = b x a\` (\`6 x 7 = 7 x 6 = 42\`).\n* **Division**: The inverse of multiplication. Splitting into equal sets.`
      }
    },
    {
      subtopic_id: stMathMulti.id,
      material_type: "mind_map",
      title: "Arithmetic Operations Mind Map",
      content: {
        nodes: [
          { id: "1", label: "Arithmetic", color: "#8b5cf6" },
          { id: "2", label: "Addition", color: "#3b82f6" },
          { id: "3", label: "Multiplication", color: "#10b981" },
          { id: "4", label: "Division", color: "#f59e0b" }
        ],
        edges: [
          { source: "1", target: "2" },
          { source: "2", target: "3", label: "Repeated Addition" },
          { source: "3", target: "4", label: "Inverse Operation" }
        ]
      }
    },
    {
      subtopic_id: stMathMulti.id,
      material_type: "flashcard",
      title: "Rapid Arithmetic Recall",
      content: {
        cards: [
          { front: "What is 8 x 7?", back: "56" },
          { front: "What is 12 / 4?", back: "3" },
          { front: "What is 9 x 6?", back: "54" },
          { front: "What is 144 / 12?", back: "12" }
        ]
      }
    },
    // Biology Multi-Modal
    {
      subtopic_id: stBioCell.id,
      material_type: "note",
      title: "Organelles: Plant vs Animal Cells",
      content: {
        markdown: `# Plant vs Animal Cells\n\n* **Mitochondria**: The powerhouse of the cell, synthesizing ATP.\n* **Chloroplasts**: Only found in plant cells; conducts photosynthesis.\n* **Cell Wall**: Rigid cellulose layer present in plant cells, absent in animal cells.`
      }
    },
    {
      subtopic_id: stBioCell.id,
      material_type: "mind_map",
      title: "Cellular Organelles Architecture",
      content: {
        nodes: [
          { id: "1", label: "Eukaryotic Cell", color: "#10b981" },
          { id: "2", label: "Plant Cell", color: "#22c55e" },
          { id: "3", label: "Animal Cell", color: "#3b82f6" },
          { id: "4", label: "Mitochondria", color: "#f43f5e" },
          { id: "5", label: "Chloroplast", color: "#84cc16" }
        ],
        edges: [
          { source: "1", target: "2" },
          { source: "1", target: "3" },
          { source: "2", target: "4" },
          { source: "3", target: "4" },
          { source: "2", target: "5", label: "Photosynthesis" }
        ]
      }
    },
    {
      subtopic_id: stBioCell.id,
      material_type: "flashcard",
      title: "Cell Organelle Flashcards",
      content: {
        cards: [
          { front: "Which organelle generates ATP energy?", back: "Mitochondria" },
          { front: "What gives plant cells rigid structure?", back: "Cell Wall (Cellulose)" },
          { front: "Where does DNA reside in eukaryotic cells?", back: "Nucleus" }
        ]
      }
    }
  ]);

  // 5. Questions with Distractor Taxonomy
  await admin.from("questions").insert([
    {
      subtopic_id: stMathMulti.id,
      prompt: "What is 6 multiplied by 7?",
      difficulty: 1,
      options: [
        { id: "a", text: "42", isCorrect: true },
        { id: "b", text: "13", isCorrect: false, errorType: "conceptual" },
        { id: "c", text: "48", isCorrect: false, errorType: "calculation" },
        { id: "d", text: "36", isCorrect: false, errorType: "careless" }
      ]
    },
    {
      subtopic_id: stMathMulti.id,
      prompt: "If 48 chocolates are divided equally among 6 students, how many chocolates does each student receive?",
      difficulty: 2,
      options: [
        { id: "a", text: "8", isCorrect: true },
        { id: "b", text: "7", isCorrect: false, errorType: "calculation" },
        { id: "c", text: "12", isCorrect: false, errorType: "conceptual" },
        { id: "d", text: "6", isCorrect: false, errorType: "careless" }
      ]
    },
    {
      subtopic_id: stBioCell.id,
      prompt: "Which organelle is considered the powerhouse of the cell?",
      difficulty: 1,
      options: [
        { id: "a", text: "Mitochondria", isCorrect: true },
        { id: "b", text: "Nucleus", isCorrect: false, errorType: "conceptual" },
        { id: "c", text: "Cell Wall", isCorrect: false, errorType: "application" }
      ]
    }
  ]);

  console.log("Database successfully seeded with Grade 1-12 curriculum!");
}

if (import.meta.main) {
  seedSystem();
}
